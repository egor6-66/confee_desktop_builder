import { useUpdateEffect } from 'react-use';

import { useEasyState } from './index';

type Options<T> = {
    initialArr?: T[];
    multiple?: boolean;
};

function useArray<T extends { id: number | string; [key: string]: any }>({
    initialArr,
    multiple = true,
}: Options<T>): {
    length: number;
    array: T[];
    push: (item: T) => void;
    unshift: (item: T) => void;
    findById: (id: number | string) => T | null;
    deleteById: (id: number | string) => void;
    deleteByIds: (id: number[] | string[]) => void;
    clear: () => void;
    pushOrDelete: (arr: T) => void;
    unshiftOrDelete: (arr: T) => void;
    replace: (arr: T[]) => void;
    getIds: () => number[] | string[];
    pushUnique: (item: T) => void;
    concat: (arr: T[]) => void;
} {
    const array = useEasyState<T[]>(initialArr || []);

    useUpdateEffect(() => {
        initialArr && array.set(initialArr);
    }, [initialArr?.length]);

    const getIds = () => {
        return array.value.map((i) => i.id) as number[] | string[];
    };

    const push = (item: T) => {
        if (!multiple) {
            array.set([]);
        }
        array.set((prev) => {
            prev.push(item);
        });
    };

    const replace = (arr: T[]) => {
        array.set(arr);
    };

    const concat = (arr: T[]) => {
        array.set((prev) => prev.concat(arr));
    };

    const unshift = (item: T) => {
        if (!multiple) {
            array.set([]);
        }
        array.set((prev) => {
            prev.unshift(item);
        });
    };

    const findById = (id: number | string) => {
        if (array.value.length) {
            return array.value.find((i) => i.id === id) || null;
        }
        return null;
    };

    const deleteById = (id: number | string) => {
        array.set((prev) => prev.filter((i) => i.id !== id));
    };

    const deleteByIds = (ids: number[] | string[]) => {
        // @ts-ignore
        array.set((prev) => prev.filter((i) => !ids.includes(i.id)));
    };

    const pushOrDelete = (item: T) => {
        const found = array.value.find((el) => el.id === item.id);
        if (!multiple) array.set([]);
        if (!found) array.set((prev) => [...prev, item]);
        else array.set((prev) => prev.filter((i) => i.id !== found.id));
    };

    const unshiftOrDelete = (item: T) => {
        const found = array.value.find((el) => el.id === item.id);
        if (!multiple) array.set([]);
        if (!found) array.set((prev) => [item, ...prev]);
        else array.set((prev) => prev.filter((i) => i.id !== found.id));
    };

    const pushUnique = (item: T) => {
        if (!findById(item.id)) {
            push(item);
        }
    };

    const clear = () => {
        array.set([]);
    };

    return {
        length: array.value.length,
        array: array.value,
        push,
        concat,
        unshift,
        findById,
        replace,
        deleteById,
        deleteByIds,
        pushOrDelete,
        unshiftOrDelete,
        clear,
        getIds,
        pushUnique,
    };
}

export type UseArrayReturnType<T extends { [key: string]: any; id: string | number }> = ReturnType<typeof useArray<T>>;
export default useArray;
