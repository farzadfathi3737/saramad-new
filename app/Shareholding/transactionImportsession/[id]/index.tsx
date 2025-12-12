'use client'

import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import AnimateHeight from 'react-animate-height';
import { ActionIcon, Tooltip } from '@mantine/core';
import Demo from '@/app/components/Datatable/MRT';
import FormatBytes from '@/app/components/inputs/fileSize';
import { Dialog, Transition } from '@headlessui/react';
import DForms from '@/app/components/Forms';
import { IconCaretDown } from '@tabler/icons-react';
import { apiFetch } from '@/lib/apiFetch';
//import { useMantineReactTable } from 'mantine-react-table';

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

interface AddProps {
    id: string;
}

const Add = ({ id }: AddProps) => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [editModel, setEditModel] = useState<IDataModel>();
    const [data, setData] = useState<ICompany | undefined>();
    const [editdata, setEditData] = useState<ICompany | undefined>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [modelData, setModelData] = useState<any>();

    const router = useRouter();

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isRecheckModalOpen, setIsRecheckModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [active1, setActive1] = useState<string>('1');
    const [active2, setActive2] = useState<string>('1');

    const togglePara1 = (value: string) => {
        setActive1((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const togglePara2 = (value: string) => {
        setActive2((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    //const sumPrice: number = 10;

    useEffect(() => {
        setRowId(id);

        const _setdata = async () => {
            const _model = getEntityModel('transactionimportsession');
            setModel(_model);
        };

        _setdata();
    }, [id]);

    useEffect(() => {
        setData(undefined);
        const _setdata = async () => {
            rowId && fetchData(rowId);
        };

        _setdata();
    }, [rowId]);

    const fetchData = async (id: string) => {
        setIsLoading(true);

        const res = await apiFetch(`${model?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result: ICompany = await res?.json();
            setData(result);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const reject = async () => {
        setIsLoading(true);
        const _model = await getEntityModel('transactionimportsessionreject');
        const res = await apiFetch(`${_model?.register?.url}?sessionId=${rowId}`, { method: 'post' });

        if (res.ok) {
            setIsLoading(false);
            router.back();
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const recheck = async () => {
        setIsLoading(true);
        const _model = await getEntityModel('transactionimportsessionrecheck');
        const res = await apiFetch(`${_model?.register?.url}?sessionId=${rowId}`, { method: 'post' });

        if (res.ok) {
            setIsLoading(false);
            router.back();
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const approve = async () => {
        setIsLoading(true);
        const _model = await getEntityModel('transactionimportsessionapprove');
        const res = await apiFetch(`${_model?.register?.url}?sessionId=${rowId}`, { method: 'post' });

        if (res.ok) {
            setIsLoading(false);
            router.back();
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const ShowEditForm = async (id: string) => {
        //setIsLoading(true);
        const _model = await getEntityModel('rawtransaction');
        setEditModel(_model);

        const res = await apiFetch(`${_model?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result: ICompany = await res?.json();
            setData(result);
            //setIsLoading(false);
            setIsEditModalOpen(true);
        } else {
            setData(undefined);
            //setIsLoading(false);
        }
    };

    const SignupSchema = Yup.object().shape({
        categoryId: Yup.string().required(t('required').toString()),
    });

    const handlGetData = () => {
        const setdata = async () => {
            const _model = await getEntityModel('rawtransaction');
            // console.log(_model);
            setModelData(_model);
        };
        setdata();
    };

    const handlEditClick = async (data: ICompany) => {
        setIsLoading(true);
        // console.log(data);
        const res = await apiFetch(`${editModel?.update?.url.replace('{id}', rowId ? rowId : '')}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const result = res && (await res?.json());
            //setInitialRecords(result);
            //setAddModal(false);
            //fetchData();
            setIsLoading(false);
            router.back();
        } else {
            //setInitialRecords({ pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
        }
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn btn-outline pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50 cursor-pointer"
                                onClick={() => router.back()}>
                                <i className="fa-duotone fa-solid fa-chevron-right text-xl ml-2" />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        عملیات ورود اطلاعات
                    </div>
                </div>
                {data && (
                    <div className="table-responsive px-0">
                        <div className="py-5">
                            <div className="grid w-full grid-cols-1 gap-2 px-10 sm:grid-cols-2">
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div>
                                        <fieldset>
                                            <label className="!text-gray-600">شماره جلسه</label>
                                            <div className="form-input pt-3 !text-gray-600">{data.number}</div>
                                        </fieldset>
                                    </div>
                                    <div>
                                        <fieldset>
                                            <label className="!text-gray-600">نام فایل</label>
                                            <div className="form-input pt-3 !text-gray-600">{`${data.fileName} - ( ${FormatBytes(10737418, 1)} )`}</div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="grid w-full"></div>
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div>
                                        <fieldset>
                                            <label className="!text-gray-600">زمان شروع</label>
                                            <div className="form-input pt-3 !text-gray-600">{data.date}</div>
                                        </fieldset>
                                    </div>
                                    <div>
                                        <fieldset>
                                            <label className="!text-gray-600">نوع فایل</label>
                                            <div className="form-input pt-3 !text-gray-600">{data.fileTypeName}</div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="grid w-full"></div>
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div>
                                        <fieldset>
                                            <label className="!text-gray-600">وضعیت</label>
                                            <div className="form-input pt-3 !text-gray-600">{data.statusName}</div>
                                        </fieldset>
                                    </div>
                                    <div>
                                        <fieldset>
                                            <label className="!text-gray-600">تعداد تراکنش</label>
                                            <div className="form-input pt-3 !text-gray-600">{data.transactionsCount}</div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="grid w-full"></div>
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div>
                                        <fieldset>
                                            <div className="flex justify-between">
                                                <label className="!text-gray-600">درصد پیشرفت</label>
                                                <label className="!text-gray-600">{`${data.progress}%`}</label>
                                            </div>
                                            {/* <div className="form-input bg-white-light pt-3 text-white-dark">{data.stockName}</div> */}
                                            <div className="mb-4 h-5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                                <div className="h-5 rounded-full bg-yellow-400" style={{ width: `${data.progress}%` }}></div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div></div>
                                </div>
                            </div>

                            {data.hasException && (
                                <div className="flex w-full">
                                    <div className="w-full">
                                        <div className="space-y-c space-y-2 font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active1 === '1' ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara1('1')}
                                                >
                                                    شرح خطاها
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active1 === '1' ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active1 === '1' ? 'auto' : 0}>
                                                        <div className="flex w-full px-5">
                                                            <div className="flex w-full flex-col rounded-md border-2 border-red-800 bg-red-50 p-5">
                                                                {data.unknownSymbols && (
                                                                    <div className="flex w-full py-2">
                                                                        <div className="text-lg text-red-950">نماد های نامشخص :</div>
                                                                        <div className="pr-5 text-red-800">{data.unknownSymbols}</div>
                                                                    </div>
                                                                )}
                                                                {data.unknownBrokers && (
                                                                    <div className="flex w-full py-2">
                                                                        <div className="text-lg text-red-950">کارگزار های نامشخص :</div>
                                                                        <div className="pr-5 text-red-800">{data.unknownBrokers}</div>
                                                                    </div>
                                                                )}
                                                                {data.unknownTradingCodes && (
                                                                    <div className="flex w-full py-2">
                                                                        <div className="text-lg text-red-950">نماد های نامشخص :</div>
                                                                        <div className="pr-5 text-red-800">{data.unknownTradingCodes}</div>
                                                                    </div>
                                                                )}
                                                                {data.exceptionMessages && (
                                                                    <div className="flex w-full py-2">
                                                                        <div className="text-lg text-red-950">خطا :</div>
                                                                        <div className="pr-5 text-red-800">{data.exceptionMessages}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid w-full grid-cols-1 gap-2 px-10 py-5 sm:grid-cols-2">
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div>
                                        {(!data.isInProgress || data.status == 'PendingApproval') && (
                                            <button type="button" onClick={handlGetData} className="btn bg-primary-50 text-white w-52">
                                                نمایش اطلاعات فایل
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex">
                                        {data.status == 'PendingApproval' && (
                                            <>
                                                <button type="button" className="btn btn-danger w-32 px-5" onClick={() => setIsRejectModalOpen(true)}>
                                                    لغو
                                                </button>
                                                <Transition appear show={isRejectModalOpen} as={Fragment}>
                                                    <Dialog as="div" open={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
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
                                                                            <h2 className="text-xl font-semibold text-red-600">اخطار !</h2>
                                                                            <button type="button" onClick={() => setIsRejectModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                                <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                            </button>
                                                                        </div>
                                                                        <div className="text-center text-xl mb-4">
                                                                            <p>آیا از لغو فایل اطمینان دارید ؟</p>
                                                                        </div>
                                                                        <div className="flex justify-end">
                                                                            <button type="button" onClick={() => setIsRejectModalOpen(false)} className="ml-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                                                                                انصراف
                                                                            </button>
                                                                            <button type="button" onClick={() => reject()} className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                                                                                لغو
                                                                            </button>
                                                                        </div>
                                                                    </Dialog.Panel>
                                                                </Transition.Child>
                                                            </div>
                                                        </div>
                                                    </Dialog>
                                                </Transition>
                                            </>
                                        )}

                                        {data.status == 'InitialCheckFailed' && (
                                            <>
                                                <button type="button" className="btn bg-orange-400 text-yellow-100 w-32 px-5" onClick={() => setIsRecheckModalOpen(true)}>
                                                    بررسی مجدد
                                                </button>
                                                <Transition appear show={isRecheckModalOpen} as={Fragment}>
                                                    <Dialog as="div" open={isRecheckModalOpen} onClose={() => setIsRecheckModalOpen(false)}>
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
                                                                            <h2 className="text-xl font-semibold text-orange-600">اخطار !</h2>
                                                                            <button type="button" onClick={() => setIsRecheckModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                                <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                            </button>
                                                                        </div>
                                                                        <div className="text-center text-xl mb-4">
                                                                            <p>آیا از بررسی مجدد فایل اطمینان دارید ؟</p>
                                                                        </div>
                                                                        <div className="flex justify-end">
                                                                            <button type="button" onClick={() => setIsRecheckModalOpen(false)} className="ml-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                                                                                انصراف
                                                                            </button>
                                                                            <button type="button" onClick={() => recheck()} className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                                                                                بررسی مجدد
                                                                            </button>
                                                                        </div>
                                                                    </Dialog.Panel>
                                                                </Transition.Child>
                                                            </div>
                                                        </div>
                                                    </Dialog>
                                                </Transition>
                                            </>
                                        )}
                                        {data.status == 'PendingApproval' && (
                                            <>
                                                <button type="button" className="btn bg-green-500 text-green-100 w-32 px-5" onClick={() => setIsApproveModalOpen(true)}>
                                                    ثبت نهایی
                                                </button>
                                                <Transition appear show={isApproveModalOpen} as={Fragment}>
                                                    <Dialog as="div" open={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)}>
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
                                                                            <h2 className="text-xl font-semibold text-green-600">اخطار !</h2>
                                                                            <button type="button" onClick={() => setIsApproveModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                                <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                            </button>
                                                                        </div>
                                                                        <div className="text-center text-xl mb-4">
                                                                            <p>آیا از ثبت نهایی فایل اطمینان دارید ؟</p>
                                                                        </div>
                                                                        <div className="flex justify-end">
                                                                            <button type="button" onClick={() => setIsApproveModalOpen(false)} className="ml-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                                                                                انصراف
                                                                            </button>
                                                                            <button type="button" onClick={() => approve()} className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                                                                                ثبت نهایی
                                                                            </button>
                                                                        </div>
                                                                    </Dialog.Panel>
                                                                </Transition.Child>
                                                            </div>
                                                        </div>
                                                    </Dialog>
                                                </Transition>
                                            </>
                                        )}

                                        <Transition appear show={isEditModalOpen} as={Fragment}>
                                            <Dialog as="div" open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
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
                                                                    <h2 className="text-xl font-semibold">ویرایش</h2>
                                                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                                                        <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <DForms
                                                                        model={undefined}
                                                                        parameter={editModel?.update?.requestBody}
                                                                        initialValues={data}
                                                                        filedNotShow={[]}
                                                                        onClick={handlEditClick}
                                                                        setModal={setIsEditModalOpen}
                                                                        sucsesBtnText="edit"
                                                                        cancelBtnText="انصراف"
                                                                    />
                                                                </div>
                                                            </Dialog.Panel>
                                                        </Transition.Child>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        </Transition>
                                    </div>
                                </div>
                                <div className="grid w-full"></div>
                            </div>

                            {(!data.isInProgress || (data.isInProgress && data.status == 'PendingApproval')) && modelData && (
                                <div className="flex w-full">
                                    <div className="w-full">
                                        <div className="space-y-2 font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`space-y-cc flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active2 === '1' ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara2('1')}
                                                >
                                                    اطلاعات بارگزاری شده (پردازش نشده){' '}
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active2 === '1' ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active2 === '1' ? 'auto' : 0}>
                                                        <div className="table-responsive px-5">
                                                            {modelData && rowId && (
                                                                <Demo
                                                                    isShowSearchForm={false}
                                                                    model={modelData}
                                                                    isShowHideCol={true}
                                                                    hideColList={['id', 'companyId', 'date', 'status', 'fileType', 'progress', 'importedFileId', 'isEdited']}
                                                                    addSepratorFildes={['volume']}
                                                                    addFooterSumFildes={['volume']}
                                                                    labaleNameList={[
                                                                        { label: 'Keyword', value: 'نام سهام' },
                                                                        { label: 'name', value: 'نام سهام' },
                                                                        { label: 'type', value: 'نوع عملیات' },
                                                                    ]}
                                                                    staticParams={[{ name: 'SessionId', value: rowId! }]}
                                                                    isEditable={false}
                                                                    action={(row: any) => (
                                                                        <>
                                                                            {data.status != 'Completed' && data.status != 'CompletedWithErrors' && (
                                                                                <Tooltip label="ویرایش">
                                                                                    <ActionIcon
                                                                                        onClick={() => ShowEditForm(row.id)}
                                                                                        variant="transparent"
                                                                                        className="mr-3 flex items-center rounded-xl w-9 h-9 p-0">
                                                                                        <i className="fa-duotone fa-solid fa-pen-to-square text-xl text-gray-400 hover:text-blue-500" />
                                                                                    </ActionIcon>
                                                                                </Tooltip>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                    mantineTableBodyRowBackgroundColor={'#fdba74'}
                                                                    mantineTableBodyRowBackgroundColorChangeByField={'isEdited'}
                                                                    headerAction={
                                                                        <>
                                                                            {/* <button
                                                                                        type="button"
                                                                                        className="btn btn-danger"
                                                                                        //onClick={() => togglePara1(true)}
                                                                                    >
                                                                                        لغو
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-warning"
                                                                                        //onClick={() => togglePara1(true)}
                                                                                    >
                                                                                        بررسی مجدد
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-success"
                                                                                        //onClick={() => togglePara1(true)}
                                                                                    >
                                                                                        ثبت نهایی
                                                                                    </button> */}
                                                                        </>
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Add;
