import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import produce from 'immer';

import { axiosClient } from 'shared/configs';
import { useWebSocket, useStorage, useRouter, useDatabase } from 'shared/hooks';
import { getFormData, httpHandlers } from 'shared/lib';

import { Chat, SocketIn, SocketOut } from './types';
import chat from '../../../pages/main/chats/widgets/chat';
import { Company } from '../../company/model/types';
import { MessageType, MediaContentType, File } from '../../message/model/types';
import { chatTypes } from '../index';
import { chats_limit } from '../lib/constants';

class ChatApi {
    pathPrefix = '/api/v2/chats';

    storage = useStorage();

    socket = useWebSocket<SocketIn, SocketOut>();

    handleGetChat = (data: { chatId: number | undefined }) => {
        return useQuery(['get-chat', data.chatId], () => axiosClient.get(`${this.pathPrefix}/${data.chatId}`), {
            staleTime: Infinity,
            enabled: !!data.chatId,
            select: (data) => {
                const res = httpHandlers.response<{ data: Chat }>(data);
                return res.data?.data;
            },
        });
    };

    handleGetPrivateChat = (data: { userId: number | undefined }) => {
        return useQuery(['get-private-chat', data.userId], () => axiosClient.get(`${this.pathPrefix}/chat/with-user/${data.userId}`), {
            staleTime: Infinity,
            enabled: !!data.userId,
            select: (data) => {
                const res = httpHandlers.response<{ data: Chat }>(data);
                return res.data?.data;
            },
        });
    };

    handleGetChats = (data: { type?: 'all' | 'personal' | 'company'; companyId?: number }) => {
        const type = data.type === 'company' ? `for-company/${data.companyId}` : data.type;

        const { save } = useDatabase();
        return useInfiniteQuery(
            ['get-chats', type],
            ({ pageParam }) => axiosClient.get(`${this.pathPrefix}/${type}`, { params: { per_page: chats_limit, page: pageParam || 0 } }),
            {
                enabled: !!type && !(data.type === 'company' && !data.companyId),
                staleTime: Infinity,
                getPreviousPageParam: (lastPage, pages) => {
                    const { current_page } = lastPage?.data.meta;
                    return current_page > 1 ? current_page - 1 : undefined;
                },
                getNextPageParam: (lastPage, pages) => {
                    const { current_page, last_page } = lastPage?.data.meta;
                    return current_page < last_page ? current_page + 1 : undefined;
                },
                select: (data) => {
                    save(data, 'chats');
                    return {
                        pages: data.pages,
                        pageParams: [...data.pageParams],
                    };
                },
            }
        );
    };

    handleCreatePersonalChat() {
        const queryClient = useQueryClient();
        return useMutation((data: { user_ids: number[] | string[] | null; is_group: boolean }) => axiosClient.post(`${this.pathPrefix}`, data), {
            onSuccess: async (res, data) => {
                const updRes = httpHandlers.response<{ data: Chat }>(res);
                ['all', 'personal'].forEach((i) =>
                    queryClient.setQueryData(['get-chats', i], (cacheData: any) => {
                        if (!cacheData?.pages?.length) return cacheData;
                        return produce(cacheData, (draft: any) => {
                            draft?.pages.forEach((page: any) => {
                                page?.data?.data.unshift(updRes.data?.data);
                            });
                        });
                    })
                );
            },
        });
    }

    handleAddMembersPersonalChat() {
        const queryClient = useQueryClient();
        return useMutation(
            (data: { chatId: number | string; user_ids: number[] | string[] | null }) =>
                axiosClient.post(`${this.pathPrefix}/${data.chatId}/add-members `, data),
            {
                onSuccess: async (res, data) => {
                    const updRes = httpHandlers.response<{ data: Chat }>(res);
                    queryClient.setQueryData(['get-chat', updRes.data?.data.id], (cacheData: any) => {
                        cacheData.data.data = updRes.data?.data;
                    });
                },
            }
        );
    }

