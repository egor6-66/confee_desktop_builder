import React, { useRef, Fragment, useEffect, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { useInView, usePrevious, useScroll } from 'shared/hooks';
import { BaseTypes } from 'shared/types';

import styles from './styles.module.scss';
import { chatTypes } from '../../../chat';
import { MessageProxy } from '../../model/types';
import Message from '../message';
import SystemMessage from '../message/variants/system';

type Props = {
    chat: chatTypes.Chat | BaseTypes.Empty;
    messages: MessageProxy[] | BaseTypes.Empty;
    getPrevPage: () => void;
    getNextPage: () => void;
    hoverMessage: (message: MessageProxy) => void;
} & BaseTypes.Statuses;

function MessagesListView(props: Props) {
    const { chat, messages, getPrevPage, getNextPage, hoverMessage } = props;

    const [initOnce, setInitOnce] = useState(true);

    const prevChat = usePrevious(chat);

    const { executeScrollToElement, getScrollPosition } = useScroll();

    const wrapperRef = useRef<HTMLDivElement>(null);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const firstUnreadMessageRef = useRef<HTMLDivElement>(null);

    const { ref: prevPageRef, inView: inViewPrevPage } = useInView({ delay: 200 });
    const { ref: nextPageRef, inView: inViewNextPage } = useInView({ delay: 200 });

    useEffect(() => {
        if (wrapperRef?.current && chat) {
            executeScrollToElement({ ref: lastMessageRef, disabled: !!chat?.pending_messages_count });
            executeScrollToElement({ ref: firstUnreadMessageRef, disabled: !chat?.pending_messages_count || !initOnce });
            if (prevChat?.id !== chat.id) setInitOnce(true);
            setTimeout(() => setInitOnce(false), 1000);
        }
    }, [messages]);

    useEffect(() => {
        if (inViewPrevPage) return getPrevPage();
        if (inViewNextPage) return getNextPage();
    }, [inViewPrevPage, inViewNextPage]);

    const getMessageRefs = (message: MessageProxy, index: number) => {
        if (!messages?.length) return null;
        const refs = [];
        if (message.isFirstUnread) refs.push(firstUnreadMessageRef);
        if (messages.length - 1 === index) refs.push(lastMessageRef);
        return mergeRefs(refs);
    };

    const getSystemMessageText = (message: MessageProxy) => {
        if (message.isFirstUnread) return 'Непрочитанные';
        return '';
    };

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            {messages?.map((message, index) => (
                <Fragment key={message.id}>
                    <SystemMessage text={getSystemMessageText(message)} />
                    <div
                        onMouseEnter={() => hoverMessage(message)}
                        className={styles.row}
                        style={{ justifyContent: message.type === 'system' ? 'center' : message.isMy ? 'flex-end' : 'flex-start' }}
                        ref={getMessageRefs(message, index)}
                    >
                        {index === 5 && <div ref={nextPageRef} />}
                        <Message message={message} />
                        {messages?.length - 5 === index && <div ref={prevPageRef} />}
                    </div>
                </Fragment>
            ))}
        </div>
    );
}

export default MessagesListView;
