'use client'

import FTextField from '@/app/components/inputs/textField';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useRouter as Router } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLanguage } from '@/contexts/LanguageContext';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import { Drawer, DrawerItems } from 'flowbite-react';
import Demo from '@/app/components/Datatable/MRT';
import { Dialog, Transition } from '@headlessui/react';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { apiFetch } from '@/lib/apiFetch';
import * as Yup from 'yup';
import FSelectField from '@/app/components/inputs/selectField';

interface ICompany {
    date: string;
    exceptionMessages: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    fileTypeName: string;
    hasException: boolean;
    id: string;
    importedFileId: string;
    isFailed: boolean;
    isInProgress: boolean;
    number: number;
    progress: number;
    status: string;
    statusName: string;
    transactionsCount: number;
    unknownBrokers: string | null;
    unknownSymbols: string | null;
    unknownTradingCodes: string | null;
}

interface ISession {
    creationDate: string;
    date: string;
    id: string;
    isDeletable: boolean;
    lastUpdateDate: string;
    number: number;
}
interface ISessionlist {
    items: ISession[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

interface ITC {
    id: string;
    transactionOrder: number;
    calculationTypeName: string;
    tradingCode: string;
    stockSymbol: string;
    stockName: string;
    ticketNumber: string;
    volume: number;
    price: number;
    grossCost: number;
    brokerName: string;
    brokerCode: string;
    primeCost: number;
    netSellCost: number;
    brokerCostWithoutDiscount: number;
    brokerCommission: number;
    brokerCommissionDiscount: number;
    depositoryCommission: number;
    bourseAgencyCommission: number;
    bourseCompanyCommission: number;
    bourseITCommission: number;
    bourseRayanCommission: number;
    tax: number;
    totalCommissions: number;
    costBenefit: number;
    commissionsModified: boolean;
    subType: 'Normal' | 'Block' | 'Underwriting';
}

interface ITicket {
    ticketNumber: string;
}

interface ISubType {
    subType: string;
}

interface IShareTransaction {
    calculationTypeName: string;
    stockSymbol: string;
    id: string;
    ticketNumber: string;
    subType: string;
}

interface IShareTransactionPrimeCost {
    transactionId: string,
    amount: number
}

type Props = {
    id: string;
    sessionid?: string;
};

const Session = ({ id, sessionid }: Props) => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [modelS, setModelS] = useState<IDataModel>();
    const [modelSD, setModelSD] = useState<IDataModel>();
    const [modelD, setModelD] = useState<IDataModel>();
    const [modelTC, setModelTC] = useState<ITC>();
    const [data, setData] = useState<ICompany | undefined>();
    const [dataSession, setDataSession] = useState<ISessionlist | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isPrimeCostAdding, setIsPrimeCostAdding] = useState<boolean>(false);
    const [isPrimeCostSubtracting, setIsPrimeCostSubtracting] = useState<boolean>(false);
    const [isDiscountApplying, setIsDiscountApplying] = useState<boolean>(false);
    const [isDiscountRemoving, setIsDiscountRemoving] = useState<boolean>(false);
    const [isAutoCalculating, setIsAutoCalculating] = useState<boolean>(false);
    const [isCommissionEditing, setIsCommissionEditing] = useState<boolean>(false);
    const [isTicketNumberEditing, setIsTicketNumberEditing] = useState<boolean>(false);
    const [isSubTypeEditing, setIsSubTypeEditing] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>();
    const [selectedItem, setSelectedItem] = useState<ISession>();
    const [sessionId, setSessionId] = useState<string>(sessionid!);
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [modelData, setModelData] = useState<any>();
    const [companyId, setCompanyId] = useState('');
    const [selected, setSelected] = useState<number>(0);
    const [items, setItems] = useState<ISession[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentRowId, setCurrentRowId] = useState('');

    const [isPrimeCostAddModalOpen, setIsPrimeCostAddModalOpen] = useState(false);
    const [isPrimeCostSubModalOpen, setIsPrimeCostSubModalOpen] = useState(false);
    const [isReapplyAddModalOpen, setIsReapplyAddModalOpen] = useState(false);
    const [isReapplyDelModalOpen, setIsReapplyDelModalOpen] = useState(false);
    const [isAutoCommissionModalOpen, setIsAutoCommissionModalOpen] = useState(false);
    const [isHandlyCommissionModalOpen, setIsHandlyCommissionModalOpen] = useState(false);
    const [isTicketNumberModalOpen, setIsTicketNumberModalOpen] = useState(false);
    const [isSubTypeModalOpen, setIsSubTypeModalOpen] = useState(false);

    const [selectedRow, setSelectedRow] = useState<IShareTransaction>();

    // // set the drawer menu element
    // const $targetEl: HTMLElement = document.getElementById('drawer-js-example')!;

    // // options with default values
    // const options: DrawerOptions = {
    //     placement: 'left',
    //     backdrop: true,
    //     bodyScrolling: false,
    //     edge: false,
    //     edgeOffset: '',
    //     backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30',
    //     onHide: () => {
    //         console.log('drawer is hidden');
    //     },
    //     onShow: () => {
    //         console.log('drawer is shown');
    //     },
    //     onToggle: () => {
    //         console.log('drawer has been toggled');
    //     },
    // };

