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
import { Drawer, DrawerItems } from 'flowbite-react';
import { apiFetch } from '@/lib/apiFetch';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

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
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelS, setModelS] = useState<IDataModel>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ISession>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [fiscalYearId, setFiscalYearId] = useState('');
    const [selected, setSelected] = useState<number>(0);
    const [items, setItems] = useState<ISession[]>([]);
    const [open, setOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentRowId, setCurrentRowId] = useState('');

    useEffect(() => {
        setCompanyId(appConfig.company.id);
        setFiscalYearId(appConfig.fiscalYear.id);
    }, [appConfig.company, appConfig.fiscalYear]);

    useEffect(() => {
        const _setdata = async () => {
            const _modelS = await getEntityModel('sharetransactionbatch');
            setModelS(_modelS);

            const _model = await getEntityModel('nonmarketsharetransaction');
            setModel(_model);
        };
        _setdata();
    }, []);

    useEffect(() => {
        const _setdata = async () => {
            await loadMore();
        };
        _setdata();
    }, [modelS, fiscalYearId]);

    const loadMore = async () => {
        const res = await apiFetch(`${modelS?.list?.url}?FiscalYearId=${fiscalYearId}&Type=Transfer`);

        if (res.ok) {
            const result: ISessionlist = await res?.json();
            setItems(result.items);
            setSelected(0);
            setSelectedItem(result.items[0]);
            setIsLoading(false);
        } else {
            setItems([]);
            setIsLoading(false);
        }
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

    const handlerShowDeleteModal = (id: string) => {
        setCurrentRowId(id);
        setIsDeleteModalOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
                <div className="panel h-full w-full px-0">

                    <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                        <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                            فهرست کد به کد
                        </div>

                        <div className='p-2 h-full flex flex-col justify-center align-middle pl-2'>
                            <button type="button" className="btn btn-outline mr-3 flex items-center rounded-lg p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                onClick={() => subPage('transfercodetocode', 'add', undefined, [{ key: 'shareId', value: "125" }])}>
                                {/* onClick={() => subPage('transfercodetocode', 'add')}> */}
                                <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                                کد به کد جدید
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive p-5">
                        {model && (
                            <Demo
                                // isShowSearchForm={false}
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
                            />
                        )}
                    </div>
                    <>
                        <Drawer open={open} onClose={() => setOpen(false)} position="right" className='flex flex-col overflow-y-hidden py-0'>
                            <DrawerItems className='flex flex-col h-full overflow-hidden'>
                                <div className="flex justify-between p-4 border-b flex-shrink-0">
                                    <div>لیست دسته بندی ها</div>
                                    <div onClick={() => setOpen(false)} className="cursor-pointer">
                                        <i className={`fa-duotone fa-solid fa-xmark text-sm text-gray-700 hover:text-gray-900`} />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto bg-gray-50 p-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                    <div className="flex flex-col gap-3">
                                        {items &&
                                            items?.map((item: ISession, index) => {
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
