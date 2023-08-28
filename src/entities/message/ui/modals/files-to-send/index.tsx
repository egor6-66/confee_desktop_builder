import React, { ReactNode } from 'react';

import { UseArrayReturnType, UseFileUploaderTypes } from 'shared/hooks';
import { BaseTypes } from 'shared/types';
import { AudioPlayer, Button, Document, Icons, Image, Title, VideoPlayer } from 'shared/ui';

import styles from './styles.module.scss';
import { getEnding } from '../../../../../shared/lib';

type Props = {
    images: UseArrayReturnType<UseFileUploaderTypes.Types.ImageFile>;
    audios: UseArrayReturnType<UseFileUploaderTypes.Types.AudioFile>;
    documents: UseArrayReturnType<UseFileUploaderTypes.Types.DocumentFile>;
    videos: UseArrayReturnType<UseFileUploaderTypes.Types.VideoFile>;
    addFiles: () => void;
    sendFiles: () => void;
    close: () => void;
} & BaseTypes.Statuses;

function FilesToSendModalView(props: Props) {
    const { images, documents, audios, videos, addFiles, sendFiles, close } = props;

    const fileLength = images.length + documents.length + audios.length + videos.length;

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <Title variant="H2">{`Отправить ${fileLength} ${getEnding(fileLength, ['файл', 'файла', 'файлов'])}`}</Title>
            </div>
            <div className={styles.list}>
                {images.array.length
                    ? images.array.map((i) => (
                          <Item key={i.id} remove={() => images.deleteById(i.id)}>
                              <Image.Card url={i.fileUrl} name={i.name} size={+i.size} />
                          </Item>
                      ))
                    : null}
                {audios.array.length
                    ? audios.array.map((i) => (
                          <Item key={i.id} remove={() => audios.deleteById(i.id)}>
                              <AudioPlayer.Card url={i.fileUrl} name={i.name} size={+i.size} />
                          </Item>
                      ))
                    : null}
                {videos.array.length
                    ? videos.array.map((i) => (
                          <Item key={i.id} remove={() => videos.deleteById(i.id)}>
                              <VideoPlayer.Card url={i.fileUrl} name={i.name} size={+i.size} />
                          </Item>
                      ))
                    : null}
                {documents.array.length
                    ? documents.array.map((i) => (
                          <Item key={i.id} remove={() => documents.deleteById(i.id)}>
                              <Document url={i.fileUrl} name={i.name} size={+i.size} />
                          </Item>
                      ))
                    : null}
            </div>
            <div className={styles.footer}>
                <Button variant="inherit" active width="25%" onClick={addFiles}>
                    Добавить
                </Button>
                <div className={styles.confirm} onClick={close}>
                    <Button variant="inherit" active>
                        Отмена
                    </Button>
                    <Button variant="inherit" active onClick={sendFiles}>
                        Отправить
                    </Button>
                </div>
            </div>
        </div>
    );
}

function Item(props: { children: ReactNode; remove: () => void }) {
    const { children, remove } = props;
    return (
        <div className={styles.item}>
            <div className={styles.children}>{children}</div>
            <Button.Circle onClick={remove} radius={30} variant="inherit" className={styles.deleteIcon}>
                <Icons variant="delete" />
            </Button.Circle>
        </div>
    );
}

export default FilesToSendModalView;