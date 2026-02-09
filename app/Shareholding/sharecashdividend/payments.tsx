import { getEntityModel } from '@/models/entity';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../../components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { Tooltip } from '@mantine/core';

const Payments = ({ CashDividendId, tradingCode, meetingId }: { CashDividendId?: string; tradingCode?: string, meetingId?: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('sharecashdividendpayments');
            setModelData(_model);
        };
        setdata();
        console.log('meetingId', meetingId);
    }, []);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('sharemeeting', 'sharecashdividend', [], [{ key: 'MeetingId', value: meetingId! }])}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        پرداخت های سود نقدی سبد - {tradingCode}
                    </div>
                    <div className='p-2 h-full flex flex-col item-center mr-auto pl-2'>
                        <button
                            type="button"
                            onClick={() => subPage('sharemeeting', 'sharecashdividend/submitdeposit', undefined, [{ key: 'CashDividendId', value: CashDividendId! }, { key: 'tradingCode', value: tradingCode! }, { key: 'MeetingId', value: meetingId! }])}
                            className="btn btn-outline flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-white"
                        >
                            <i className="fa-duotone fa-solid fa-plus text-lg ml-2" />
                            ثبت واریز بانکی
                        </button>
                    </div>
                </div>

                <div className="px-5 my-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            isEditable={false}
                            isDeleteable={false}
                            isShowSearchForm={false}
                            staticParams={[
                                { name: 'CashDividendId', value: CashDividendId! },
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
