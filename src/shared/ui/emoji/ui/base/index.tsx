import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import React, { useRef } from 'react';
import { useUpdateEffect } from 'react-use';

import { useClickAway, useEasyState, useStyles, useTheme, useThrottle } from 'shared/hooks';

import styles from './styles.module.scss';
import { appService } from '../../../../../entities/app';
import Box from '../../../box';
import Icons from '../../../icons';
import { BaseEmojiProps } from '../../types';
import customsEmojis from '../custom';
import categoriesEmojis from '../custom/categories';

const [throttleMouseMove] = useThrottle((cb) => cb(), 1000);

function EmojiBase(props: BaseEmojiProps) {
    const { onMouseMove, openCloseTrigger, clickOnEmoji } = props;

    const pickerRef = useRef(null);

    const theme = useTheme();

    const visible = useEasyState(false);

    const click = (data: any) => {
        console.log(data.unified);
        clickOnEmoji(data.emoji);
    };

    useClickAway(pickerRef, () => {
        visible.set(false);
    });

    const classes = useStyles(styles, 'picker', {
        visible,
    });

    useUpdateEffect(() => {
        openCloseTrigger && openCloseTrigger(visible.value);
    }, [visible.value]);

    return (
        <div className={styles.wrapper}>
            <Box.Animated
                visible={visible.value}
                className={classes}
                ref={pickerRef}
                onMouseMove={() => {
                    onMouseMove && throttleMouseMove(onMouseMove);
                }}
            >
                <EmojiPicker
                    categories={categoriesEmojis as any}
                    customEmojis={customsEmojis}
                    emojiVersion="5.0"
                    lazyLoadEmojis
                    emojiStyle={EmojiStyle.APPLE}
                    width={300}
                    height={400}
                    theme={theme.value === 'light' ? Theme.LIGHT : Theme.DARK}
                    onEmojiClick={click}
                    searchDisabled
                    previewConfig={{
                        showPreview: false,
                    }}
                />
            </Box.Animated>
            <div onClick={() => visible.set(true)} className={styles.btn}>
                <Icons variant="emoji" />
            </div>
        </div>
    );
}
//
export default EmojiBase;
