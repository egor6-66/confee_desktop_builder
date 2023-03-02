import { StorageObjectsNames } from 'shared/enums';

const ls = window.localStorage;
export const set = (name: keyof typeof StorageObjectsNames, value: any) => {
    ls.setItem(name, value);
};

export const get = (name: keyof typeof StorageObjectsNames) => {
    return ls.getItem(name);
};

export const remove = (name: keyof typeof StorageObjectsNames) => {
    ls.removeItem(name);
};

export const clear = () => {
    ls.clear();
};
