import React from 'react';

import { UserCardView, UserInfoView, userProxy, userTypes } from 'entities/user';
import { BaseTypes } from 'shared/types';

import styles from './styles.module.scss';
import { useWidthMediaQuery } from '../../../../shared/hooks';
import { Avatar, Button, Dropdown, DropdownTypes, Icons, Title } from '../../../../shared/ui';
import { CompanyTagView } from '../../../company';
import { ContactProxy } from '../../model/types';

type Props = {
    contact: ContactProxy | BaseTypes.Empty;
    clickAvatar: () => void;
    back: () => void;
    actions: userTypes.UserCardActions;
} & BaseTypes.Statuses;

function ContactProfileView(props: Props) {
    const { loading, clickAvatar, contact, back, actions } = props;

    const sm = useWidthMediaQuery().to('sm');

    const Btns: BaseTypes.Item[] = [
        { id: 0, title: 'Аудио', icon: 'phone', payload: '', callback: actions?.audioCall },
        { id: 1, title: 'Видео', icon: 'videocam', payload: '', callback: actions?.videoCall },
        { id: 2, title: 'Чат', icon: 'chat', payload: '', callback: actions?.getChat },
        { id: 3, title: 'Ещё', icon: 'more', payload: '', callback: () => '' },
    ];

    const moreBtn: DropdownTypes.DropdownMenuItem[] = [
        { id: 0, title: 'Выключить уведомления', icon: <Icons.Player variant="mute" />, callback: () => actions?.mute() },
        { id: 1, title: 'Удалить', icon: <Icons variant="delete" />, callback: () => actions?.delete && actions?.delete() },
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.avatarBlock}>
                <div className={styles.name}>
                    <Title variant="H1">{contact?.full_name}</Title>
                </div>
                <Avatar loading={loading} clickAvatar={clickAvatar} circle={false} size={sm ? 346 : 375} img={contact?.avatar} />
                <div className={styles.btns}>
                    {Btns.map((i) => (
                        <Dropdown.Menu position="bottom-center" items={moreBtn} key={i.id} disabled={i.title !== 'Ещё'}>
                            <Button
                                direction="vertical"
                                prefixIcon={i.id === 3 ? <Icons.Player variant={i.icon} /> : <Icons variant={i.icon} />}
                                onClick={i.callback}
                            >
                                {i.title}
                            </Button>
                        </Dropdown.Menu>
                    ))}
                </div>
            </div>
            <UserInfoView user={contact?.userProxy || null} />
        </div>
    );
}

export default ContactProfileView;
