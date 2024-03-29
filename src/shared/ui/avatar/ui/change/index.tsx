import React, { useState } from 'react';

import { Avatar, DropdownTypes, WebCameraPhoto, Box, ContextMenu, ContextMenuTypes, Icons } from 'shared/ui';

import styles from './styles.module.scss';
import { useEasyState } from '../../../../hooks';
import { AvatarChangeProps } from '../../types';

function AvatarChange(props: AvatarChangeProps) {
    const { img, name, clickAvatar, dropdownLeft, dropdownTop, selectFile, circle = true, size = 80, deleteFile, getScreenshot, disabled } = props;

    const [visibleCamera, setVisibleCamera] = useState(false);

    const visibleMenu = useEasyState(false);

    const action = (preview: string, file: File) => {
        setVisibleCamera(false);
        getScreenshot(preview, file);
    };

    const items: ContextMenuTypes.ContextMenuItem[] = [
        { id: 0, icon: <Icons variant="select-file" />, title: 'Выбрать файл', callback: selectFile },
        { id: 1, icon: <Icons variant="makePhoto" />, title: 'Сделать фото', callback: () => setVisibleCamera(!visibleCamera) },
        // { id: 2, icon: <Icons variant="delete" />, isRed: true, title: 'Удалить фото', callback: deleteFile, hidden: !img },
    ];

    return (
        <div className={styles.wrapper} onMouseLeave={() => visibleMenu.set(false)}>
            <Box.Animated visible={visibleCamera} className={styles.webCamera}>
                <WebCameraPhoto getScreenshot={action} />
            </Box.Animated>
            <ContextMenu trigger="mouseup" visible={visibleMenu.value} items={items.filter((i) => !i.hidden)} />
            <div className={styles.avatar} style={{ borderRadius: circle ? '50%' : 8 }}>
                <Avatar clickAvatar={clickAvatar} circle={circle} img={img || ''} name={name} size={size} />
                <div onClick={visibleMenu.toggle} className={styles.cover}>
                    Загрузить
                </div>
            </div>
        </div>
    );
}

export default AvatarChange;
