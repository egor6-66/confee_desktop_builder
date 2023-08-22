import React from 'react';

import { chatApi, chatProxy, ChatProfileModalView, chatTypes } from 'entities/chat';
import { messageTypes } from 'entities/message';
import { useRouter, useEasyState } from 'shared/hooks';
import { Modal, ModalTypes, Notification } from 'shared/ui';

function ChatProfileModal(chatProfileModal: ModalTypes.UseReturnedType) {
    const { params, navigate } = useRouter();
    const chatId = Number(params.chat_id);

    const { data: chatData } = chatApi.handleGetChat({ chatId });
    const { mutate: handleDeleteChat } = chatApi.handleDeleteChat();

    const mediaTypes = useEasyState<messageTypes.MediaContentType | null>(chatData?.is_group ? 'images' : null);

    const { data: filesData } = chatApi.handleGetChatFiles({ chatId, filesType: mediaTypes.value });
    console.log(filesData);
    const notification = Notification.use();

    const actions = (action: chatTypes.Actions) => {
        switch (action) {
            case 'audioCall':
                return notification.inDev();
            case ' videoCall':
                return notification.inDev();
            case 'delete':
                return handleDeleteChat(
                    { chatId },
                    {
                        onSuccess: () => {
                            chatProfileModal.close();
                            navigate('/chats');
                        },
                    }
                );
        }
    };

    return <ChatProfileModalView chat={chatProxy(chatData)} actions={actions} mediaTypes={mediaTypes} filesData={filesData} />;
}

export default function (chatProfileModal: ModalTypes.UseReturnedType) {
    return (
        <Modal {...chatProfileModal}>
            <ChatProfileModal {...chatProfileModal} />
        </Modal>
    );
}
