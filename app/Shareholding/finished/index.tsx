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

const Jobs = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('jobinstancefinished');

            setModelData(_model);
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

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">

                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        تاریخچه سرویس ها
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isEditable={false}
                            isDeleteable={false}
                            isShowHideCol={true}
                            hideColList={['shareId', 'id']}
                            labaleNameList={[
                                { label: 'Keyword', value: 'companyName' },
                                { label: 'name', value: 'نام شرکت' },
                            ]}
                            myRef={tableRefreshRef}

                        />
                    )}
                </div>
            </div>
        </div >
    );
};

export default Jobs;
