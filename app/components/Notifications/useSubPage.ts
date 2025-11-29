'use client'

import { ITabData } from '@/interface/dataModel';
import { IRootState } from '@/store';
import { setTabs } from '@/store/appConfigSlice';
import { useDispatch, useSelector } from 'react-redux';

export function useSubPage() {
    const appConf = useSelector((state: IRootState) => state.appConfig);
    const dispatch = useDispatch();

    const load = (cmpName: string, subName?: string, filters?: []) => {
        const _newTabs: ITabData[] = appConf.tabs.filter((x) => x.id !== cmpName)!;
        const _newTab: ITabData = appConf.tabs.find((x) => x.id == cmpName)!;

        if (_newTab) {
            const newTab = { ..._newTab, key: subName ?? cmpName, filters: filters ?? [] };
            const updatedTabs = [..._newTabs, newTab];
            dispatch(setTabs(updatedTabs));
        }
    };

    return load;
}