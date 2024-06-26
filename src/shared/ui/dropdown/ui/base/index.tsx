import React, { forwardRef, RefObject, useEffect, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useElementDimensions } from 'react-screen-hooks';
import { useUpdateEffect, useWindowSize } from 'react-use';

import { useCallbackRef, useClickAway, useEasyState, useReverseTimer, useSize, useStyles, useWindowMouseClick } from 'shared/hooks';
import { Box } from 'shared/ui/index';

import styles from './styles.module.scss';
import { useDimensionsObserver } from '../../../../hooks';
import { BaseDropdownProps } from '../../types';

function Dropdown(props: BaseDropdownProps) {
    const {
        destroyed,
        openCloseTrigger,
        reverseX,
        reverseY,
        visible,
        content,
        trigger,
        onClick,
        animationVariant = 'visibleHidden',
        disabled,
        clickAway,
        y,
        x,
    } = props;

    const elementRef = useRef<HTMLDivElement>(null);

    const clickCoord = useWindowMouseClick(trigger, visible && trigger === 'mouseup');

    const { innerHeight, innerWidth } = window;
    const wrapperSize = useEasyState<any>({ width: 0, height: 0 });
    const outsideY = useEasyState(0);
    const outsideX = useEasyState(0);

    useEffect(() => {
        function handleResize() {
            clickAway && clickAway();
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useClickAway(elementRef, () => {
        clickAway && clickAway();
    });

    const padding = 12;

    const classes = useStyles(styles, 'wrapper', {});

    useUpdateEffect(() => {
        setTimeout(() => {
            if (elementRef.current && visible) {
                new ResizeObserver((entries) => {
                    const elementRect = entries[0].contentRect;

                    wrapperSize.set({ height: elementRect?.height, width: elementRect?.width });
                    if (reverseY) {
                        if (clickCoord.y - elementRect.height < 0) {
                            outsideY.set(elementRect.height + clickCoord.y - innerHeight);
                        } else {
                            outsideY.set(0);
                        }
                    } else if (elementRect.height + clickCoord.y > innerHeight) {
                        outsideY.set(elementRect.height + clickCoord.y - innerHeight);
                    } else {
                        outsideY.set(0);
                    }

                    if (reverseX) {
                        if (clickCoord.x - elementRect.width < 0) {
                            outsideX.set(elementRect.width + clickCoord.x - innerWidth);
                        } else {
                            outsideX.set(0);
                        }
                    } else if (clickCoord.x + elementRect.width > innerWidth) {
                        outsideX.set(clickCoord.x + elementRect.width - innerWidth);
                    } else {
                        outsideX.set(0);
                    }
                }).observe(elementRef.current);
            }
        }, 10);
    }, [elementRef.current]);

    useEffect(() => {
        openCloseTrigger && openCloseTrigger(visible);
    }, [visible]);

    const getTop = () => {
        if (wrapperSize.value.height) {
            if (reverseY) {
                if (outsideY.value < 0) {
                    return padding;
                }
                return clickCoord.y - wrapperSize.value.height;
            }
            if (outsideY.value > 0) {
                return clickCoord.y - outsideY.value - padding;
            }
            return clickCoord.y;
        }
        return y ? clickCoord.y + y : clickCoord.y;
    };

    const getLeft = () => {
        if (wrapperSize.value.width) {
            if (reverseX) {
                if (outsideX.value < 0) {
                    return padding;
                }
                return clickCoord.x - wrapperSize.value.width;
            }
            if (outsideX.value > 0) {
                return innerWidth - wrapperSize.value.width - padding;
            }
            return clickCoord.x;
        }
        return x ? clickCoord.x + x : clickCoord.x;
    };

    const item = () => (
        <Box.Animated
            ref={elementRef}
            animationVariant={animationVariant}
            style={{ top: getTop(), left: getLeft() }}
            className={classes}
            visible={visible}
            presence
            onClick={(e) => {
                onClick && onClick();
                e.stopPropagation();
            }}
        >
            {content}
        </Box.Animated>
    );

    return destroyed ? (visible ? item() : null) : item();
}

export default Dropdown;
