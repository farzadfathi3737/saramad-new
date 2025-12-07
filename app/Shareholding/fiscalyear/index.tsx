import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import Demo from '../../components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { IRootState } from '@/store';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

const Fiscalyear = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState("");
    //const [fiscalYear] = useState(appConfig.fiscalYear)

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('fiscalyear');
            setModelData(_model);
            //setModel(_model);
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
                        {t('list')} {t('fiscalyear')}
                        {/* - {appConfig.company.name} */}
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
                            labaleNameList={
                                [{ label: "name", value: "finandeName" }]
                            }
                            staticParams={[
                                { name: 'CompanyId', value: companyId },
                                //{ name: 'FiscalYearId', value: fiscalYear.id },
                            ]}
                            hideColList={['shareId', 'id', 'companyId', 'voucherTemplateId']}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Fiscalyear;
