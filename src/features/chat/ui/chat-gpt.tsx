import React from 'react';

import ChatGptView from 'entities/chat/ui/chat-gpt';
import { messageApi, useMessageStore } from 'entities/message';
import { useArray, useEasyState, useStorage } from 'shared/hooks';
import { getRandomString } from 'shared/lib';

import { ChatProxy } from '../../../entities/chat/model/types';
import { Modal } from '../../../shared/ui';

function ChatGpt() {
    const { data: history } = messageApi.handleGetMessagesWithChatGpt();
    const { mutate: handleSendTextMessageWithChatGpt } = messageApi.handleSendTextMessageWithChatGpt();
    const { mutate: handleClearHistoryWithChatGpt } = messageApi.handleClearHistoryWithChatGpt();

    const lastMessageWithChatGpt = useMessageStore.use.lastMessageWithChatGpt();

    const message = useEasyState('');
    const messages = useArray({
        initialArr: history?.map((i) => ({ id: getRandomString(10), ...i })).reverse(),
    });

    const confirmClearHistory = Modal.useConfirm((value) => {
        if (value) {
            lastMessageWithChatGpt.clear();
            handleClearHistoryWithChatGpt();
        }
    });

    const sendMessage = () => {
        const myMsg = { id: getRandomString(10), content: message.value, role: 'user' } as any;
        lastMessageWithChatGpt.set(myMsg);
        messages.unshift(myMsg);

        handleSendTextMessageWithChatGpt(
            { text: message.value },
            {
                onSuccess: (data) => {
                    const botMsg = { id: getRandomString(10), content: data.data.message.content, role: 'assistant' } as any;
                    messages.unshift(botMsg);
                    lastMessageWithChatGpt.set(botMsg);
                },
            }
        );
        message.set('');
    };

    return (
        <>
            <Modal.Confirm {...confirmClearHistory} title="Очистить историю" okText="очистить" />
            <ChatGptView sendMessage={sendMessage} message={message} messages={messages.array} clearHistory={confirmClearHistory.open} />
        </>
    );
}

export default ChatGpt;
