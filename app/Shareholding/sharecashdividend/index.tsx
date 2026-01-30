import { getEntityModel } from '@/models/entity';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../../components/Datatable/MRT';
//import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import { ActionIcon, Tooltip } from '@mantine/core';

const Sharecashdividend = ({ meetingId }: { meetingId?: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('sharecashdividend');
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
                                className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('sharemeeting')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        سود نقدی
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
                                { name: 'MeetingId', value: meetingId! },
                            ]}
                            hideColList={['id']}
                            // labaleNameList={[
                            //     { label: 'Keyword', value: 'companyName' },
                            //     { label: 'name', value: 'نام شرکت' },
                            // ]}
                            // myRef={tableRefreshRef}

                            addSepratorFildes={[
                                'dps',
                                'paidAmount',
                                'remaining',
                                'shareCount',
                                'totalProfit'

                            ]}

                            action={(row) => {
                                return (
                                    <>
                                        <Tooltip label="پرداخت ها">
                                            <ActionIcon
                                                onClick={() => subPage('sharemeeting', 'sharecashdividend/payments', undefined, [{ key: 'CashDividendId', value: row.id }, { key: 'tradingCode', value: row.tradingCode }, { key: 'MeetingId', value: meetingId?.toString() }])}
                                                variant="transparent"
                                                className="mr-3 hover:bg-green-100 w-9 h-9"
                                            >
                                                <i className="fa-duotone fa-solid fa-money-bill-wave text-xl text-gray-400 hover:text-green-600" />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="ثبت واریز بانکی">
                                            <ActionIcon
                                                onClick={() => subPage('sharemeeting', 'sharecashdividend/submitdeposit', undefined, [{ key: 'CashDividendId', value: row.id }, { key: 'tradingCode', value: row.tradingCode }, { key: 'MeetingId', value: meetingId! }])}
                                                variant="transparent"
                                                className="mr-3 hover:bg-blue-100 w-9 h-9"
                                            >
                                                <i className="fa-duotone fa-solid fa-university text-xl text-gray-400 hover:text-blue-600" />
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
