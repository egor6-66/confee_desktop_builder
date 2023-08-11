import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { chatApi, chatProxy } from 'entities/chat';
import { messageApi, MessageInputView, messageTypes, useMessageStore } from 'entities/message';
import { viewerService } from 'entities/viewer';
import { useArray, useEasyState, useFileUploader, UseFileUploaderTypes } from 'shared/hooks';

import { getFormData } from '../../../shared/lib';

function MessageInput() {
    const params = useParams();
    const chatId = Number(params.chat_id);

    const { mutate: handleSendTextMessage, isLoading } = messageApi.handleSendTextMessage();
    const { mutate: handleSendFileMessage } = messageApi.handleSendFileMessage();
    // const { mutate: handleMessageAction } = MessageApi.handleMessageAction();
    const { mutate: handleReplyMessage } = messageApi.handleReplyMessage();
    const { mutate: handleChangeTextInMessages } = messageApi.handleChangeTextInMessages();

    const { data: chatData } = chatApi.handleGetChat({ chatId });

    const setReplyMessage = useMessageStore.use.setReplyMessage();
    const replyMessage = useMessageStore.use.replyMessage();

    const messageTextState = useEasyState('');

    const { open: openFilesDownloader } = useFileUploader({
        accept: 'all',
        multiple: true,
        onAfterUploading: (data) => {
            console.log('wdad');
        },
    });

    const sendMessage = () => {
        if (messageTextState.value) {
            handleSendTextMessage({ text: messageTextState.value, chatId });
            messageTextState.set('');
        }
    };

    const onKeyDown = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (event.shiftKey || event.ctrlKey) {
                messageTextState.set((prev) => `${prev}\n`);
            } else {
                sendMessage();
            }
        }
    };

    useEffect(() => {
        messageTextState.set('');
    }, [chatId]);

    return (
        <>
            <MessageInputView
                chat={chatProxy(chatData)}
                onKeyDown={onKeyDown}
                messageTextState={messageTextState}
                btnClick={sendMessage}
                loading={isLoading}
                clickUploadFiles={openFilesDownloader}
                replyMessage={{ value: replyMessage, set: setReplyMessage }}
            />
        </>
    );
}

export default MessageInput;
