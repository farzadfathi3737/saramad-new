'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

const Comprehensive = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [fiscalYearId, setFiscalYearId] = useState('');

    useEffect(() => {
        const setdata = async () => {
            let _model = await getEntityModel('reportcomprehensive');

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
                        گزارش جامع گردش سهام
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
                                'beginningBalance',
                                'beginningPrimeCostSum',
                                'beginningMarketValue',
                                'beginningValueDifference',
                                'buyVolume',
                                'buyPrimeCost',
                                'positiveAdjustmentVolume',
                                'positiveAdjustmentPrimeCost',
                                'tradableBonusShares',
                                'nonTradableBonusShares',
                                'tradablePreemptiveRights',
                                'preemptiveRightPrimeCost',
                                'paidNominalValue',
                                'convertedPreemptiveRights',
                                'convertedPreemptiveRightsValue',
                                'sellVolume',
                                'sellPrimeCost',
                                'sellNetCost',
                                'sellCostBenefit',
                                'negativeAdjustmentVolume',
                                'negativeAdjustmentPrimeCost',
                                'investmentDecrease',
                                'endingBalance',
                                'endingPrimeCostSum',
                                'endingFinalPrice',
                                'endingMarketValue',
                                'endingGrossMarketValue',
                                'endingValueDifference',
                                'beginningDpsSum',
                                'periodDpsSum',
                                'endingDpsSum',
                                'capital',
                                'ownershipPercentage',
                                'beginningEndingValueDifference',
                                'totalCostBenefit',
                            ]}
                            addFooterSumFildes={[
                                'beginningBalance',
                                'beginningPrimeCostSum',
                                'beginningMarketValue',
                                'beginningValueDifference',
                                'buyVolume',
                                'buyPrimeCost',
                                'positiveAdjustmentVolume',
                                'positiveAdjustmentPrimeCost',
                                'tradableBonusShares',
                                'nonTradableBonusShares',
                                'tradablePreemptiveRights',
                                'preemptiveRightPrimeCost',
                                'paidNominalValue',
                                'convertedPreemptiveRights',
                                'convertedPreemptiveRightsValue',
                                'sellVolume',
                                'sellPrimeCost',
                                'sellNetCost',
                                'sellCostBenefit',
                                'negativeAdjustmentVolume',
                                'negativeAdjustmentPrimeCost',
                                'investmentDecrease',
                                'endingBalance',
                                'endingPrimeCostSum',
                                'endingFinalPrice',
                                'endingMarketValue',
                                'endingGrossMarketValue',
                                'endingValueDifference',
                                'beginningDpsSum',
                                'periodDpsSum',
                                'endingDpsSum',
                                'capital',
                                'ownershipPercentage',
                                'beginningEndingValueDifference',
                                'totalCostBenefit',
                            ]}
                            groupColumn={[
                                {
                                    header: ' ',
                                    columnsName: ['tradingCode', 'stockName', 'stockSymbol', 'stockTypeName', 'categoryName', 'industryName', 'investmentTypeName', 'shareRelationType'],
                                },
                                {
                                    header: 'ابتدای دوره',
                                    columnsName: ['incAveragePrice', 'incGrossCostSum', 'incCosts', 'incPrimeCostSum'],
                                    bodyClassName: 'columnColorStyle columnColor_FFFACD',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'خرید',
                                    columnsName: ['buyVolume', 'buyPrimeCost'],
                                    bodyClassName: 'columnColorStyle columnColor_F5DEB3',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'تعدیل مثبت',
                                    columnsName: ['positiveAdjustmentVolume', 'positiveAdjustmentPrimeCost'],
                                    bodyClassName: 'columnColorStyle columnColor_F5DEB3',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'سهام جایزه',
                                    columnsName: ['tradableBonusShares', 'nonTradableBonusShares'],
                                    bodyClassName: 'columnColorStyle columnColor_F5DEB3',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'حق تقدم',
                                    columnsName: ['tradablePreemptiveRights', 'preemptiveRightPrimeCost', 'paidNominalValue', 'convertedPreemptiveRights', 'convertedPreemptiveRightsValue'],
                                    bodyClassName: 'columnColorStyle columnColor_F5DEB3',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'فروش',
                                    columnsName: ['sellVolume', 'sellPrimeCost', 'sellNetCost', 'sellCostBenefit'],
                                    bodyClassName: 'columnColorStyle columnColor_E3E3E3',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'تعدیل منفی',
                                    columnsName: ['negativeAdjustmentVolume', 'negativeAdjustmentPrimeCost'],
                                    bodyClassName: 'columnColorStyle columnColor_E3E3E3',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: '  ',
                                    columnsName: ['investmentDecrease'],
                                    bodyClassName: 'columnColorStyle columnColor_E3E3E3',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'انتهای دوره',
                                    columnsName: ['endingBalance', 'endingPrimeCostSum', 'endingFinalPrice', 'endingMarketValue', 'endingGrossMarketValue', 'endingValueDifference'],
                                    bodyClassName: 'columnColorStyle columnColor_E0FFFF',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'سود اوراق بهادار',
                                    columnsName: ['beginningDpsSum', 'periodDpsSum', 'endingDpsSum'],
                                    bodyClassName: 'columnColorStyle',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'انتهای دوره',
                                    columnsName: ['capital', 'ownershipPercentage'],
                                    bodyClassName: 'columnColorStyle columnColor_',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: '   ',
                                    columnsName: ['beginningEndingValueDifference', 'totalCostBenefit'],
                                    bodyClassName: 'columnColorStyle columnColor_',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                            ]}
                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comprehensive;
