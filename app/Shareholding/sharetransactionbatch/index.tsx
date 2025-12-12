'use client'

import FTextField from '@/app/components/inputs/textField';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Field, Form, Formik } from 'formik';
import { Fragment, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import Demo from '@/app/components/Datatable/MRT';
import { Dialog, Transition } from '@headlessui/react';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
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
    sessionid?: string;
};

const Session = ({ sessionid }: Props) => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [modelS, setModelS] = useState<IDataModel>();
    const [modelTC, setModelTC] = useState<ITC>();
    const [data, setData] = useState<ICompany | undefined>();
    const [dataSession, setDataSession] = useState<ISessionlist | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>();
    const [selectedItem, setSelectedItem] = useState<ISession>();
    const [sessionId, setSessionId] = useState<string>(sessionid!);
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [modelData, setModelData] = useState<any>();
    const [companyId, setCompanyId] = useState('');
    const [fiscalYearId, setFiscalYearId] = useState('');
    const [selected, setSelected] = useState<number>(0);
    const [items, setItems] = useState<ISession[]>([]);
    const [open, setOpen] = useState(false);
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
        setFiscalYearId(appConfig.fiscalYear.id);
    }, [appConfig.company, appConfig.fiscalYear]);

    useEffect(() => {
        const _setdata = async () => {
            const _modelS = await getEntityModel('sharetransactionbatch');
            setModelS(_modelS);

            const _model = await getEntityModel('sharetransaction');
            setModel(_model);
        };
        _setdata();
    }, []);

    useEffect(() => {
        const _setdata = async () => {
            await loadMore();
        };
        _setdata();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelS, fiscalYearId]);

    const loadMore = async () => {
        //setIsLoading(true);

        //const res = await fetch(`${modelS?.list?.url}?SessionId=${sessionId}&PageSize=10&PageNumber=${page}`);
        const res = await fetch(`${modelS?.list?.url}?FiscalYearId=${fiscalYearId}&Type=Trade`);

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
        setIsLoading(true);

        const res = await fetch(modelS?.delete?.url.replace('{id}', id) as string, {
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
    };

    const fetchData = async (id: string) => {
        setIsLoading(true);

        const res = await fetch(`${modelS?.read?.url.replace('{id}', id)}`);

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

    const handlerGetTransactioncommission = async (id: string) => {
        const _model = await getEntityModel('transactioncommission');

        const res = await fetch(`${_model?.read?.url.replace('{transactionId}', id)}`);

        if (res.ok) {
            const result: ITC = await res?.json();

            setModelTC(result);
            setIsHandlyCommissionModalOpen(true);
            setSessionId(result.id);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }

    }

    const handlerShareTransactionPrimeCostAdd = async (data: IShareTransactionPrimeCost) => {
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
    }

    const handlerShareTransactionPrimeCostSub = async (data: IShareTransactionPrimeCost) => {
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
    }

    const handlerShareTransactionDiscountReapplyOn = async (id: string) => {
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
    }

    const handlerShareTransactionDiscountRemoveOn = async (id: string) => {
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
    }

    const handlerShareTransactionCommissionReapplyOn = async (id: string) => {
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
    }

    const handlerShareTransactionCommissionEditClick = async (data: ITC, id: string) => {
        setIsLoading(true);

        const _model = await getEntityModel('transactioncommission');

        const res = await fetch(`${_model?.update?.url.replace('{transactionId}', id)}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', ' ویرایش کارمزدها با موفقیت انجام گردید گردید');
            setIsHandlyCommissionModalOpen(false)
            setIsLoading(false);
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
    };

    const handlerShareTransactionTicketNumberEditClick = async (data: ITicket, id: string) => {
        setIsLoading(true);

        const _model = await getEntityModel('sharetransactionticketnumber');

        const res = await fetch(`${_model?.default?.url.replace('{id}', id)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', ' ویرایش اعلامیه با موفقیت انجام گردید گردید');
            setIsTicketNumberModalOpen(false)
            setIsLoading(false);
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
    };

    const handlerShareTransactionSubTypeEditClick = async (data: ISubType, id: string) => {
        setIsLoading(true);

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
            setIsLoading(false);
        } else {
            const responce = await res.text();
            ColoredToast('danger', responce);
        }
    };

    return (
        <>
            <link rel="stylesheet" href="/assets/css/style2.css" />
            <div className="h-auto flex flex-col">
                <div className="panel h-full w-full px-0">
                    <div className="flex px-0 py-0 w-full">
                        <div className="flex flex-col px-0 w-full">
                            <div>
                                <div className="grid w-full grid-cols-9 px-5 pt-5">
                                    <div className="col-span-12">
                                        <div className="table-responsive relative">
                                            <div
                                                className={`absolute z-30 h-full w-full backdrop-blur-sm ${open ? '' : 'hidden'} rounded-xl`}
                                                onClick={() => {
                                                    setOpen(false);
                                                }}
                                            ></div>
                                            <div
                                                id="drawer-js-example"
                                                className={`absolute z-40 h-full ${open ? 'w-80' : 'hidden w-0'} overflow-y-auto rounded-xl border-2 border-solid border-gray-200 bg-white p-2 backdrop-blur-sm`}
                                                tabIndex={-1}
                                                aria-labelledby="drawer-js-label"
                                            >
                                                <div className="col-span-2">
                                                    <div className="bg-white">
                                                        <div className="grid grid-cols-7 rounded-t-2xl bg-[#d1ebef] text-center font-extrabold">
                                                            <div className="col-span-2 rounded-tr-2xl border border-gray-300 p-5">شماره دسته</div>
                                                            <div className="col-span-3 border border-gray-300 p-5">تاریخ</div>
                                                            <div className="col-span-2 rounded-tl-2xl border border-gray-300 px-2 py-5">عملیات</div>
                                                        </div>

                                                        <div className="max-h-[600px] overflow-y-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                                            {items &&
                                                                items?.map((item: ISession, index) => {
                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            // onClick={() => {
                                                                            //     setSelected(index);
                                                                            //     setSelectedItem(item);
                                                                            //     setOpen(false);
                                                                            // }}
                                                                            className={`grid grid-cols-7 text-center hover:bg-[#0aa7b885] ${index == selected ? 'bg-[#0aa6b8c4] text-white' : ''}`}
                                                                        >
                                                                            <div
                                                                                onClick={() => {
                                                                                    setSelected(index);
                                                                                    setSelectedItem(item);
                                                                                    setOpen(false);
                                                                                }}
                                                                                className="col-span-2 border border-gray-300 p-3"
                                                                            >
                                                                                {item.number}
                                                                            </div>
                                                                            <div
                                                                                onClick={() => {
                                                                                    setSelected(index);
                                                                                    setSelectedItem(item);
                                                                                    setOpen(false);
                                                                                }}
                                                                                className="col-span-3 border border-gray-300 p-3"
                                                                            >
                                                                                {item.date}
                                                                            </div>
                                                                            <div className="col-span-2 border border-gray-300 px-2 py-3">
                                                                                {item.isDeletable && (
                                                                                    <Tooltip label="حذف">
                                                                                        <ActionIcon
                                                                                            className="btn btn-outline bg-secondary-light px-1 font-iranyekan text-secondary"
                                                                                            onClick={() => handlerShowDeleteModal(item.id)}
                                                                                        >
                                                                                            <i className="fa-duotone fa-solid fa-trash text-xl" />
                                                                                        </ActionIcon>
                                                                                    </Tooltip>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {model && selectedItem && (
                                                <Demo
                                                    isShowSearchForm={false}
                                                    manualPagination={true}
                                                    model={model}
                                                    isShowHideCol={true}
                                                    hideColList={['id', 'companyId', 'isEdited', 'commissionsModified']}
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
                                                    headerAction={
                                                        <>
                                                            <Tooltip label="نمایش دسته تراکنش ها ">
                                                                {/* <ActionIcon onClick={() => setOpen(true)}>
                                                                    <IconMinus />
                                                                </ActionIcon> */}
                                                                <button type="button" className="btn btn-outline mr-3 flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-white" onClick={() => setOpen(true)}>
                                                                    شماره دسته : {selectedItem?.number}
                                                                </button>
                                                            </Tooltip>

                                                            <div className="flex items-center justify-center">
                                                                {/* <div className="pl-5">شماره دسته : {selectedItem?.number}</div> */}
                                                                <div>تاریخ : {selectedItem?.date}</div>
                                                            </div>
                                                        </>
                                                    }
                                                    // action={(item: any) => (
                                                    //     <Tooltip label="حذف">
                                                    //         <ActionIcon
                                                    //         //onClick={() =>}
                                                    //         >
                                                    //             <IconTrash />
                                                    //         </ActionIcon>
                                                    //     </Tooltip>
                                                    // )}
                                                    detailPanel={(row: any) => {
                                                        //console.log(row.original);
                                                        return (
                                                            <div className="h-[134px]">
                                                                <div className="flex p-5 absolute">
                                                                    <div className="ml-5 flex flex-col rounded-md border-2 p-2">
                                                                        <div className="py-2 text-center">اصلاح بها</div>
                                                                        <div className="flex">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-success ml-2 w-28 px-0"
                                                                                onClick={() => {
                                                                                    setSelectedRow(row.row.original);
                                                                                    setIsPrimeCostAddModalOpen(true);
                                                                                }}
                                                                            >
                                                                                <i className="fa-duotone fa-solid fa-plus ml-2" />
                                                                                افرایش
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-danger w-28 px-0"
                                                                                onClick={() => {
                                                                                    setSelectedRow(row.row.original);
                                                                                    setIsPrimeCostSubModalOpen(true);
                                                                                }}
                                                                            >
                                                                                <i className="fa-duotone fa-solid fa-minus ml-2" />
                                                                                کاهش
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-5 flex flex-col rounded-md border-2 p-2">
                                                                        <div className="py-2 text-center">تخفیف کارمزد</div>
                                                                        <div className="flex">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-success ml-2 w-36 px-0"
                                                                                onClick={() => {
                                                                                    setSelectedRow(row.row.original);
                                                                                    setIsReapplyAddModalOpen(true);
                                                                                }}
                                                                            >
                                                                                <i className="fa-duotone fa-solid fa-plus ml-2" />
                                                                                اعمال تخفیف
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-danger w-36 px-0"
                                                                                onClick={() => {
                                                                                    setSelectedRow(row.row.original);
                                                                                    setIsReapplyDelModalOpen(true);
                                                                                }}
                                                                            >
                                                                                <i className="fa-duotone fa-solid fa-trash text-xl" />
                                                                                حذف تخفیف
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-5 flex flex-col rounded-md border-2 p-2">
                                                                        <div className="py-2 text-center">ویرایش کارمزد ها</div>
                                                                        <div className="flex">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-success ml-2 w-36 px-0"
                                                                                onClick={() => {
                                                                                    setSelectedRow(row.row.original);
                                                                                    setIsAutoCommissionModalOpen(true);
                                                                                }}
                                                                            >
                                                                                {/* <IconPlus className='ml-2'/> */}
                                                                                محاسبه اتوماتیک
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-danger w-36 px-0"
                                                                                onClick={() => {
                                                                                    setSelectedRow(row.row.original);
                                                                                    handlerGetTransactioncommission(row.row.original?.id ?? '')
                                                                                    //setIsHandlyCommissionModalOpen(true);
                                                                                }}
                                                                            >
                                                                                {/* <IconTrash className='ml-2'/> */}
                                                                                ویرایش دستی
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-5 flex flex-col rounded-md border-2 p-2">
                                                                        <div className="py-2 text-center">سایر</div>
                                                                        <div className="flex">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-warning ml-2 w-36 px-0"
                                                                                onClick={() => {
                                                                                    setSelectedRow(row.row.original);
                                                                                    setIsTicketNumberModalOpen(true);
                                                                                }}
                                                                            >
                                                                                {/* <IconPlus className='ml-2'/> */}
                                                                                ویرایش اعلامیه
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary w-36 px-0"
                                                                                onClick={() => {
                                                                                    setSelectedRow(row.row.original);
                                                                                    setIsSubTypeModalOpen(true);
                                                                                }}
                                                                            >
                                                                                {/* <IconTrash className='ml-2'/> */}
                                                                                ویرایش نوع فرعی
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
                                                                <Dialog.Panel className="rounded-lg bg-white p-6 shadow-lg">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex text-lg font-bold">
                                                                            <div className="flex pl-2 text-success">
                                                                                <i className="fa-duotone fa-solid fa-plus ml-2" />
                                                                                افزایش
                                                                            </div>
                                                                            بها
                                                                        </div>
                                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                                            <div className="flex items-center justify-items-center">
                                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                                    {selectedRow?.calculationTypeName}
                                                                                </div>
                                                                                {selectedRow?.stockSymbol}
                                                                            </div>
                                                                        </div>

                                                                        <button type="button" onClick={() => setIsPrimeCostAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                            <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                        </button>
                                                                    </div>                                                                    <Formik
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
                                                                            <div className="p-5 text-xl">
                                                                                <Field id="amount" name="amount" label="مقدار اصلاحی" component={FTextField} />
                                                                            </div>
                                                                            <div className="p-5">
                                                                                <div className="mt-8 flex items-center justify-end">
                                                                                    <button type="button" onClick={() => setIsPrimeCostAddModalOpen(false)} className="btn btn-outline-danger">
                                                                                        انصراف
                                                                                    </button>
                                                                                    <button type="submit" className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                                        <i className="fa-duotone fa-solid fa-plus ml-2" />
                                                                                        افزایش
                                                                                    </button>
                                                                                </div>
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
                                                                <Dialog.Panel className="rounded-lg bg-white p-6 shadow-lg">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex text-lg font-bold">
                                                                            <div className="flex pl-2 text-danger">
                                                                                <i className="fa-duotone fa-solid fa-plus ml-2" />
                                                                                کاهش
                                                                            </div>
                                                                            بها
                                                                        </div>
                                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                                            <div className="flex items-center justify-items-center">
                                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                                    {selectedRow?.calculationTypeName}
                                                                                </div>
                                                                                {selectedRow?.stockSymbol}
                                                                            </div>
                                                                        </div>

                                                                        <button type="button" onClick={() => setIsPrimeCostSubModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                            <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                        </button>
                                                                    </div>                                                                    <Formik
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
                                                                            <div className="p-5 text-xl">
                                                                                <Field id="amount" name="amount" label="مقدار اصلاحی" component={FTextField} />
                                                                            </div>
                                                                            <div className="p-5">
                                                                                <div className="mt-8 flex items-center justify-end">
                                                                                    <button type="button" onClick={() => setIsPrimeCostSubModalOpen(false)} className="btn btn-outline-danger">
                                                                                        انصراف
                                                                                    </button>
                                                                                    <button type="submit" className="btn btn-danger flex w-32 ltr:ml-4 rtl:mr-4">
                                                                                        <i className="fa-duotone fa-solid fa-plus ml-2" />
                                                                                        کاهش
                                                                                    </button>
                                                                                </div>
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
                                                                <Dialog.Panel className="rounded-lg bg-white p-6 shadow-lg">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex text-lg font-bold">
                                                                            <div className="flex w-40 pl-2 text-success">اعمال تخفیف</div>
                                                                        </div>
                                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                                            <div className="flex items-center justify-items-center">
                                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                                    {selectedRow?.calculationTypeName}
                                                                                </div>
                                                                                {selectedRow?.stockSymbol}
                                                                            </div>
                                                                        </div>

                                                                        <button type="button" onClick={() => setIsReapplyAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                            <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="p-5 text-center text-2xl">آیا از انجام این عملیات مطمئن هستید؟</div>
                                                                    <div className="p-5">
                                                                        <div className="mt-8 flex items-center justify-end">
                                                                            <button type="button" onClick={() => setIsReapplyAddModalOpen(false)} className="btn btn-outline-danger">
                                                                                انصراف
                                                                            </button>
                                                                            <button type="button" onClick={() => handlerShareTransactionDiscountReapplyOn(selectedRow?.id ?? '')} className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                                تایید
                                                                            </button>
                                                                        </div>
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
                                                                <Dialog.Panel className="rounded-lg bg-white p-6 shadow-lg">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex text-lg font-bold">
                                                                            <div className="flex w-40 pl-2 text-danger">
                                                                                <i className="fa-duotone fa-solid fa-trash text-xl" />
                                                                                حذف تخفیف
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                                            <div className="flex items-center justify-items-center">
                                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                                    {selectedRow?.calculationTypeName}
                                                                                </div>
                                                                                {selectedRow?.stockSymbol}
                                                                            </div>
                                                                        </div>

                                                                        <button type="button" onClick={() => setIsReapplyDelModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                            <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="p-5 text-center text-2xl">آیا از انجام این عملیات مطمئن هستید؟</div>
                                                                    <div className="p-5">
                                                                        <div className="mt-8 flex items-center justify-end">
                                                                            <button type="button" onClick={() => setIsReapplyDelModalOpen(false)} className="btn btn-outline-danger">
                                                                                انصراف
                                                                            </button>
                                                                            <button type="button" onClick={() => handlerShareTransactionDiscountRemoveOn(selectedRow?.id ?? '')} className="btn btn-danger flex w-32 ltr:ml-4 rtl:mr-4">
                                                                                <i className="fa-duotone fa-solid fa-trash text-xl" />
                                                                                حذف
                                                                            </button>
                                                                        </div>
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
                                                                <Dialog.Panel className="rounded-lg bg-white p-6 shadow-lg">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex w-10 text-lg font-bold">
                                                                            <div className="flex w-56 pl-2 text-success">
                                                                                {/* <IconTrash className="ml-2" /> */}
                                                                                محاسبه اتوماتیک
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                                            <div className="flex items-center justify-items-center">
                                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                                    {selectedRow?.calculationTypeName}
                                                                                </div>
                                                                                {selectedRow?.stockSymbol}
                                                                            </div>
                                                                        </div>

                                                                        <button type="button" onClick={() => setIsAutoCommissionModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                            <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="p-5 text-center text-2xl">آیا از انجام محاسبه اتوماتیک مطمئن هستید؟</div>
                                                                    <div className="p-5">
                                                                        <div className="mt-8 flex items-center justify-end">
                                                                            <button type="button" onClick={() => setIsAutoCommissionModalOpen(false)} className="btn btn-outline-danger">
                                                                                انصراف
                                                                            </button>
                                                                            <button type="button" onClick={() => handlerShareTransactionCommissionReapplyOn(selectedRow?.id ?? '')} className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                                {/* <IconTrash className="ml-2" /> */}
                                                                                محاسبه
                                                                            </button>
                                                                        </div>
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
                                                                <Dialog.Panel className="rounded-lg bg-white p-6 shadow-lg">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex w-56 text-lg font-bold">ویرایش کارمزد ها</div>
                                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                                            <div className="flex items-center justify-items-center">
                                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                                    {selectedRow?.calculationTypeName}
                                                                                </div>
                                                                                {selectedRow?.stockSymbol}
                                                                            </div>
                                                                        </div>

                                                                        <button type="button" onClick={() => setIsHandlyCommissionModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                            <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="p-5 text-xl">
                                                                        <Formik
                                                                            initialValues={modelTC!}
                                                                            //validationSchema={{}}
                                                                            onSubmit={(values) => {
                                                                                console.log('ok', values);
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

                                                                                <div className="p-5">
                                                                                    <div className="mt-8 flex items-center justify-end">
                                                                                        <button type="button" onClick={() => setIsHandlyCommissionModalOpen(false)} className="btn btn-outline-danger">
                                                                                            انصراف
                                                                                        </button>
                                                                                        <button type="submit" className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                                            {/* <IconPlus className="ml-2" /> */}
                                                                                            ثبت
                                                                                        </button>
                                                                                    </div>
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
                                                                <Dialog.Panel className="rounded-lg bg-white p-6 shadow-lg">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex w-56 text-lg font-bold">ویرایش اعلامیه</div>
                                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                                            <div className="flex items-center justify-items-center">
                                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                                    {selectedRow?.calculationTypeName}
                                                                                </div>
                                                                                {selectedRow?.stockSymbol}
                                                                            </div>
                                                                        </div>

                                                                        <button type="button" onClick={() => setIsTicketNumberModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                            <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                        </button>
                                                                    </div>                                                                    <Formik
                                                                        initialValues={{
                                                                            ticketNumber: selectedRow?.ticketNumber ?? ''
                                                                        }}
                                                                        //validationSchema={{}}
                                                                        onSubmit={(values) => {
                                                                            handlerShareTransactionTicketNumberEditClick(values, selectedRow?.id ?? '');
                                                                        }}
                                                                    >
                                                                        <Form>
                                                                            <div className="p-5 text-xl">
                                                                                <Field id="ticketNumber" name="ticketNumber" label="شماره اعلامیه" component={FTextField} />
                                                                            </div>
                                                                            <div className="p-5">
                                                                                <div className="mt-8 flex items-center justify-end">
                                                                                    <button type="button" onClick={() => setIsTicketNumberModalOpen(false)} className="btn btn-outline-danger">
                                                                                        انصراف
                                                                                    </button>
                                                                                    <button type="submit" className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                                        {/* <IconPlus className="ml-2" /> */}
                                                                                        ثبت
                                                                                    </button>
                                                                                </div>
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
                                                                <Dialog.Panel className="rounded-lg bg-white p-6 shadow-lg">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex w-56 text-lg font-bold">ویرایش نوع فرعی</div>
                                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                                            <div className="flex items-center justify-items-center">
                                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                                    {selectedRow?.calculationTypeName}
                                                                                </div>
                                                                                {selectedRow?.stockSymbol}
                                                                            </div>
                                                                        </div>

                                                                        <button type="button" onClick={() => setIsSubTypeModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                            <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                        </button>
                                                                    </div>                                                                    <Formik
                                                                        initialValues={{
                                                                            subType: selectedRow?.subType ?? ''
                                                                        }}
                                                                        //validationSchema={{}}
                                                                        onSubmit={(values) => {
                                                                            handlerShareTransactionSubTypeEditClick(values, selectedRow?.id ?? '');
                                                                        }}
                                                                    >
                                                                        <Form>
                                                                            <div className="p-5 text-xl">
                                                                                <Field id="subType" name="subType" label="نوع فرعی"
                                                                                    options={[
                                                                                        { value: "Normal", label: "تراکنش عادی" },
                                                                                        { value: "Block", label: "تراکنش بلوکی" },
                                                                                        { value: "Underwriting", label: "پذیره نویسی" }]
                                                                                    }
                                                                                    value={""}
                                                                                    component={FSelectField} />

                                                                            </div>
                                                                            <div className="p-5">
                                                                                <div className="mt-8 flex items-center justify-end">
                                                                                    <button type="button" onClick={() => setIsSubTypeModalOpen(false)} className="btn btn-outline-danger">
                                                                                        انصراف
                                                                                    </button>
                                                                                    <button type="submit" className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                                        ثبت
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </Form>

                                                                    </Formik>


                                                                </Dialog.Panel>
                                                            </Transition.Child>
                                                        </div>
                                                    </div>
                                                </Dialog>
                                            </Transition>
                                        </>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Transition appear show={isDeleteModalOpen} as={Fragment}>
                <Dialog as="div" open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                <Dialog.Panel className="rounded-lg bg-white p-6 shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex text-lg font-bold">
                                            <div className="flex w-40 pl-2 text-danger">
                                                <i className="fa-duotone fa-solid fa-trash text-xl" />
                                                حذف
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                            <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                        </button>
                                    </div>
                                    <div className="p-5 text-center text-2xl">آیا از حذف این ردیف مطمئن هستید؟</div>
                                    <div className="p-5">
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn btn-outline-danger">
                                                انصراف
                                            </button>
                                            <button type="button" onClick={() => deleteSharetransactionbatch(currentRowId)} className={`btn btn-danger flex w-32 ltr:ml-4 rtl:mr-4 ${isLoading ? 'disabled' : ''}}`}>
                                                {isLoading ? (
                                                    <span className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4"></span>
                                                ) : (
                                                    <i className="fa-duotone fa-solid fa-trash text-xl" />
                                                )}
                                                حذف
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
