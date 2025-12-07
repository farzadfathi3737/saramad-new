import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '../../components/Datatable/MRT';
//import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';

const Company = ({ id, brokerName }: { id: string, brokerName: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    console.log(id, brokerName)
    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('companybrokerdiscount');
            setModel(_model);
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
                                onClick={() => subPage('companybroker')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full w-full flex flex-col justify-center align-middle'>
                        <div className="p-2">{t('list')} تخفیف کارگزار - {brokerName} </div>
                    </div>

                    <div className='p-2 h-full flex flex-col justify-center align-middle pl-2'>
                        <button type="button" className="btn btn-outline mr-3 flex items-center rounded-lg p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                            onClick={() => subPage('companybroker', 'companybrokerdiscount/add', undefined, [{ key: 'id', value: id }, { key: 'brokerName', value: brokerName }])}>
                            <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                            {t('add')}
                        </button>
                    </div>
                </div>

                <div className="table-responsive px-5">
                    {model && (
                        <Demo
                            model={model}
                            isShowHideCol={true}
                            staticParams={[
                                { name: 'CompanyBrokerId', value: id },
                                // { name: 'CompanyId', value: companyId },
                            ]}
                            labaleNameList={[{ label: 'companybrokerid', value: 'نام کارگذار' }]}
                            action={(row) => (
                                <div className="flex">
                                    {/* <ActionIcon onClick={() => router.push(`companybroker/code/${item}`)}>
                                        <IconEye />
                                    </ActionIcon> 
                                    <Link href={`/Shareholding/companybroker/code/${item.id}`} className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                        کارگزارفرعی
                                    </Link>*/}
                                </div>
                            )}
                            hideColList={['id', 'companyId', 'company']}
                            editAction={() => subPage('companybroker', 'companybrokerdiscount/edit', undefined, [{ key: 'id', value: id }, { key: 'brokerName', value: brokerName }])}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
