import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

import { secrets, http } from 'shared/constanst';
import { TokenService } from 'shared/services';

const config: AxiosRequestConfig = {
    baseURL: `${http.url}`,
};

const axiosClient = axios.create(config);

axiosClient.interceptors.request.use(async (config: any) => {
    const tokens = await TokenService.getAsync();
    if (tokens?.access_token) {
        return {
            ...config,
            headers: {
                ...config.headers,
                Accept: 'application/json',
                Authorization: `Bearer ${tokens.access_token}`,
            },
        };
    }
    return config;
});

axiosClient.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;
        const currentTokens = await TokenService.getAsync();
        if (error.response.status === 401 && error.config && currentTokens && !error.config._isRetry) {
            error.config._isRetry = true;
            try {
                const additional = { grant_type: 'refresh_token', ...secrets.auth };
                // const res: any = await $axios.post('/auth/oauth/token', { refresh_token: currentTokens.refresh_token, ...additional });
                const res: any = await axiosClient.post('api/v2/authorization/refresh', currentTokens);
                if (res.data.data) {
                    const { access_token, refresh_token } = res.data.data;
                    await TokenService.save({ access_token, refresh_token });
                    return await axiosClient.request(originalRequest);
                }
                await TokenService.remove();
                window.location.reload();
                return null;
            } catch (err) {
                await TokenService.remove();
                window.location.reload();
                return null;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
