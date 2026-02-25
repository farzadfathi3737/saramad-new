import { getEntityModel } from '@/models/entity';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Demo from '@/app/components/Datatable/MRT';
import { IDataModel, IFieldsTable } from '@/interface/dataModel';

import Link from 'next/link';
import { ActionIcon, Tooltip } from '@mantine/core';

const Payments = ({ TradingCodeId, TradingCode, MeetingId }: { TradingCodeId?: string; TradingCode?: string, MeetingId?: string }) => {
    const { t } = useTranslation();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();

    useEffect(() => {
        const setdata = async () => {

            const _model = getEntityModel('sharemeetingprerightswaivedsell');
            setModelData(_model);
        };
        setdata();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">

                <div className="flex h-[3.5rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('sharemeeting', 'prerightsforwaivedsell', [], [{ key: 'MeetingId', value: MeetingId! }])}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        پرداخت های سود نقدی سبد - {TradingCode}
                    </div>
                    <div className='p-2 h-full flex flex-col item-center mr-auto pl-2'>
                        <button
                            type="button"
                            onClick={() => subPage('sharemeeting', 'prerightsforwaivedsell/prerightswaivedselladd', undefined, [{ key: 'tradingCodeId', value: TradingCodeId! }, { key: 'tradingCode', value: TradingCode! }, { key: 'MeetingId', value: MeetingId! }])}
                            className="btn btn-outline flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-white"
                        >
                            <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
                            ثبت فروش
                        </button>
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
                                { name: 'MeetingId', value: MeetingId! },
                                { name: 'TradingCodeId', value: TradingCodeId! }
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
