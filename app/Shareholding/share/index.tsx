import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '../../components/Datatable/MRT';
// import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';
import { ActionIcon, Tooltip } from '@mantine/core';

const Company = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const router = useRouter();

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('share');
            setModel(_model);
        };
        setdata();
    }, []);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">

                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        فهرست دارایی ها
                    </div>

                    <div className='h-full flex justify-center align-middle p-2'>
                        <button type="button" className="btn btn-outline mr-3 flex items-center rounded-lg p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                            onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '', 'add')}>
                            <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                            دارایی جدید
                        </button>
                        <button type="button" className="btn btn-outline mr-3 flex items-center rounded-lg p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                            onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '', 'addt')}>
                            <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                            دارایی غیربورسی جدید
                        </button>
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {model && (
                        <Demo
                            model={model}
                            isShowHideCol={true}
                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                            labaleNameList={[{ label: 'Keyword', value: 'نام / نماد' }]}
                            //hideColList={['id', 'companyId', 'stockId','nameAndSymbol', 'stockIndustry', 'stockParentIndustry','stockTypeName','investmentType','relationType', 'accountingMainCode','accountingSubCode','isNonMarket','lastUpdateDate']}
                            hideColList={['id', 'companyId', 'isNonMarket', 'stockId']}
                            action={(row: any) => (
                                <>
                                    <Tooltip label="اطلاعات نماد">
                                        <ActionIcon
                                            onClick={() => subPage('share', 'stock/view', undefined, [{ key: 'id', value: row.stockId.toString() }, { key: 'master', value: 'share' }])}
                                            variant="transparent"
                                            className="mr-3 flex items-center rounded-xl w-9 h-9 p-0">
                                            <i className={`fa-duotone fa-solid fa-hospital-symbol text-xl text-gray-400 hover:text-blue-500`} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="مانده ابتدای دوره">
                                        <ActionIcon
                                            onClick={() => subPage(model.name.toLowerCase(), 'shareinitialbalance', undefined, [{ key: 'id', value: row.id.toString() }, { key: 'name', value: row.stockName }])}
                                            variant='transparent'
                                            className="mr-3 flex items-center rounded-xl w-9 h-9 p-0">
                                            <i className={`fa-duotone fa-solid fa-circle text-xl text-gray-400 hover:text-blue-500`} />
                                        </ActionIcon>
                                    </Tooltip>
                                </>
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
