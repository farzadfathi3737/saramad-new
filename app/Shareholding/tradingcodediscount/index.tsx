import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '../../components/Datatable/MRT';
//import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';

const Company = ({ tradingCodeId, tradingCode }: { tradingCodeId: string, tradingCode: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);


    console.log(tradingCodeId, tradingCode);

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('tradingcodediscount');
            setModelData(_model);
        };
        setdata();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">

                <div className="flex h-[3.5rem] items-start justify-start border-b border-gray-300">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn btn-outline pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('companytradingcode')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full w-full flex flex-col justify-center align-middle'>
                        <div className="p-2"> تعریف تخفیف سبد : {tradingCode} - {appConfig.company.name}</div>
                    </div>

                    <div className='p-2 h-full flex flex-col justify-center align-middle pl-2'>
                        <button type="button" className="btn btn-outline mr-3 flex items-center rounded-xl p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                            //onClick={() => subPage(modelData?.name.toLocaleLowerCase() ?? '', 'add',  )}>
                            onClick={() => subPage('companytradingcode', 'tradingcodediscount/add', [{ key: 'tradingCodeId', value: tradingCodeId }, { key: 'tradingCode', value: tradingCode }], undefined)}>
                            <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                            {t('add')}
                        </button>
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            staticParams={[{ name: 'TradingCodeId', value: tradingCodeId! }]}
                            hideColList={['id', 'companyId', 'brokerId', 'accountingCode']}
                            labaleNameList={[{ label: 'Keyword', value: 'companytradingcode' }]}
                        //changeColumnName={[{ label: 'type', value: 'typeName' }]}
                        // action={(row) => {
                        //     return (
                        //         <ActionIcon onClick={() => router.push(`${modelData.name.toString().toLowerCase()}/${row}`)}>
                        //             <IconMenuOrder />
                        //         </ActionIcon>
                        //     );
                        // }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
