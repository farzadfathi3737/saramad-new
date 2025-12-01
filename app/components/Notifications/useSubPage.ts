'use client'

import { IKeyValue, ITabData } from '@/interface/dataModel';
import { IRootState } from '@/store';
import { setTabs } from '@/store/appConfigSlice';
import { useDispatch, useSelector } from 'react-redux';

export function useSubPage() {
    const appConf = useSelector((state: IRootState) => state.appConfig);
    const dispatch = useDispatch();

    const load = (tabName: string, subName?: string, filters?: IKeyValue[], params?: IKeyValue[]) => {

        const _newTabs: ITabData[] = appConf.tabs.filter((x) => x.id !== tabName)!;
        const _newTab: ITabData = appConf.tabs.find((x) => x.id == tabName)!;

        if (_newTab) {
            const newTab = { ..._newTab, key: subName ?? tabName, filters: filters ?? [], params: params ?? [] };
            const updatedTabs = [..._newTabs, newTab];
            dispatch(setTabs(updatedTabs));
        }
    };

    return load;
}