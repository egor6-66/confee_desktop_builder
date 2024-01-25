import React, { MouseEvent, RefObject, useEffect, useRef, WheelEvent } from 'react';

import { useEasyState, useReverseTimer, useDebounce } from 'shared/hooks';

function useMessagesScroll(wrapperRef: RefObject<HTMLDivElement>) {
    const sliderRef = useRef<HTMLDivElement>(null);

    const realHeight = useEasyState(0);
    const sliderHeight = useEasyState(0);
    const sliderY = useEasyState(0);
    const isSliderCapture = useEasyState(false);
    const visible = useEasyState(false);

    // useDebounce(() => visible.set(false), 2000, [sliderY]);

    const onWheel = (e: WheelEvent<HTMLDivElement>) => {
        const wrapper = e.currentTarget;
        visible.set(true);
        const { scrollTop, scrollHeight, clientHeight } = wrapper;
        const step = 50;
        wrapper.scrollTop = e.deltaY < 0 ? scrollTop - step : scrollTop + step;
        const viewHeightPercent = Math.ceil((clientHeight * 100) / scrollHeight);
        const sliderHeightNum = (clientHeight / 100) * viewHeightPercent;
        const realHeightNum = clientHeight - (clientHeight / 100) * viewHeightPercent;
        const viewYPercent = Math.ceil((scrollTop / (scrollHeight - clientHeight)) * 100);
        if (scrollHeight > clientHeight) {
            sliderY.set(-viewYPercent);
            if (sliderHeight.value !== sliderHeightNum) {
                sliderHeight.set(sliderHeightNum);
            }
            realHeight.set(realHeightNum);
        }
    };

    const onMouseMove = (e: globalThis.MouseEvent) => {
        if (wrapperRef.current) {
            const { offsetTop, clientHeight } = wrapperRef.current;
            const mouseY = Math.floor(clientHeight - (e.clientY - 70));
            const mouseYPercent = Math.floor((mouseY / clientHeight) * 10000) / 100;
            sliderY.set(mouseYPercent);
        }
    };

    useEffect(() => {
        document.addEventListener('mouseup', () => isSliderCapture.set(false));
        if (wrapperRef.current) {
            if (isSliderCapture.value) {
                wrapperRef.current.onmousemove = onMouseMove;
            } else {
                wrapperRef.current.onmousemove = null;
            }
        }
        return document.removeEventListener('mouseup', () => null);
    }, [isSliderCapture.value]);

    function Scrollbar() {
        return (
            <div
                onMouseDown={() => isSliderCapture.set(true)}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    height: '100%',
                    width: 6,
                    zIndex: 100000,
                    display: visible.value ? 'flex' : 'none',
                    alignItems: 'center',
                    overflow: 'hidden',

                    // backgroundColor: 'var(--control-tertiary)',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: realHeight.value,
                        position: 'relative',
                        // backgroundColor: 'var(--control-tertiary)',
                    }}
                >
                    <div
                        ref={sliderRef}
                        style={{
                            cursor: 'pointer',
                            width: '100%',
                            height: sliderHeight.value,
                            backgroundColor: 'var(--bg-quaternary)',
                            borderRadius: 22,
                            position: 'absolute',
                            left: 0,
                            bottom: `${sliderY.value || 0}%`,
                            transform: ' translateY(50%)',
                        }}
                    />
                </div>
            </div>
        );
    }

    return { onWheel, Scrollbar };
}

export default useMessagesScroll;
