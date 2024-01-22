import React, { useRef, Fragment, useEffect, useState, RefObject } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useUpdateEffect } from 'react-use';

import { useInView, usePrevious, useScroll, UseStoreTypes, useDimensionsObserver, useEasyState, UseEasyStateReturnType } from 'shared/hooks';
import { BaseTypes } from 'shared/types';
import { Box, Button, Counter, Icons } from 'shared/ui';

import styles from './styles.module.scss';
import { appTypes } from '../../../app';
import { chatTypes } from '../../../chat';
import { EmployeeProxy } from '../../../company/model/types';
import { UserProxy } from '../../../user/model/types';
import { File, MediaContentType, MessageMenuActions, MessageProxy } from '../../model/types';
import Message from '../message';
import SystemMessage from '../message/variants/system';

type Props = {
    chat: chatTypes.ChatProxy | BaseTypes.Empty;
    messages: MessageProxy[];
    getPrevPage: () => void;
    getNextPage: () => void;
    readMessage: (messageId: number) => void;
    subscribeToChat: (action: 'sub' | 'unsub') => void;
    chatSubscription: number | null;
    messageMenuAction: (
        action: MessageMenuActions,
        message: MessageProxy,
        file: { blob: Blob; name: string; id: number | string; type: MediaContentType } | null
    ) => void;
    sendReaction: (emoji: string, messageId: number) => void;
    openChatProfileModal: (data: { user?: UserProxy; employee?: EmployeeProxy }) => void;
    highlightedMessages: UseStoreTypes.SelectorWithArr<MessageProxy>;
    voiceRecordingInProgress: boolean;
    foundMessage: MessageProxy | null;
    deleteFoundMessage: () => void;
    clickMessageReply: (message: MessageProxy) => void;
    dropContainerRef: RefObject<any>;
    goDownList: boolean;
    isFileDrag: UseStoreTypes.SelectorWithPrimitive<boolean>;
    initialOpenChat: UseStoreTypes.SelectorWithPrimitive<boolean>;
    isFetching: boolean;
} & BaseTypes.Statuses;

