import { Contact } from '../../contact/model/types';

export enum NetworkStatuses {
    'online' = '#0000ff',
    'offline' = '',
}

export type User = {
    avatar: string;
    birth: string;
    contact_name: string;
    created_at: Date;
    email: string;
    first_name: string;
    id: number;
    is_online: boolean;
    last_active: Date;
    last_name: string;
    nickname: string;
    phone: string;
    updated_at: Date;
};

export type UserProxy = {
    full_name: string;
    networkStatus: keyof typeof NetworkStatuses;
    formatted_birth: string | null;
    formatted_last_active: string;
} & User;

export type UserCardActions = {
    audioCall: () => void;
    videoCall: () => void;
    getChat: () => void;
    mute: () => void;
    delete?: () => void;
};

export type SocketIn = 'UserUpdated';
export type SocketOut = '';
