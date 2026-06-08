'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '@/app/components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiFetch } from '@/lib/apiFetch';

const Company = ({ id }: { id: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [parentId, setParentId] = useState<string>();
    const [industryName, setIndustryName] = useState<string>();
    const [companyName, setCompanyName] = useState<string>();

    useEffect(() => {


        const setdata = async () => {
            const _model = await getEntityModel('stockindustry');
            setModelData(_model);

            setParentId(id);
        };
        setdata();
    }, []);

    useEffect(() => {
        if (!parentId) return;

        const getdata = async () => {
            const _model = getEntityModel('stockindustrycode');
            const res = await apiFetch(`${_model?.read?.url.replace('{id}', parentId)}`);

            if (res.ok) {
                const result = res && (await res?.json());
                setIndustryName(result.industryName);
                setCompanyName(result.companyName);
            }
        };

        getdata();
    }, [parentId]);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('stockindustrycode')}>
                                <i className="fa-duotone fa-solid fa-chevron-right text-xl ml-2" />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        زیر صنعت - {industryName}
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            staticParams={[{ name: 'ParentId', value: parentId! }]}
                            labaleNameList={[
                                { label: 'name', value: 'stockindustryName' },
                                { label: 'externalId', value: 'stockindustryCodeId' },
                                { label: 'Keyword', value: 'stockindustryName' },
                            ]}
                            hideColList={['id', 'actions', 'lastUpdateDate']}
                            isEditable={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
