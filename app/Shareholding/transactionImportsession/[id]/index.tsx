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
import { IconCaretDown, IconCaretLeft } from '@tabler/icons-react';
import { apiFetch } from '@/lib/apiFetch';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import getStageStatus from '@/app/components/getStageStatus';
//import { useMantineReactTable } from 'mantine-react-table';

export interface ICompany {
    date: string;
    exceptionMessages: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    fileTypeName: string;
    sourceTypeName: string;
    hasException: boolean;
    id: string;
    importedFileId: string;
    isFailed: boolean;
    isInProgress: boolean;
    number: number;
    progress: number;
    status: string;
    stage: string;
    statusName: string;
    transactionsCount: number;
    unknownBrokers: string | null;
    unknownSymbols: string | null;
    unknownTradingCodes: string | null;
    rawDataFromDate: string;
    rawDataToDate: string;
    canBeResumed: boolean;
    stopMessage: string;
}

interface AddProps {
    id: string;
}

const Add = ({ id }: AddProps) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
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
    const [isExporting, setIsExporting] = useState(false);

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

    // useEffect(() => {
    //     setData(undefined);
    //     const _setdata = async () => {
    //         rowId && fetchData(rowId);
    //     };

    //     _setdata();
    // }, [rowId]);


    useEffect(() => {
        setData(undefined);
        const _setdata = async () => {
            rowId && fetchData(rowId);
        };

        _setdata();

        const intervalId = setInterval(() => {
            _setdata();
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
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
            subPage('transactionimportsession');
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const downloadFile = async () => {

        setIsExporting(true);

        const _model = getEntityModel('transactionimportsessionimported-file');
        const fetchUrl = _model.read?.url.replace('{sessionId}', rowId) as string;

        try {
            const res = await fetch(fetchUrl, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'text/plain'
                }
            });

            if (!res.ok) {
                throw new Error('خطا در دریافت داده');
            }

            // استخراج نام فایل از header
            const contentDisposition = res.headers.get('content-disposition');

            let fileName = '';// 'export-file.xlsx';

            if (contentDisposition && contentDisposition.includes('filename')) {
                const matches = contentDisposition.match(/filename\*=UTF-8''(.+)|filename="?(.+?)"?($|;)/i);
                fileName = matches?.[1]
                    ? decodeURIComponent(matches[1])
                    : matches?.[2]
                        ? matches[2]
                        : fileName;
            }

            // دریافت blob و دانلود فایل
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            ColoredToast('success', 'فایل با موفقیت دانلود شد');
        } catch (error) {
            console.error('Export error:', error);
            ColoredToast('error', error instanceof Error ? error.message : 'خطا در دریافت فایل');
        } finally {
            setIsExporting(false);
        }
    }

    const resume = async () => {
        setIsLoading(true);
        const _model = await getEntityModel('transactionimportsessionresume');
        const res = await apiFetch(`${_model?.register?.url}?sessionId=${rowId}`, { method: 'post' });

        if (res.ok) {
            setIsLoading(false);
            fetchData(rowId ?? '');
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
            subPage('transactionimportsession');
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
            fetchData(rowId ?? '');
            //subPage('transactionimportsession');
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
            subPage('transactionimportsession');
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
        }
        setIsLoading(false);
    };


    const handleInlineSave = async (rowId: string, values: any): Promise<boolean> => {
        try {
            if (!editModel) {
                const _model = await getEntityModel('rawtransaction');
                setEditModel(_model);

                const res = await apiFetch(`${_model?.update?.url.replace('{id}', rowId ? rowId : '')}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (res.ok) {
                    return true;
                } else {
                    const result = await res?.json();
                    ColoredToast('danger', result?.message || 'خطا در ویرایش');
                    return false;
                }
            } else {
                const res = await apiFetch(`${editModel?.update?.url.replace('{id}', rowId ? rowId : '')}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (res.ok) {
                    return true;
                } else {
                    const result = await res?.json();
                    ColoredToast('danger', result?.message || 'خطا در ویرایش');
                    return false;
                }
            }
        } catch (error) {
            ColoredToast('danger', error?.toString() ?? 'خطا در ذخیره‌سازی');
            return false;
        }
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50 cursor-pointer"
                                //onClick={() => router.back()}>
                                onClick={() => subPage('transactionimportsession', undefined, undefined, [{ key: 'id', value: id.toString() }])}>
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

                            <div className='grid grid-cols-11 p-10 mx-10 items-center justify-items-center'>

                                <div className={`flex flex-col items-center justify-items-center ${getStageStatus(data.status, data.stage, 0)}`}>
                                    <i className="fa-duotone fa-solid fa-circle-check text-3xl" />
                                    <p className='pt-2 text-md'>بارگزاری فایل</p>
                                    {data.stage == 'FileParsing' && <p className={`pt-2 text-xs`}>{data.statusName}</p>}
                                    {data.stage == 'FileParsing' && data.status == 'InProgress' && <p className={`pt-2 text-lg`}>{data.progress} %</p>}
                                </div>

                                <div><i className={`fa-duotone fa-solid fa-angle-left text-3xl text-gray-600`} /></div>

                                <div className={`flex flex-col items-center justify-items-center ${getStageStatus(data.status, data.stage, 1)}`}>
                                    <i className={`fa-duotone fa-solid fa-table text-3xl ${data.stage == 'ReviewAndApproval' ? 'animate-pulse' : ''}`} />
                                    <p className="pt-2 text-lg">تایید اطلاعات</p>
                                    {data.stage == 'ReviewAndApproval' && <p className={`pt-2 text-xs`}>{data.statusName}</p>}
                                    {data.stage == 'ReviewAndApproval' && data.status == 'InProgress' && <p className={`pt-2 text-lg`}>{data.progress} %</p>}
                                </div>

                                <div><i className={`fa-duotone fa-solid fa-angle-left text-3xl text-gray-600`} /></div>

                                <div className={`flex flex-col items-center justify-items-center ${getStageStatus(data.status, data.stage, 2)}`}>
                                    <i className={`fa-duotone fa-solid fa-gear text-3xl ${data.stage == 'Process' ? data.status == 'InProgress' ? 'animate-spin' : 'animate-pulse' : ''}`} />
                                    <p className='pt-2 text-lg'>پردازش</p>
                                    {data.stage == 'Process' && <p className={`pt-2 text-xs`}>{data.statusName}</p>}
                                    {data.stage == 'Process' && data.status == 'InProgress' && <p className={`pt-2 text-lg`}>{data.progress} %</p>}
                                </div>

                                <div><i className={`fa-duotone fa-solid fa-angle-left text-3xl text-gray-600`} /></div>

                                <div className={`flex flex-col items-center justify-items-center ${getStageStatus(data.status, data.stage, 3)}`}>
                                    <i className={`fa-duotone fa-solid fa-bars-sort text-3xl ${data.stage == 'ReviewAndApproval' ? 'animate-pulse' : ''}`} />
                                    <p className='pt-2 text-lg'>مرتب سازی</p>
                                    {data.stage == 'Reorder' && <p className={`pt-2 text-xs`}>{data.statusName}</p>}
                                    {data.stage == 'Reorder' && data.status == 'InProgress' && <p className={`pt-2 text-lg`}>{data.progress} %</p>}
                                </div>

                                <div><i className={`fa-duotone fa-solid fa-angle-left text-3xl text-gray-600`} /></div>

                                <div className={`flex flex-col items-center justify-items-center ${getStageStatus(data.status, data.stage, 4)}`}>
                                    <i className={`fa-duotone fa-solid fa-calculator-simple text-3xl ${data.stage == 'Calculations' ? 'animate-pulse' : ''}`} />
                                    <p className='pt-2 text-lg'>محاسبات</p>
                                    {/* <p className='pt-2 text-lg'>بهای تمام شده</p> */}
                                    {data.stage == 'Calculations' && <p className={`pt-2 text-xs`}>{data.statusName}</p>}
                                    {data.stage == 'Calculations' && data.status == 'InProgress' && <p className={`pt-2 text-lg`}>{data.progress} %</p>}
                                </div>

                                <div><i className={`fa-duotone fa-solid fa-angle-left text-3xl text-gray-600`} /></div>

                                <div className={`flex flex-col items-center justify-items-center ${getStageStatus(data.status, data.stage, 5)}`}>
                                    <i className={`fa-duotone fa-solid fa-sparkles text-3xl ${data.stage == 'Finalized' ? 'animate-pulse' : ''}`} />
                                    <p className='pt-2 text-lg '>پایان</p>
                                    {data.stage == 'Finalized' && <p className={`pt-2 text-xs`}>{data.statusName}</p>}
                                </div>

                            </div>

                            <div className='text-blue-600 p-2 mx-10'>اطلاعات فایل آپلود شده دارید</div>
                            <div className='rounded-lg border bg-blue-100 border-blue-400 p-4 mx-10'>

                                <div className="grid grid-cols-2 justify-between">
                                    <div className="grid grid-cols-1 justify-between">
                                        <div className="grid grid-cols-1 justify-between pb-3">
                                            <div className="flex justify-between">
                                                <div className="flex text-sm">
                                                    <p className='text-gray-500'>شماره جلسه :</p>
                                                    <p className='pr-1'>{data.number}</p>
                                                </div>
                                                <div className="flex text-sm">
                                                    <p className='text-gray-500'>از تاریخ :</p>
                                                    <p className='pr-1'>{data.rawDataFromDate}</p>
                                                </div>
                                                <div className="flex text-sm">
                                                    <p className='text-gray-500'>تا تاریخ :</p>
                                                    <p className='pr-1'>{data.rawDataToDate}</p>
                                                </div>
                                                <div className="flex text-sm">
                                                    <p className='text-gray-500'>تعداد تراکنش :</p>
                                                    <p className='pr-1'>{data.transactionsCount}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 justify-between">
                                            <div className="flex justify-between">
                                                <div className="flex text-sm">
                                                    <p className='text-gray-500'>نام فایل :</p>
                                                    <p className='pr-1'>{data.fileName}</p>
                                                </div>
                                                <div className="flex text-sm">
                                                    <p className='text-gray-500'>نوع داده ورودی :</p>
                                                    <p className='pr-1'>{data.sourceTypeName}</p>
                                                </div>
                                                <div className="flex text-sm">
                                                    <p className='text-gray-500'>حجم :</p>
                                                    <p className='pr-1'>{FormatBytes(data.fileSize, 1)}</p>
                                                </div>
                                                <div className="flex text-sm">
                                                    <p className='text-gray-500'>زمان شروع :</p>
                                                    <p className='pr-1'>{data.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <button type="button" onClick={downloadFile} className="p-2 text-blue-500 w-52 flex justify-center disabled:text-gray-300" disabled={isExporting}>
                                            <i className={`fa-duotone fa-solid fa-cloud-download text-2xl`} />
                                            <p className='pr-3'>دانلود فایل</p>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {(data.status == 'PendingUserAction' && data.stage == 'ReviewAndApproval') && (
                                <div className='rounded-lg border bg-green-100 border-green-400 p-4 mx-10 mt-5 text-green-500 flex'>
                                    <div className='flex items-center'>
                                        <i className="fa-duotone fa-solid fa-circle-check text-3xl" />

                                    </div>
                                    <div className='flex flex-col pr-3'>
                                        <p className='pt-2 text-xl'>تبریک</p>
                                        <p className='pt-2 text-md'>اطلاعات فایل صحیح است</p>
                                    </div>

                                </div>
                            )}

                            {data.stage == 'Finalized' && data.canBeResumed && (
                                <div className="rounded-lg border bg-orange-100 border-orange-400 p-4 mx-10 mt-5">
                                    <div className="items-center justify-center">
                                        <div className='grid grid-cols-2'>
                                            <div>
                                                <div className="flex items-center text-md text-orange-600 text-right">
                                                    <i className={`fa-duotone fa-solid fa-exclamation-triangle text-3xl text-yellow-500`} />
                                                    <p className='pr-2'>موفق همراه با خطا</p>
                                                </div>
                                                <div className="flex items-center text-md text-orange-600 text-right pt-3">
                                                    <i className={`fa-duotone fa-solid fa-exclamation-triangle text-lg text-red-500`} />
                                                    <div className="items-center justify-center text-sm text-orange-800 text-right pr-2">{data.stopMessage}</div>
                                                </div>

                                            </div>
                                            <div className="flex items-center justify-end">
                                                <button type="button" onClick={resume} className="border-2 border-blue-500 p-2 text-blue-500 w-52">
                                                    تلاش مجدد
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            }

                            {data.hasException && !data.canBeResumed && (<div className="rounded-lg border bg-orange-100 border-orange-400 p-4 mx-10 mt-5">
                                <div className="items-center justify-center">
                                    <div className='grid grid-cols-2'>
                                        <div>
                                            <div className="items-center justify-center text-xl text-orange-800 text-right">توجه</div>
                                            <div className="items-center justify-center text-xl text-orange-800 text-right">فایل آپلود شده دارای خطا است</div>
                                        </div>
                                        <div className="flex items-center justify-end">
                                            {/* <button type="button" onClick={() => { }} disabled={false} className="ml-2 rounded-lg px-4 py-2 text-red-600 hover:border-red-600 hover:border disabled:opacity-50 disabled:cursor-not-allowed">
                                                انصراف و حذف فایل
                                            </button> */}
                                            {data.stage == 'ReviewAndApproval' &&
                                                (data.status == 'Failed' || data.status == 'PendingUserAction') &&
                                                <>
                                                    <button type="button" onClick={() => setIsRejectModalOpen(true)} className="ml-2 rounded-lg px-4 py-2 text-red-600 hover:border-red-600 hover:border-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                        انصراف و حذف فایل
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
                                                                                <button type="button" onClick={() => setIsRejectModalOpen(false)} className="ml-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600" disabled={isLoading}>
                                                                                    انصراف
                                                                                </button>
                                                                                <button type="button" onClick={() => reject()} className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600" disabled={isLoading}>
                                                                                    {isLoading ? (
                                                                                        <i className="fa-duotone fa-solid fa-spinner fa-spin text-xl" />
                                                                                    ) : (
                                                                                        'لغو'
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        </Dialog.Panel>
                                                                    </Transition.Child>
                                                                </div>
                                                            </div>
                                                        </Dialog>
                                                    </Transition>
                                                </>
                                            }
                                        </div>
                                    </div>


                                    <div className="grid">
                                        {/* <i className={`fa-duotone fa-solid fa-close text-xl m-1 pl-5 text-gray-500`} onClick={() => setUploadedFiles([])} /> */}
                                        <div className='rounded-lg border bg-orange-100 border-orange-400 p-6 mt-4'>

                                            <div className="grid grid-cols-1 justify-between">
                                                <div className="flex justify-between">
                                                    <div className="flex flex-col text-sm w-full">
                                                        {data.unknownSymbols && (
                                                            <div className="flex w-full py-2">
                                                                <div className="text-red-950">نماد های نامشخص :</div>
                                                                <div className="pr-5 text-red-800">{data.unknownSymbols}</div>
                                                            </div>
                                                        )}
                                                        {data.unknownBrokers && (
                                                            <div className="flex w-full py-2">
                                                                <div className="text-red-950">کارگزار های نامشخص :</div>
                                                                <div className="pr-5 text-red-800">{data.unknownBrokers}</div>
                                                            </div>
                                                        )}
                                                        {data.unknownTradingCodes && (
                                                            <div className="flex w-full py-2">
                                                                <div className="text-red-950">نماد های نامشخص :</div>
                                                                <div className="pr-5 text-red-800">{data.unknownTradingCodes}</div>
                                                            </div>
                                                        )}
                                                        {data.exceptionMessages && (
                                                            <div className="flex w-full py-2">
                                                                <div className="text-red-950">خطا:</div>
                                                                <div className="pr-5 text-red-800 w-full">{
                                                                    data.exceptionMessages.split("|").map((item, index) => (
                                                                        <div key={index}>{item}</div>
                                                                    ))
                                                                }</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {data.status == 'Failed' && data.stage == 'ReviewAndApproval' && (
                                                        <div className="flex text-sm">
                                                            <div className="flex flex-col text-lg w-full">
                                                                {(!modelData) && (
                                                                    <button type="button" onClick={handlGetData} className="btn border-2 border-blue-500 p-2 text-blue-500 text-lg w-52">
                                                                        مشاهده و ادامه
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>)
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            (data.status == 'Failed' && data.stage == 'ReviewAndApproval') && modelData && (
                                                <div className='grid grid-cols-1 border bg-orange-100 border-orange-400 mt-4'>


                                                    <div className="space-y-2 font-iranyekan">

                                                        <div className="table-responsive">
                                                            {modelData && rowId && (
                                                                < Demo
                                                                    isShowSearchForm={false}
                                                                    model={modelData}
                                                                    isShowHideCol={true}
                                                                    hideColList={['id', 'companyId', 'date', 'status', 'stage', 'fileType', 'progress', 'importedFileId', 'isEdited', 'hasException']}
                                                                    addSepratorFildes={['volume']}
                                                                    addFooterSumFildes={['volume']}
                                                                    labaleNameList={[
                                                                        { label: 'Keyword', value: 'نام سهام' },
                                                                        { label: 'name', value: 'نام سهام' },
                                                                        { label: 'type', value: 'نوع عملیات' },
                                                                    ]}
                                                                    staticParams={[{ name: 'SessionId', value: rowId! }]}
                                                                    isEditable={false}
                                                                    // isEditable={() => {data.stage == 'ReviewAndApproval' && data.status == 'PendingUserAction'}                                                                    }
                                                                    isDeleteable={false}
                                                                    enableInlineEditing={true}
                                                                    editableColumns={['name', 'description', 'price', 'quantity']}
                                                                    onInlineSave={handleInlineSave}
                                                                    mantineTableBodyRowBackgroundColor={'#fdba74'}
                                                                    mantineTableBodyRowBackgroundColorChangeByField={'isEdited'}
                                                                    headerAction={<></>}
                                                                />
                                                            )}
                                                        </div>

                                                    </div>

                                                </div>
                                            )
                                        }

                                        {
                                            //(data.status == 'CompletedWithErrors' && data.stage == 'Finalized') 
                                            (data.status == 'Failed' && data.stage == 'ReviewAndApproval')
                                            && (
                                                <div className="flex flex-col items-end text-lg w-full mt-5">
                                                    <button type="button" className="border-2 border-blue-500 p-2 text-blue-500 w-52" onClick={() => setIsRecheckModalOpen(true)}>
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
                                                                                <button type="button" onClick={() => setIsRecheckModalOpen(false)} className="ml-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600" disabled={isLoading}>
                                                                                    انصراف
                                                                                </button>
                                                                                <button type="button" onClick={() => recheck()} className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600" disabled={isLoading}>
                                                                                    {isLoading ? (
                                                                                        <i className="fa-duotone fa-solid fa-spinner fa-spin text-xl" />
                                                                                    ) : (
                                                                                        'بررسی مجدد'
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        </Dialog.Panel>
                                                                    </Transition.Child>
                                                                </div>
                                                            </div>
                                                        </Dialog>
                                                    </Transition>
                                                </div>
                                            )}
                                    </div>

                                </div>
                            </div>)}


                            {
                                ((data.status !== 'Failed' && data.stage == 'ReviewAndApproval') || data.stage == 'Finalized') && (
                                    <div className="flex w-full">
                                        <div className="w-full">
                                            <div className="px-5">
                                                <button
                                                    type="button"
                                                    className={`flex items-center p-4 font-iranyekan text-blue-600`}
                                                    onClick={() => {
                                                        handlGetData();
                                                        togglePara2('1');
                                                    }}
                                                >
                                                    <div className={`ml-2 ${active2 === '1' ? '' : ''}`}>
                                                        <i className={`fa-duotone fa-solid text-xl text-blue-600 ${active2 === '1' ? 'fa-angle-up' : 'fa-angle-down'}`} />
                                                    </div>
                                                    اطلاعات بارگزاری شده (پردازش نشده){' '}

                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active2 === '' ? 'auto' : 0}>
                                                        <div className="table-responsive px-5">
                                                            {modelData && rowId && (
                                                                < Demo
                                                                    isShowSearchForm={false}
                                                                    model={modelData}
                                                                    isShowHideCol={true}
                                                                    hideColList={['id', 'companyId', 'date', 'status', 'stage', 'fileType', 'progress', 'importedFileId', 'isEdited', 'hasException']}
                                                                    addSepratorFildes={['volume']}
                                                                    addFooterSumFildes={['volume']}
                                                                    labaleNameList={[
                                                                        { label: 'Keyword', value: 'نام سهام' },
                                                                        { label: 'name', value: 'نام سهام' },
                                                                        { label: 'type', value: 'نوع عملیات' },
                                                                    ]}
                                                                    staticParams={[{ name: 'SessionId', value: rowId! }]}
                                                                    isEditable={false}
                                                                    // isEditable={(data.status !== 'Failed' && data.stage == 'ReviewAndApproval')}
                                                                    // isEditable={() => {data.stage == 'ReviewAndApproval' && data.status == 'PendingUserAction'}}
                                                                    isDeleteable={false}
                                                                    enableInlineEditing={false}
                                                                    editableColumns={['name', 'description', 'price', 'quantity']}
                                                                    onInlineSave={handleInlineSave}
                                                                    mantineTableBodyRowBackgroundColor={'#fdba74'}
                                                                    mantineTableBodyRowBackgroundColorChangeByField={'isEdited'}
                                                                    headerAction={<></>}
                                                                />
                                                            )}
                                                        </div>
                                                    </AnimateHeight>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            <div className="flex w-full gap-2 px-10 py-5 items-end justify-end">


                                {(data.status == 'PendingUserAction' && data.stage == 'ReviewAndApproval') && (
                                    <button type="button"
                                        // onClick={() => subPage('transactionimportsession', undefined, undefined, [{ key: 'id', value: id.toString() }])}
                                        onClick={() => reject()}
                                        className="ml-2 rounded-lg px-4 py-2 text-red-600 hover:border-red-600 hover:border-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        انصراف
                                    </button>


                                )}


                                {(data.status == 'PendingUserAction' && data.stage == 'ReviewAndApproval') && (
                                    <>
                                        <button type="button" className="rounded-lg bg-blue-100 text-blue-600 border-2 border-blue-600 w-32 px-5" onClick={() => setIsApproveModalOpen(true)}>
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
                                                                    <button type="button" onClick={() => setIsApproveModalOpen(false)} className="ml-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600" disabled={isLoading}>
                                                                        انصراف
                                                                    </button>
                                                                    <button type="button" onClick={() => approve()} className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600" disabled={isLoading}>
                                                                        {isLoading ? (
                                                                            <i className="fa-duotone fa-solid fa-spinner fa-spin text-xl" />
                                                                        ) : (
                                                                            'ثبت نهایی'
                                                                        )}
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
                        </div >
                    </div >
                )}
            </div >
        </div >
    );
};

export default Add;
