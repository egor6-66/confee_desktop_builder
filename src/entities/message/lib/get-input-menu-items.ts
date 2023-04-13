import { useEffect } from 'react';

import { useFileUploader } from 'shared/hooks';

import useMessageStore from '../model/store';
import { InputMenuItem } from '../model/types';

function getInputMenuItems(): InputMenuItem[] {
    const setMediaContentToSend = useMessageStore.use.setMediaContentToSend();
    const image = useFileUploader({
        accept: 'image',
        multiple: true,
        formDataName: 'images',
    });

    const audio = useFileUploader({
        accept: 'audio',
        multiple: true,
        formDataName: 'audios',
    });

    const video = useFileUploader({
        accept: 'video',
        multiple: true,
        formDataName: 'videos',
    });

    const document = useFileUploader({
        accept: 'document',
        multiple: true,
        formDataName: 'documents',
    });

    useEffect(() => {
        image.files.length && setMediaContentToSend({ type: 'image', data: image.files, formData: image.formData });
        audio.files.length && setMediaContentToSend({ type: 'audio', data: audio.files, formData: audio.formData });
        video.files.length && setMediaContentToSend({ type: 'video', data: video.files, formData: video.formData });
        document.files.length && setMediaContentToSend({ type: 'document', data: document.files, formData: document.formData });
    }, [image.files.length, audio.files.length, video.files.length, document.files.length, image.formData, audio.formData, video.formData, document.formData]);

    return [
        { id: 0, title: 'Загрузить фото', icon: 'image', onClick: image.open },
        { id: 1, title: 'Загрузить аудио', icon: 'audio', onClick: audio.open },
        { id: 2, title: 'Загрузить видео', icon: 'video', onClick: video.open },
        { id: 3, title: 'Загрузить документы', icon: 'document', onClick: document.open },
    ];
}

export default getInputMenuItems;