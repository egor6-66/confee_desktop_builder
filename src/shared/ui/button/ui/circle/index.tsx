import React from 'react';

import { useStyles } from 'shared/hooks';

import styles from './styles.module.scss';
import Glare from '../../../loading-indicator/ui/glare';
import { CircleButtonProps } from '../../types';

function CircleButton(props: CircleButtonProps) {
    const { children, disabled, loading, error, radius = 40, active, ...other } = props;

    const classes = useStyles(styles, 'wrapper', {
        active,
        disabled: disabled || loading,
        error,
    });

    return (
        <button className={classes} {...other} style={{ width: radius, height: radius }}>
            {children}
            <Glare visible={!!loading} />
        </button>
    );
}

export default CircleButton;
