import React from 'react';

import { chatApi } from 'entities/chat';
import { useEasyState } from 'shared/hooks';
import { Modal, Input, Notification, ModalTypes, Image } from 'shared/ui';

type Props = {
    chatId: number;
    visible: boolean;
    onClose: () => void;
};

function ChatAvatarsSwiper(props: Props) {
    const { chatId, onClose, visible } = props;

    const { data: imagesData } = chatApi.handleGetAvatars({ chatId });

    const updItems = imagesData?.map((i, index) => ({
        id: i,
        url: i || '',
    }));

    return <Image.Swiper initialSlide={0} closeClick={onClose} visible={visible} items={imagesData?.length ? updItems : []} />;
}

export default ChatAvatarsSwiper;
