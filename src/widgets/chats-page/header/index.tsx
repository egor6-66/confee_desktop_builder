import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';

import { ChatService, useChatStore } from 'entities/chat';
import { VideoCallBtn, AudioCallBtn } from 'features/button';
import { ChatCard, ChatHeaderMenu } from 'features/chat';
import { SearchMessages } from 'features/message';
import { useSize, useNetworkState } from 'shared/hooks';
import { Box, Button, Icons, LoadingIndicator } from 'shared/ui';

import styles from './styles.module.scss';

function HeaderForChatsPage() {
    const { pathname } = useLocation();
    const navigation = useNavigate();
    const params = useParams();
    const { width } = useSize();

    const openChatId = ChatService.getOpenChatId();
    const openChat = ChatService.getChatInList(Number(params.chat_id));

    const setVisibleHeaderMenu = useChatStore.use.setVisibleHeaderMenu();
    const network = useNetworkState();

    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                <AnimatePresence mode="wait">
                    {network.online ? (
                        <>
                            <Box.Animated visible={!!openChatId} key={pathname.split('/')[4]} className={styles.card}>
                                <Box.Animated
                                    onClick={() => navigation(pathname.split('/').splice(0, 3).join('/'))}
                                    visible={!!openChatId && width < 680}
                                    className={styles.back}
                                >
                                    <Icons variants="backArrow" />
                                </Box.Animated>
                                <ChatCard />
                            </Box.Animated>
                            <Box.Animated
                                visible={!!openChatId && !ChatService.checkIsOpenChatInfo()}
                                animationVariant="autoWidth"
                                className={styles.rightColumn}
                            >
                                <SearchMessages mini={width < 900} />
                                <VideoCallBtn />
                                <AudioCallBtn />
                                {openChat?.is_group && (
                                    <div onClick={() => setVisibleHeaderMenu()} className={styles.icon}>
                                        <Icons variants="dots" />
                                    </div>
                                )}
                            </Box.Animated>
                        </>
                    ) : (
                        <div className={styles.network}>
                            <LoadingIndicator visible />
                            <div className={styles.text}>подключение к сети...</div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default HeaderForChatsPage;
