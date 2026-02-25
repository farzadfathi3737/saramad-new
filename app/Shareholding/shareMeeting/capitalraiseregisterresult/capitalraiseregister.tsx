'use client'

import { getEntityModel } from '@/models/entity';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '@/app/components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { Tooltip } from '@mantine/core';

const Payments = ({ TradingCodeId, TradingCode, MeetingId }: { TradingCodeId?: string; TradingCode?: string, MeetingId?: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('sharemeetingcapitalraiseregister');
            setModelData(_model);
        };
        setdata();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50 cursor-pointer"
                                onClick={() => subPage('sharemeeting', 'capitalraiseregisterresult', undefined, [{ key: 'MeetingId', value: MeetingId! }])}>
                                <i className="fa-duotone fa-solid fa-chevron-right text-xl ml-2" />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        اسناد افزایش سرمایه - {TradingCode}
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
                                { name: 'MeetingId', value: MeetingId! },
                                { name: 'TradingCodeId', value: TradingCodeId! },
                            ]}
                            hideColList={['id']}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payments;
