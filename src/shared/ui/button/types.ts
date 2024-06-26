import { ButtonHTMLAttributes, ReactNode, RefObject } from 'react';

import { BaseTypes } from 'shared/types';

type SharedProps = {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'negative' | 'inherit' | 'shadow' | 'bg-secondary';
    prefixIcon?: ReactNode;
    suffixIcon?: ReactNode;
    animateTrigger?: string;
    redText?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
    BaseTypes.Statuses;

export type BaseButtonProps = {
    size?: number | 's' | 'm';
    direction?: 'vertical' | 'horizontal';
    width?: string;
    height?: string;
    chips?: boolean;
    ref?: any;
} & SharedProps;

export type CircleButtonProps = {
    radius?: number;
} & SharedProps;
