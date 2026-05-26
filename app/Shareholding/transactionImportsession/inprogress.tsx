'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Box, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import FileUploadModal from '@/app/components/Forms/uploadFile';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import FormatBytes from '@/app/components/inputs/fileSize';
import getStageStatus from '@/app/components/getStageStatus';

interface ICompany {
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

const Inprogress = () => {
    const subPage = useSubPage();
    const [modelDataInProg, setModelDataInProg] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [isOK, setIsOK] = useState(false);
    const [initialRecords, setInitialRecords] = useState({ number: 1, numberOfElements: 10, size: 10, totalPages: 1, totalCount: 10, items: [] as ICompany[] });

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!modelDataInProg?.list?.url) return;
                const response = await fetch(modelDataInProg.list.url + '?companyId=' + companyId);
                if (!response.ok) {
                    throw new Error('خطا در دریافت داده');
                }
                const result = await response.json();
                setInitialRecords(result);
            } catch (error) {
                console.error((error as Error).message);
            }
        };

        const _setdata = async () => {
            await fetchData();
        };

        _setdata();

        const intervalId = setInterval(() => {
            _setdata();
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [modelDataInProg, companyId]);

    useEffect(() => {
        const setdata = async () => {
            const _modelInProg = await getEntityModel('transactionimportsessioninprogress');
            setModelDataInProg(_modelInProg);
        };

        setdata();
    }, []);



    return (
        <>
            {/* {initialRecords?.items.length < 1 && (
                <div className="items-center justify-between">
                    <FileUploadModal />
                </div>
            )} */}
            <div className="table-responsive w-full">
                <div className="relative">
                    {(initialRecords?.items?.length < 1 || isOK) ? (
                        <div className="items-center justify-between">
                            <FileUploadModal />
                        </div>
                    ) : (
                        <>
                            {
                                (initialRecords?.items[0].status == 'Failed' || initialRecords?.items[0].status == 'Canceled') &&
                                initialRecords?.items[0].stage !== 'ReviewAndApproval' &&
                                !isOK &&

                                <div className="rounded-lg border bg-orange-100 border-red-500 text-red-500 p-4 mt-5">
                                    <div className="grid grid-cols-2 items-center justify-center">
                                        <div>
                                            <div className="flex items-center text-lg text-right">
                                                <i className={`fa-duotone fa-solid fa-exclamation-triangle text-3xl`} />
                                                <p className='pr-2'>فایل شما پردازش نشد</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-2">
                                            <button type="button"
                                                onClick={() => subPage('transactionimportsession', 'view', undefined, [{ key: 'id', value: initialRecords?.items[0]['id'] }])}
                                                className="p-2 text-gray-400 w-52 hover:text-gray-800">
                                                مشاهده جزئیات
                                            </button>
                                            <button type="button" onClick={() => { setIsOK(true) }} className="border-2 border-red-500 p-2 text-red-500 w-52">
                                                متوجه شدم
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                initialRecords?.items[0].status !== 'InProgress' &&
                                initialRecords?.items[0].stage == 'ReviewAndApproval' &&

                                <div className="rounded-lg border bg-orange-100 border-orange-400 p-6 text-center">
                                    <div className="items-center justify-center">
                                        <div className='grid grid-cols-2'>
                                            <div>
                                                <div className="items-center justify-center text-xl text-orange-800 text-right">توجه</div>
                                                <div className="items-center justify-center text-xl text-orange-800 text-right">شما یک فایل آپلود شده دارید</div>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <button type="button" onClick={() => { }} disabled={false} className="ml-2 rounded-lg px-4 py-2 text-red-600 hover:border-red-600 hover:border disabled:opacity-50 disabled:cursor-not-allowed">
                                                    انصراف و حذف فایل
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2">
                                            {/* <i className={`fa-duotone fa-solid fa-close text-xl m-1 pl-5 text-gray-500`} onClick={() => setUploadedFiles([])} /> */}
                                            <div className='rounded-lg border bg-orange-100 border-orange-400 p-6 mt-4'>
                                                {initialRecords?.items?.map((item: any, index) => (
                                                    <>
                                                        <div key={index} className="grid grid-cols-1 justify-between">
                                                            <div className="flex justify-between">
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>نام فایل :</p>
                                                                    <p className='pr-1'>{item.fileName}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>نوع داده ورودی :</p>
                                                                    <p className='pr-1'>{item.sourceTypeName}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>حجم :</p>
                                                                    <p className='pr-1'>{FormatBytes(item.fileSize, 1)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div key={index} className="grid grid-cols-1 justify-between pt-5">
                                                            <div className="flex justify-between">
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>تعداد تراکنش ها :</p>
                                                                    <p className='pr-1'>{item.transactionsCount}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    {/* <p className='text-gray-500'>نوع داده ورودی :</p>
                                                                    <p className='pr-1'>{item.sourceTypeName}</p> */}
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    {/* <p className='text-gray-500'>حجم :</p>
                                                                    <p className='pr-1'>{FormatBytes(item.fileSize, 1)}</p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div key={index} className="flex justify-between pt-5">
                                                            <div className={`flex flex-col items-center justify-items-center ${getStageStatus(item.status, item.stage, 2)}`}>
                                                                {item.status == 'InProgress' && <div className='items-center justify-items-center'>
                                                                    <i className={`fa-duotone fa-solid fa-gear text-3xl animate-spin`} />
                                                                    <p className='pt-2 text-lg'>پردازش</p>
                                                                    <p className={`pt-2 text-xs`}>{item.statusName}</p>
                                                                    <p className={`pt-2 text-lg`}>{item.progress} %</p>
                                                                </div>}
                                                            </div>

                                                            <div className="grid justify-end mt-5">
                                                                <button type="button"
                                                                    onClick={() => subPage('transactionimportsession', 'view', undefined, [{ key: 'id', value: item['id'] }])}
                                                                    className="btn border-2 border-blue-500 p-2 text-blue-500 text-lg w-52">
                                                                    مشاهده و ادامه
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                initialRecords?.items[0].status == 'Completed' &&
                                initialRecords?.items[0].stage == 'Finalized' &&
                                !isOK &&

                                <div className="rounded-lg border bg-green-100 border-green-500 p-6 text-center">
                                    <div className="items-center justify-center">
                                        <div className='grid grid-cols-2'>
                                            <div className='flex text-green-500'>
                                                <i className="fa-duotone fa-solid fa-circle-check text-3xl" />
                                                <div className="items-center justify-center text-xl text-right pr-3">فایل شما با موفقیت پردازش شد</div>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <button type="button" onClick={() => { setIsOK(true) }} disabled={false} className="ml-2 px-16 rounded-lg py-2 text-green-500 border-green-500 border disabled:opacity-50 disabled:cursor-not-allowed">
                                                    متوجه شدم
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2">
                                            {/* <i className={`fa-duotone fa-solid fa-close text-xl m-1 pl-5 text-gray-500`} onClick={() => setUploadedFiles([])} /> */}
                                            <div className='rounded-lg border bg-green-100 border-green-500 p-6 mt-1'>
                                                {initialRecords?.items?.map((item: any, index) => (
                                                    <>
                                                        <div key={index} className="grid grid-cols-1 justify-between">
                                                            <div className="flex justify-between">
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>نام فایل :</p>
                                                                    <p className='pr-1'>{item.fileName}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>نوع داده ورودی :</p>
                                                                    <p className='pr-1'>{item.sourceTypeName}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>حجم :</p>
                                                                    <p className='pr-1'>{FormatBytes(item.fileSize, 1)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div key={index} className="grid grid-cols-1 justify-between pt-5">
                                                            <div className="flex justify-between">
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>تعداد تراکنش ها :</p>
                                                                    <p className='pr-1'>{item.transactionsCount}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    {/* <p className='text-gray-500'>نوع داده ورودی :</p>
                                                                    <p className='pr-1'>{item.sourceTypeName}</p> */}
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    {/* <p className='text-gray-500'>حجم :</p>
                                                                    <p className='pr-1'>{FormatBytes(item.fileSize, 1)}</p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div key={index} className="flex justify-between pt-1">
                                                            <div className="flex w-full justify-end">
                                                                <button type="button"
                                                                    onClick={() => subPage('transactionimportsession', 'view', undefined, [{ key: 'id', value: initialRecords?.items[0]['id'] }])}
                                                                    className="p-2 text-gray-400 w-52 hover:text-gray-800">
                                                                    مشاهده جزئیات
                                                                </button>
                                                                <button type="button"
                                                                    onClick={() => subPage('transactionimportsession', 'transaction', undefined, [{ key: 'id', value: item.id.toString() }])}
                                                                    className="btn border-2 border-blue-500 p-2 text-blue-500 text-lg w-52">
                                                                    مشاهده تراکنش ها
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            }

                            {
                                initialRecords?.items[0].status == 'CompletedWithErrors' &&
                                initialRecords?.items[0].stage == 'Finalized' &&
                                !isOK &&

                                <div className="rounded-lg border bg-orange-100 border-orange-500 text-orange-500 p-6 text-center">
                                    <div className="items-center justify-center">
                                        <div className='grid grid-cols-2'>
                                            <div>
                                                <div className="items-center justify-center text-xl text-right">توجه</div>
                                                <div className="items-center justify-center text-xl text-right">فایل شما با موفقیت پردازش شد (همراه با خطا)</div>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <button type="button" onClick={() => { setIsOK(true) }} disabled={false} className="ml-2 px-16 rounded-lg py-2 text-green-500 border-green-500 border disabled:opacity-50 disabled:cursor-not-allowed">
                                                    متوجه شدم
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2">
                                            {/* <i className={`fa-duotone fa-solid fa-close text-xl m-1 pl-5 text-gray-500`} onClick={() => setUploadedFiles([])} /> */}
                                            <div className='rounded-lg border bg-orange-100 border-orange-400 text-gray-500 p-6 mt-4'>
                                                {initialRecords?.items?.map((item: any, index) => (
                                                    <>
                                                        <div key={index} className="grid grid-cols-1 justify-between">
                                                            <div className="flex justify-between">
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>نام فایل :</p>
                                                                    <p className='pr-1'>{item.fileName}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>نوع داده ورودی :</p>
                                                                    <p className='pr-1'>{item.sourceTypeName}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>حجم :</p>
                                                                    <p className='pr-1'>{FormatBytes(item.fileSize, 1)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div key={index} className="grid grid-cols-1 justify-between pt-5">
                                                            <div className="flex justify-between">
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>تعداد تراکنش ها :</p>
                                                                    <p className='pr-1'>{item.transactionsCount}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    {/* <p className='text-gray-500'>نوع داده ورودی :</p>
                                                                    <p className='pr-1'>{item.sourceTypeName}</p> */}
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    {/* <p className='text-gray-500'>حجم :</p>
                                                                    <p className='pr-1'>{FormatBytes(item.fileSize, 1)}</p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div key={index} className="flex justify-between pt-1">
                                                            <div className="grid w-full justify-end">
                                                                <button type="button"
                                                                    onClick={() => subPage('transactionimportsession', 'view', undefined, [{ key: 'id', value: item['id'] }])}
                                                                    className="btn border-2 border-blue-500 p-2 text-blue-500 text-lg w-52">
                                                                    مشاهده و ادامه
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                initialRecords?.items[0].status == 'InProgress' &&


                                <div className="rounded-lg border bg-blue-100 border-blue-500 text-blue-500 p-6 text-center">
                                    <div className="items-center justify-center">
                                        <div className='grid grid-cols-2'>
                                            <div>
                                                <div className="items-center justify-center text-xl text-right">توجه</div>
                                                <div className="items-center justify-center text-xl text-right">شما یک فایل اپلود شده دارید</div>
                                            </div>
                                            <div className="flex items-center justify-end">

                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2">
                                            {/* <i className={`fa-duotone fa-solid fa-close text-xl m-1 pl-5 text-gray-500`} onClick={() => setUploadedFiles([])} /> */}
                                            <div className='rounded-lg border bg-blue-100 border-blue-400 text-gray-500 p-6 mt-4'>
                                                {initialRecords?.items?.map((item: any, index) => (
                                                    <>
                                                        <div key={index} className="grid grid-cols-1 justify-between">
                                                            <div className="flex justify-between">
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>نام فایل :</p>
                                                                    <p className='pr-1'>{item.fileName}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>نوع داده ورودی :</p>
                                                                    <p className='pr-1'>{item.sourceTypeName}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>حجم :</p>
                                                                    <p className='pr-1'>{FormatBytes(item.fileSize, 1)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div key={index} className="grid grid-cols-1 justify-between pt-5">
                                                            <div className="flex justify-between">
                                                                <div className="flex text-sm">
                                                                    <p className='text-gray-500'>تعداد تراکنش ها :</p>
                                                                    <p className='pr-1'>{item.transactionsCount}</p>
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    {/* <p className='text-gray-500'>نوع داده ورودی :</p>
                                                                    <p className='pr-1'>{item.sourceTypeName}</p> */}
                                                                </div>
                                                                <div className="flex text-sm">
                                                                    {/* <p className='text-gray-500'>حجم :</p>
                                                                    <p className='pr-1'>{FormatBytes(item.fileSize, 1)}</p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div key={index} className="flex justify-between pt-5">
                                                            <div className={`flex flex-col items-center justify-items-center ${getStageStatus(item.status, item.stage, 2)}`}>
                                                                {item.status == 'InProgress' && <div className='flex items-center justify-items-center'>
                                                                    <i className={`fa-duotone fa-solid fa-gear text-3xl animate-spin`} />
                                                                    <div className='flex pr-5 items-center justify-items-center'>
                                                                        <p className='text-lg pl-5'>{item.stageName} {item.progress} %</p>
                                                                        <p className={`text-xs`}>({item.statusName})</p>
                                                                    </div>
                                                                </div>}
                                                            </div>

                                                            <div className="grid justify-end mt-5">
                                                                <button type="button"
                                                                    onClick={() => subPage('transactionimportsession', 'view', undefined, [{ key: 'id', value: item['id'] }])}
                                                                    className="btn border-2 border-blue-500 p-2 text-blue-500 text-lg w-52">
                                                                    مشاهده و ادامه
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            }

                            {/* <table className="border-collapse border border-gray-400 w-full">
                                <thead>
                                    <tr className='bg-gray-200'>
                                        <th className="border border-gray-300 p-2">شماره</th>
                                        <th className="border border-gray-300 p-2">زمان شروع</th>
                                        <th className="border border-gray-300 p-2">نوع فایل</th>
                                        <th className="border border-gray-300 p-2">تعداد تراکنش</th>
                                        <th className="border border-gray-300 p-2">وضعیت</th>
                                        <th className="border border-gray-300 p-2">درصد پیشرفت</th>
                                        <th className="border border-gray-300 p-2">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {initialRecords?.items?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="border border-gray-300 p-2">{item['number']}</td>
                                                <td className="border border-gray-300 p-2">{item['dateAndTime']}</td>
                                                <td className="border border-gray-300 p-2">{item['fileTypeName']}</td>
                                                <td className="border border-gray-300 p-2">{item['transactionsCount']}</td>
                                                <td className="border border-gray-300 p-2">{item['statusName']}</td>
                                                <td className="border border-gray-300 p-2">
                                                    <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                                        <div className="h-2.5 rounded-full bg-green-500" style={{ width: `${item['progress']}%` }}></div>
                                                        <div className="flex w-full items-center justify-center">{`${item['progress']}%`}</div>
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <Box className="flex">
                                                        <Tooltip label="نمایش اطلاعات">
                                                            <ActionIcon
                                                                //onClick={() => router.push(`transactionImportsession/${item['id']}`)}
                                                                onClick={() => subPage('transactionimportsession', 'view', undefined, [{ key: 'id', value: item['id'] }])}
                                                                variant="transparent"
                                                                //className="btn btn-outline mr-3 flex items-center rounded-xl bg-blue-50 px-2 font-iranyekan text-blue-600 hover:bg-blue-100">
                                                                className="mr-3 flex items-center rounded-xl w-9 h-9 p-0">
                                                                <i className="fa-duotone fa-solid fa-eye text-lg" />
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    </Box>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table> */}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Inprogress;
