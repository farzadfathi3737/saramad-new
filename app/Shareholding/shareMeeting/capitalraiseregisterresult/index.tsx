'use client'

import { getEntityModel } from '@/models/entity';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Demo from '@/app/components/Datatable/MRT';
import { IDataModel, IFieldsTable } from '@/interface/dataModel';
import { ActionIcon, Tooltip } from '@mantine/core';

const Sharecashdividend = ({ meetingId }: { meetingId?: string }) => {
    const { t } = useTranslation();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const [isLoading, setIsLoading] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    const [rowId, setRowId] = useState<string>();

    useEffect(() => {
        const setdata = async () => {

            setRowId(meetingId);

            const _model = getEntityModel('sharemeetingcapitalraiseregisterresult');

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
                        ثبت افزایش سرمایه
                    </div>
                </div>

                <div className="px-5 mt-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            isEditable={false}
                            isShowSearchForm={false}
                            staticParams={[
                                { name: 'MeetingId', value: rowId! },
                            ]}
                            hideColList={['tradingCodeId']}
                            addSepratorFildes={[
                                'allocated',
                                'allocatedPrimeCost',
                                'balanceAtMeeting',
                                'convertedToShare',
                                'convertedToSharePrimeCost',
                                'paidCost',
                                'paidCount',
                                'primeCostAtMeeting',
                                'traded',
                                'tradedPrimeCost',
                                'waivedBuy',
                                'waivedBuyPrimeCost',
                                'waivedSell',
                                'waivedSellPrimeCost'
                            ]}
                            // labaleNameList={[
                            //     { label: 'Keyword', value: 'companyName' },
                            //     { label: 'name', value: 'نام شرکت' },
                            // ]}
                            // myRef={tableRefreshRef}
                            action={(row) => {
                                return (
                                    <>
                                        <Tooltip label="مرور اسناد">
                                            <ActionIcon
                                                onClick={() => subPage('sharemeeting', 'capitalraiseregisterresult/capitalraiseregister', undefined, [{ key: 'tradingCodeId', value: row.tradingCodeId }, { key: 'tradingCode', value: row.tradingCode }, { key: 'MeetingId', value: meetingId! }])}
                                                variant="transparent"
                                                className="mr-3 flex items-center rounded-xl w-9 h-9 p-0"
                                            >
                                                <i className="fa-duotone fa-solid fa-folder-open text-xl text-gray-400 hover:text-blue-500" />
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
