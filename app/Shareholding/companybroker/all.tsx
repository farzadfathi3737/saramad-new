import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '../../components/Datatable/MRT';
//import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

const Company = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('stockbroker');
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

                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn btn-outline pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('companybroker')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        <div className="p-2">فهرست تمامی کارگزاران</div>
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                            labaleNameList={[
                                { label: 'name', value: 'نام کارگزار اصلی' },
                                { label: 'Keyword', value: 'نام کارگذار' },
                            ]}
                            hideColList={['id', 'companyId', 'codes']}
                            action={(row) => (
                                // <ActionIcon onClick={() => router.push(`code/${item}`)}>
                                //     <IconEye />
                                // </ActionIcon>
                                <button type="button"
                                    className="btn btn-outline px-2 p-1 mr-3 flex rounded-md items-center bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                    onClick={() => subPage('companybroker', 'code', undefined, [{ key: 'id', value: row.id.toString() }, { key: 'brokerName', value: row.name }, { key: 'master', value: 'all' }])}>
                                    کارگزارفرعی
                                </button>
                                // <Link href={`/Shareholding/companybroker/code/${item.id}`} className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                //     کارگزارفرعی
                                // </Link>
                            )}
                            isEditable={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
