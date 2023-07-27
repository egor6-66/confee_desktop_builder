import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { useCreateSelectors } from 'shared/hooks';

import { User } from './types';

type Store = {
    openContactsModal: boolean;
    openAddContactsModal: boolean;
    openPersonalInfoModal: boolean;
    setOpenContactsModal: (val: boolean) => void;
    setOpenAddContactsModal: (val: boolean) => void;
    setOpenPersonalInfoModal: (val: boolean) => void;
};

const userStore = create<Store>()(
    devtools(
        immer((set) => ({
            openContactsModal: false,
            openAddContactsModal: false,
            openPersonalInfoModal: false,
            setOpenContactsModal: (val) =>
                set((state) => {
                    state.openContactsModal = val;
                }),
            setOpenAddContactsModal: (val) =>
                set((state) => {
                    state.openAddContactsModal = val;
                }),
            setOpenPersonalInfoModal: (val) =>
                set((state) => {
                    state.openPersonalInfoModal = val;
                }),
        }))
    )
);

const useUserStore = useCreateSelectors(userStore);

export default useUserStore;
