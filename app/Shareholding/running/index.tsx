import { getEntityModel } from '@/models/entity';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../../components/Datatable/MRT';
// import 'tippy.js/dist/tippy.css';
//import axios from 'axios';
import { IDataModel, IFieldsTable } from '@/interface/dataModel';
import { ActionIcon, Tooltip } from '@mantine/core';
import { apiFetch } from '@/lib/apiFetch';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

const Company = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('jobinstancerunning');

            _model?.list?.responses.map((item: IFieldsTable) => {
                if (['backgroundColor', 'textColor'].includes(item.accessor)) {
                    item = {
                        ...item,
                        Cell: ({ cell }) => {
                            const _bg = cell.getValue();
                            return (
                                <div className="flex w-full items-center justify-start">
                                    {_bg ? <div className={`h-8 w-8 rounded-md border border-gray-200 shadow-2xl `} style={{ backgroundColor: _bg }} /> : <div className={`h-8 w-8 rounded-md border border-gray-200 bg-inherit`} />}
                                    <div className="pr-2">{_bg}</div>
                                </div>
                            );
                        },
                    };

                    _model.list.responses = [..._model.list.responses.filter((x: any) => x.accessor != item.accessor), item];
                }
            });

            setModelData(_model);
            //setModel(_model);
        };
        setdata();
    }, []);

    const SetIsHolding = async (id: any) => {
        const _modelholding = getEntityModel('companysetasholding');

        const res = await apiFetch(_modelholding?.register?.url as string, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyId: id,
            }),
        });

        if (res.ok) {
            tableRefreshRef?.current?.fetchData();
        } else {
        }
    };

    // const loadSubPage = (name: string) => {
    //     const _newTabs: ITabData[] = appConf.tabs.filter((x) => x.id !== "companyProfile")!;
    //     const _newTab: ITabData = appConf.tabs.find((x) => x.id == "companyProfile")!;

    //     if (_newTab) {
    //         const newTab = { ..._newTab, key: name, filters: [] };
    //         console.log(newTab);
    //         const updatedTabs = [..._newTabs, newTab];
    //         dispatch(setTabs(updatedTabs));
    //     };
    // };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">

                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        سرویس های در حال اجرا
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            hideColList={['shareId', 'id']}
                            labaleNameList={[
                                { label: 'Keyword', value: 'companyName' },
                                { label: 'name', value: 'نام شرکت' },
                            ]}
                            myRef={tableRefreshRef}
                            isEditable={false}
                            isDeleteable={false}
                        />
                    )}
                </div>
            </div>
        </div >
    );
};

export default Company;
