import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '../../components/Datatable/MRT';
//import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';

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
            const _model = getEntityModel('stock');
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

                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        {t('list')} {t('stock')}
                    </div>
                </div>

                <div className="table-responsive p-5 ">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            manualPagination={true}
                            hideColList={['id', 'companyId', 'externalId', 'externalId2', 'optionDetails']}
                            labaleNameList={[
                                { label: 'Keyword', value: 'نام سهام' },
                                { label: 'Name', value: 'نام سهام' },
                                { label: 'industryName', value: 'زیرصنعت' },
                                { label: "IncludeDeprecated", value: 'نمادهای حذف شده' },
                            ]}

                            isEditable={false}
                            action={(item) => (
                                <Tooltip label="اطلاعات نماد">
                                    <ActionIcon
                                        className="ml-3 flex items-center rounded-xl w-9 h-9 p-0 font-iranyekan"
                                        variant='transparent'
                                        onClick={() => subPage(modelData?.name.toLocaleLowerCase() ?? '', 'view', undefined, [{ key: 'id', value: item.id }, { key: 'master', value: modelData?.name.toLocaleLowerCase() ?? '' }])}>
                                        <i className={`fa-duotone fa-solid fa-eye text-xl text-gray-400 hover:text-blue-500`} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
