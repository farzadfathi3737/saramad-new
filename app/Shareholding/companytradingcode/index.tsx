import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../../components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

const Company = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    //const router = useRouter();

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('companytradingcode');

            // _model.list.responses = [
            //     ..._model.list.responses,
            //     { "accessorKey": "typeName1", "header": "typeName", "accessor": "typeName", "title": "نوع", "sortable": true, "hidden": false },
            // ]
            console.log(_model);
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
                        {t('list')} {t('companytrading')} : {appConfig.company.name}
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
                            hideColList={['id', 'companyId']}
                            labaleNameList={[{ label: 'Keyword', value: 'companytradingcode' }, { label: 'typeName', value: 'نوع سبد' }]}
                            changeColumnName={[{ label: 'type', value: 'typeName' }]}
                            action={(row) => {
                                return (
                                    <button type="button"
                                        //className="btn btn-outline mr-3 flex items-center rounded-xl p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                        className="btn btn-outline px-2 p-1 mr-3 flex rounded-md items-center bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                        onClick={() => subPage(modelData?.name.toLocaleLowerCase() ?? '', 'tradingcodediscount', [{ key: 'tradingCodeId', value: row.id.toString() }, { key: 'tradingCode', value: row.tradingCode.toString() }], undefined)}>
                                        تخفیف کارمزد
                                    </button>
                                );
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
