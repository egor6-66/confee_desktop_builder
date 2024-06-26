import { ReactNode, CSSProperties } from 'react';

import { BaseTypes } from 'shared/types';

import { AnimationVariants } from '../box/types';

export type Trigger = 'contextmenu' | 'click' | 'mousedown' | 'mouseup';
export type BaseDropdownProps = {
    visible: boolean;
    content?: ReactNode;
    reverseX?: boolean;
    reverseY?: boolean;
    animationVariant?: AnimationVariants;
    openCloseTrigger?: (arg: boolean) => void;
    onClick?: () => void;
    clickAway?: () => void;
    trigger?: Trigger;
    destroyed?: boolean;
    x?: number;
    y?: number;
} & BaseTypes.Statuses;
