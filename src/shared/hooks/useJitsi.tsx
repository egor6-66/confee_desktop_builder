import { JitsiMeeting } from '@jitsi/react-sdk';
import React, { useEffect, useState } from 'react';

import { viewerApi, viewerProxy } from '../../entities/viewer';

const DOMAIN = 'video.confee.ru';

const customParticipantMenuButtons = [
    {
        id: 'custom-button',
        text: 'Custom Button',
    },
];
const customToolbarButtons = [
    {
        id: 'custom-toolbar-button',
        text: 'Custom Toolbar Button',
    },
];
const GENERAL_SETTINGS = {
    startWithAudioMuted: true,
    startWithVideoMuted: true,
    disableModeratorIndicator: false,
    startScreenSharing: false,
    enableEmailInStats: false,
    customParticipantMenuButtons,
    customToolbarButtons,
};

const INTERFACE_CONFIG_OVERWRITE = {
    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
};

type Props = {
    meetId?: string;
};

function useJitsi(props: Props) {
    const { meetId } = props;

    const { data: viewerData, isLoading } = viewerApi.handleGetViewer();

    const viewer = viewerProxy(viewerData?.user);

    const getIframeRef = (parentNode: HTMLDivElement) => {
        parentNode.style.height = '100vh';
        parentNode.style.width = '100%';
    };

    function ConferenceWebView() {
        const conferenceName = meetId;
        const userName = viewer?.full_name;
        const avatarUrl = viewer?.full_avatar_url;

        return conferenceName && userName && meetId ? (
            <JitsiMeeting
                domain={DOMAIN}
                roomName={conferenceName as string}
                configOverwrite={GENERAL_SETTINGS}
                interfaceConfigOverwrite={INTERFACE_CONFIG_OVERWRITE}
                userInfo={{
                    displayName: userName,
                    email: '',
                }}
                key={viewer.id}
                onApiReady={(externalApi) => {
                    console.log(externalApi);
                    externalApi.executeCommand('avatarUrl', avatarUrl || '');
                    externalApi.addListener('readyToClose', () => {});
                }}
                onReadyToClose={() => {
                    console.log('wdad');
                }}
                getIFrameRef={getIframeRef}
            />
        ) : (
            <></>
        );
    }

    return { ConferenceWebView };
}

export default useJitsi;
