import React, { memo, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';

import styles from './styles.module.scss';
import { messageStore } from '../../../../../../entities/message';
import { useEasyState, UseEasyStateReturnType, useFetchMediaContent, useFs, useStorage, useVideo } from '../../../../../hooks';
import Box from '../../../../box';
import Icons from '../../../../icons';
import { ContextMenu, ContextMenuTypes, Dropdown, DropdownTypes } from '../../../../index';
import LoadingIndicator from '../../../../loading-indicator';
import Notification from '../../../../notification';
import Image from '../../../image';
import { BaseVideoProps } from '../../types';

function VideoPlayer(props: BaseVideoProps) {
    const { previewUrl, visibleDropdown = true, id, name, url, onClick, borderRadius = true, height, horizontalImgWidth, width } = props;

    const fs = useFs();

    const { src, isLoading, error, getFileBlob } = useFetchMediaContent({ url, name, fileType: 'video' });

    const downloadFile = messageStore.use.downloadFile();

    const notification = Notification.use();

    const progress = useEasyState(0);

    // const { saveFromBack } = useFs();
    const visibleMenu = useEasyState(false);

    const saveFile = () => {
        if (name && url) {
            fs.downLoadAndSave({ baseDir: 'download', url, fileName: name, progressCallback: (percent) => progress.set(percent) });
        }
    };

    const [video, state, controls, ref] = useVideo(
        <video
            onClick={onClick}
            onContextMenu={(e) => e.preventDefault()}
            style={{ width: width || '100%', height, borderRadius: borderRadius ? 12 : 0, objectFit: 'contain', cursor: 'pointer', maxHeight: 400 }}
            src={src}
            autoPlay
            muted
        />
    );

    const clickContextMenu = (e: any) => {
        e.preventDefault();
        if (visibleDropdown) {
            visibleMenu.toggle();
        } else {
            downloadFile.set({
                fileType: 'videos',
                callback: saveFile,
            });
        }
    };

    const menuItems: ContextMenuTypes.ContextMenuItem[] = [
        {
            id: 0,
            title: 'Скачать видео',
            icon: <Icons variant="save" />,
            callback: async () => {
                visibleMenu.set(false);
                saveFile();
                downloadFile.clear();
            },
        },
    ];

    useEffect(() => {
        if (progress.value === 100) {
            notification.success({ title: 'Видео сохранено', system: true });
        }
    }, [progress.value]);

    return (
        <div
            onMouseLeave={() => visibleMenu.set(false)}
            onContextMenu={clickContextMenu}
            className={styles.wrapper}
            style={{ maxWidth: width || '100%', width: width || '100%', height }}
        >
            {progress.value > 0 && progress.value < 100 && (
                <div className={styles.savingFile}>
                    <LoadingIndicator.Downloaded size={50} visible primary={false} />
                </div>
            )}
            {video}
            <Box.Animated className={styles.loading} visible={isLoading} style={{ borderRadius: borderRadius ? 12 : 0, height }}>
                <LoadingIndicator visible />
            </Box.Animated>
            <ContextMenu visible={visibleMenu.value} items={menuItems} />
        </div>
    );
}

export default VideoPlayer;
