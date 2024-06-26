import React, { CSSProperties } from 'react';

import { useWidthMediaQuery } from 'shared/hooks';
import { BaseTypes } from 'shared/types';
import { Card, Icons, Image, Title } from 'shared/ui';

import styles from './styles.module.scss';
import { Company, EmployeeStatuses } from '../../model/types';
import EmployeeStatusView from '../employee/status';

type Props = {
    title: string;
    subtitle: string;
    status: keyof typeof EmployeeStatuses;
    position: string;
    width?: string;
    style?: CSSProperties;
    cardClick?: () => void;
    avatar?: string;
    mini?: boolean;
    visibleArrow?: boolean;
} & BaseTypes.Statuses;

function CompanyCardView(props: Props) {
    const { visibleArrow = true, mini, avatar, cardClick, style, title, status, subtitle, position, width } = props;
    const sm = useWidthMediaQuery().to('sm');

    return mini ? (
        <div className={styles.company} onClick={cardClick}>
            <div className={styles.container}>
                <Image width="32px" height="32px" url={avatar || ''} />
                <div className={styles.name}>
                    <Title variant="H4S">{title || ''}</Title>
                </div>
                <div className={styles.dot} />
                <Title primary={false} variant="H4R">
                    {subtitle}
                </Title>
            </div>
            <Icons size={14} variant="arrow-drop-right" />
        </div>
    ) : (
        <div className={styles.wrapper} style={{ ...style, cursor: cardClick ? 'pointer' : 'default' }} onClick={cardClick}>
            {visibleArrow && (
                <div className={styles.arrow}>
                    <Icons variant="arrow-drop-right" />
                </div>
            )}
            <div className={styles.body}>
                <Card img={avatar} title={title} subtitle={subtitle} />
                <div className={styles.position}>
                    <Title textWrap variant="caption1M">
                        {position || 'Нет данных'}
                    </Title>
                </div>
                <EmployeeStatusView status={status} />
            </div>
        </div>
    );
}

export default CompanyCardView;
