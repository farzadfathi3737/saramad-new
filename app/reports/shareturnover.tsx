'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../components/Datatable/MRT';
import { IDataModel, ITabData } from '@/interface/dataModel';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useSubPage } from '../components/Notifications/useSubPage';
import { useRouter } from 'next/navigation';
import { setActiveTab, setTabs } from '@/store/appConfigSlice';
import { ColoredToast } from '../components/Notifications/colorNotification';

const ShareTurnover = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [fiscalYearId, setFiscalYearId] = useState('');
    const [data, setData] = useState<any>();
    const subPage = useSubPage();
    const dispatch = useDispatch();
    const router = useRouter();
    const appConf = useSelector((state: IRootState) => state.appConfig);

    const AddTab = (param: ITabData) => {

        //console.log(param.key, param.name)

        // بررسی: اگر تب قبلاً وجود دارد، فقط آن را فعال کن
        const _existingTab = appConf.tabs.find((x) => x.id == param.id);

        if (_existingTab) {
            // تب قبلاً وجود دارد - فقط فعال کن
            dispatch(setActiveTab(param.id));
            router.replace(`?tab=${param.id}`);
            return;
        }

        // اگر تب جدید است و تعداد < 6، اضافه کن
        if (appConf.tabs.length >= 7) {
            ColoredToast('warning', 'حداکثر 7 تب مجاز است!');
            return;
        }

        // اضافه کردن تب جدید
        const newTab: ITabData = {
            id: param.id,
            key: param.key,
            name: param.name,
            title: param.title,
            orther: param.key == 'dashboard' ? 0 : appConf.tabs.length,
            filters: param.filters ?? [],
            params: param.params ?? [],
        };

        const updatedTabs = [...appConf.tabs, newTab];
        dispatch(setTabs(updatedTabs));

        // فعال کردن تب جدید
        dispatch(setActiveTab(param.id));
        router.replace(`?tab=${param.id}`);
    };

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('reportshareturnover');

            setModel(_model);
        };
        setdata();
    }, []);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
        setFiscalYearId(appConfig.fiscalYear.id);

        setData({
            FromDate: appConfig.fiscalYear.begin,
            ToDate: appConfig.fiscalYear.end
        })

    }, [appConfig.company, appConfig.fiscalYear]);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        گردش سهام
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {model && (
                        <Demo
                            model={model}
                            loadingDataInit={false}
                            isEditable={false}
                            isShowHideCol={true}
                            addSepratorFildes={['beginningBalance', 'beginningFinalPrice', 'beginningMarketValue', 'beginningPrimeCostSum', 'decPrimeCostSum', 'decVol', 'endingBalance', 'endingCapital', 'endingFinalPrice', 'endingMarketValue', 'endingPrimeCostSum', 'incPrimeCostSum', 'incVol', 'nominalValue']}
                            addFooterSumFildes={['beginningBalance', 'beginningFinalPrice', 'beginningMarketValue', 'beginningPrimeCostSum', 'decPrimeCostSum', 'decVol', 'endingBalance', 'endingCapital', 'endingFinalPrice', 'endingMarketValue', 'endingPrimeCostSum', 'incPrimeCostSum', 'incVol', 'nominalValue']}
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
                            hideColList={['shareId', 'id']}
                            formInitialValues={data}
                            onDoubleClick={(row) => {
                                console.log(row.original.shareId)
                                console.log(row.original.stockSymbol)

                                const data: ITabData = {
                                    id: row.original.shareId.toString(),
                                    key: "stackedcardex",
                                    name: "stackedcardex",
                                    title: `روند موجودی (${row.original.stockSymbol.toString()})`,
                                    orther: 0,
                                    params: [{ key: 'id', value: row.original.shareId.toString() }, { key: 'name', value: row.original.stockSymbol.toString() }]
                                };
                                AddTab(data);
                                //subPage('reportstackedcardex', '', undefined, [{ key: 'id', value: row.original.shareId.toString() }, { key: 'name', value: row.original.stockSymbol.toString() }])

                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareTurnover;
