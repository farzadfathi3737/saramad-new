'use client'

import { getEntityModel } from '@/models/entity';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '@/app/components/Datatable/MRT';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { IDataModel, IFieldsTable } from '@/interface/dataModel';
import Link from 'next/link';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import AnimateHeight from 'react-animate-height';

const Capitalraise = () => {
    const { t } = useLanguage();
    const [modelData, setModelData] = useState<IDataModel>();
    const [modelData2, setModelData2] = useState<IDataModel>();
    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    const [rowId, setRowId] = useState<string>();

    const router = useRouter();
    const searchParams = useSearchParams();
    const meetingId = searchParams.get('MeetingId');

    const [active, setActive] = useState<boolean>(true);
    const togglePara = (value: boolean) => {
        setActive((oldValue) => {
            return oldValue === value ? false : value;
        });
    };

    useEffect(() => {
        const setdata = async () => {

            setRowId(meetingId || undefined);

            const _model = await getEntityModel('sharemeetingcapitalraise');
            const _model2 = await getEntityModel('sharemeetingcapitalraisedetails');

            setModelData(_model);
            setModelData2(_model2);
        };
        setdata();
    }, []);

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
                <div className="mb-5 flex h-[3rem] items-start justify-start border-b-2 px-5 pb-3">
                    <div>
                        <Tooltip label={t('back')}>
                            <ActionIcon color="inheritans" className="flex items-center justify-center rounded-[50%] p-5 hover:bg-inherit hover:text-blue-900" onClick={() => router.back()}>
                                <i className="fa-duotone fa-solid fa-arrow-right text-lg ml-2" />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <div className='p-2'>
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
                                <div className="table-responsive p-5">
                                    <div className='grid grid-cols-2 gap-2'>
                                        <div className='border'>
                                            <div className='text-center p-3'>
                                                درصد افزایش سرمایه
                                            </div>
                                            <div>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>سرمایه قدیم (میلیون ریال)</th>
                                                            <th>سرمایه جدید (میلیون ریال)</th>
                                                            <th>درصد کل</th>
                                                            <th>درصد آورده نقدی (حق تقدم)</th>
                                                            <th>درصد اندوخته ها (سهام جایزه)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='border'>{data?.previousShares.toLocaleString('fa-IR')}</td>
                                                            <td className='border'>{data?.newShares.toLocaleString('fa-IR')}</td>
                                                            <td className='border'>{data?.totalPercentage}</td>
                                                            <td className='border'>{data?.cashPercentage}</td>
                                                            <td className='border'>{data?.reservesPercentage}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className='border'>
                                            <div className='text-center p-3'>
                                                محل تآمین افزایش سرمایه
                                            </div>
                                            <div>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>مطالبات و آورده نقدی</th>
                                                            <th>سود انباشته (میلیون ریال)</th>
                                                            <th>اندوخته (میلیون ریال)</th>
                                                            <th>تجدید ارزیابی (میلیون ریال)</th>
                                                            <th>صرف سهام (میلیون ریال)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='border'>{data?.shareholderCash.toLocaleString('fa-IR')}</td>
                                                            <td className='border'>{data?.retainedEarnings.toLocaleString('fa-IR')}</td>
                                                            <td className='border'>{data?.expansionReserve.toLocaleString('fa-IR')}</td>
                                                            <td className='border'>{data?.revaluationSurplus.toLocaleString('fa-IR')}</td>
                                                            <td className='border'>{data?.capitalSurplus.toLocaleString('fa-IR')}</td>
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
