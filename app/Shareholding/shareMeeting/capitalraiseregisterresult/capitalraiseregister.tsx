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

const Payments = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const [isLoading, setIsLoading] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    const [rowId, setRowId] = useState<string>();
    const [tradingCode, setTradingCode] = useState<string>();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const setdata = async () => {
            setRowId(searchParams.get('CashDividendId') || undefined);
            setTradingCode(searchParams.get('tradingCode') || undefined);

            const _model = getEntityModel('sharemeetingcapitalraiseregister');
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
                    <div className="mb-5 flex w-full h-[3rem] items-center justify-between border-b-2 px-5 pb-3">
                        اسناد افزایش سرمایه - {tradingCode}
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
                                { name: 'CashDividendId', value: rowId! },
                            ]}
                            hideColList={['id']}
                        // labaleNameList={[
                        //     { label: 'Keyword', value: 'companyName' },
                        //     { label: 'name', value: 'نام شرکت' },
                        // ]}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payments;
