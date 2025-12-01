
import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '../../components/Datatable/MRT';
// import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

const Company = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const router = useRouter();

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('companybroker');
            setModelData(_model);
        };
        setdata();
    }, []);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">

                {/* <div className="mb-5 flex h-[3rem] items-center justify-between border-b-2 px-5 pb-3">
                    <div className="flex items-center">
                        {t('list')} {t('companybroker')} : {appConfig.company.name}
                        <Link className="btn btn-outline mr-3 flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-[#fff]" 
                        href={modelData?.name.toLocaleLowerCase() + '/all'}>
                            {/* <FontAwesomeIcon icon={faPlus} size="lg" className="ml-2" /> */}
                {/* {t('allstockbroker')} /}
                            فهرست تمامی کارگزاران
                        </Link>
                    </div>

                    <Link className="btn btn-outline mr-3 flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-[#fff]" 
                    href={modelData?.name.toLocaleLowerCase() + '/add'}>
                        <FontAwesomeIcon icon={faPlus} size="lg" className="ml-2" />
                        {t('add')}
                    </Link>
                </div> */}


                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex justify-center items-center align-middle pr-5'>
                        {t('list')} {t('companybroker')} : {appConfig.company.name}
                        <button type="button" className="btn btn-outline mr-3 flex items-center rounded-xl p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                            onClick={() => subPage(modelData?.name.toLocaleLowerCase() ?? '', 'all')}>
                            فهرست تمامی کارگزاران
                        </button>
                    </div>

                    <div className='p-2 h-full flex flex-col justify-center align-middle pl-2'>
                        <button type="button" className="btn btn-outline mr-3 flex items-center rounded-xl p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                            onClick={() => subPage(modelData?.name.toLocaleLowerCase() ?? '', 'add')}>
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
                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                            labaleNameList={[
                                { label: 'name', value: 'نام کارگذار اصلی' },
                                { label: 'Keyword', value: 'نام کارگذار' },
                            ]}
                            action={(row) => (
                                <div className='flex'>
                                    <button type="button"
                                        className="btn btn-outline px-2 p-1 mr-3 flex rounded-md items-center bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                        onClick={() => subPage('companybroker', 'companybrokerdiscount', undefined, [{ key: 'id', value: row.id.toString() }, { key: 'brokerName', value: row.broker }])}>
                                        تخفیف
                                    </button>
                                    <button type="button"
                                        className="btn btn-outline px-2 p-1 mr-3 flex rounded-md items-center bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                        onClick={() => subPage('companybroker', 'code', undefined, [{ key: 'id', value: row.id.toString() }, { key: 'brokerName', value: row.broker }, { key: 'master', value: '' }])}>
                                        کارگزارفرعی
                                    </button>
                                </div>
                            )}
                            hideColList={['id', 'companyId', 'company']}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
