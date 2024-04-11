import { useRouter, useRustServer, useStorage } from '../../../shared/hooks';
import { getRandomString } from '../../../shared/lib';
import { Notification } from '../../../shared/ui';
import { appService } from '../../app';
import { chatService } from '../../chat';
import { ChatProxy } from '../../chat/model/types';
import { meetStore } from '../index';
import meetApi from '../model/api';

function useMeet() {
    const { params, navigate } = useRouter();
    const notification = Notification.use();

    const ls = useStorage();

    const { mutate: handleCreateMeeting } = meetApi.handleCreateMeeting();
    const { mutate: handleLeftCall } = meetApi.handleLeftCall();

    // const calls = meetStore.use.calls();
    const createMeet = meetStore.use.createMeet();

    const { useWebview } = useRustServer();

    const openCall = (id: string, name: string, type: 'outgoing' | 'incoming' | 'room', chatId: number, openModal: () => void) => {
        const { view } = useWebview(`meet-${id}`);
        if (!view) {
            const webview = useWebview(`meet-${id}`, {
                title: name || `Конференция`,
                events: {
                    onClose: () => {
                        // calls.set(calls.value.filter((i) => i.id !== id));
                        webview?.close();
                    },
                },
            });
            if (!webview.view) {
                if (appService.tauriIsRunning) {
                    webview.open({ path: `/meet/${type}_call/${id}` });
                } else {
                    openModal();
                }
            }
        }
    };

    const openCreateMeet = (chat: ChatProxy | null) => {
        if (!chat) return null;
        createMeet.set({
            meetId: getRandomString(30),
            chat,
        });
    };

    const closeCall = (meetId: string) => {
        const { view } = useWebview(`meet-${meetId}`);
        if (view) {
            console.log('close');
            // calls.set(calls.value.filter((i) => i.id !== meetId));
            // view.close();
        }
    };

    const createRoom = (meetId: string, name: string) => {
        const { view } = useWebview(`meet-${meetId}`);
        console.log(view);
        if (!view) {
            const webview = useWebview(`meet-${meetId}`, {
                title: name || `Конференция`,
                events: {
                    onClose: () => {
                        // calls.set(calls.value.filter((i) => i.id !== meetId));
                        webview?.close();
                    },
                },
            });
            if (!webview.view) {
                if (appService.tauriIsRunning) {
                    webview.open({ path: `/meet/room/${meetId}` });
                } else {
                }
            }
        }
    };

    const goToRoom = (meetId: string) => {
        navigate(`/meet/room/${meetId}`);
    };

    return { openCreateMeet, openCall, goToRoom, createRoom, closeCall };
}

export default useMeet;
