import { getEntityModel } from '@/models/entity';
import Demo from '../../../components/Datatable/MRT';
//import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

const Company = ({ id, brokerName, master }: { id: string, brokerName: string, master: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('stockbrokercode');
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
                                className="btn btn-outline pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('companybroker', master)}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        <div className="p-2">لیست کارگزاران - {brokerName} - ({appConfig.company.name})</div>
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            staticParams={[{ name: 'BrokerId', value: id }]}
                            labaleNameList={[
                                { label: 'Keyword', value: 'نام / کد کارگذار' },
                                { label: 'name', value: 'نام کارگذار' },
                                { label: 'code', value: 'کد دو حرفی' },
                            ]}
                            hideColList={['id', 'companyId', 'brokerId']}
                            isEditable={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
