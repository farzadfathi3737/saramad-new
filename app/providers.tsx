'use client';

import store from '@/store';
import { Provider } from 'react-redux';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
    components: {
        // Button: {
        //     defaultProps: {
        //         color: 'custom',
        //     },
        //     styles: {
        //         root: {
        //             '&:hover': {
        //                 backgroundColor: '#162940',
        //             },
        //         },
        //     },
        // },
        // ActionIcon: {
        //     defaultProps: {
        //         color: 'custom',
        //     },
        //     styles: {
        //         root: {
        //             backgroundColor: '#1B334D',
        //             color: '#ffffff',
        //             '&:hover': {
        //                 backgroundColor: '#162940',
        //             },
        //         },
        //     },
        // },
        Pagination: {
            styles: {
                control: {
                    '&[data-active]': {
                        backgroundColor: 'transparent !important',
                        borderColor: '#1B334D !important',
                        color: '#1B334D !important',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#e8f4f8 !important',
                            color: '#1B334D !important',
                        },
                    },
                    '&:hover:not([data-active])': {
                        backgroundColor: '#f0f0f0 !important',
                    },
                },
            },
        },
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <MantineProvider theme={theme}>{children}</MantineProvider>
        </Provider>
    );
}
