import { useZustand, UseZustandTypes } from 'shared/hooks';

import { PhotoAndVideoSwiperType } from './types';

type Store = {
    autostart: boolean;
    enableNotifications: boolean;
    enableCompanyNotifications: boolean;
    photoAndVideoFromSwiper: PhotoAndVideoSwiperType;
};

type Methods = {};

const appStore = useZustand<Store, Methods>({
    keys: ['autostart', 'enableNotifications', 'enableCompanyNotifications', 'photoAndVideoFromSwiper'],
    default: {
        autostart: false,
        enableNotifications: true,
        enableCompanyNotifications: true,
    },
    forStorage: {
        all: true,
        storageName: 'app_storage',
    },
});

export type AppStoreTypes = UseZustandTypes.StoreTypes<typeof appStore.use>;
export default appStore;
