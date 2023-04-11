import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { date } from 'yup';

import { axiosClient, socketIo } from 'shared/configs';
import { uniqueArray } from 'shared/lib';

import useMessageStore from './store';
import { Message, MessageProxy } from './types';
import { message_limit } from '../lib/constants';
import messageEntity from '../lib/message-entity';

class MessageApi {
    private pathPrefix = '/api/v2/chats';

    handleGetMessages({ initialPage, chatId }: { initialPage: number | undefined; chatId: number }) {
        return useInfiniteQuery(
            ['get-messages', chatId],
            ({ pageParam }) => {
                return axiosClient.get(`${this.pathPrefix}/${chatId}/messages`, {
                    params: {
                        page: pageParam || initialPage,
                        limit: message_limit,
                    },
                });
            },
            {
                getPreviousPageParam: (lastPage, pages) => {
                    if (lastPage?.data.page === 1) return undefined;
                    return lastPage?.data.page - 1;
                },
                getNextPageParam: (lastPage, pages) => {
                    if (lastPage?.data.page === Math.ceil(lastPage.data.total / message_limit)) return undefined;
                    return lastPage?.data.page + 1;
                },
                select: (data) => {
                    return {
                        pages: uniqueArray(
                            data.pages.reduce((messages: any, page: any) => [...[...page.data.data].reverse(), ...messages], []),
                            'id'
                        ),
                        pageParams: [...data.pageParams].reverse(),
                    };
                },
                enabled: !!chatId && !!initialPage,
                staleTime: Infinity,
            }
        );
    }

    handleSendTextMessage() {
        const queryClient = useQueryClient();
        const setSocketAction = useMessageStore.use.setSocketAction();
        const viewerData: any = queryClient.getQueryData(['get-viewer']);
        return useMutation(
            (data: { text: string; chatId: number }) =>
                axiosClient.post(`${this.pathPrefix}/message/${data.chatId}`, { text: data.text, message_type: 'text' }),
            {
                onMutate: async (data) => {
                    queryClient.setQueryData(['get-messages', data.chatId], (cacheData: any) => {
                        const message = messageEntity({ text: data.text, viewer: viewerData?.data.data });
                        cacheData.pages[0].data.data.unshift(message);
                        setSocketAction(`add${message.id}`);
                        return cacheData;
                    });
                },
            }
        );
    }

    handleDeleteMessage() {
        return useMutation((data: { messages: string[]; fromAll: boolean; chatId: number }) =>
            axiosClient.delete(`${this.pathPrefix}/message/${data.chatId}`, { data: { fromAll: data.fromAll, messages: data.messages } })
        );
    }

    handleReadMessage() {
        return (data: { chat_id: number; messages: number[] }) => {
            data.messages && socketIo.emit('messageRead', data);
        };
    }

    handleMessageAction = () => {
        return (data: { chatId: number; action: string }) => {
            socketIo.emit('messageAction', {
                chat_id: data.chatId,
                action: data.action,
            });
        };
    };

    handleSendReaction() {
        return useMutation((data: { chatId: number; messageId: number; reaction: string }) =>
            axiosClient.post(`${this.pathPrefix}/${data.chatId}/message/${data.messageId}/reaction`, { reaction: data.reaction })
        );
    }

    handleChangeTextInMessages() {
        return useMutation((data: { chatId: number; messageId: number; text: string }) =>
            axiosClient.patch(`${this.pathPrefix}/message/${data.chatId}/${data.messageId}`, { text: data.text })
        );
    }

    subscriptions() {
        const queryClient = useQueryClient();
        const setSocketAction = useMessageStore.use.setSocketAction();

        useEffect(() => {
            socketIo.on('receiveMessage', ({ message }) => {
                const viewerData: any = queryClient.getQueryData(['get-viewer']);
                queryClient.setQueryData(['get-messages', Number(message.chat_id)], (cacheData: any) => {
                    if (cacheData) {
                        if (message.is_edited) {
                            cacheData.pages.length &&
                                cacheData.pages.forEach((page: any) => {
                                    page?.data?.data.forEach((messageInCache: MessageProxy, index: number) => {
                                        if (message?.id === messageInCache?.id) {
                                            page.data.data.splice(index, 1, { ...messageInCache, text: message.text, is_edited: true });
                                        }
                                    });
                                });
                        } else {
                            const viewerId = viewerData?.data.data.id;
                            const pageOne = cacheData.pages.find((page: any) => page.data.page === 1);
                            if (viewerId === message.user.id) {
                                pageOne.data.data.find((myMessage: MessageProxy, index: number) => {
                                    if (myMessage.user?.id === viewerId && myMessage.isMock) {
                                        pageOne.data.data.splice(index, 1, { ...message, isMy: true });
                                    }
                                });
                            } else if (pageOne) {
                                pageOne.data.data.unshift(message);
                            }
                        }
                        setSocketAction(`receiveMessage:${message.id}:${new Date()}`);
                    }
                    return cacheData;
                });
            });
            socketIo.on('receiveDeleteMessage', ({ chat_id, messages }) => {
                queryClient.setQueryData(['get-messages', chat_id], (cacheData: any) => {
                    cacheData &&
                        cacheData.pages.forEach((page: any) => {
                            page.data.data.forEach((message: Message, index: number) => {
                                messages.forEach((deletedMessage: Message) => {
                                    if (message.id === deletedMessage.id) {
                                        page.data.data.splice(index, 1);
                                        setSocketAction(`receiveReactions:${message.id}:${new Date()}`);
                                    }
                                });
                            });
                        });
                    return cacheData;
                });
            });
            socketIo.on('receiveReactions', ({ data }) => {
                queryClient.setQueryData(['get-messages', data.chatId], (cacheData: any) => {
                    cacheData.pages.forEach((page: any) => {
                        page.data.data.forEach((message: any) => {
                            if (message.id === data.messageId) {
                                message.reactions = { ...data.reactions };
                                setSocketAction(`receiveReactions:${message.id}:${new Date()}`);
                            }
                        });
                    });
                    return cacheData;
                });
            });
            socketIo.on('receiveMessageStatus', (data) => {
                queryClient.setQueryData(['get-messages', data.chat_id], (cacheData: any) => {
                    cacheData &&
                        cacheData.pages.forEach((page: any) => {
                            page.data.data.forEach((message: Record<string, any>) => {
                                data.messages.forEach((responseMessage: Record<string, any>, index: number) => {
                                    if (responseMessage.id === message.id) {
                                        Object.keys(responseMessage).forEach((key) => {
                                            message[key] = responseMessage[key];
                                        });
                                        message.message_status = responseMessage.message_status;
                                        setSocketAction(`receiveMessageStatus:${message.id}:${responseMessage.id}`);
                                    }
                                });
                            });
                        });
                    return cacheData;
                });
            });
        }, []);
    }
}

export default new MessageApi();
