import React from 'react';

import { JoinMeetModalView, useMeetStore } from 'entities/meet';
import { Modal, Notification, ModalTypes, CardTypes, Input } from 'shared/ui';

import { appService } from '../../../../entities/app';
import { useRouter, useStorage, useWebView } from '../../../../shared/hooks';

function JoinMeetModal(modal: ModalTypes.UseReturnedType) {
    const joinRequest = useMeetStore.use.joinRequest();
    const notification = Notification.use();
    const { params, navigate } = useRouter();
    const meetPath = joinRequest.value.id ? `/meet/${joinRequest.value.id}` : '';

    const webView = useWebView({
        id: 'meet',
        title: 'Конференция',
    });

    const joining = (value: boolean) => {
        if (value) {
            if (webView?.isOpen() || params.meet_id) {
                return notification.info({ title: 'Сначала покиньте текущую конференцию', system: true });
            }
            if (appService.tauriIsRunning) {
                webView?.open(meetPath);
            } else {
                navigate(meetPath);
            }
        }
        modal.close();
        setTimeout(() => joinRequest.clear(), 500);
    };

    return <JoinMeetModalView joining={joining} {...joinRequest.value} />;
}

export default function (modal: ModalTypes.UseReturnedType) {
    return (
        <Modal {...modal} closeIcon={false}>
            <JoinMeetModal {...modal} />
        </Modal>
    );
}