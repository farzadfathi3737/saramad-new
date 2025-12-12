'use client'

import FTextField from '@/app/components/inputs/textField';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useRouter as Router } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import Demo from '@/app/components/Datatable/MRT';
import { Dialog, Transition } from '@headlessui/react';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';

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

interface IShareTransaction {
    calculationTypeName: string;
    stockSymbol: string;
}

type Props = {
    sessionid?: string;
};

const Session = ({ sessionid }: Props) => {
    const { t } = useTranslation();
    const [model, setModel] = useState<IDataModel>();
    const [modelS, setModelS] = useState<IDataModel>();
    const [modelSD, setModelSD] = useState<IDataModel>();
    const [modelD, setModelD] = useState<IDataModel>();
    const [data, setData] = useState<ICompany | undefined>();
    const [dataSession, setDataSession] = useState<ISessionlist | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
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

    const router = useRouter();
    const _router = Router();
    const { query } = _router;

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
        setRowId(query.id?.toString());
        const _setdata = async () => {
            let _modelS = await getEntityModel('sharetransactionbatchsession');
            setModelS(_modelS);

            let _modelSD = await getEntityModel('sharetransactionbatch');
            setModelSD(_modelSD);

            let _model = await getEntityModel('sharetransaction');
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

        //const res = await fetch(`${modelS?.list?.url}?SessionId=${sessionId}&PageSize=10&PageNumber=${page}`);
        const res = await fetch(`${modelS?.list?.url}?SessionId=${sessionId}`);

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

        const res = await fetch(modelSD?.delete?.url.replace('{id}', id) as string, {
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

        const res = await fetch(`${model?.read?.url.replace('{id}', id)}`);

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
                {/* <div className="mt-5 grid w-full grid-cols-9 bg-gray-100 px-5 font-extrabold">
                <div className="col-span-2 p-5">دسته تراکنش ها</div>
                <div className="p-5 pr-10">تراکنش ها</div>
            </div> */}

                <div className="grid w-full grid-cols-9 px-5 pt-5">
                    {/*<Dialog open={open} onClose={setOpen} className="relative z-10">
                     <DialogBackdrop
                        transition
                        className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-500/75 transition-opacity"
                    /> */}

                    {/* <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                            >
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                            <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                                Deactivate account
                                            </DialogTitle>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="shadow-xs inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    >
                                        Deactivate
                                    </button>
                                    <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => setOpen(false)}
                                        className="shadow-xs mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </DialogPanel>
                        </div>
                    </div> 
                </Dialog>*/}

                    {/* <div className="col-span-2">
                    <div className="">
                        <div className="grid grid-cols-6 rounded-t-2xl bg-[#d1ebef] text-center font-extrabold">
                            <div className="col-span-2 rounded-tr-2xl border border-gray-300 p-5">شماره دسته</div>
                            <div className="col-span-3 border border-gray-300 p-5">تاریخ</div>
                            <div className="col-span-1 rounded-tl-2xl border border-gray-300 px-2 py-5">عملیات</div>
                        </div>

                        <div className="max-h-[600px] overflow-y-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {items &&
                                items?.map((item: ISession, index) => {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setSelected(index);
                                                setSelectedId(item.id);
                                            }}
                                            className={`grid grid-cols-6 text-center ${index == selected ? 'bg-[#0aa6b8c4] text-white' : ''}`}
                                        >
                                            <div className="col-span-2 border border-gray-300 p-3">{item.number}</div>
                                            <div className="col-span-3 border border-gray-300 p-3">{item.date}</div>
                                            <div className="col-span-1 border border-gray-300 px-2 py-3">
                                                {item.isDeletable && (
                                                    <Tooltip label="حذف">
                                                        <ActionIcon
                                                        //onClick={() =>}
                                                        >
                                                            <i className="fa-duotone fa-solid fa-trash text-lg" />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div> */}

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
                                                                            onClick={() => deleteSharetransactionbatch(item.id)}
                                                                        >
                                                                            <i className="fa-duotone fa-solid fa-trash text-lg" />
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
                                    model={model}
                                    isShowHideCol={true}
                                    hideColList={['id', 'companyId', 'isEdited']}
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
                                                <ActionIcon onClick={() => setOpen(true)}>
                                                    <i className="fa-duotone fa-solid fa-minus text-lg" />
                                                </ActionIcon>
                                            </Tooltip>
                                            <div className="flex items-center justify-center">
                                                <div className="pl-5">شماره دسته : {selectedItem?.number}</div>
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
                                    detailPanel={(row) => {
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
                                                                <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
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
                                                                <i className="fa-duotone fa-solid fa-minus text-lg ml-2" />
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
                                                                <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
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
                                                                <i className="fa-duotone fa-solid fa-trash text-lg ml-2" />
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
                                                                    setIsHandlyCommissionModalOpen(true);
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
                                                            <div className="flex pl-2 text-success">
                                                                <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
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

                                                        <button type="button" onClick={() => setIsPrimeCostAddModalOpen(false)} className="text-white-dark hover:text-dark">
                                                            <i className="fa-duotone fa-solid fa-xmark text-2xl m-1 text-gray-500" />
                                                        </button>
                                                    </div>
                                                    <div className="p-5 text-xl">
                                                        <Formik
                                                            initialValues={{}}
                                                            validationSchema={{}}
                                                            onSubmit={(values) => {
                                                                console.log('ok', values);
                                                                //handlEditClick(values);
                                                                //alert(JSON.stringify(values, null, 2));
                                                            }}
                                                        >
                                                            <Form>
                                                                <Field id="amount" name="amount" label="مقدار اصلاحی" component={FTextField} />
                                                            </Form>
                                                        </Formik>
                                                    </div>
                                                    <div className="p-5">
                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button type="button" onClick={() => setIsPrimeCostAddModalOpen(false)} className="btn btn-outline-danger">
                                                                انصراف
                                                            </button>
                                                            <button type="button" onClick={() => { }} className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
                                                                افزایش
                                                            </button>
                                                        </div>
                                                    </div>
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
                                                            <div className="flex pl-2 text-danger">
                                                                <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
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

                                                        <button type="button" onClick={() => setIsPrimeCostSubModalOpen(false)} className="text-white-dark hover:text-dark">
                                                            <i className="fa-duotone fa-solid fa-xmark text-2xl m-1 text-gray-500" />
                                                        </button>
                                                    </div>
                                                    <div className="p-5 text-xl">
                                                        <Formik
                                                            initialValues={{}}
                                                            validationSchema={{}}
                                                            onSubmit={(values) => {
                                                                console.log('ok', values);
                                                                //handlEditClick(values);
                                                                //alert(JSON.stringify(values, null, 2));
                                                            }}
                                                        >
                                                            <Form>
                                                                <Field id="amount" name="amount" label="مقدار اصلاحی" component={FTextField} />
                                                            </Form>
                                                        </Formik>
                                                    </div>
                                                    <div className="p-5">
                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button type="button" onClick={() => setIsPrimeCostSubModalOpen(false)} className="btn btn-outline-danger">
                                                                انصراف
                                                            </button>
                                                            <button type="button" onClick={() => { }} className="btn btn-danger flex w-32 ltr:ml-4 rtl:mr-4">
                                                                <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
                                                                کاهش
                                                            </button>
                                                        </div>
                                                    </div>
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

                                                        <button type="button" onClick={() => setIsReapplyAddModalOpen(false)} className="text-white-dark hover:text-dark">
                                                            <i className="fa-duotone fa-solid fa-xmark text-2xl m-1 text-gray-500" />
                                                        </button>
                                                    </div>
                                                    <div className="p-5 text-center text-2xl">آیا از انجام این عملیات مطمئن هستید؟</div>
                                                    <div className="p-5">
                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button type="button" onClick={() => setIsReapplyAddModalOpen(false)} className="btn btn-outline-danger">
                                                                انصراف
                                                            </button>
                                                            <button type="button" onClick={() => { }} className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
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

                                                        <button type="button" onClick={() => setIsReapplyDelModalOpen(false)} className="text-white-dark hover:text-dark">
                                                            <i className="fa-duotone fa-solid fa-xmark text-2xl m-1 text-gray-500" />
                                                        </button>
                                                    </div>
                                                    <div className="p-5 text-center text-2xl">آیا از انجام این عملیات مطمئن هستید؟</div>
                                                    <div className="p-5">
                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button type="button" onClick={() => setIsReapplyDelModalOpen(false)} className="btn btn-outline-danger">
                                                                انصراف
                                                            </button>
                                                            <button type="button" onClick={() => { }} className="btn btn-danger flex w-32 ltr:ml-4 rtl:mr-4">
                                                                <i className="fa-duotone fa-solid fa-trash text-lg ml-2" />
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

                                                        <button type="button" onClick={() => setIsAutoCommissionModalOpen(false)} className="text-white-dark hover:text-dark">
                                                            <i className="fa-duotone fa-solid fa-xmark text-2xl m-1 text-gray-500" />
                                                        </button>
                                                    </div>
                                                    <div className="p-5 text-center text-2xl">آیا از انجام محاسبه اتوماتیک مطمئن هستید؟</div>
                                                    <div className="p-5">
                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button type="button" onClick={() => setIsAutoCommissionModalOpen(false)} className="btn btn-outline-danger">
                                                                انصراف
                                                            </button>
                                                            <button type="button" onClick={() => { }} className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                <i className="fa-duotone fa-solid fa-trash text-lg ml-2" />
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
                                                        <div className="flex w-56 text-lg font-bold">ویرایش کارمزد ها</div>
                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                            <div className="flex items-center justify-items-center">
                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                    {selectedRow?.calculationTypeName}
                                                                </div>
                                                                {selectedRow?.stockSymbol}
                                                            </div>
                                                        </div>

                                                        <button type="button" onClick={() => setIsHandlyCommissionModalOpen(false)} className="text-white-dark hover:text-dark">
                                                            <i className="fa-duotone fa-solid fa-xmark text-2xl m-1 text-gray-500" />
                                                        </button>
                                                    </div>
                                                    <div className="p-5 text-xl">
                                                        <Formik
                                                            initialValues={{}}
                                                            validationSchema={{}}
                                                            onSubmit={(values) => {
                                                                console.log('ok', values);
                                                                //handlEditClick(values);
                                                                //alert(JSON.stringify(values, null, 2));
                                                            }}
                                                        >
                                                            <Form>
                                                                <div className="grid w-full grid-cols-1 gap-2 px-5">
                                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                        <div>
                                                                            <Field id="externalId" name="externalId" label={t('externalId')} component={FTextField} disabled />
                                                                        </div>
                                                                        <div>
                                                                            <Field id="externalId2" name="externalId2" label={t('externalId2')} component={FTextField} disabled />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                        <div>
                                                                            <Field id="externalId" name="externalId" label={t('externalId')} component={FTextField} disabled />
                                                                        </div>
                                                                        <div>
                                                                            <Field id="externalId2" name="externalId2" label={t('externalId2')} component={FTextField} disabled />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                        <div>
                                                                            <Field id="externalId" name="externalId" label={t('externalId')} component={FTextField} disabled />
                                                                        </div>
                                                                        <div>
                                                                            <Field id="externalId2" name="externalId2" label={t('externalId2')} component={FTextField} disabled />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                        <div>
                                                                            <Field id="externalId" name="externalId" label={t('externalId')} component={FTextField} disabled />
                                                                        </div>
                                                                        <div>
                                                                            <Field id="externalId2" name="externalId2" label={t('externalId2')} component={FTextField} disabled />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Form>
                                                        </Formik>
                                                    </div>
                                                    <div className="p-5">
                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button type="button" onClick={() => setIsHandlyCommissionModalOpen(false)} className="btn btn-outline-danger">
                                                                انصراف
                                                            </button>
                                                            <button type="button" onClick={() => { }} className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                {/* <IconPlus className="ml-2" /> */}
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
                                                        <div className="flex w-56 text-lg font-bold">ویرایش اعلامیه</div>
                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                            <div className="flex items-center justify-items-center">
                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                    {selectedRow?.calculationTypeName}
                                                                </div>
                                                                {selectedRow?.stockSymbol}
                                                            </div>
                                                        </div>

                                                        <button type="button" onClick={() => setIsTicketNumberModalOpen(false)} className="text-white-dark hover:text-dark">
                                                            <i className="fa-duotone fa-solid fa-xmark text-2xl m-1 text-gray-500" />
                                                        </button>
                                                    </div>
                                                    <div className="p-5 text-xl">
                                                        <Formik
                                                            initialValues={{}}
                                                            validationSchema={{}}
                                                            onSubmit={(values) => {
                                                                console.log('ok', values);
                                                                //handlEditClick(values);
                                                                //alert(JSON.stringify(values, null, 2));
                                                            }}
                                                        >
                                                            <Form>
                                                                <Field id="amount" name="amount" label="شماره اعلامیه" component={FTextField} />
                                                            </Form>
                                                        </Formik>
                                                    </div>
                                                    <div className="p-5">
                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button type="button" onClick={() => setIsTicketNumberModalOpen(false)} className="btn btn-outline-danger">
                                                                انصراف
                                                            </button>
                                                            <button type="button" onClick={() => { }} className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                {/* <IconPlus className="ml-2" /> */}
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
                                                        <div className="flex w-56 text-lg font-bold">ویرایش نوع فرعی</div>
                                                        <div className="flex w-full flex-col items-end justify-items-end pl-5">
                                                            <div className="flex items-center justify-items-center">
                                                                <div className={`flex pl-2 text-lg font-bold ${selectedRow?.calculationTypeName == 'خرید' ? 'text-success' : 'text-danger'}`}>
                                                                    {selectedRow?.calculationTypeName}
                                                                </div>
                                                                {selectedRow?.stockSymbol}
                                                            </div>
                                                        </div>

                                                        <button type="button" onClick={() => setIsSubTypeModalOpen(false)} className="text-white-dark hover:text-dark">
                                                            <i className="fa-duotone fa-solid fa-xmark text-2xl m-1 text-gray-500" />
                                                        </button>
                                                    </div>
                                                    <div className="p-5 text-xl">
                                                        <Formik
                                                            initialValues={{}}
                                                            validationSchema={{}}
                                                            onSubmit={(values) => {
                                                                console.log('ok', values);
                                                                //handlEditClick(values);
                                                                //alert(JSON.stringify(values, null, 2));
                                                            }}
                                                        >
                                                            <Form>
                                                                <Field id="amount" name="amount" label="نوع فرعی" component={FTextField} />
                                                            </Form>
                                                        </Formik>
                                                    </div>
                                                    <div className="p-5">
                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button type="button" onClick={() => setIsSubTypeModalOpen(false)} className="btn btn-outline-danger">
                                                                انصراف
                                                            </button>
                                                            <button type="button" onClick={() => { }} className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                                {/* <IconPlus className="ml-2" /> */}
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
                                            <button type="button" onClick={() => deleteSharetransactionbatch(currentRowId)} className={`btn btn-danger flex w-32 ltr:ml-4 rtl:mr-4 ${isLoading ? 'disabled' : ''}}`}>
                                                {isLoading ? (
                                                    <span className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4"></span>
                                                ) : (
                                                    <i className="fa-duotone fa-solid fa-trash text-lg ml-2" />
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
