import React, { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { BaseTypes } from 'shared/types';
import { Box, Title, Counter, Icons, Avatar, Button, Dropdown } from 'shared/ui';

import ChatMenu from './menu';
import styles from './styles.module.scss';
import MessageMenu from '../../../message/ui/message/menu';
import { Actions, ChatProxy } from '../../model/types';

type Props = {
    clickOnChat: (arg: ChatProxy) => void;
    chat: ChatProxy;
    active: boolean;
    chatMenuAction: (action: Actions, chat: ChatProxy) => void;
} & BaseTypes.Statuses;

const ChatCardView = forwardRef((props: Props, refs: any) => {
    const { clickOnChat, chat, active, chatMenuAction } = props;
    console.log(refs.wrapper);
    return (
        <Dropdown.Dynamic
            ref={refs.wrapper}
            position="left-center"
            left={210}
            trigger="right-click"
            closeAfterClick
            content={<ChatMenu chat={chat} chatMenuAction={chatMenuAction} />}
        >
            <div ref={refs.lastChat} key={chat?.id} className={`${styles.wrapper} ${active ? styles.wrapper_active : ''}`} onClick={() => clickOnChat(chat)}>
                <div className={styles.body}>
                    <div className={styles.avatar}>
                        <Avatar networkStatus={chat?.secondMember?.networkStatus} size={52} img={chat.avatar} name={chat?.name} />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.row}>
                            <div className={styles.left}>
                                <Title variant="H3S">{chat?.name}</Title>
                                {!chat.is_personal && <Button tag>TFN</Button>}
                            </div>
                            <div className={styles.right}>
                                <Title textAlign="right" variant="caption1M" primary={false}>
                                    {chat?.date}
                                </Title>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.left}>
                                <Title primary={false} variant="H3R">
                                    {chat?.lastMessageTitle}
                                </Title>
                            </div>
                            <div className={styles.right}>
                                {chat.pending_messages_count ? (
                                    <Counter variant="primary" height={18}>
                                        {chat?.pending_messages_count}
                                    </Counter>
                                ) : (
                                    chat?.checkIsMyLastMessage && <Icons variant={chat?.last_message.users_have_read.length ? 'double-check' : 'check'} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dropdown.Dynamic>
    );
});
export default ChatCardView;
