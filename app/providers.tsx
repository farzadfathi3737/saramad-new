'use client';

import { useEffect, useState } from 'react';
import store from '@/store';
import { Provider } from 'react-redux';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
    components: {
        Pagination: {
            styles: {
                control: {
                    '&[dataActive]': {
                        backgroundColor: 'transparent !important',
                        borderColor: '#1B334D !important',
                        color: '#1B334D !important',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#e8f4f8 !important',
                            color: '#1B334D !important',
                        },
                    },
                    '&:hover:not([dataActive])': {
                        backgroundColor: '#f0f0f0 !important',
                    },
                },
            },
        },
    },
});

function ThemeAwareMantineProvider({ children }: { children: React.ReactNode }) {
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const html = document.documentElement;

        const update = () => {
            setColorScheme(html.classList.contains('dark') ? 'dark' : 'light');
        };

        update();

        const observer = new MutationObserver(update);
        observer.observe(html, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return (
        <MantineProvider theme={theme} forceColorScheme={colorScheme}>
            {children}
        </MantineProvider>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeAwareMantineProvider>{children}</ThemeAwareMantineProvider>
        </Provider>
    );
}
