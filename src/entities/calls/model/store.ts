import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { useCreateSelectors } from 'shared/hooks';

type Store = {
    testState: {
        value: number;
        set: () => void;
    };
};

const callsStore = create<Store>()(
    devtools(
        immer((set) => ({
            testState: {
                value: 0,
                set: () =>
                    set((state) => {
                        state.testState.value += 1;
                    }),
            },
        }))
    )
);

const useCallsStore = useCreateSelectors(callsStore);

export default useCallsStore;
