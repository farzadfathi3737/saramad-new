'use client'

import { useRouter } from 'next/navigation';
import { getEntityModel } from '@/models/entity';
import { Fragment, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '@/app/components/Datatable/MRT';
import { Dialog, Transition } from '@headlessui/react';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { Field, Form, Formik } from 'formik';
import FTextField from '@/app/components/inputs/textField';

interface IOptioncontract {
    tradingCode: string;
    brokerName: string;
    contractSymbol: string;
    contractName: string;
    contractStockSymbol: string;
    contractTypeName: string;
    expirationDate: string;
    daysUntilExpiration: number;
    contractSize: number;
    strikePrice: number;
    executedCount: number;
    executedCost: number;
    unExecutedBuyCount: number;
    unExecutedBuyCost: number;
    unExecutedSellCount: number;
    unExecutedSellCost: number;
    buyCount: number;
    buyCost: number;
    buyAveragePrice: number;
    sellCount: number;
    netSellCost: number;
    sellAveragePrice: number;
    balance: number;
    balanceCostBenefit: number;
    openSide: string;
    buyCommission: number;
    sellCommission: number;
    contractStockCategoryId: string;
}

const Optioncontract = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<IOptioncontract>();
    const [tedadEmal, setTedadEmal] = useState(0);
    const [mablaghEmal, setMablaghEmal] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('optioncontract');

            // _model.list.responses = [
            //     ..._model.list.responses,
            //     { "accessorKey": "typeName1", "header": "typeName", "accessor": "typeName", "title": "نوع", "sortable": true, "hidden": false },
            // ]
            console.log(_model);
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
                <div className="mb-5 flex h-[3rem] items-center justify-between border-b-2 px-5 pb-3">
                    {t('list')} {t('optioncontract')} : {appConfig.company.name}
                    {/* <Link className="btn btn-outline mr-3 flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-[#fff]" href={modelData?.name.toLocaleLowerCase() + '/add'}>
                        <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
                        {t('add')}
                    </Link> */}
                </div>

                <div className="table-responsive px-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                            hideColList={[
                                'id',
                                'companyId',
                                'openSide',
                                'buyCommission',
                                'sellCommission',
                                'tradingCodeId',
                                'brokerId',
                                'contractStockCategoryId',
                                'contractStockId',
                                'contractShareId',
                                'contractId',
                            ]}
                            labaleNameList={[{ label: 'Keyword', value: 'companytradingcode' }, { label: 'expirationdate', value: 'expirationdateto' }]}
                            changeColumnName={[{ label: 'type', value: 'typeName' }]}
                            isEditable={false}
                            addSepratorFildes={[
                                'balance',
                                'balanceCostBenefit',
                                'executedCount',
                                'executedCost',
                                'unExecutedBuyCount',
                                'unExecutedBuyCost',
                                'unExecutedSellCount',
                                'unExecutedSellCost',
                                'buyCount',
                                'buyCost',
                                'buyAveragePrice',
                                'sellCount',
                                'netSellCost',
                                'sellAveragePrice',
                            ]}
                            addFooterSumFildes={[
                                'balance',
                                'balanceCostBenefit',
                                'executedCount',
                                'executedCost',
                                'unExecutedBuyCount',
                                'unExecutedBuyCost',
                                'unExecutedSellCount',
                                'unExecutedSellCost',
                                'buyCount',
                                'buyCost',
                                'buyAveragePrice',
                                'sellCount',
                                'netSellCost',
                                'sellAveragePrice',
                            ]}
                            groupColumn={[
                                {
                                    header: 'قرارداد',
                                    columnsName: [
                                        'tradingCode',
                                        'brokerName',
                                        'contractStockSymbol',
                                        'contractSymbol',
                                        'contractName',
                                        'contractTypeName',
                                        'expirationDate',
                                        'daysUntilExpiration',
                                        'contractSize',
                                        'strikePrice',
                                    ],
                                },
                                {
                                    header: 'مانده اختیار',
                                    columnsName: ['balance', 'balanceCostBenefit'],
                                    bodyClassName: 'columnColorStyle columnColor_E0FFFF',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'اعمال',
                                    columnsName: ['executedCount', 'executedCost'],
                                    bodyClassName: 'columnColorStyle columnColor_BCF7B7',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'عدم اعمال خرید',
                                    columnsName: ['unExecutedBuyCount', 'unExecutedBuyCost'],
                                },
                                {
                                    header: 'عدم اعمال فروش',
                                    columnsName: ['unExecutedSellCount', 'unExecutedSellCost'],
                                },
                                {
                                    header: 'خرید',
                                    columnsName: ['buyCount', 'buyCost', 'buyAveragePrice'],
                                    bodyClassName: 'columnColorStyle columnColor_FAF0E6',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                                {
                                    header: 'فروش',
                                    columnsName: ['sellCount', 'netSellCost', 'sellAveragePrice'],
                                    bodyClassName: 'columnColorStyle columnColor_FFDAB9',
                                    headerClassName: 'columnColorStyle',
                                    groupHeaderClassName: 'columnColorStyle',
                                    footerClassName: 'columnColorStyle',
                                },
                            ]}
                            action={(row) => {
                                return (
                                    <button
                                        type="button"
                                        className="btn btn-outline mr-3 flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                        onClick={() => {
                                            setSelectedRow(row);
                                            setIsModalOpen(true);
                                            console.log(row);
                                        }}
                                    >
                                        تسویه
                                    </button>
                                    // <Link
                                    //     //href={`/Shareholding/optioncontract/${row.id}/${row.tradingCode}`}
                                    //     href=""
                                    //     onClick={() => {
                                    //         setSelectedRow(row.row.original);
                                    //         setIsModalOpen(true);
                                    //     }}
                                    //     className="btn btn-outline mr-3 flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                    // >
                                    //     تسویه
                                    // </Link>
                                );
                            }}
                        />
                    )}
                </div>

                <Transition appear show={isModalOpen} as={Fragment}>
                    <Dialog as="div" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-start justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel relative my-8 w-full max-w-4xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between border-b-2 bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <div className="flex w-56 text-lg font-bold">تسویه قرارداد</div>

                                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-white-dark hover:text-dark">
                                                <i className="fa-duotone fa-solid fa-xmark text-xl m-1 text-gray-500" />
                                            </button>
                                        </div>
                                        {selectedRow && (
                                            <div className="p-5 text-xl">
                                                <Formik
                                                    initialValues={selectedRow}
                                                    //validationSchema={{}}
                                                    onSubmit={(values) => {
                                                        console.log('ok', values);
                                                        //handlEditClick(values);
                                                        //alert(JSON.stringify(values, null, 2));
                                                    }}
                                                >
                                                    <Form>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-5">
                                                            <div className="grid w-full grid-cols-3 gap-2">
                                                                <div>
                                                                    <Field id="contractSymbol" name="contractSymbol" label="نماد اختیار" component={FTextField} disabled />
                                                                </div>
                                                                <div>
                                                                    <Field id="contractName" name="contractName" label="نام اوراق" component={FTextField} disabled />
                                                                </div>
                                                                <div>
                                                                    <Field id="expirationDate" name="expirationDate" label="تاریخ سررسید" component={FTextField} disabled />
                                                                </div>
                                                            </div>
                                                            <div className="grid w-full grid-cols-3 gap-2">
                                                                <div>
                                                                    <Field id="strikePrice" name="strikePrice" label="تعداد مانده اختبار" component={FTextField} disabled />
                                                                </div>
                                                                <div>
                                                                    <Field id="strikePrice" name="strikePrice" label="قیمت اعمال" component={FTextField} disabled />
                                                                </div>
                                                                <div>
                                                                    <Field id="contractSize" name="contractSize" label="اندازه قرارداد" component={FTextField} disabled />
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className="grid w-full grid-cols-3 gap-2">
                                                                <div>
                                                                    <Field
                                                                        id="tedadEmal"
                                                                        name="tedadEmal"
                                                                        label="تعداد اعمال"
                                                                        component={FTextField}
                                                                        //value={tedadEmal}
                                                                        onChange={(val: any) => {
                                                                            console.log(val.target.value)
                                                                            setTedadEmal(val.target.value)
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Field id="mablaghEmal" name="mablaghEmal" label="مبلغ اعمال" component={FTextField} value={mablaghEmal} />
                                                                </div>
                                                                <div className="flex h-full w-full flex-col justify-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            console.log(selectedRow.strikePrice);
                                                                            console.log(parseInt(tedadEmal.toString()))

                                                                            const _grossCost = parseInt(tedadEmal.toString()) * selectedRow.strikePrice;
                                                                            console.log(_grossCost);
                                                                            if (selectedRow.openSide == 'Buy') {
                                                                                console.log(_grossCost);
                                                                                const _commission = _grossCost * selectedRow.buyCommission;
                                                                                setMablaghEmal(_grossCost + _commission);
                                                                            } else {
                                                                                console.log(_grossCost);
                                                                                const _commission = _grossCost * selectedRow.sellCommission;
                                                                                console.log(_grossCost);
                                                                                setMablaghEmal(_grossCost - _commission);
                                                                            }
                                                                        }}
                                                                        className="btn btn-primary mt-3 flex h-12 w-full rounded-xl"
                                                                    >
                                                                        محاسبه مبلغ اعمال
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="grid w-full grid-cols-3 gap-2">
                                                                <div>
                                                                    <Field id="externalId" name="externalId" label="تعداد عدم اعمال" component={FTextField} />
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className="grid w-full grid-cols-3 gap-2">
                                                                <div>
                                                                    <Field id="externalId" name="externalId" label="تعداد نکول" component={FTextField} />
                                                                </div>
                                                                <div>
                                                                    <Field id="externalId2" name="externalId2" label="مبلغ نکول" component={FTextField} />
                                                                </div>
                                                                <div className="flex h-full w-full flex-col justify-center">
                                                                    <button type="button" onClick={() => { }} className="btn btn-primary mt-3 flex h-12 w-full rounded-xl">
                                                                        محاسبه مبلغ نکول
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                </Formik>
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <div className="mt-8 flex items-center justify-end">
                                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline-danger">
                                                    انصراف
                                                </button>
                                                <button type="button" onClick={() => { }} className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4" disabled>
                                                    ثبت
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default Optioncontract;
