import React, { useEffect } from 'react';

import { UseEasyStateReturnType, useReverseTimer } from 'shared/hooks';
import { BaseTypes } from 'shared/types';
import { Button, Icons, Input, Title, InputTypes, Box } from 'shared/ui';

import styles from './styles.module.scss';

type Props = {
    inputs: {
        email: InputTypes.UseReturnedType;
        code: InputTypes.UseReturnedType;
    };
    steps: UseEasyStateReturnType<'sendCode' | 'registration' | 'success'>;
    sendCode: () => void;
} & BaseTypes.Statuses;

function Registration(props: Props) {
    const { inputs, steps, sendCode } = props;
    const { start, time, reset, isRunning } = useReverseTimer({ seconds: 30 });

    const getCode = () => {
        sendCode();
        start();
    };

    useEffect(() => {
        start();
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.form}>
                <Title textAlign="center" textWrap variant="H1">
                    Введите код
                </Title>
                <Title textAlign="center" primary={false} textWrap variant="H3S">
                    {`Мы отправили код подтверждения  на ${inputs.email.value}`}
                </Title>
                <Input className={styles.input} maxLength={5} {...inputs.code} placeholder="00000" pattern="/^\d+$/" />
                <Button disabled={time[2] !== 0} onClick={getCode}>
                    {isRunning ? `Получить новый код через 00:${time[2]}` : 'Получить новый код'}
                </Button>
                <Button disabled={inputs.email.error} onClick={() => steps.set('sendCode')}>
                    Назад
                </Button>
            </div>
        </div>
    );
}

export default Registration;
