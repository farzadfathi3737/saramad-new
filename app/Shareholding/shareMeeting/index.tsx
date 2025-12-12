'use client'

import FTextField from '@/app/components/inputs/textField';
import { IDataModel, IFieldsTable } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import Demo from '@/app/components/Datatable/MRT';
import { Dialog, Transition } from '@headlessui/react';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import Link from 'next/link';

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

const ShareMeeting = ({ sessionid }: Props) => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [modelS, setModelS] = useState<IDataModel>();
    const [modelSD, setModelSD] = useState<IDataModel>();
    const [modelD, setModelD] = useState<IDataModel>();
    const [data, setData] = useState<ICompany | undefined>();
    const [dataSession, setDataSession] = useState<ISessionlist | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>();
    const [selectedItem, setSelectedItem] = useState<ISession>();
    const [sessionId, setSessionId] = useState<string>(sessionid || '');
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [modelData, setModelData] = useState<any>();
    const [companyId, setCompanyId] = useState('');
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

    const router = useRouter();

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    useEffect(() => {
        const _setdata = async () => {
            const _model = await getEntityModel('sharemeeting');

            _model?.list?.responses.map((item: IFieldsTable) => {
                if (['cashDividendStatus', 'capitalRaiseStatus', 'capitalRaiseRegisterStatus'].includes(item.accessor)) {
                    item = {
                        ...item,
                        Cell: ({ cell }) => {
                            const _bg = cell.getValue();

                            return (
                                <div className="flex w-full items-center justify-start">
                                    {_bg == 'NoData' ? <div className={`h-6 w-6 rounded-full border border-gray-500`} style={{ backgroundColor: "white" }} /> :
                                        _bg == 'NotApplied' ? <div className={`h-6 w-6 rounded-full border border-gray-500`} style={{ backgroundColor: "#FFB62B" }} /> :
                                            _bg == 'Applied' ? <div className={`h-6 w-6 rounded-full border border-gray-500`} style={{ backgroundColor: "#22B14C" }} /> :
                                                _bg == 'RollBacked' ? <div className={`h-6 w-6 rounded-full border border-gray-500`} style={{ backgroundColor: "#c4C4C4" }} /> :
                                                    <></>
                                    }
                                    {/* <div className={`h-8 w-8 rounded-full border border-gray-500`} style={_bg == 'NoData' ? { backgroundColor: "white" } : _bg == 'NotApplied' ? { backgroundColor: "yallow" } : _bg == 'Applied' ? { backgroundColor: "green" } : _bg == 'RollBacked' ? { backgroundColor: "gray" } : ''} /> */}
                                    {/* _bg == 'NoData' ? <div className={`h-8 w-8 rounded-full border `} style={{ backgroundColor: 'white' }} /> : <div className={`h-8 w-8 rounded-md border bg-inherit`} />} */}
                                    {/* <div className="pr-2">{_bg}</div> */}
                                </div>
                            );
                        },
                    };

                    _model.list.responses = [..._model.list.responses.filter((x: any) => x.accessor != item.accessor), item];
                }
            });
            console.log(_model.list.responses);


            const _copy = [..._model.list.responses];
            for (let index = 0; index < 3; index++) {
                const [removed] = _copy.splice(14, 1);
                _copy.splice(5, 0, removed);
            }
            _model.list.responses = _copy;

            console.log(_copy);

            setModel(_model);
        };

        _setdata();
    }, []);

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
                                                                            onClick={() => deleteSharetransactionbatch(item.id)}
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

                            {model && (
                                <Demo
                                    isShowSearchForm={true}
                                    model={model}
                                    isShowHideCol={true}
                                    hideColList={['id', 'cashDividendStatusName', 'capitalRaiseStatusName', 'capitalRaiseRegisterStatusName']}
                                    headerAction={
                                        <div className='flex justify-center items-center '>
                                            <div className={`h-6 w-6 rounded-full border border-gray-500`} style={{ backgroundColor: "white" }} /><div className='pl-5 pr-2'>: داده ندارد</div>
                                            <div className={`h-6 w-6 rounded-full border border-gray-500`} style={{ backgroundColor: "#FFB62B" }} /><div className='pl-5 pr-2'>: اعمال نشده</div>
                                            <div className={`h-6 w-6 rounded-full border border-gray-500`} style={{ backgroundColor: "#22B14C" }} /><div className='pl-5 pr-2'>: اعمال شده</div>
                                            <div className={`h-6 w-6 rounded-full border border-gray-500`} style={{ backgroundColor: "#c4C4C4" }} /><div className='pl-5 pr-2'>: برگشت شده</div>
                                        </div>
                                    }
                                    //labaleNameList={[{ label: 'Keyword', value: 'نام سهام' }]}
                                    // addSepratorFildes={[
                                    //     'price',
                                    //     'volume',
                                    //     'totalCommissions',
                                    //     'tax',
                                    //     'primeCost',
                                    //     'netSellCost',
                                    //     'grossCost',
                                    //     'depositoryCommission',
                                    //     'costBenefit',
                                    //     'brokerCostWithoutDiscount',
                                    //     'brokerCommissionDiscount',
                                    //     'brokerCommission',
                                    //     'bourseRayanCommission',
                                    //     'bourseITCommission',
                                    //     'bourseCompanyCommission',
                                    //     'bourseAgencyCommission',
                                    // ]}
                                    // addFooterSumFildes={[
                                    //     'volume',
                                    //     'totalCommissions',
                                    //     'tax',
                                    //     'primeCost',
                                    //     'netSellCost',
                                    //     'grossCost',
                                    //     'depositoryCommission',
                                    //     'costBenefit',
                                    //     'brokerCostWithoutDiscount',
                                    //     'brokerCommissionDiscount',
                                    //     'brokerCommission',
                                    //     'bourseRayanCommission',
                                    //     'bourseITCommission',
                                    //     'bourseCompanyCommission',
                                    //     'bourseAgencyCommission',
                                    // ]}
                                    staticParams={[
                                        { name: 'CompanyId', value: companyId },
                                    ]}
                                    isEditable={false}
                                    detailPanel={(row) => {
                                        //console.log(row.original);
                                        return (
                                            <div className="h-[100px] bg-gray-200">
                                                <div className="flex p-5 absolute">
                                                    <div className="ml-5 flex p-2 gap-5">

                                                        <Link className="btn btn-default ml-2 px-5 font-iranyekan bg-white" href={`/Shareholding/sharecashdividend?MeetingId=${row.row.original.id}`}>
                                                            سود نقدی
                                                        </Link>
                                                        <Link className="btn btn-default ml-2 px-5 font-iranyekan bg-white" href={`/Shareholding/shareMeeting/capitalraise?MeetingId=${row.row.original.id}`}>
                                                            افزایش سرمایه
                                                        </Link>
                                                        <Link className="btn btn-default ml-2 px-5 font-iranyekan bg-white" href={`/Shareholding/shareMeeting/prerightsforpayment?MeetingId=${row.row.original.id}`}>
                                                            پرداخت ارزش اسمی
                                                        </Link>
                                                        <Link className="btn btn-default ml-2 px-5 font-iranyekan bg-white" href={`/Shareholding/shareMeeting/prerightsforwaivedsell?MeetingId=${row.row.original.id}`}>
                                                            حق تقدم استفاده نشده
                                                        </Link>
                                                        <Link className="btn btn-default ml-2 px-5 font-iranyekan bg-white" href={`/Shareholding/shareMeeting/capitalraiseregisterresult?MeetingId=${row.row.original.id}`}>
                                                            ثبت افزایش سرمایه
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShareMeeting;
