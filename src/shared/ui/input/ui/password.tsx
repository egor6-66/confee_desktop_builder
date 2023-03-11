import React, { forwardRef, useState } from 'react';

import Icons from './icons';
import styles from './styles.module.scss';
import { getBase } from '../index';
import { PasswordProps } from '../types';

const Input = forwardRef<HTMLInputElement, PasswordProps>((props, ref) => {
    const [showPass, toggleShowPass] = useState<boolean>(false);

    const { classes, inputAttrs } = getBase(props);

    return (
        <div className={classes}>
            <input type={showPass ? 'text' : 'password'} ref={ref} className={styles.input} {...inputAttrs} />
            <div onClick={() => toggleShowPass((prev) => !prev)}>
                <Icons variants={showPass ? 'visiblePass' : 'hiddenPass'} />
            </div>
        </div>
    );
});

export default Input;
