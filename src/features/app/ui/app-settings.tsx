import React from 'react';

import { AppSettingsView, appTypes } from 'entities/app';
import { tokensService, viewerApi } from 'entities/viewer';
import { useTheme, useStorage, useEasyState } from 'shared/hooks';

function AppSettings() {
    const storage = useStorage();

    const { mutate: handleLogout } = viewerApi.handleLogout();
    const { mutate: handleDeleteAccount } = viewerApi.handleDeleteAccount();

    const not_scope = storage.get('notification_scope');

    const notificationActive = useEasyState(!!not_scope, (value) => {
        value ? storage.set('notification_scope', true) : storage.remove('notification_scope');
    });

    const visibleLastActive = useEasyState(!!not_scope, (value) => {
        value ? storage.set('notification_scope', true) : storage.remove('notification_scope');
    });
    const theme = useTheme();

    const logout = () => {
        tokensService.remove();
        handleLogout(null);
        window.location.reload();
    };

    const deleteAccount = () => {
        handleDeleteAccount(null, {
            onSuccess: () => {
                tokensService.remove();
                window.location.reload();
            },
        });
    };

    return (
        <AppSettingsView
            theme={theme}
            visibleLastActive={visibleLastActive}
            notificationActive={notificationActive}
            logout={logout}
            deleteAccount={deleteAccount}
        />
    );
}

export default AppSettings;
