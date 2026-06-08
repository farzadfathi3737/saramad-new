'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '@/app/components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';

const Company = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState("");

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('investmenttypecode');
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
                        <span className="mr-2">{t('list')} {t('investmenttypecode')}</span>
                    </div>

                    {/* <div className='p-2 h-full flex items-center pl-2 gap-2'>
                        <button type="button" className="btn btn-outline flex items-center rounded-lg p-2 px-4 font-iranyekan text-[#fff]"
                            onClick={() => subPage(modelData?.name.toLocaleLowerCase() ?? '', 'add')}>
                            <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
                            {t("add")}
                        </button>
                    </div> */}
                </div>

                <div className="table-responsive p-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            staticParams={[
                                { name: 'CompanyId', value: companyId },
                            ]}
                            labaleNameList={[{ label: 'Keyword', value: "نوع سرمایه گذاری" },]}
                            hideColList={['id', 'companyId', 'companyName']}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
