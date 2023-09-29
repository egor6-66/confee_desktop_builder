import React from 'react';

import { UserCardView, UserInfoView } from 'entities/user';
import { BaseTypes } from 'shared/types';

import styles from './styles.module.scss';
import { useWidthMediaQuery } from '../../../../shared/hooks';
import { Avatar, AvatarTypes, Button, Title } from '../../../../shared/ui';
import { CompanyCardView } from '../../../company';
import { Company } from '../../../company/model/types';
import { ViewerProxy } from '../../model/types';

type Props = {
    viewer: ViewerProxy | BaseTypes.Empty;
    companies: Company[];
    clickSettings: () => void;
    avatarActions?: AvatarTypes.AvatarChangeActions;
    clickAvatar: () => void;
} & BaseTypes.Statuses;

function ViewerProfileView(props: Props) {
    const { companies, clickAvatar, avatarActions, clickSettings, viewer, loading } = props;
    const sm = useWidthMediaQuery().to('sm');

    return (
        <div className={styles.wrapper}>
            <div className={styles.avatarBlock}>
                {avatarActions && (
                    <Avatar.Change
                        clickAvatar={clickAvatar}
                        dropdownLeft={sm ? 100 : 270}
                        dropdownTop={280}
                        {...avatarActions}
                        circle={false}
                        size={sm ? 346 : 375}
                        img={viewer?.avatar || ''}
                    />
                )}
                <Button onClick={clickSettings}>Редактировать личную информацию</Button>
            </div>
            <div className={styles.description}>
                <div className={styles.name}>
                    <Title variant="H1">{viewer?.full_name}</Title>
                </div>
                <UserInfoView user={viewer as any} />
            </div>
            {companies.length ? (
                <CompanyCardView
                    title={companies[0]?.name || ''}
                    subtitle={companies[0].departments[0].name || ''}
                    status="in office"
                    position={companies[0].departments[0].employees[0].status || 'in office'}
                />
            ) : null}
        </div>
    );
}

export default ViewerProfileView;