    // // instance options object
    // const instanceOptions: InstanceOptions = {
    //     id: 'drawer-js-example',
    //     override: true,
    // };

    // /*
    //  * $targetEl (required)
    //  * options (optional)
    //  * instanceOptions (optional)
    //  */
    // const drawer: DrawerInterface = new Drawer($targetEl, options, instanceOptions);

    // // show the drawer
    // //drawer.show();

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    useEffect(() => {
        const _setdata = async () => {
            const _modelS = await getEntityModel('sharetransactionbatchsession');
            setModelS(_modelS);

            const _modelSD = await getEntityModel('sharetransactionbatch');
            setModelSD(_modelSD);

            const _model = await getEntityModel('sharetransaction');
            setModel(_model);
        };

        _setdata();
    }, []);

    useEffect(() => {
        setDataSession(undefined);
        const _setdata = async () => {
            sessionId && loadMore();
        };
        _setdata();
    }, [modelS]);

    const loadMore = async () => {
        //setIsLoading(true);
        console.log("okokokok")
        //const res = await fetch(`${modelS?.list?.url}?SessionId=${sessionId}&PageSize=10&PageNumber=${page}`);
        const res = await apiFetch(`${modelS?.list?.url}?SessionId=${sessionId}`);

        if (res.ok) {
            const result: ISessionlist = await res?.json();
            //setItems([...items, ...result.items]);
            setItems(result.items);
            setSelected(0);
            setSelectedItem(result.items[0]);
            //setPage(page + 1);
            //if (result.items.length === 0) setHasMore(false);
            //setDataSession(result);
            setIsLoading(false);
        } else {
            setItems([]);
            setIsLoading(false);
        }
    };

    const handlerShowDeleteModal = (id: string) => {
        setCurrentRowId(id);
        setIsDeleteModalOpen(true);
    };

