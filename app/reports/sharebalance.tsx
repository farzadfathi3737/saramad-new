'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

const ShareBalance = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [fiscalYearId, setFiscalYearId] = useState('');

    useEffect(() => {
        const setdata = async () => {
            let _model = await getEntityModel('reportsharebalance');

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
                        مانده سهام
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
                                'shareBalance',
                                'nonTradableBonusShares',
                                'primePrice',
                                'totalPrimeCost',
                                'primeCostToPortfolioPercentage',
                                'finalPrice',
                                'finalPriceTotalValue',
                                'finalPriceValueChange',
                                'finalPriceValueChangePercentage',
                                'yesterdayFinalPrice',
                                'priceChangePercentage',
                                'lastPrice',
                                'lastPriceTotalValue',
                                'lastPriceValueChange',
                                'lastPriceValueChangePercentage',
                                'ownershipPercentage',
                                'capital',
                            ]}
                            addFooterSumFildes={[
                                'shareBalance',
                                'nonTradableBonusShares',
                                'primePrice',
                                'totalPrimeCost',
                                'primeCostToPortfolioPercentage',
                                'finalPrice',
                                'finalPriceTotalValue',
                                'finalPriceValueChange',
                                'finalPriceValueChangePercentage',
                                'yesterdayFinalPrice',
                                'priceChangePercentage',
                                'lastPrice',
                                'lastPriceTotalValue',
                                'lastPriceValueChange',
                                'lastPriceValueChangePercentage',
                                'ownershipPercentage',
                                'capital',
                            ]}
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
                            hideColList={['shareId', 'tradingCodeId']}
                            groupColumn={[
                                {
                                    header: ' ',
                                    columnsName: [
                                        'tradingCode',
                                        'stockName',
                                        'stockSymbol',
                                        'stockTypeName',
                                        'categoryName',
                                        'industryName',
                                        'investmentTypeName',
                                        'shareRelationType',
                                        'shareBalance',
                                        'nonTradableBonusShares',
                                    ],
                                },
                                {
                                    header: 'بهای تمام شده کل',
                                    columnsName: ['primePrice', 'totalPrimeCost', 'primeCostToPortfolioPercentage'],
                                    bodyClassName: 'columnColorStyle',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle'
                                },
                                {
                                    header: 'قیمت پایانی',
                                    columnsName: ['finalPrice', 'finalPriceTotalValue', 'finalPriceValueChange', 'finalPriceValueChangePercentage'],
                                    bodyClassName: 'columnColorStyle',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'قیمت پایانی روز قبل',
                                    columnsName: ['yesterdayFinalPrice', 'priceChangePercentage'],
                                    bodyClassName: 'columnColorStyle',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'قیمت آخرین معامله',
                                    columnsName: ['lastPrice', 'lastPriceTotalValue', 'lastPriceValueChange', 'lastPriceValueChangePercentage'],
                                    bodyClassName: 'columnColorStyle',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: '  ',
                                    columnsName: ['ownershipPercentage', 'capital'],
                                },
                            ]}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareBalance;
