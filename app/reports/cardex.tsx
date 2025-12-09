'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

const Cardex = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [fiscalYearId, setFiscalYearId] = useState('');
    const [data, setData] = useState<any>();

    useEffect(() => {
        const setdata = async () => {
            let _model = await getEntityModel('reportcardex');

            setModel(_model);
        };
        setdata();
    }, []);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
        setFiscalYearId(appConfig.fiscalYear.id);

        setData({
            FromDate: appConfig.fiscalYear.beginDate,
            ToDate: appConfig.fiscalYear.endDate
        })

    }, [appConfig.company, appConfig.fiscalYear]);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        کاردکس ریز سهام
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
                            addSepratorFildes={['costBenefit', 'decAveragePrice', 'decCosts', 'decGrossCostSum', 'decPrimeCostSum', 'incAveragePrice', 'incCosts', 'incGrossCostSum', 'incPrimeCostSum', 'netSellCostSum', 'volume']}
                            addFooterSumFildes={['costBenefit', 'decAveragePrice', 'decCosts', 'decGrossCostSum', 'decPrimeCostSum', 'incAveragePrice', 'incCosts', 'incGrossCostSum', 'incPrimeCostSum', 'netSellCostSum', 'volume']}
                            staticParams={[
                                { name: 'CompanyId', value: companyId },
                                { name: 'FiscalYearId', value: fiscalYearId },
                            ]}
                            labaleNameList={[
                                { label: 'ShareId', value: 'share' },
                                { label: 'TradingCodeId', value: 'tradingCode' },
                                { label: 'CalculationType', value: 'calculationType' },
                                { label: 'BrokerId', value: 'broker' },
                            ]}
                            hideColList={['shareId', 'id', 'tradingCode', 'tradingCodeId']}
                            formInitialValues={data}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cardex;
