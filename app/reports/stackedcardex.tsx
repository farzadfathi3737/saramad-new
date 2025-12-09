'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

const StackedCardex = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [fiscalYearId, setFiscalYearId] = useState('');

    useEffect(() => {
        const setdata = async () => {
            let _model = await getEntityModel('reportstackedcardex');

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
                        روند موجودی
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
                            addSepratorFildes={[
                                'incAveragePrice',
                                'incGrossCostSum',
                                'incCosts',
                                'incPrimeCostSum',
                                'decAveragePrice',
                                'decGrossCostSum',
                                'decCosts',
                                'netSellCostSum',
                                'decPrimeCostSum',
                                'costBenefit',
                                'volume',
                            ]}
                            addFooterSumFildes={[
                                'incAveragePrice',
                                'incGrossCostSum',
                                'incCosts',
                                'incPrimeCostSum',
                                'decAveragePrice',
                                'decGrossCostSum',
                                'decCosts',
                                'netSellCostSum',
                                'decPrimeCostSum',
                                'costBenefit',
                                'volume',
                            ]}
                            groupColumn={[
                                {
                                    header: ' ',
                                    columnsName: ['tradingCode', 'date', 'typeName', 'volume'],
                                },
                                {
                                    header: '  ',
                                    columnsName: ['incAveragePrice', 'incGrossCostSum', 'incCosts', 'incPrimeCostSum'],
                                    bodyClassName: 'columnColorStyle columnColor_FAEBD7',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: '   ',
                                    columnsName: ['decAveragePrice'],
                                    bodyClassName: 'columnColorStyle columnColor_D3D3D3',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: '   ',
                                    columnsName: ['decGrossCostSum', 'decCosts', 'netSellCostSum', 'decPrimeCostSum', 'costBenefit'],
                                    bodyClassName: 'columnColorStyle .columnColor_E0FFFF',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                            ]}
                            staticParams={[
                                { name: 'FiscalYearId', value: fiscalYearId },
                                { name: 'CompanyId', value: companyId },
                            ]}
                            labaleNameList={[
                                { label: 'ShareId', value: 'share' },
                                { label: 'TradingCodeId', value: 'tradingCode' },
                            ]}
                            hideColList={['tradingCodeId', 'type']}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StackedCardex;