    const deleteSharetransactionbatch = async (id: string) => {
        setIsDeleting(true);

        const res = await apiFetch(modelSD?.delete?.url.replace('{id}', id) as string, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            ColoredToast('success', 'ردیف موردنظر با موفقیت حذف گردید');
            loadMore();
            setIsDeleteModalOpen(false);
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
        setIsDeleting(false);
    };

    const handlerShareTransactionPrimeCostAdd = async (data: IShareTransactionPrimeCost) => {
        setIsPrimeCostAdding(true);
        const _model = await getEntityModel('sharetransactionprimecostadd');

        const res = await fetch(_model?.register?.url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', 'افزایش بها با موفقیت انجام گردید گردید');
            setIsPrimeCostAddModalOpen(false)
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
        setIsPrimeCostAdding(false);
    }

    const handlerShareTransactionPrimeCostSub = async (data: IShareTransactionPrimeCost) => {
        setIsPrimeCostSubtracting(true);
        const _model = await getEntityModel('sharetransactionprimecostsub');

        const res = await fetch(_model?.register?.url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', 'کاهش بها با موفقیت انجام گردید گردید');
            setIsPrimeCostSubModalOpen(false)
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
        setIsPrimeCostSubtracting(false);
    }

    const handlerShareTransactionDiscountReapplyOn = async (id: string) => {
        setIsDiscountApplying(true);
        const _model = await getEntityModel('transactioncommissiondiscountreapplyon');

        const res = await fetch(_model?.default?.url.replace('{transactionId}', id) as string, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (res.ok) {
            ColoredToast('success', ' اعمال تخفیف کارمزد با موفقیت انجام گردید گردید');
            setIsReapplyAddModalOpen(false)
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
        setIsDiscountApplying(false);
    }

    const handlerShareTransactionDiscountRemoveOn = async (id: string) => {
        setIsDiscountRemoving(true);
        const _model = await getEntityModel('transactioncommissiondiscountremoveon');

        const res = await fetch(_model?.default?.url.replace('{transactionId}', id) as string, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (res.ok) {
            ColoredToast('success', ' حذف تخفیف کارمزد با موفقیت انجام گردید گردید');
            setIsReapplyDelModalOpen(false)
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
        setIsDiscountRemoving(false);
    }

    const handlerShareTransactionCommissionReapplyOn = async (id: string) => {
        setIsAutoCalculating(true);
        const _model = await getEntityModel('transactioncommissionreapplyon');

        const res = await fetch(_model?.default?.url.replace('{transactionId}', id) as string, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (res.ok) {
            ColoredToast('success', ' محاسبه اتوماتیک با موفقیت انجام گردید گردید');
            setIsAutoCommissionModalOpen(false)
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
        setIsAutoCalculating(false);
    }

    const handlerGetTransactioncommission = async (id: string) => {
        const _model = await getEntityModel('transactioncommission');

        const res = await apiFetch(`${_model?.read?.url.replace('{transactionId}', id)}`);

        if (res.ok) {
            const result: ITC = await res?.json();

            setModelTC(result);
            setIsHandlyCommissionModalOpen(true);
        }

    }

    const handlerShareTransactionCommissionEditClick = async (data: ITC, id: string) => {
        setIsCommissionEditing(true);

        const _model = await getEntityModel('transactioncommission');

        const res = await apiFetch(`${_model?.update?.url.replace('{transactionId}', id)}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', ' ویرایش کارمزدها با موفقیت انجام گردید گردید');
            setIsHandlyCommissionModalOpen(false)
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
        setIsCommissionEditing(false);
    };

    const handlerShareTransactionTicketNumberEditClick = async (data: ITicket, id: string) => {
        setIsTicketNumberEditing(true);

        const _model = await getEntityModel('sharetransactionticketnumber');

        const res = await apiFetch(`${_model?.default?.url.replace('{id}', id)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', ' ویرایش اعلامیه با موفقیت انجام گردید گردید');
            setIsTicketNumberModalOpen(false)
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
        setIsTicketNumberEditing(false);
    };

    const handlerShareTransactionSubTypeEditClick = async (data: ISubType, id: string) => {
        setIsSubTypeEditing(true);

        const _model = await getEntityModel('sharetransactionsubtype');

        const res = await fetch(`${_model?.default?.url.replace('{id}', id)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', ' ویرایش نوع فرعی با موفقیت انجام گردید گردید');
            setIsSubTypeModalOpen(false)
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
        setIsSubTypeEditing(false);
    };

    const fetchData = async (id: string) => {
        setIsLoading(true);

        const res = await apiFetch(`${model?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result: ICompany = await res?.json();
            setData(result);
            console.log(result);
            setSessionId(result.id);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    // const handlGetData = () => {
    //     const setdata = async () => {
    //         let _model = getEntityModel('rawtransaction');
    //         // console.log(_model);
    //         setModelData(_model);
    //     };
    //     setdata();
    // };

    // const handlEditClick = async (data: ICompany) => {
    //     setIsLoading(true);
    //     // console.log(data);
    //     const res = await fetch(`${model?.update?.url.replace('{id}', rowId ? rowId : '')}`, {
    //         method: 'put',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(data),
    //     });

    //     if (res.ok) {
    //         const result = res && (await res?.json());
    //         //setInitialRecords(result);
    //         //setAddModal(false);
    //         //fetchData();
    //         setIsLoading(false);
    //         router.back();
    //     } else {
    //         //setInitialRecords({ pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
    //     }
    //     setIsLoading(false);
    // };

    return (
        <>
            <link rel="stylesheet" href="/assets/css/style2.css" />

            <div>
                <div className="grid w-full grid-cols-9 px-5 pt-5">
                    <div className="col-span-12">
                        <div className="table-responsive relative">
                            {model && selectedItem && (
                                <Demo
                                    isShowSearchForm={false}
                                    manualPagination={true}
                                    model={model}
                                    isShowHideCol={true}
                                    hideColList={['id', 'companyId', 'isEdited', 'commissionsModified', 'subType']}
                                    labaleNameList={[{ label: 'Keyword', value: 'نام سهام' }]}
                                    addSepratorFildes={[
                                        'price',
                                        'volume',
                                        'totalCommissions',
                                        'tax',
                                        'primeCost',
                                        'netSellCost',
                                        'grossCost',
                                        'depositoryCommission',
                                        'costBenefit',
                                        'brokerCostWithoutDiscount',
                                        'brokerCommissionDiscount',
                                        'brokerCommission',
                                        'bourseRayanCommission',
                                        'bourseITCommission',
                                        'bourseCompanyCommission',
                                        'bourseAgencyCommission',
                                    ]}
                                    addFooterSumFildes={[
                                        'volume',
                                        'totalCommissions',
                                        'tax',
                                        'primeCost',
                                        'netSellCost',
                                        'grossCost',
                                        'depositoryCommission',
                                        'costBenefit',
                                        'brokerCostWithoutDiscount',
                                        'brokerCommissionDiscount',
                                        'brokerCommission',
                                        'bourseRayanCommission',
                                        'bourseITCommission',
                                        'bourseCompanyCommission',
                                        'bourseAgencyCommission',
                                    ]}
                                    staticParams={[
                                        { name: 'BatchId', value: selectedItem?.id ? selectedItem?.id : '' },
                                        { name: 'CompanyId', value: companyId },
                                    ]}
                                    isEditable={false}
                                    mantineTableBodyRowBackgroundColor={'#fdba74'}
                                    mantineTableBodyRowBackgroundColorChangeByField={'commissionsModified'}
                                    headerAction={
                                        <>
                                            <Tooltip label="نمایش دسته تراکنش ها ">
                                                <button type="button" className="btn btn-outline mr-3 flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-white" onClick={() => setOpen(true)}>
                                                    شماره دسته : {selectedItem?.number}
                                                </button>
                                            </Tooltip>

                                            <div className="flex items-center justify-center">
                                                <div>تاریخ : {selectedItem?.date}</div>
                                            </div>
                                        </>
                                    }

                                    detailPanel={(row) => {
                                        //console.log(row.original);
                                        return (
                                            <div className="min-h-[130px] bg-white border-t border-gray-200 p-4">
                                                <div className="flex flex-wrap gap-3 justify-start">
                                                    {/* اصلاح بها */}
                                                    <div className="w-[230px] flex flex-col rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 text-center border-b border-slate-200">
                                                            <h3 className="text-white font-semibold text-[11px] flex items-center justify-center gap-1.5">
                                                                <i className="fa-duotone fa-solid fa-coins text-sm" />
                                                                اصلاح بها
                                                            </h3>
                                                        </div>
                                                        <div className="flex gap-1.5 p-2">
                                                            <button
                                                                type="button"
                                                                className="flex-1 flex items-center justify-center gap-1 px-2 h-8 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md text-[11px] font-medium shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedRow(row.row.original);
                                                                    setIsPrimeCostAddModalOpen(true);
                                                                }}
                                                            >
                                                                <i className="fa-duotone fa-solid fa-plus text-xs" />
                                                                <span>افزایش</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="flex-1 flex items-center justify-center gap-1 px-2 h-8 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-md text-[11px] font-medium shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedRow(row.row.original);
                                                                    setIsPrimeCostSubModalOpen(true);
                                                                }}
                                                            >
                                                                <i className="fa-duotone fa-solid fa-minus text-xs" />
                                                                <span>کاهش</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* تخفیف کارمزد */}
                                                    <div className="w-[230px] flex flex-col rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 text-center border-b border-slate-200">
                                                            <h3 className="text-white font-semibold text-[11px] flex items-center justify-center gap-1.5">
                                                                <i className="fa-duotone fa-solid fa-percent text-sm" />
                                                                تخفیف کارمزد
                                                            </h3>
                                                        </div>
                                                        <div className="flex gap-1.5 p-2">
                                                            <button
                                                                type="button"
                                                                className="flex-1 flex items-center justify-center gap-1 px-2 h-8 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md text-[11px] font-medium shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedRow(row.row.original);
                                                                    setIsReapplyAddModalOpen(true);
                                                                }}
                                                            >
                                                                <i className="fa-duotone fa-solid fa-badge-percent text-xs" />
                                                                <span>اعمال</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="flex-1 flex items-center justify-center gap-1 px-2 h-8 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-md text-[11px] font-medium shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedRow(row.row.original);
                                                                    setIsReapplyDelModalOpen(true);
                                                                }}
                                                            >
                                                                <i className="fa-duotone fa-solid fa-trash text-xs" />
                                                                <span>حذف</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* ویرایش کارمزدها */}
                                                    <div className="w-[290px] flex flex-col rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-2 text-center border-b border-slate-200">
                                                            <h3 className="text-white font-semibold text-[11px] flex items-center justify-center gap-1.5">
                                                                <i className="fa-duotone fa-solid fa-pen-to-square text-sm" />
                                                                ویرایش کارمزدها
                                                            </h3>
                                                        </div>
                                                        <div className="flex gap-1.5 p-2">
                                                            <button
                                                                type="button"
                                                                className="flex-1 flex items-center justify-center gap-1 px-1.5 h-8 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md text-[10px] font-medium shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedRow(row.row.original);
                                                                    setIsAutoCommissionModalOpen(true);
                                                                }}
                                                            >
                                                                <i className="fa-duotone fa-solid fa-wand-magic-sparkles text-xs" />
                                                                <span>محاسبه اتوماتیک</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="flex-1 flex items-center justify-center gap-1 px-1.5 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-md text-[10px] font-medium shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedRow(row.row.original);
                                                                    handlerGetTransactioncommission(row.row.original?.id ?? '')
                                                                }}
                                                            >
                                                                <i className="fa-duotone fa-solid fa-hand-pointer text-xs" />
                                                                <span>ویرایش دستی</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* سایر */}
                                                    <div className="w-[280px] flex flex-col rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 text-center border-b border-slate-200">
                                                            <h3 className="text-white font-semibold text-[11px] flex items-center justify-center gap-1.5">
                                                                <i className="fa-duotone fa-solid fa-ellipsis text-sm" />
                                                                سایر عملیات
                                                            </h3>
                                                        </div>
                                                        <div className="flex gap-1.5 p-2">
                                                            <button
                                                                type="button"
                                                                className="flex-1 flex items-center justify-center gap-1 px-1.5 h-8 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md text-[10px] font-medium shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedRow(row.row.original);
                                                                    setIsTicketNumberModalOpen(true);
                                                                }}
                                                            >
                                                                <i className="fa-duotone fa-solid fa-file-lines text-xs" />
                                                                <span>ویرایش اعلامیه</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="flex-1 flex items-center justify-center gap-1 px-1.5 h-8 bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-md text-[10px] font-medium shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedRow(row.row.original);
                                                                    setIsSubTypeModalOpen(true);
                                                                }}
                                                            >
                                                                <i className="fa-duotone fa-solid fa-tags text-xs" />
                                                                <span>ویرایش نوع فرعی</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            )}
                        </div>

                        <>
                            <Transition appear show={isPrimeCostAddModalOpen} as={Fragment}>
                                <Dialog as="div" open={isPrimeCostAddModalOpen} onClose={() => setIsPrimeCostAddModalOpen(false)}>
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
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
                                        <div className="w-full max-w-lg">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 scale-95"
                                                enterTo="opacity-100 scale-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 scale-100"
                                                leaveTo="opacity-0 scale-95"
                                            >
                                                <Dialog.Panel className="rounded-xl bg-white shadow-2xl overflow-hidden">
                                                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                                    <i className="fa-duotone fa-solid fa-plus text-white text-lg" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-white font-bold text-lg">افزایش بها</h3>
                                                                    <p className="text-white/80 text-sm">{selectedRow?.stockSymbol} - {selectedRow?.calculationTypeName}</p>
                                                                </div>
                                                            </div>
                                                            <button type="button" onClick={() => setIsPrimeCostAddModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                                <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Formik
                                                        initialValues={{
                                                            transactionId: selectedRow?.id ?? '',
                                                            amount: 0
                                                        }}
                                                        validationSchema={Yup.object().shape({
                                                            amount: Yup.number().required(t('required').toString())
                                                        })}
                                                        onSubmit={(values: IShareTransactionPrimeCost) => {
                                                            handlerShareTransactionPrimeCostAdd(
                                                                {
                                                                    transactionId: selectedRow?.id ?? '',
                                                                    amount: values?.amount
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        <Form>
                                                            <div className="p-6">
                                                                <Field id="amount" name="amount" label="مقدار اصلاحی" component={FTextField} isNumber={true} />
                                                            </div>
                                                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                                                <button type="button" onClick={() => setIsPrimeCostAddModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                                    انصراف
                                                                </button>
                                                                <button type="submit" disabled={isPrimeCostAdding} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                                    {isPrimeCostAdding ? (
                                                                        <i className="fa-solid fa-spinner fa-spin" />
                                                                    ) : (
                                                                        <i className="fa-duotone fa-solid fa-plus" />
                                                                    )}
                                                                    {isPrimeCostAdding ? 'در حال افزایش...' : 'افزایش'}
                                                                </button>
                                                            </div>
                                                        </Form>
                                                    </Formik>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>

                            <Transition appear show={isPrimeCostSubModalOpen} as={Fragment}>
                                <Dialog as="div" open={isPrimeCostSubModalOpen} onClose={() => setIsPrimeCostSubModalOpen(false)}>
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
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
                                        <div className="w-full max-w-lg">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 scale-95"
                                                enterTo="opacity-100 scale-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 scale-100"
                                                leaveTo="opacity-0 scale-95"
                                            >
                                                <Dialog.Panel className="rounded-xl bg-white shadow-2xl overflow-hidden">
                                                    <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                                    <i className="fa-duotone fa-solid fa-minus text-white text-lg" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-white font-bold text-lg">کاهش بها</h3>
                                                                    <p className="text-white/80 text-sm">{selectedRow?.stockSymbol} - {selectedRow?.calculationTypeName}</p>
                                                                </div>
                                                            </div>
                                                            <button type="button" onClick={() => setIsPrimeCostSubModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                                <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Formik
                                                        initialValues={{
                                                            transactionId: selectedRow?.id ?? '',
                                                            amount: 0
                                                        }}
                                                        validationSchema={Yup.object().shape({
                                                            amount: Yup.number().required(t('required').toString())
                                                        })}
                                                        onSubmit={(values: IShareTransactionPrimeCost) => {
                                                            handlerShareTransactionPrimeCostSub(
                                                                {
                                                                    transactionId: selectedRow?.id ?? '',
                                                                    amount: values?.amount
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        <Form>
                                                            <div className="p-6">
                                                                <Field id="amount" name="amount" label="مقدار اصلاحی" component={FTextField} isNumber={true} />
                                                            </div>
                                                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                                                <button type="button" onClick={() => setIsPrimeCostSubModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                                    انصراف
                                                                </button>
                                                                <button type="submit" disabled={isPrimeCostSubtracting} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                                    {isPrimeCostSubtracting ? (
                                                                        <i className="fa-solid fa-spinner fa-spin" />
                                                                    ) : (
                                                                        <i className="fa-duotone fa-solid fa-minus" />
                                                                    )}
                                                                    {isPrimeCostSubtracting ? 'در حال کاهش...' : 'کاهش'}
                                                                </button>
                                                            </div>
                                                        </Form>
                                                    </Formik>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>

                            <Transition appear show={isReapplyAddModalOpen} as={Fragment}>
                                <Dialog as="div" open={isReapplyAddModalOpen} onClose={() => setIsReapplyAddModalOpen(false)}>
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
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
                                        <div className="w-full max-w-lg">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 scale-95"
                                                enterTo="opacity-100 scale-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 scale-100"
                                                leaveTo="opacity-0 scale-95"
                                            >
                                                <Dialog.Panel className="rounded-xl bg-white shadow-2xl overflow-hidden">
                                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                                    <i className="fa-duotone fa-solid fa-tag text-white text-lg" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-white font-bold text-lg">اعمال تخفیف</h3>
                                                                    <p className="text-white/80 text-sm">{selectedRow?.stockSymbol} - {selectedRow?.calculationTypeName}</p>
                                                                </div>
                                                            </div>
                                                            <button type="button" onClick={() => setIsReapplyAddModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                                <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="p-8 text-center">
                                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <i className="fa-duotone fa-solid fa-question text-blue-600 text-2xl" />
                                                        </div>
                                                        <p className="text-gray-700 text-lg font-medium">آیا از انجام این عملیات مطمئن هستید؟</p>
                                                    </div>
                                                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                                        <button type="button" onClick={() => setIsReapplyAddModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                            انصراف
                                                        </button>
                                                        <button type="button" disabled={isDiscountApplying} onClick={() => handlerShareTransactionDiscountReapplyOn(selectedRow?.id ?? '')} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                            {isDiscountApplying ? (
                                                                <i className="fa-solid fa-spinner fa-spin" />
                                                            ) : null}
                                                            {isDiscountApplying ? 'در حال اعمال...' : 'تایید'}
                                                        </button>
                                                    </div>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>

                            <Transition appear show={isReapplyDelModalOpen} as={Fragment}>
                                <Dialog as="div" open={isReapplyDelModalOpen} onClose={() => setIsReapplyDelModalOpen(false)}>
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
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
                                        <div className="w-full max-w-lg">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 scale-95"
                                                enterTo="opacity-100 scale-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 scale-100"
                                                leaveTo="opacity-0 scale-95"
                                            >
                                                <Dialog.Panel className="rounded-xl bg-white shadow-2xl overflow-hidden">
                                                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                                    <i className="fa-duotone fa-solid fa-trash text-white text-lg" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-white font-bold text-lg">حذف تخفیف</h3>
                                                                    <p className="text-white/80 text-sm">{selectedRow?.stockSymbol} - {selectedRow?.calculationTypeName}</p>
                                                                </div>
                                                            </div>
                                                            <button type="button" onClick={() => setIsReapplyDelModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                                <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="p-8 text-center">
                                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <i className="fa-duotone fa-solid fa-exclamation-triangle text-red-600 text-2xl" />
                                                        </div>
                                                        <p className="text-gray-700 text-lg font-medium">آیا از انجام این عملیات مطمئن هستید؟</p>
                                                    </div>
                                                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                                        <button type="button" onClick={() => setIsReapplyDelModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                            انصراف
                                                        </button>
                                                        <button type="button" disabled={isDiscountRemoving} onClick={() => handlerShareTransactionDiscountRemoveOn(selectedRow?.id ?? '')} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                            {isDiscountRemoving ? (
                                                                <i className="fa-solid fa-spinner fa-spin" />
                                                            ) : (
                                                                <i className="fa-duotone fa-solid fa-trash" />
                                                            )}
                                                            {isDiscountRemoving ? 'در حال حذف...' : 'حذف'}
                                                        </button>
                                                    </div>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>

                            <Transition appear show={isAutoCommissionModalOpen} as={Fragment}>
                                <Dialog as="div" open={isAutoCommissionModalOpen} onClose={() => setIsAutoCommissionModalOpen(false)}>
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
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
                                        <div className="w-full max-w-lg">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 scale-95"
                                                enterTo="opacity-100 scale-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 scale-100"
                                                leaveTo="opacity-0 scale-95"
                                            >
                                                <Dialog.Panel className="rounded-xl bg-white shadow-2xl overflow-hidden">
                                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                                    <i className="fa-duotone fa-solid fa-calculator text-white text-lg" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-white font-bold text-lg">محاسبه اتوماتیک</h3>
                                                                    <p className="text-white/80 text-sm">{selectedRow?.stockSymbol} - {selectedRow?.calculationTypeName}</p>
                                                                </div>
                                                            </div>
                                                            <button type="button" onClick={() => setIsAutoCommissionModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                                <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="p-8 text-center">
                                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <i className="fa-duotone fa-solid fa-wand-magic-sparkles text-purple-600 text-2xl" />
                                                        </div>
                                                        <p className="text-gray-700 text-lg font-medium">آیا از انجام محاسبه اتوماتیک مطمئن هستید؟</p>
                                                    </div>
                                                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                                        <button type="button" onClick={() => setIsAutoCommissionModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                            انصراف
                                                        </button>
                                                        <button type="button" disabled={isAutoCalculating} onClick={() => handlerShareTransactionCommissionReapplyOn(selectedRow?.id ?? '')} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                            {isAutoCalculating ? (
                                                                <i className="fa-solid fa-spinner fa-spin" />
                                                            ) : null}
                                                            {isAutoCalculating ? 'در حال محاسبه...' : 'محاسبه'}
                                                        </button>
                                                    </div>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>

                            <Transition appear show={isHandlyCommissionModalOpen} as={Fragment}>
                                <Dialog as="div" open={isHandlyCommissionModalOpen} onClose={() => setIsHandlyCommissionModalOpen(false)}>
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
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
                                        <div className="w-full max-w-4xl">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 scale-95"
                                                enterTo="opacity-100 scale-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 scale-100"
                                                leaveTo="opacity-0 scale-95"
                                            >
                                                <Dialog.Panel className="rounded-xl bg-white shadow-2xl overflow-hidden">
                                                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                                    <i className="fa-duotone fa-solid fa-edit text-white text-lg" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-white font-bold text-lg">ویرایش کارمزد ها</h3>
                                                                    <p className="text-white/80 text-sm">{selectedRow?.stockSymbol} - {selectedRow?.calculationTypeName}</p>
                                                                </div>
                                                            </div>
                                                            <button type="button" onClick={() => setIsHandlyCommissionModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                                <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="p-6">
                                                        <Formik
                                                            initialValues={modelTC!}
                                                            //validationSchema={{}}
                                                            onSubmit={(values) => {
                                                                handlerShareTransactionCommissionEditClick(values, selectedRow?.id ?? '');
                                                            }}
                                                        >
                                                            <Form>
                                                                <div className="grid w-full grid-cols-1 gap-2 px-5">
                                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                        <div>
                                                                            <Field id="brokerCommission" name="brokerCommission" label={t('brokerCommission')} component={FTextField} />
                                                                        </div>
                                                                        <div>
                                                                            <Field id="brokerCommissionDiscount" name="brokerCommissionDiscount" label={t('brokerCommissionDiscount')} component={FTextField} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                        <div>
                                                                            <Field id="depositoryCommission" name="depositoryCommission" label={t('depositoryCommission')} component={FTextField} />
                                                                        </div>
                                                                        <div>
                                                                            <Field id="bourseAgencyCommission" name="bourseAgencyCommission" label={t('bourseAgencyCommission')} component={FTextField} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                        <div>
                                                                            <Field id="bourseCompanyCommission" name="bourseCompanyCommission" label={t('bourseCompanyCommission')} component={FTextField} />
                                                                        </div>
                                                                        <div>
                                                                            <Field id="bourseITCommission" name="bourseITCommission" label={t('bourseITCommission')} component={FTextField} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                        <div>
                                                                            <Field id="bourseRayanCommission" name="bourseRayanCommission" label={t('bourseRayanCommission')} component={FTextField} />
                                                                        </div>
                                                                        <div>
                                                                            <Field id="tax" name="tax" label={t('tax')} component={FTextField} />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                                                    <button type="button" onClick={() => setIsHandlyCommissionModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                                        انصراف
                                                                    </button>
                                                                    <button type="submit" disabled={isCommissionEditing} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                                                                        {isCommissionEditing ? (
                                                                            <>
                                                                                <i className="fa-duotone fa-solid fa-spinner fa-spin" />
                                                                                در حال ذخیره...
                                                                            </>
                                                                        ) : (
                                                                            'ثبت'
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </Form>
                                                        </Formik>
                                                    </div>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>

                            <Transition appear show={isTicketNumberModalOpen} as={Fragment}>
                                <Dialog as="div" open={isTicketNumberModalOpen} onClose={() => setIsTicketNumberModalOpen(false)}>
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
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
                                        <div className="w-full max-w-lg">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 scale-95"
                                                enterTo="opacity-100 scale-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 scale-100"
                                                leaveTo="opacity-0 scale-95"
                                            >
                                                <Dialog.Panel className="rounded-xl bg-white shadow-2xl overflow-hidden">
                                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                                    <i className="fa-duotone fa-solid fa-file-alt text-white text-lg" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-white font-bold text-lg">ویرایش اعلامیه</h3>
                                                                    <p className="text-white/80 text-sm">{selectedRow?.stockSymbol} - {selectedRow?.calculationTypeName}</p>
                                                                </div>
                                                            </div>
                                                            <button type="button" onClick={() => setIsTicketNumberModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                                <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Formik
                                                        initialValues={{
                                                            ticketNumber: selectedRow?.ticketNumber ?? ''
                                                        }}
                                                        //validationSchema={{}}
                                                        onSubmit={(values) => {
                                                            handlerShareTransactionTicketNumberEditClick(values, selectedRow?.id ?? '');
                                                        }}
                                                    >
                                                        <Form>
                                                            <div className="p-6">
                                                                <Field id="ticketNumber" name="ticketNumber" label="شماره اعلامیه" component={FTextField} />
                                                            </div>
                                                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                                                <button type="button" onClick={() => setIsTicketNumberModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                                    انصراف
                                                                </button>
                                                                <button type="submit" disabled={isTicketNumberEditing} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                                    {isTicketNumberEditing ? (
                                                                        <i className="fa-solid fa-spinner fa-spin" />
                                                                    ) : null}
                                                                    {isTicketNumberEditing ? 'در حال ثبت...' : 'ثبت'}
                                                                </button>
                                                            </div>

                                                        </Form>
                                                    </Formik>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>

                            <Transition appear show={isSubTypeModalOpen} as={Fragment}>
                                <Dialog as="div" open={isSubTypeModalOpen} onClose={() => setIsSubTypeModalOpen(false)}>
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
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
                                        <div className="w-full max-w-lg">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 scale-95"
                                                enterTo="opacity-100 scale-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 scale-100"
                                                leaveTo="opacity-0 scale-95"
                                            >
                                                <Dialog.Panel className="rounded-xl bg-white shadow-2xl overflow-hidden">
                                                    <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                                    <i className="fa-duotone fa-solid fa-layer-group text-white text-lg" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-white font-bold text-lg">ویرایش نوع فرعی</h3>
                                                                    <p className="text-white/80 text-sm">{selectedRow?.stockSymbol} - {selectedRow?.calculationTypeName}</p>
                                                                </div>
                                                            </div>
                                                            <button type="button" onClick={() => setIsSubTypeModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                                <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <Formik
                                                        initialValues={{
                                                            subType: selectedRow?.subType ?? ''
                                                        }}
                                                        //validationSchema={{}}
                                                        onSubmit={(values) => {
                                                            handlerShareTransactionSubTypeEditClick(values, selectedRow?.id ?? '');
                                                        }}
                                                    >
                                                        <Form>
                                                            <div className="p-6">
                                                                <Field id="subType" name="subType" label="نوع فرعی"
                                                                    options={[
                                                                        { value: "Normal", label: "تراکنش عادی" },
                                                                        { value: "Block", label: "تراکنش بلوکی" },
                                                                        { value: "Underwriting", label: "پذیره نویسی" }]
                                                                    }
                                                                    value={""}
                                                                    component={FSelectField} />

                                                            </div>
                                                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                                                <button type="button" onClick={() => setIsSubTypeModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                                    انصراف
                                                                </button>
                                                                <button type="submit" disabled={isSubTypeEditing} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium hover:from-sky-600 hover:to-sky-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                                    {isSubTypeEditing ? (
                                                                        <i className="fa-solid fa-spinner fa-spin" />
                                                                    ) : null}
                                                                    {isSubTypeEditing ? 'در حال ثبت...' : 'ثبت'}
                                                                </button>
                                                            </div>
                                                        </Form>

                                                    </Formik>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>

                            <Drawer open={open} onClose={() => setOpen(false)} position="right" className='flex flex-col overflow-y-hidden py-0'>
                                <DrawerItems className='flex flex-col h-full overflow-hidden'>
                                    <div className="flex justify-between p-4 border-b flex-shrink-0">
                                        <div>لیست دسته بندی ها</div>
                                        <div onClick={() => setOpen(false)} className="cursor-pointer">
                                            <i className={`fa-duotone fa-solid fa-xmark text-sm text-gray-700 hover:text-gray-900`} />
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 bg-white flex-shrink-0">
                                        <div>
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="جستجو بر اساس تاریخ..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-gray-50 p-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        <div className="flex flex-col gap-3">
                                            {items &&
                                                items?.filter((item: ISession) => item.date.includes(searchTerm)).map((item: ISession, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`rounded-lg shadow-md transition-all duration-200 ${index == selected
                                                                ? 'bg-gradient-to-r from-[#2691bf] to-[#2691bf] text-white shadow-lg scale-[1.02]'
                                                                : 'bg-white hover:shadow-lg hover:scale-[1.01]'
                                                                }`}
                                                        >
                                                            <div className="p-4">
                                                                <div
                                                                    onClick={() => {
                                                                        setSelected(index);
                                                                        setSelectedItem(item);
                                                                        setOpen(false);
                                                                    }}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex flex-col gap-2">
                                                                            <div className={`flex items-center gap-2 ${index == selected ? '' : 'text-gray-800'}`}>
                                                                                <i className="fa-duotone fa-solid fa-calendar text-base" />
                                                                                <span className="font-bold text-lg tracking-wide">{item.date}</span>
                                                                            </div>
                                                                            <div className={`flex items-center gap-1.5 text-xs ${index == selected ? 'opacity-80' : 'text-gray-500'}`}>
                                                                                <i className="fa-duotone fa-solid fa-folder text-xs" />
                                                                                <span className="font-medium">دسته {item.number}</span>
                                                                            </div>
                                                                        </div>
                                                                        {item.isDeletable && (
                                                                            <Tooltip label="حذف">
                                                                                <ActionIcon
                                                                                    className={`transition-colors ${index == selected
                                                                                        ? 'text-white hover:text-red-200'
                                                                                        : 'text-red-500 hover:text-red-700'
                                                                                        }`}
                                                                                    variant="transparent"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handlerShowDeleteModal(item.id);
                                                                                    }}
                                                                                >
                                                                                    <i className={`fa-duotone fa-solid fa-trash text-xl text-gray-400 hover:text-red-500`} />
                                                                                </ActionIcon>
                                                                            </Tooltip>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </DrawerItems>
                            </Drawer>
                        </>
                    </div>
                </div>
            </div>

            <Transition appear show={isDeleteModalOpen} as={Fragment}>
                <Dialog as="div" open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                <Dialog.Panel className="panel relative my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between border-b-2 bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <div className="flex text-lg font-bold">
                                            <div className="flex w-40 pl-2 text-danger">
                                                <i className="fa-duotone fa-solid fa-trash text-lg ml-2" />
                                                حذف
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="text-white-dark hover:text-dark">
                                            <i className="fa-duotone fa-solid fa-xmark text-2xl m-1 text-gray-500" />
                                        </button>
                                    </div>
                                    <div className="p-5 text-center text-2xl">آیا از حذف این ردیف مطمئن هستید؟</div>
                                    <div className="p-5">
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn btn-outline-danger">
                                                انصراف
                                            </button>
                                            <button type="button" disabled={isDeleting} onClick={() => deleteSharetransactionbatch(currentRowId)} className={`btn btn-danger flex w-32 ltr:ml-4 rtl:mr-4 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}>
                                                {isDeleting ? (
                                                    <span className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4"></span>
                                                ) : (
                                                    <i className="fa-duotone fa-solid fa-trash text-lg ml-2" />
                                                )}
                                                {isDeleting ? 'در حال حذف...' : 'حذف'}
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default Session;
