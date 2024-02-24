import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import { get, set, del } from 'idb-keyval';

import useRustServer from './useRustServer';
import { debounce } from '../lib';

import { useFs } from './index';

function usePersister() {
    const { rustIsRunning } = useRustServer();
    const fs = useFs();

    const key = 'queryState';
    const cachePath = { baseDir: 'document', folder: 'cache', fileName: 'state' } as any;

    const saveDebounce = debounce((callback) => callback(), 2000);

    return {
        persistClient: async (client: PersistedClient) => {
            client.clientState.queries = client.clientState.queries.filter((i) => !i.queryHash.includes('files'));
            saveDebounce(async () => {
                if (rustIsRunning) {
                    fs.saveAsJson({ ...cachePath, data: client });
                } else {
                    await set(key, JSON.stringify(client));
                }
            });
        },
        restoreClient: async () => {
            if (rustIsRunning) {
                return fs.getJson(cachePath) || undefined;
            }
            const data = await get(key);
            return data ? JSON.parse(data) : undefined;
        },
        removeClient: async () => {
            if (rustIsRunning) {
                await fs.remove(cachePath);
            } else {
                await del(key);
            }
        },
    } as Persister;
}

export default usePersister;
