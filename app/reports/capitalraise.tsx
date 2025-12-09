'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

const CapitalRaise = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [fiscalYearId, setFiscalYearId] = useState('');

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('reportcapitalraise');

            setModel(_model);
        };
        setdata();
    }, []);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
        setFiscalYearId(appConfig.fiscalYear.id);
    }, [appConfig.company, appConfig.fiscalYear]);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        افزایش سرمایه
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {model && (
                        <Demo
                            model={model}
                            loadingDataInit={false}
                            isEditable={false}
                            isDeleteable={false}
                            isShowHideCol={true}
                            staticParams={[
                                { name: 'CompanyId', value: companyId },
                                { name: 'FiscalYearId', value: fiscalYearId },
                            ]}
                            addSepratorFildes={['newCapital', 'nominalValueFromCash', 'nominalValueFromDemands', 'preRightCost', 'preRightCount', 'previousCapital', 'shareBalanceAtMeeting', 'shareCostAtMeeting']}
                            addFooterSumFildes={['newCapital', 'nominalValueFromCash', 'nominalValueFromDemands', 'preRightCost', 'preRightCount', 'previousCapital', 'shareBalanceAtMeeting', 'shareCostAtMeeting']}
                            addLinkFildes={["decisionsLink", "capitalRaiseRegisterLink"]}
                        // labaleNameList={[
                        //     { label: 'InvestmentTypeId', value: 'investmenttype' },
                        // ]}
                        //hideColList={['shareId', 'id']}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CapitalRaise;
