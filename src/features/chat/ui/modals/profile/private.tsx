import React from 'react';

import { useCall } from 'entities/call';
import { chatApi, chatProxy, chatService, chatTypes, PrivateChatProfileModalView } from 'entities/chat';
import { EmployeeProxy } from 'entities/company/model/types';
import { messageDictionaries, messageTypes } from 'entities/message';
import { UserProxy } from 'entities/user/model/types';
import { viewerService, viewerStore } from 'entities/viewer';
import { useRouter, useEasyState } from 'shared/hooks';
import { Modal, ModalTypes, Notification } from 'shared/ui';

import { getRandomString } from '../../../../../shared/lib';

function PrivateChatProfileModal(modal: ModalTypes.UseReturnedType<{ user?: UserProxy; employee?: EmployeeProxy }>) {
    const { navigate, pathname, params } = useRouter();

    const viewer = viewerStore.use.viewer();
    const { user, employee } = modal.payload;

    const { data: chatWithEmployee } = chatApi.handleGetChatWithEmployee({ employeeId: modal.payload?.employee?.id });
    const { data: chatWithUser } = chatApi.handleGetChatWithUser({ userId: modal.payload?.user?.id });

    const chatData = chatWithUser || chatWithEmployee;

    const proxyChat = chatProxy(chatData);

    const mediaTypes = useEasyState<messageTypes.MediaContentType | null>('images');

    const call = useCall();

    const { data: filesData } = chatApi.handleGetChatFiles({ chatId: proxyChat?.id, filesType: mediaTypes.value });
    const { mutate: handleCreatePersonalChat } = chatApi.handleCreatePersonalChat();
    const { mutate: handleCreateCompanyChat } = chatApi.handleCreateCompanyChat();
    const { mutate: handleDeleteChat } = chatApi.handleDeleteChat();
    const { mutate: handleChatMute } = chatApi.handleChatMute();
    const { mutate: handleUpdateChatDescription } = chatApi.handleUpdateChatDescription();

    const confirmDeleteChat = Modal.useConfirm((value) => {
        if (value && proxyChat?.id) {
            handleDeleteChat(
                { type: proxyChat.is_personal ? 'personal' : 'company', chatId: proxyChat?.id, companyId: params.company_id },
                {
                    onSuccess: () => {
                        modal.close();
                        navigate(`/chats/${pathname.split('/')[2]}${params.company_id ? `/${params.company_id}` : ''}`);
                    },
                }
            );
        }
    });

    const actions = (action: chatTypes.PrivateChatActions) => {
        switch (action) {
            case 'goMeet':
                return call.openCreateMeet(proxyChat);
            case 'message':
                const redirect = (chatId?: number) => navigate(`/chats/${user ? 'personal' : `company/${params.company_id}`}/chat/${chatId}`);
                if (!proxyChat) {
                    if (user) {
                        return handleCreatePersonalChat({ user_ids: [user.id], is_group: false }, { onSuccess: (data) => redirect(data.data.data.id) });
                    }
                    if (employee) {
                        return handleCreateCompanyChat(
                            { companyId: params.company_id, body: { employee_ids: [employee?.id], is_group: false } },
                            { onSuccess: (data) => redirect(data.data.data.id) }
                        );
                    }
                } else {
                    return redirect(proxyChat?.id);
                }
                return modal.close();
            case 'delete':
                return confirmDeleteChat.open();
            case 'mute':
                if (proxyChat) {
                    return handleChatMute({ chatId: proxyChat?.id, value: !proxyChat?.is_muted, companyId: proxyChat.company_id });
                }
        }
    };

    return (
        <>
            <Modal.Confirm {...confirmDeleteChat} okText="Удалить" title="Удалить чат" />
            <PrivateChatProfileModalView
                user={user}
                employee={employee}
                clickAvatar={() => ''}
                chat={proxyChat}
                actions={actions}
                mediaTypes={mediaTypes}
                files={filesData}
                currentChat={String(proxyChat?.id) === params.chat_id}
                isMy={user?.id === viewer.value.id}
            />
        </>
    );
}

export default function (modal: ModalTypes.UseReturnedType<{ user?: UserProxy; employee?: EmployeeProxy }>) {
    return (
        <Modal {...modal} centered={false}>
            <PrivateChatProfileModal {...modal} />
        </Modal>
    );
}