    handleCreateCompanyChat() {
        const queryClient = useQueryClient();
        return useMutation(
            (data: { body: { employee_ids: number[] | string[] | null; is_group: boolean }; companyId: any }) => {
                return axiosClient.post(`${this.pathPrefix}/for-company/${data.companyId}`, data.body);
            },
            {
                onSuccess: async (res, data) => {
                    const updRes = httpHandlers.response<{ data: Chat }>(res);
                    ['all', `for-company/${data.companyId}`].forEach((i) =>
                        queryClient.setQueryData(['get-chats', i], (cacheData: any) => {
                            if (!cacheData?.pages?.length) return cacheData;
                            return produce(cacheData, (draft: any) => {
                                draft?.pages.forEach((page: any) => {
                                    page?.data?.data.unshift(updRes.data?.data);
                                });
                            });
                        })
                    );
                },
            }
        );
    }

    handleDeleteChat() {
        const queryClient = useQueryClient();
        const { navigate } = useRouter();
        return useMutation((data: { chatId: number }) => axiosClient.delete(`${this.pathPrefix}/${data.chatId}`), {
            onSuccess: async (res, data) => {
                ['all', 'personal'].forEach((i) =>
                    queryClient.setQueryData(['get-chats', i], (cacheData: any) => {
                        if (!cacheData?.pages?.length) return cacheData;
                        return produce(cacheData, (draft: any) => {
                            draft?.pages.forEach((page: any) => {
                                page.data.data = page?.data?.data.filter((chat: chatTypes.Chat) => chat.id !== data.chatId);
                            });
                        });
                    })
                );
                navigate('/chat');
            },
        });
    }

    handleGetTotalPendingMessages = () => {
        return useQuery(['get-total-pending-messages'], () => axiosClient.get(`${this.pathPrefix}/total-pending-messages`), {
            staleTime: Infinity,
            select: (data) => {
                const res = httpHandlers.response<{ data: { total_pending_messages_count: number } }>(data);
                return res.data?.data?.total_pending_messages_count;
            },
        });
    };

    handleGetChatFiles = (data: { chatId: number; filesType: MediaContentType | null }) => {
        return useQuery(['get-chat-files', data.chatId, data?.filesType], () => axiosClient.get(`${this.pathPrefix}/${data.chatId}/files/${data.filesType}`), {
            enabled: !!data.filesType,
            select: (data) => {
                const res = httpHandlers.response<{ data: File[] }>(data);
                return res.data?.data;
            },
        });
    };

    handleGetAvatars = (data: { chatId: number }) => {
        return useQuery(['get-chat-avatars', data.chatId], () => axiosClient.get(`${this.pathPrefix}/${data.chatId}/avatars`), {
            staleTime: Infinity,
            enabled: !!data.chatId,
            select: (data) => {
                const res = httpHandlers.response<{ data: { avatars: string[] } }>(data);
                return res.data?.data.avatars;
            },
        });
    };

    handleAddAvatar() {
        return useMutation((data: { chatId: number; img: string }) =>
            axiosClient.post(`${this.pathPrefix}/${data.chatId}/avatar`, getFormData('images', data.img))
        );
    }

    handleUpdateChatName() {
        const queryClient = useQueryClient();
        return useMutation((data: { chatId: number; name: string }) => axiosClient.patch(`${this.pathPrefix}/${data.chatId}/name`, { name: data.name }), {
            onSuccess: async (data) => {},
        });
    }

    handleLeaveChat() {
        const queryClient = useQueryClient();
        return useMutation((data: { chatId: number }) => axiosClient.patch(`${this.pathPrefix}/${data.chatId}/exit`), {
            onSuccess: async (res, data) => {
                queryClient.setQueryData(['get-chats', 'all'], (cacheData: any) => {
                    if (!cacheData?.pages?.length) return cacheData;
                    return produce(cacheData, (draft: any) => {
                        draft?.pages.forEach((page: any) => {
                            page.data.data = page?.data?.data.filter((chat: chatTypes.Chat) => chat.id !== data.chatId);
                        });
                    });
                });
            },
        });
    }

    handleSubscribeToChat() {
        return {
            mutate: (chatId: number | null) => {
                this.socket.sendMessage('ChatListenersUpdated', {
                    sub: chatId,
                });
            },
        };
    }

    handleUnsubscribeFromChat() {
        return {
            mutate: (chatId: number) => {
                this.socket.sendMessage('ChatListenersUpdated', {
                    unsub: chatId,
                });
            },
        };
    }
}

export default new ChatApi();
