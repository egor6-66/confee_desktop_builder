import React, { Fragment } from 'react';

import { useStyles } from 'shared/hooks';

import styles from './styles.module.scss';
import Button from '../../../button';
import Icons from '../../../icons';
import { BaseTabBarProps } from '../../types';

function BaseTabBar(props: BaseTabBarProps) {
    const { items, activeItemId, variant = '' } = props;

    const classes = useStyles(styles, 'body', {
        [variant]: variant,
    });

    return (
        <div className={styles.wrapper}>
            <div className={classes}>
                {items.map((i) => (
                    <Fragment key={i.id}>
                        {variant === 'icons' ? (
                            <Button.Circle variant="secondary" onClick={i.callback}>
                                <Icons variant={i.icon} />
                            </Button.Circle>
                        ) : (
                            <Button onClick={i.callback} key={i.id} variant={i.id === activeItemId ? 'primary' : 'secondary'} chips>
                                {i.title}
                            </Button>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

export default BaseTabBar;