function MessagesListView(props: Props) {
    const {
        clickMessageReply,
        deleteFoundMessage,
        foundMessage,
        chat,
        messages,
        getPrevPage,
        getNextPage,
        readMessage,
        subscribeToChat,
        chatSubscription,
        messageMenuAction,
        sendReaction,
        openChatProfileModal,
        highlightedMessages,
        voiceRecordingInProgress,
        loading,
        dropContainerRef,
        goDownList,
        isFileDrag,
        initialOpenChat,
        isFetching,
    } = props;

    const prevChat = usePrevious(chat);

    const { executeScrollToElement, scrollBottom } = useScroll();

    const subCurrentChat = chatSubscription === chat?.id;

    const wrapperRef: any = useRef<HTMLDivElement>(null);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const firstUnreadMessageRef = useRef<HTMLDivElement>(null);
    const foundMessageRef = useRef<HTMLDivElement>(null);

    const { ref: prevPageRef, inView: inViewPrevPage } = useInView({ delay: 200 });
    const { ref: nextPageRef, inView: inViewNextPage } = useInView({ delay: 200 });
    const { ref: lastMessageCheckVisibleRef, inView: inViewLastMessageCheckVisibleRef } = useInView({ delay: 200 });
    const { ref: firstUnreadCheckVisibleRef, inView: inViewFirstUnreadCheckVisibleRef } = useInView({ delay: 200 });

    const getMessageRefs = (message: MessageProxy, index: number) => {
        if (!messages?.length) return null;
        const refs = [];
        if (message.isFirstUnread) {
            refs.push(firstUnreadMessageRef);
            refs.push(firstUnreadCheckVisibleRef);
        }
        if (foundMessage?.id && foundMessage.id === message.id) {
            refs.push(foundMessageRef);
        }
        return mergeRefs(refs);
    };

    const rowClick = (message: MessageProxy) => {
        if (highlightedMessages.value.length) {
            highlightedMessages.pushOrDelete(message);
        }
    };

    const clickBtnDown = () => {
        // if (!chat?.pending_messages_count) {
        executeScrollToElement({ ref: lastMessageRef, enable: true });
        // } else {
        //     executeScrollToElement({ ref: firstUnreadMessageRef, enable: true });
        // }
    };

    useEffect(() => {
        if (wrapperRef?.current && chat) {
            if (foundMessageRef.current) {
                setTimeout(() => deleteFoundMessage(), 1000);
                return executeScrollToElement({ ref: foundMessageRef, enable: true, block: 'center' });
            }
            if (initialOpenChat.value) {
                if (chat.pending_messages_count) {
                    executeScrollToElement({ ref: firstUnreadMessageRef });
                }
                // } else {
                //     executeScrollToElement({ ref: lastMessageRef, enable: true });
                // }
                initialOpenChat.set(false);
            } else if (chatSubscription === chat.id) {
                // return executeScrollToElement({ ref: lastMessageRef, enable: true, smooth: true });
            }
        }
    }, [messages, chatSubscription, initialOpenChat.value]);

    useEffect(() => {
        if (inViewPrevPage) getPrevPage();
        if (inViewNextPage) getNextPage();
    }, [inViewPrevPage, inViewNextPage]);

    useEffect(() => {
        subscribeToChat(inViewLastMessageCheckVisibleRef ? 'sub' : 'unsub');
    }, [inViewLastMessageCheckVisibleRef, chat?.pending_messages_count]);

    useEffect(() => {
        const firstUnread = messages.find((i) => i.isFirstUnread);
        inViewFirstUnreadCheckVisibleRef && firstUnread && readMessage(firstUnread.id);
    }, [inViewFirstUnreadCheckVisibleRef]);

    useUpdateEffect(() => {
        if (wrapperRef.current) {
            wrapperRef.current.style.overflow = isFetching ? 'hidden' : 'auto';
        }
    }, [isFetching]);

    useUpdateEffect(() => {
        if (goDownList) {
            executeScrollToElement({ ref: lastMessageRef, enable: true });
        }
    }, [goDownList]);

    return (
        <div
            className={`${styles.wrapper} ${isFileDrag.value ? styles.wrapper_dragOver : ''}`}
            ref={mergeRefs([wrapperRef, dropContainerRef])}
            onDragOver={() => isFileDrag.set(true)}
            onDragLeave={() => isFileDrag.set(false)}
            onDrop={() => isFileDrag.set(false)}
        >
            <Box.Animated visible={!inViewLastMessageCheckVisibleRef} className={styles.btnDown}>
                <Counter>{chat?.pending_messages_count || 0}</Counter>
                <Button.Circle radius={34} onClick={clickBtnDown}>
                    <Icons variant="arrow-drop-down" />
                </Button.Circle>
            </Box.Animated>
            <div ref={mergeRefs([lastMessageRef, lastMessageCheckVisibleRef])} />
            {messages?.map((message, index) => (
                <Fragment key={message.id}>
                    {message.type !== 'system' && (
                        <div
                            onClick={() => rowClick(message)}
                            onMouseEnter={() => !message.is_read && readMessage(message.id)}
                            className={`${styles.row} ${
                                highlightedMessages.value.find((i) => i.id === message.id) || message.id === foundMessage?.id ? styles.row_active : ''
                            }`}
                            style={{
                                justifyContent: message.isMy ? 'flex-end' : 'flex-start',
                                cursor: highlightedMessages.value.length ? 'pointer' : 'default',
                            }}
                            ref={getMessageRefs(message, index)}
                        >
                            {index === 10 && <div ref={prevPageRef} />}
                            <Message
                                clickMessageReply={clickMessageReply}
                                openChatProfileModal={openChatProfileModal}
                                sendReaction={sendReaction}
                                chat={chat}
                                ref={wrapperRef}
                                message={message}
                                messageMenuAction={messageMenuAction}
                                voiceRecordingInProgress={voiceRecordingInProgress}
                            />
                            {messages?.length - 10 === index && <div ref={nextPageRef} />}
                        </div>
                    )}
                    {message.systemMessages.length
                        ? message.systemMessages.map((text, ind) => (
                              <div key={ind} ref={getMessageRefs(message, index)} onMouseEnter={() => !message.is_read && readMessage(message.id)}>
                                  <SystemMessage text={text} />
                              </div>
                          ))
                        : null}
                </Fragment>
            ))}
        </div>
    );
}

export default MessagesListView;
