import { relaunch } from '@tauri-apps/api/process';
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import React, { useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { enable, isEnabled, disable } from 'tauri-plugin-autostart-api';

import { appService, AppSettingsView, appStore } from 'entities/app';
import { tokensService, viewerApi } from 'entities/viewer';
import { useTheme, useStorage, useEasyState, useUnmount } from 'shared/hooks';
import { Modal } from 'shared/ui';

import CacheModal from './modals/cache';
import SessionModal from './modals/session';
import { chatStore } from '../../../entities/chat';

function AppSettings() {
    const storage = useStorage();
    const theme = useTheme();

    const not_scope = storage.get('notification');

    const { data: viewerData, isLoading } = viewerApi.handleGetViewer();
    const { mutate: handleLogout } = viewerApi.handleLogout();
    const { mutate: handleDeleteAccount } = viewerApi.handleDeleteAccount();
    const visibleChatGpt = chatStore.use.visibleChatGpt();
    const autostart = appStore.use.autostart();

    const sessionModal = Modal.use();
    const cacheModal = Modal.use();

    const notificationToggle = useEasyState(!!not_scope, (value) => {
        value ? storage.set('notification', true) : storage.remove('notification');
    });

    const confirmLogout = Modal.useConfirm((value, callbackData) => {
        if (value && callbackData) {
            handleLogout(null, {
                onSuccess: () => {
                    tokensService.remove();
                    storage.remove('session');
                    window.location.reload();
                },
            });
        }
    });

    const confirmDeleteAccount = Modal.useConfirm((value, callbackData) => {
        if (value) {
            handleDeleteAccount(null, {
                onSuccess: () => {
                    tokensService.remove();
                    storage.remove('session');
                    window.location.reload();
                },
            });
        }
    });

    const [updateAvailable, setUpdateAvailable] = useState(false);

    const check = async () => {
        try {
            const { shouldUpdate, manifest } = await checkUpdate();
            setUpdateAvailable(shouldUpdate);
        } catch (e) {
            setUpdateAvailable(false);
        }
    };

    const updateApp = async () => {
        await installUpdate();
        await relaunch();
    };

    useEffect(() => {
        if (appService.tauriIsRunning) {
            check().then();
        }
    }, []);

    useUpdateEffect(() => {
        if (appService.tauriIsRunning) {
            if (autostart.value) {
                enable().then();
            } else {
                disable().then();
            }
        }
    }, [autostart.value]);

    return (
        <>
            <Modal.Confirm {...confirmLogout} title="Выйти из аккаунта" closeText="Отмена" okText="Выйти" />
            <Modal.Confirm {...confirmDeleteAccount} title="Удалить аккаунт" closeText="Отмена" okText="Удалить" />
            <SessionModal {...sessionModal} />
            <CacheModal {...cacheModal} />
            <AppSettingsView
                visibleSwitchChatGpt={!!viewerData?.companies?.length}
                visibleChatGpt={visibleChatGpt}
                openCacheModal={cacheModal.open}
                updateAvailable={updateAvailable}
                updateApp={updateApp}
                theme={theme}
                notificationToggle={notificationToggle}
                logout={confirmLogout.open}
                deleteAccount={confirmDeleteAccount.open}
                openSessionModal={sessionModal.open}
                autostart={autostart}
            />
        </>
    );
}

export default AppSettings;
