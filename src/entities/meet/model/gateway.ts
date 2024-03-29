import produce from 'immer';

import { Socket } from './types';

function meetGateway({ event, data }: Socket, queryClient: any, store: any) {
    switch (event) {
        case 'CallCreated':
            const extraInfo = data.extra_info;

            store.invitationToConference.set({
                id: extraInfo.confee_video_room,
                avatar: data.chat.avatar,
                name: data.chat.name,
                muted: extraInfo.muted,
            });

            ['all', 'personal', `for-company/17`].forEach((i) =>
                queryClient.setQueryData(['get-chats', i], (cacheData: any) => {
                    if (!cacheData?.pages?.length) return cacheData;
                    return produce(cacheData, (draft: any) => {
                        draft?.pages.forEach((page: any) => {
                            page.data.data = page?.data?.data.map((chat: any) => {
                                if (data.chat.id === chat.id) return { ...chat, meetId: extraInfo.confee_video_room };
                                return chat;
                            });
                        });
                    });
                })
            );
            queryClient.setQueryData(['get-chat', data.chat.id], (cacheData: any) => {
                if (!cacheData?.data?.data) return cacheData;
                return produce(cacheData, (draft: any) => {
                    draft.data.data = { ...draft.data.data, meetId: extraInfo.confee_video_room };
                });
            });
    }
}

export default meetGateway;
