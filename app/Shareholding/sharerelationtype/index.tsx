import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '../../components/Datatable/MRT';
//import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

const ShareRelationType = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('sharerelationtype');
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
                        نوع وابستگی سهم
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
                                { label: 'Keyword', value: 'نوع وابستگی' },
                                { label: 'name', value: 'نوع وابستگی' },
                            ]}
                            //hideColList={['id', 'companyId', 'stockId','nameAndSymbol', 'stockIndustry', 'stockParentIndustry','stockTypeName','investmentType','relationType', 'accountingMainCode','accountingSubCode','isNonMarket','lastUpdateDate']}
                            hideColList={['id', 'companyId']}
                        // action={(item) => (
                        //     <Tooltip label="اطلاعات نماد">
                        //         <ActionIcon onClick={() => router.push(`/Shareholding/stock/${item.stockId}`)}>
                        //             <IconEye />
                        //         </ActionIcon>
                        //     </Tooltip>
                        // )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareRelationType;
