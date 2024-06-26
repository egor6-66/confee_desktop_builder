import { ChatProxy } from '../../chat/model/types';

export type CallInActiveCallList = {
    id: number;
    member_ids: number[];
    room: string;
    members_count: number;
};

export type Call = {
    avatar: string;
    id: string;
    name: string;
    muted: boolean;
    userId: number;
    chatId: number;
    usersIds: number[];
    type: 'out' | 'in';
};

export type Meet = {
    roomId: string;
    callId?: number;
    avatar: string;
    name: string;
    chatId: number;
    initiatorId: number;
    users_ids: number[] | string[];
};

export type Responses = 'accepted' | 'reject' | 'timeout';

export type CallResponse = {
    room_id: string;
    chat_id: number | null;
    call_id: string;
    response: Responses;
    to_user_id: number;
    from_user_id: number;
};

export type SocketIn = 'CallCreated' | 'CallResponse' | 'JoinedCall' | 'LeftCall' | 'Auth';
export type SocketOut = 'LeftCall' | 'CallResponse' | 'JoinedCall';

export type Socket = {
    event: SocketIn;
    data: any;
    success?: boolean;
};
