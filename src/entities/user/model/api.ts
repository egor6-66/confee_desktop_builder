import { useQuery } from '@tanstack/react-query';

import { axiosClient } from 'shared/configs';

import { User } from './types';
import { httpHandlers } from '../../../shared/lib';
import { Contact } from '../../contact/model/types';

class UserApi {
    handleGetUserByPhone(data: { phone: string }) {
        return useQuery(['get-user-by-phone', data.phone], () => axiosClient.get(`/api/v2/user/phone`, { params: { phone: data.phone } }), {
            staleTime: Infinity,
            enabled: !!data.phone,
            select: (res) => {
                const updRes = httpHandlers.response<{ data: User[] }>(res);
                return updRes.data?.data;
            },
        });
    }

    handleCheckNickname() {
        return async (data: { nickname: string }) => {
            const response = await axiosClient.get('/api/v2/users/check-nickname', { params: { nickname: data.nickname } });
            return response.data;
        };
    }

    handleCheckEmail() {
        return async (data: { email: string }) => {
            const response = await axiosClient.get('/api/v2/check-identifier', { params: { identifier: data.email } });
            return response.data;
        };
    }

    handleCheckPhone() {
        return async (data: { phone: string | number }) => {
            const response = await axiosClient.get('/api/v2/check-identifier', { params: { identifier: data.phone } });
            return response.data;
        };
    }
}

export default new UserApi();
