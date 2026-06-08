'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '@/app/components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

const Company = () => {
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('stockcategorycode');
            setModelData(_model);
        };
        setdata();
    }, []);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex items-center pr-5'>
                        <span className="mr-2">تعریف کدینگ گروه اوراق بهادار</span>
                    </div>

                    <div className='p-2 h-full flex items-center pl-2 gap-2'>
                        <button type="button" className="btn btn-outline flex items-center rounded-lg p-2 px-4 font-iranyekan text-[#fff]"
                            onClick={() => subPage(modelData?.name.toLocaleLowerCase() ?? '', 'add')}>
                            <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
                            تعریف کدینگ جدید
                        </button>
                        <button type="button" className="btn btn-outline flex items-center rounded-lg p-2 px-4 font-iranyekan text-[#fff]"
                            onClick={() => subPage(modelData?.name.toLocaleLowerCase() ?? '', 'addt')}>
                            تعریف کدینگ اختیار معاملات
                        </button>
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                            labaleNameList={[{ label: 'Keyword', value: 'نام ، کد گروه' }]}
                            hideColList={['id', 'categoryId', 'isOptionCategory']}
                            isEditable={false}
                            action={(row) => {
                                return row.isOptionCategory ? (
                                    <Tooltip label="ویرایش">
                                        <ActionIcon
                                            onClick={() => subPage(modelData.name.toString().toLowerCase(), 'option', undefined, [{ key: 'id', value: row.id }])}
                                            variant="transparent"
                                            className="mr-3 w-9 h-9">
                                            <i className="fa-duotone fa-solid fa-pen-to-square text-xl text-gray-400 hover:text-orange-500" />
                                        </ActionIcon>
                                    </Tooltip>
                                ) : (
                                    <Tooltip label="ویرایش">
                                        <ActionIcon
                                            onClick={() => subPage(modelData.name.toString().toLowerCase(), 'edit', undefined, [{ key: 'id', value: row.id }])}
                                            variant="transparent"
                                            className="mr-3 w-9 h-9">
                                            <i className="fa-duotone fa-solid fa-pen-to-square text-xl text-gray-400 hover:text-orange-500" />
                                        </ActionIcon>
                                    </Tooltip>
                                );
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
