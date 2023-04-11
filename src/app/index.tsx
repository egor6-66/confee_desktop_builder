import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import moment from 'moment';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import 'moment/locale/ru';
import Routing from 'pages';
import { useTheme } from 'shared/hooks';

import routingObserver from './routing-observer';
import './index.scss';
import { Notification } from '../features/application';

const queryClient = new QueryClient();
moment.locale('ru');

function App() {
    useTheme();
    routingObserver();

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Routing />
                <Notification />
                <ReactQueryDevtools position="bottom-right" />
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
