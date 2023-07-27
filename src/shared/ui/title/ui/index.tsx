import cn from 'classnames';
import cnBind from 'classnames/bind';
import React from 'react';

import styles from './styles.module.scss';
import { Props } from '../types';

function Title(props: Props) {
    const { children, isError, textWrap, primary = true, variant } = props;

    const cx = cnBind.bind(styles);

    const classes = cn(
        cx('wrapper', {
            error: isError,
            [variant]: variant,
            primary,
            textWrap,
        })
    );

    return <div className={classes}>{children}</div>;
}

export default Title;
