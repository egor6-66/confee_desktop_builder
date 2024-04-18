import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef } from 'react';

import { messageTypes } from 'entities/message';
import { useEasyState, UseEasyStateReturnType } from 'shared/hooks';
import { BaseTypes } from 'shared/types';
import { Title, Icons, Avatar, Button, IconsTypes, ContextMenu, ContextMenuTypes, Input, ModalTypes } from 'shared/ui';

import styles from './styles.module.scss';
import { Box } from '../../../../../../shared/ui';
import { CompanyTagView } from '../../../../../company';
import { EmployeeProxy } from '../../../../../company/model/types';
import { UserProxy } from '../../../../../user/model/types';
import { ChatProxy, GroupChatActions } from '../../../../model/types';
import ChatProfileContentView from '../content';
import ChatDescriptionView from '../description';

type Props = {
    chat: ChatProxy | BaseTypes.Empty;
    actions: (actions: GroupChatActions) => void;
    mediaTypes: UseEasyStateReturnType<messageTypes.MediaContentType | null>;
    files: messageTypes.File[] | BaseTypes.Empty;
    selectFile: () => void;
    getScreenshot: (preview: string, file: File) => void;
    clickAvatar: () => void;
    updateChatName: (name: string) => void;
    clickUser: (data: { user?: UserProxy; employee?: EmployeeProxy }) => void;
    removeMember: (id: number, name: string) => void;
    setDescription: (value: string) => void;
    scrollPosition?: ModalTypes.ScrollPosition;
} & BaseTypes.Statuses;

function GroupChatProfileModalView(props: Props) {
    const {
        scrollPosition,
        setDescription,
        removeMember,
        clickUser,
        clickAvatar,
        chat,
        actions,
        mediaTypes,
        files,
        getScreenshot,
        selectFile,
        updateChatName,
    } = props;

    const visibleMenu = useEasyState(false);
    const visibleDescriptionMenu = useEasyState(false);
    const mainInfoRef = useRef<HTMLDivElement>(null);

    const btns: BaseTypes.Item<IconsTypes.BaseIconsVariants, any>[] = [
        { id: 0, title: 'Конференция', icon: 'videocam', payload: '', callback: () => actions('goMeet') },
        { id: 1, title: 'Ещё', icon: 'more', payload: '', callback: () => visibleMenu.set(true) },
    ];

    const menuItems: ContextMenuTypes.ContextMenuItem[] = [
        {
            id: 0,
            title: !chat?.is_muted ? 'Выключить уведомления' : 'Включить уведомления',
            icon: <Icons variant={chat?.is_muted ? 'unmute' : 'mute'} />,
            callback: async () => {
                actions('mute');
            },
        },
        {
            id: 1,
            title: 'Покинуть чат',
            icon: <Icons variant="delete" />,
            hidden: !chat?.is_group,
            callback: () => {
                actions('leave');
                visibleMenu.set(false);
            },
            isRed: true,
        },
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainInfo} ref={mainInfoRef}>
                <Avatar.Change
                    disabled={!chat?.isOwner}
                    clickAvatar={clickAvatar}
                    dropdownLeft={90}
                    size={200}
                    img={chat?.avatar || ''}
                    name={chat?.name || ''}
                    deleteFile={() => ''}
                    selectFile={selectFile}
                    getScreenshot={getScreenshot}
                />
                <div className={styles.name}>
                    <Title
                        maxLength={22}
                        animateTrigger={chat?.name}
                        updCallback={chat?.isOwner ? (name) => updateChatName(String(name)) : undefined}
                        textAlign="center"
                        variant="H1"
                    >
                        {chat?.name}
                    </Title>
                    {!chat?.is_personal && <CompanyTagView name="TFN" />}
                </div>
                <Title textAlign="center" variant="H3R">
                    {chat?.subtitle}
                </Title>
            </div>
            <Box.Animated className={styles.chatName} visible={!!scrollPosition?.top && scrollPosition.top > 250}>
                <Title textAlign="center" variant="H2">
                    {chat?.name}
                </Title>
            </Box.Animated>
            <ContextMenu
                onClick={() => visibleMenu.set(false)}
                trigger="mouseup"
                items={menuItems}
                visible={visibleMenu.value}
                clickAway={() => visibleMenu.set(false)}
            />
            <div className={styles.btns}>
                {btns.map((i) => (
                    <Button
                        variant="bg-secondary"
                        redText={i.isRed}
                        direction="vertical"
                        prefixIcon={<Icons variant={i.icon} />}
                        key={i.id}
                        onClick={i.callback}
                    >
                        {i.title}
                    </Button>
                ))}
            </div>
            <ChatDescriptionView description={chat?.description} setDescription={setDescription} />

            <ChatProfileContentView
                removeMember={removeMember}
                files={files}
                chat={chat}
                mediaTypes={mediaTypes}
                clickUser={clickUser}
                addMemberClick={() => actions('add-members')}
            />
        </div>
    );
}

export default GroupChatProfileModalView;
