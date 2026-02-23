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
            const _model = getEntityModel('job');

            setModelData(_model);
        };
        setdata();
    }, []);

    const JobTrigger = async (id: any) => {
        const _modelholding = getEntityModel('jobtrigger');

        const res = await apiFetch(`${_modelholding?.default?.url?.replace('{id}', id)}`, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
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
                        سرویس ها
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isEditable={false}
                            isShowHideCol={true}
                            hideColList={['shareId', 'id']}
                            labaleNameList={[
                                { label: 'Keyword', value: 'companyName' },
                                { label: 'name', value: 'نام شرکت' },
                            ]}
                            myRef={tableRefreshRef}
                            action={(row) => {
                                return (
                                    <>
                                        <Tooltip label="اجرا">
                                            <ActionIcon
                                                onClick={() => JobTrigger(row.id.toString())}
                                                variant="transparent"
                                                className="mr-3 hover:bg-orange-100 w-9 h-9">
                                                <i className={`fa-duotone fa-solid fa-play text-xl text-gray-400 hover:text-blue-500`} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="ویرایش زمانیندی">
                                            <ActionIcon
                                                //onClick={() => SetIsHolding(row.id.toString())}
                                                variant="transparent"
                                                className="mr-3 hover:bg-orange-100 w-9 h-9">
                                                <i className={`fa-duotone fa-solid fa-calendar text-xl text-gray-400 hover:text-blue-500`} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="سوابق اجرا">
                                            <ActionIcon
                                                //onClick={() => SetIsHolding(row.id.toString())}
                                                variant="transparent"
                                                className="mr-3 hover:bg-orange-100 w-9 h-9">
                                                <i className={`fa-duotone fa-solid fa-history text-xl text-gray-400 hover:text-blue-500`} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </>
                                );
                            }}
                        />
                    )}
                </div>
            </div>
        </div >
    );
};

export default Jobs;
