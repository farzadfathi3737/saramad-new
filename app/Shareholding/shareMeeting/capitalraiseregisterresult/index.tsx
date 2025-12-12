import { getEntityModel } from '@/models/entity';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Demo from '@/app/components/Datatable/MRT';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { IDataModel, IFieldsTable } from '@/interface/dataModel';

import Link from 'next/link';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useRouter as Router } from 'next/router';

const Sharecashdividend = () => {
    const { t } = useTranslation();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const [isLoading, setIsLoading] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    const [rowId, setRowId] = useState<string>();

    const router = useRouter();
    const _router = Router();
    const { query } = _router;

    useEffect(() => {
        const setdata = async () => {

            setRowId(query.MeetingId?.toString());

            let _model = getEntityModel('sharemeetingcapitalraiseregisterresult');

            setModelData(_model);
        };
        setdata();
    }, []);

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
                        ثبت افزایش سرمایه
                    </div>
                </div>

                <div className="table-responsive px-5">
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
                                            <Link
                                                href={`/Shareholding/shareMeeting/capitalraiseregisterresult/capitalraiseregister?CashDividendId=${rowId}&tradingCode=${row.tradingCode}`}
                                                className="btn btn-outline mr-3 flex items-center rounded-xl bg-secondary-light px-2 font-iranyekan text-secondary"
                                            >
                                                <i className="fa-duotone fa-solid fa-check text-lg mx-1" />
                                            </Link>
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
