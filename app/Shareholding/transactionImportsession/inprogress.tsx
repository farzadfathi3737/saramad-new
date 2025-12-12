'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { Box, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import FileUploadModal from '@/app/components/Forms/uploadFile';

const Inprogress = () => {
    const [modelDataInProg, setModelDataInProg] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const router = useRouter();
    const [initialRecords, setInitialRecords] = useState({ number: 1, numberOfElements: 10, size: 10, totalPages: 1, totalCount: 10, items: [] });

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
            {initialRecords?.items.length < 1 && (
                <div className="mb-5 flex h-12 items-center justify-between">
                    <FileUploadModal />
                </div>
            )}
            <div className="table-responsive w-full">
                <div className="relative">
                    {initialRecords?.items?.length < 1 ? (
                        <div className="flex w-full items-center justify-center rounded-md border-2 border-solid border-gray-200 bg-gray-50 p-5">فایلی در حال پردازش نمی باشد ...</div>
                    ) : (
                        <table className="border-collapse border border-gray-400">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300">شماره</th>
                                    <th className="border border-gray-300">زمان شروع</th>
                                    <th className="border border-gray-300">نوع فایل</th>
                                    <th className="border border-gray-300">تعداد تراکنش</th>
                                    <th className="border border-gray-300">وضعیت</th>
                                    <th className="border border-gray-300">درصد پیشرفت</th>
                                    <th className="border border-gray-300">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialRecords?.items?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="border border-gray-300">{item['number']}</td>
                                            <td className="border border-gray-300">{item['dateAndTime']}</td>
                                            <td className="border border-gray-300">{item['fileTypeName']}</td>
                                            <td className="border border-gray-300">{item['transactionsCount']}</td>
                                            <td className="border border-gray-300">{item['statusName']}</td>
                                            <td className="border border-gray-300">
                                                <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <div className="h-2.5 rounded-full bg-green-500" style={{ width: `${item['progress']}%` }}></div>
                                                    <div className="flex w-full items-center justify-center">{`${item['progress']}%`}</div>
                                                </div>
                                            </td>
                                            <td className="border border-gray-300">
                                                <Box className="flex">
                                                    <Tooltip label="نمایش اطلاعات">
                                                        <button
                                                            type="button"
                                                            onClick={() => router.push(`transactionImportsession/${item['id']}`)}
                                                            className="btn btn-outline mr-3 flex items-center rounded-xl bg-blue-50 px-2 font-iranyekan text-blue-600 hover:bg-blue-100"
                                                        >
                                                            <i className="fa-duotone fa-solid fa-eye text-lg" />
                                                        </button>
                                                    </Tooltip>
                                                </Box>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default Inprogress;
