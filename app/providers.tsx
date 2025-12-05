'use client';

import store from '@/store';
import { Provider } from 'react-redux';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
    primaryColor: 'custom',
    colors: {
        custom: [
            '#e8f4f8',
            '#d1e9f1',
            '#a3d3e3',
            '#75bdd5',
            '#1B334D',
            '#162940',
            '#121f33',
            '#0d1526',
            '#090a13',
            '#06070a',
        ],
    },
    primaryShade: 4,
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <MantineProvider theme={theme}>{children}</MantineProvider>
        </Provider>
    );
}
