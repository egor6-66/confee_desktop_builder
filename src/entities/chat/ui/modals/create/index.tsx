import React, { useState } from 'react';

import { viewerTypes } from 'entities/viewer';
import { UseEasyStateReturnType, UseArrayReturnType } from 'shared/hooks';
import { BaseTypes } from 'shared/types';
import { Button, Icons, Input, Title, TabBar, Card, CardTypes } from 'shared/ui';

import styles from './styles.module.scss';

type Props = {
    selectedContacts: UseArrayReturnType<CardTypes.CardListItem>;
    isGroup: UseEasyStateReturnType<boolean>;
    createChat: () => void;
    contacts: viewerTypes.ContactProxy[] | BaseTypes.Empty;
} & BaseTypes.Statuses;

function CreateChatModalView(props: Props) {
    const { selectedContacts, isGroup, createChat, contacts, loading } = props;

    const [activeTab, setActiveTab] = useState(0);
    const btns = [{ id: 0, title: 'Все', callback: () => setActiveTab(0) }];

    const toggle = () => {
        isGroup.toggle();
        selectedContacts.clear();
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <Title animateTrigger={`${isGroup.value}`} variant="H2">
                    {isGroup.value ? 'Группа' : 'Написать сообщение'}
                </Title>
                <div className={styles.search}>
                    <Input width="100%" placeholder="Поиск" prefixIcon="search" clearIcon />
                </div>
                <div className={styles.border} />
                <div className={styles.switch}>
                    <Button
                        onClick={toggle}
                        width="auto"
                        variant="inherit"
                        active
                        animateTrigger={`${isGroup.value}`}
                        prefixIcon={<Icons variant={isGroup.value ? 'contacts' : 'group'} />}
                    >
                        {!isGroup.value ? 'Создать группу' : 'Написать личное сообщение'}
                    </Button>
                </div>
            </div>
            <TabBar bodyStyle={{ padding: '0 22px' }} items={btns} activeItemId={activeTab} />
            <div className={styles.list}>
                <Card.List
                    sortByName
                    selected={selectedContacts}
                    items={contacts?.map((i) => ({
                        id: i.user_id,
                        img: i.avatar,
                        name: i.contact_name || i.first_name || '',
                        title: i.contact_name || i.first_name || '',
                        subtitle: i.phone || '',
                    }))}
                />
            </div>
            <div className={styles.footer}>
                <Button animateTrigger={`${isGroup.value}`} prefixIcon={<Icons variant="new-message" />} variant="secondary" onClick={createChat}>
                    {isGroup.value ? 'Создать группу' : '  Написать'}
                </Button>
            </div>
        </div>
    );
}

export default CreateChatModalView;
