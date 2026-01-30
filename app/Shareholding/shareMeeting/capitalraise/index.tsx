'use client'

import { getEntityModel } from '@/models/entity';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '@/app/components/Datatable/MRT';
//import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { IDataModel, IFieldsTable } from '@/interface/dataModel';
import Link from 'next/link';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import AnimateHeight from 'react-animate-height';

const Capitalraise = ({ meetingId }: { meetingId?: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();
    const [modelData2, setModelData2] = useState<IDataModel>();
    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    const [rowId, setRowId] = useState<string>();

    const router = useRouter();

    const [active, setActive] = useState<boolean>(true);
    const togglePara = (value: boolean) => {
        setActive((oldValue) => {
            return oldValue === value ? false : value;
        });
    };

    useEffect(() => {
        const setdata = async () => {

            const _model = await getEntityModel('sharemeetingcapitalraise');
            const _model2 = await getEntityModel('sharemeetingcapitalraisedetails');

            setModelData(_model);
            setModelData2(_model2);

            setRowId(meetingId || undefined);
        };
        setdata();
    }, [meetingId]);

    useEffect(() => {
        const setdata = async () => {
            rowId && fetchData(rowId);
        };

        setdata();
    }, [rowId]);

    const fetchData = async (id: string) => {
        setIsLoading(true);

        const res = await fetch(`${modelData2?.list?.url}?MeetingId=${id}`);

        if (res.ok) {
            const result: any = await res?.json();
            setData(result);
            console.log(result);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };


    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('sharemeeting')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        افزایش سرمایه
                    </div>
                </div>

                <div className=" space-y-2 font-iranyekan">
                    <div className="border-[#d3d3d3] dark:border-[#1b2e4b]">
                        <button
                            type="button"
                            className={`space-y-cc flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active ? '!#089bab' : '#089bab'}`}
                            onClick={() => togglePara(true)}
                        >
                            <div className="px-5 flex">
                                <div className='pl-10'>اطلاعات افزایش سرمایه</div>
                            </div>
                        </button>
                        <div>
                            <AnimateHeight duration={300} height={active ? 'auto' : 0}>
                                <div className="p-5">
                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                        <div className='rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white'>
                                            <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 px-4'>
                                                <h3 className='font-semibold text-base'>درصد افزایش سرمایه</h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-gray-50">
                                                            <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-200">سرمایه قدیم<br /><span className="text-[10px] text-gray-500">(میلیون ریال)</span></th>
                                                            <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-200">سرمایه جدید<br /><span className="text-[10px] text-gray-500">(میلیون ریال)</span></th>
                                                            <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-200">درصد کل</th>
                                                            <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-200">آورده نقدی<br /><span className="text-[10px] text-gray-500">(حق تقدم)</span></th>
                                                            <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-200">اندوخته‌ها<br /><span className="text-[10px] text-gray-500">(سهام جایزه)</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="hover:bg-blue-50 transition-colors">
                                                            <td className='px-3 py-3 text-sm text-center border-b border-gray-100 font-medium text-gray-800'>{data?.previousShares?.toLocaleString('fa-IR') || '-'}</td>
                                                            <td className='px-3 py-3 text-sm text-center border-b border-gray-100 font-medium text-gray-800'>{data?.newShares?.toLocaleString('fa-IR') || '-'}</td>
                                                            <td className='px-3 py-3 text-sm text-center border-b border-gray-100 font-semibold text-blue-600'>{data?.totalPercentage || '-'}%</td>
                                                            <td className='px-3 py-3 text-sm text-center border-b border-gray-100 font-semibold text-green-600'>{data?.cashPercentage || '-'}%</td>
                                                            <td className='px-3 py-3 text-sm text-center border-b border-gray-100 font-semibold text-amber-600'>{data?.reservesPercentage || '-'}%</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className='rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white'>
                                            <div className='bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-center py-3 px-4'>
                                                <h3 className='font-semibold text-base'>محل تأمین افزایش سرمایه</h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-gray-50">
                                                            <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-200">مطالبات و<br />آورده نقدی</th>
                                                            <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-200">سود انباشته<br /><span className="text-[10px] text-gray-500">(میلیون ریال)</span></th>
                                                            <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-200">اندوخته<br /><span className="text-[10px] text-gray-500">(میلیون ریال)</span></th>
                                                            <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-200">تجدید ارزیابی<br /><span className="text-[10px] text-gray-500">(میلیون ریال)</span></th>
                                                            <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-200">صرف سهام<br /><span className="text-[10px] text-gray-500">(میلیون ریال)</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="hover:bg-emerald-50 transition-colors">
                                                            <td className='px-3 py-3 text-sm text-center border-b border-gray-100 font-medium text-gray-800'>{data?.shareholderCash?.toLocaleString('fa-IR') || '-'}</td>
                                                            <td className='px-3 py-3 text-sm text-center border-b border-gray-100 font-medium text-gray-800'>{data?.retainedEarnings?.toLocaleString('fa-IR') || '-'}</td>
                                                            <td className='px-3 py-3 text-sm text-center border-b border-gray-100 font-medium text-gray-800'>{data?.expansionReserve?.toLocaleString('fa-IR') || '-'}</td>
                                                            <td className='px-3 py-3 text-sm text-center border-b border-gray-100 font-medium text-gray-800'>{data?.revaluationSurplus?.toLocaleString('fa-IR') || '-'}</td>
                                                            <td className='px-3 py-3 text-sm text-center border-b border-gray-100 font-medium text-gray-800'>{data?.capitalSurplus?.toLocaleString('fa-IR') || '-'}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimateHeight>
                        </div>
                    </div>
                </div>

                <div className="table-responsive px-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            isEditable={false}
                            isDeleteable={false}
                            action={undefined}
                            isShowSearchForm={false}

                            staticParams={[
                                { name: 'MeetingId', value: rowId! },
                            ]}
                            hideColList={['id']}
                            addSepratorFildes={[
                                'balanceAtMeeting',
                                'price',
                                'primeCost',
                                'primeCostAtMeeting',
                                'transactionOrder',
                                'volume'
                            ]}
                        // labaleNameList={[
                        //     { label: 'Keyword', value: 'companyName' },
                        //     { label: 'name', value: 'نام شرکت' },
                        // ]}
                        // myRef={tableRefreshRef}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Capitalraise;
