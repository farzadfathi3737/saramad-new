
import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '../../components/Datatable/MRT';
// import 'tippy.js/dist/tippy.css';
import { IDataModel, ITabData } from '@/interface/dataModel';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { ActionIcon, Tooltip } from '@mantine/core';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { setActiveTab, setTabs } from '@/store/appConfigSlice';
const Company = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();

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

    const AddTab = (param: ITabData) => {

        //console.log(param.key, param.name)

        // بررسی: اگر تب قبلاً وجود دارد، فقط آن را فعال کن
        const _existingTab = appConfig.tabs.find((x) => x.id == param.id);

        if (_existingTab) {
            // تب قبلاً وجود دارد - فقط فعال کن
            dispatch(setActiveTab(param.id));
            router.replace(`?tab=${param.id}`);
            return;
        }

        // اگر تب جدید است و تعداد < 6، اضافه کن
        if (appConfig.tabs.length >= 7) {
            ColoredToast('warning', 'حداکثر 7 تب مجاز است!');
            return;
        }

        // اضافه کردن تب جدید
        const newTab: ITabData = {
            id: param.id,
            key: param.key,
            name: param.name,
            title: param.title,
            orther: param.key == 'dashboard' ? 0 : appConfig.tabs.length,
            filters: [],
            params: [],
        };

        const updatedTabs = [...appConfig.tabs, newTab];
        dispatch(setTabs(updatedTabs));

        // فعال کردن تب جدید
        dispatch(setActiveTab(param.id));
        router.replace(`?tab=${param.id}`);
    };

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
                        {t('list')} {t('companybroker')}
                        {/* : {appConfig.company.name} */}
                        <button type="button" className="btn btn-outline mr-3 flex items-center rounded-lg p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                            onClick={() => subPage(modelData?.name.toLocaleLowerCase() ?? '', 'all')}
                        // onClick={() => AddTab({
                        //     id: modelData?.name?.toLocaleLowerCase() + 'all',
                        //     key: modelData?.name?.toLocaleLowerCase() + 'all',
                        //     name: modelData?.name?.toLocaleLowerCase() + 'all',
                        //     title: "فهرست تمامی کارگزاران",
                        //     orther: 0
                        // })}
                        >
                            فهرست تمامی کارگزاران
                        </button>
                    </div>

                    <div className='p-2 h-full flex flex-col justify-center align-middle pl-2'>
                        <button type="button" className="btn btn-outline mr-3 flex items-center rounded-lg p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
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
                                    {/* <button type="button"
                                        className="btn btn-outline px-2 p-1 mr-3 flex rounded-md items-center bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                        onClick={() => subPage('companybroker', 'companybrokerdiscount', undefined, [{ key: 'id', value: row.id.toString() }, { key: 'brokerName', value: row.broker }])}>
                                        تخفیف
                                    </button> */}
                                    <Tooltip label="تخفیف">
                                        <ActionIcon
                                            onClick={() => subPage('companybroker', 'companybrokerdiscount', undefined, [{ key: 'id', value: row.id.toString() }, { key: 'brokerName', value: row.broker }])}
                                            variant="transparent"
                                            className="mr-3 hover:bg-red-100 w-9 h-9"
                                        >
                                            <i className={`fa-duotone fa-solid fa-percent text-xl text-gray-400 hover:text-[#2D9AA0]`} />
                                        </ActionIcon>
                                    </Tooltip>

                                    {/* <button type="button"
                                        className="btn btn-outline px-2 p-1 mr-3 flex rounded-md items-center bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                        onClick={() => subPage('companybroker', 'code', undefined, [{ key: 'id', value: row.id.toString() }, { key: 'brokerName', value: row.broker }, { key: 'master', value: '' }])}>
                                        کارگزارفرعی
                                    </button> */}
                                    <Tooltip label="کارگزارفرعی">
                                        <ActionIcon
                                            onClick={() => subPage('companybroker', 'code', undefined, [{ key: 'id', value: row.id.toString() }, { key: 'brokerName', value: row.broker }, { key: 'master', value: '' }])}
                                            variant="transparent"
                                            className="mr-3 hover:bg-red-100 w-9 h-9"
                                        >
                                            <i className={`fa-duotone fa-solid fa-users text-xl text-gray-400 hover:text-blue-500`} />
                                        </ActionIcon>
                                    </Tooltip>
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
