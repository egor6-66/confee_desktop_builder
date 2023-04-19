import React, { useEffect } from 'react';

import { useAppStore } from 'entities/app';
import { usePrevious } from 'shared/hooks';
import { UniversalStorage } from 'shared/services';
import { Notification as NotificationUi } from 'shared/ui';

function Notification() {
    const notifications = useAppStore.use.notifications();
    const deleteFirstNotifications = useAppStore.use.deleteFirstNotifications();
    const prev = usePrevious(notifications.length);

    const not_scope = UniversalStorage.localStorageGet('not_scope');

    const timeout = 5000;

    useEffect(() => {
        if (notifications.length && !prev) {
            setTimeout(() => deleteFirstNotifications(), timeout);
        }
        if (notifications.length && prev && notifications.length > prev) {
            setTimeout(() => deleteFirstNotifications(), timeout);
        }
    }, [notifications.length]);

    return <NotificationUi items={notifications} disabledApp={!not_scope?.app} disabledDesktop={!not_scope?.desk} />;
}

export default Notification;
