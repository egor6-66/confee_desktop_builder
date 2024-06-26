import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { VideoSeekSlider } from 'react-video-seek-slider';

import 'react-video-seek-slider/styles.css';

import { useEasyState, useFetchMediaContent, useVideo, useIdle } from 'shared/hooks';
import { secondsToHms } from 'shared/lib';

import styles from './styles.module.scss';
import { Box, Button, Icons, Slider, Title } from '../../../..';
import { BaseVideoProps } from '../../types';

function VideoPlayerWithControls(props: BaseVideoProps) {
    const { autoPlay, clickFull, url, onClick, borderRadius = true, height, horizontalImgWidth, width, reset, name } = props;

    const { src, isLoading, error } = useFetchMediaContent({ url, name, fileType: 'video' });
    const visibleControl = useEasyState(true);
    const speed = useEasyState(1);

    const [video, state, controls, ref] = useVideo(
        <motion.video
            autoPlay={autoPlay}
            onMouseEnter={() => visibleControl.set(true)}
            onMouseLeave={() => visibleControl.set(false)}
            className={styles.video}
            style={{ borderRadius: borderRadius ? 12 : 0 }}
            src={src}
            onContextMenu={(e) => {
                e.preventDefault();
            }}
        />
    );

    useEffect(() => {
        if (ref.current) {
            ref.current.playbackRate = speed.value;
        }
    }, [speed.value]);

    return (
        <div className={styles.wrapper}>
            {video}
            <Box.Animated
                visible={visibleControl.value}
                className={styles.controls}
                onMouseMove={() => visibleControl.set(true)}
                onMouseLeave={() => visibleControl.set(false)}
            >
                <div className={styles.top}>
                    <div className={styles.volume}>
                        <Button.Circle variant="inherit" radius={24} onClick={state.muted ? controls.unmute : controls.mute}>
                            <Icons.Player variant={!state.muted ? 'unmute' : 'mute'} />
                        </Button.Circle>
                        <Slider max={1} step={0.01} defaultValue={state.volume} onChange={(value) => typeof value === 'number' && controls.volume(value)} />
                    </div>
                    <Button.Circle variant="inherit" onClick={!state.playing ? controls.play : controls.pause}>
                        <Icons.Player variant={state.playing ? 'pause' : 'play'} />
                    </Button.Circle>
                    <div className={styles.actions}>
                        <Button.Circle variant="inherit" radius={30} onClick={() => speed.set(speed.value < 3 ? speed.value + 0.5 : 1)}>
                            <div className={styles.speed}>{`${speed.value}x`}</div>
                        </Button.Circle>
                        <Button.Circle variant="inherit" radius={18} onClick={clickFull}>
                            <Icons.Player variant="full" />
                        </Button.Circle>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.time}>
                        <Title variant="H4M" color="fixed">
                            {secondsToHms(Math.ceil(state.time))}
                        </Title>
                    </div>
                    <div className={styles.slider}>
                        <VideoSeekSlider
                            max={state.duration}
                            secondsPrefix="00:"
                            minutesPrefix="0:"
                            currentTime={state.time}
                            bufferTime={state.buffered[0]?.time}
                            limitTimeTooltipBySides
                            // getPreviewScreenUrl={() => ''}
                            hideThumbTooltip
                            onChange={controls.seek}
                        />
                    </div>
                    <div className={styles.timeReverse}>
                        <Title color="fixed" textAlign="right" variant="H4M">{`${secondsToHms(Math.floor(state.duration - state.time))}`}</Title>
                    </div>
                </div>
            </Box.Animated>
        </div>
    );
}

export default VideoPlayerWithControls;
