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
import { useRouter } from 'next/navigation';

const Sharecashdividend = ({ meetingId }: { meetingId?: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const [isLoading, setIsLoading] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    const [rowId, setRowId] = useState<string>();

    const router = useRouter();

    useEffect(() => {
        const setdata = async () => {

            setRowId(meetingId);

            const _model = getEntityModel('sharemeetingprerightsforwaivedsell');

            setModelData(_model);
        };
        setdata();
    }, [meetingId]);

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
                        فروش حق تقدم استفاده نشده
                    </div>
                </div>

                <div className="p-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            isEditable={false}
                            isShowSearchForm={false}
                            staticParams={[
                                { name: 'MeetingId', value: rowId! },
                            ]}
                            hideColList={['tradingCodeId', 'id']}
                            addSepratorFildes={[
                                'allocated',
                                'allocatedPrimeCost',
                                'balanceAtMeeting',
                                'paidByCash',
                                'paidByDemands',
                                'payableAmount',
                                'payableCount',
                                'primeCostAtMeeting',
                                'traded',
                                'tradedPrimeCost',
                                'paidCost',
                                'paidCount',
                                'waivedBuy',
                                'waivedBuyPrimeCost',
                                'waivedSell',
                                'waivedSellPrimeCost',
                            ]}
                            // labaleNameList={[
                            //     { label: 'Keyword', value: 'companyName' },
                            //     { label: 'name', value: 'نام شرکت' },
                            // ]}
                            // myRef={tableRefreshRef}
                            action={(row) => {
                                return (
                                    <>
                                        <Tooltip label="اسناد فروش">
                                            <ActionIcon
                                                onClick={() => subPage('sharemeeting', 'prerightsforwaivedsell/prerightswaivedsell', undefined, [{ key: 'tradingCodeId', value: row.tradingCodeId }, { key: 'tradingCode', value: row.tradingCode }, { key: 'MeetingId', value: meetingId?.toString() }])}
                                                variant="transparent"
                                                className="mr-3 hover:bg-green-100 w-9 h-9"
                                            >
                                                <i className="fa-duotone fa-solid fa-file-doc text-xl text-gray-400 hover:text-green-600" />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="ثبت فروش">
                                            <ActionIcon
                                                onClick={() => subPage('sharemeeting', 'prerightsforwaivedsell/prerightswaivedselladd', undefined, [{ key: 'tradingCodeId', value: row.tradingCodeId }, { key: 'tradingCode', value: row.tradingCode }, { key: 'MeetingId', value: meetingId! }])}
                                                variant="transparent"
                                                className="mr-3 hover:bg-blue-100 w-9 h-9"
                                            >
                                                <i className="fa-duotone fa-solid fa-save text-xl text-gray-400 hover:text-blue-600" />
                                            </ActionIcon>
                                        </Tooltip>
                                    </>
                                );
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sharecashdividend;
