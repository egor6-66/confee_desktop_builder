import { useRouter, useRustServer, useShell, useStorage } from '../../../shared/hooks';
import { getRandomString } from '../../../shared/lib';
import { Notification } from '../../../shared/ui';
import { appService } from '../../app';
import { chatService } from '../../chat';
import { ChatProxy } from '../../chat/model/types';
import { viewerStore } from '../../viewer';
import { meetStore } from '../index';
import meetApi from '../model/api';
import { CallResponse, Meet } from '../model/types';

function useMeet() {
    const { params, navigate } = useRouter();
    const notification = Notification.use();

    const ls = useStorage();
    const { openBrowser } = useShell();
    const { mutate: handleCreateMeet } = meetApi.handleCreateMeet();
    const { mutate: handleCallResponse } = meetApi.handleCallResponse();
    const viewer = viewerStore.use.viewer();
    const { mutate: handleLeftCall } = meetApi.handleLeftCall();

    // const calls = meetStore.use.calls();
    const createCall = meetStore.use.createCall();

    const { useWebview, rustIsRunning, socket } = useRustServer();

    const createWindow = (roomId: string, path: 'pre_join' | 'room', data: any) => {
        const { view } = useWebview(roomId);
        if (!view) {
            const webview = useWebview(roomId, {
                events: {
                    onClose: () => {
                        webview?.close();
                    },
                },
            });
            if (!webview.view) {
                const meetData = JSON.stringify({ ...data, avatar: data?.avatar.split('/').join('|') });
                if (appService.tauriIsRunning) {
                    webview.open({ path: `/meet/${path}/${meetData}` });
                } else {
                    window.open(`${appService.getUrls().clientBaseURL}/meet/${path}/${meetData}`, '_blank');
                }
            }
        }
    };

    const outgoingPrivateCall = (data: Meet) => {
        handleCreateMeet(
            {
                confee_video_room: data.roomId,
                chatId: data.chatId,
                targets_user_id: data.users_ids,
            },
            {
                onSuccess: (res) => {
                    createWindow(data.roomId, 'pre_join', { ...data, callId: res.data.data.id, type: 'out' });
                },
            }
        );
    };

    const incomingCall = (data: Meet) => {
        createWindow(data.roomId, 'pre_join', { ...data, type: 'in' });
    };

    const openCreateMeet = (chat: ChatProxy | null) => {
        if (!chat) return null;
        const { secondUser, is_group } = chat;
        createCall.set({
            roomId: getRandomString(30),
            avatar: chat.avatar || '',
            name: chat.name,
            chatId: chat.id,
            initiatorId: viewer.value.id,
            users_ids: secondUser ? [secondUser?.id] : [],
            isGroup: chat.is_group,
        });
    };

    const callResponse = (data: CallResponse) => {
        if (rustIsRunning) {
            const { view } = useWebview(data.room_id);
            view && view.close();
        } else {
            window.close();
        }
        handleCallResponse(data);
    };

    const goToRoom = (meetId: string) => {
        navigate(`/meet/room/${meetId}`);
    };

    return { outgoingPrivateCall, openCreateMeet, goToRoom, callResponse, incomingCall };
}

export default useMeet;
