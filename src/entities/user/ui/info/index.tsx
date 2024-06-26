import React, { useEffect } from 'react';

import { BaseTypes } from 'shared/types';
import { Title } from 'shared/ui';

import styles from './styles.module.scss';
import { updatePhone } from '../../../../shared/lib';
import { UserProxy } from '../../model/types';

type Props = {
    user?: UserProxy | null;
    hiddenEmail?: boolean;
} & BaseTypes.Statuses;

function UserInfoView(props: Props) {
    const { user, hiddenEmail } = props;

    const rows: { id: number; title: string; subtitle: string; hidden: boolean }[] = [
        { id: 0, title: 'Никнейм', subtitle: `@${user?.nickname}`, hidden: !user?.nickname },
        { id: 1, title: 'Номер телефона', subtitle: updatePhone(user?.phone || ''), hidden: !user?.phone },
        { id: 2, title: 'Дата рождения', subtitle: user?.formatted_birth || '', hidden: !user?.formatted_birth },
        { id: 3, title: 'Почта', subtitle: user?.email || '', hidden: !user?.email || !!hiddenEmail },
        { id: 4, title: 'О себе', subtitle: user?.about || '', hidden: !user?.about },
    ];

    return (
        <div className={styles.wrapper}>
            {rows
                .filter((i) => !i.hidden)
                .map((i) => (
                    <div key={i.id} className={styles.item}>
                        <Title variant="H4R" primary={false}>
                            {i.title}
                        </Title>
                        <Title textWrap={i.id === 4} variant="H3M">
                            {i.subtitle}
                        </Title>
                    </div>
                ))}
        </div>
    );
}

export default UserInfoView;
