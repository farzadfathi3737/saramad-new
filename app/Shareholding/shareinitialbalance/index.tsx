import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import Demo from '../../components/Datatable/MRT';
//import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

const ShareRelationType = ({ id, name }: { id: string, name: string }) => {

    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [fiscalYearId, setFiscalYearId] = useState('');

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('shareinitialbalance');
            setModel(_model);
        };
        setdata();
    }, []);

    useEffect(() => {
        setFiscalYearId(appConfig.fiscalYear.id);
    }, [appConfig.fiscalYear]);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">

                <div className="flex h-[3.5rem] items-start justify-start border-b border-gray-300">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn btn-outline pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('share')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full w-full flex flex-col justify-center align-middle'>
                        <div className="p-2">مانده ابتدای دوره - {name}</div>
                    </div>

                    <div className='p-2 h-full flex flex-col justify-center align-middle pl-2'>
                        <button type="button" className="btn btn-outline mr-3 flex items-center rounded-xl p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                            onClick={() => subPage('share', 'shareinitialbalance/add', undefined, [{ key: 'shareId', value: id }, { key: 'name', value: name }])}>
                            <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                            {t('add')}
                        </button>
                    </div>
                </div>

                <div className="table-responsive p-5">
                    {model && fiscalYearId && (
                        <Demo
                            model={model}
                            isShowHideCol={true}
                            staticParams={[
                                { name: 'FiscalYearId', value: fiscalYearId },
                                { name: 'ShareId', value: id },
                            ]}
                            labaleNameList={[
                                { label: 'Keyword', value: 'نوع وابستگی' },
                                { label: 'name', value: 'نوع وابستگی' },
                            ]}
                            hideColList={['id', 'companyId', 'shareId', 'transactionId']}
                            addSepratorFildes={[
                                'price', 'volume', 'primeCost'
                            ]}
                            addFooterSumFildes={[
                                'volume', 'primeCost',
                            ]}
                            isEditable={false}
                            action={(row) => (
                                <Tooltip label="ویرایش">
                                    <ActionIcon
                                        onClick={() => subPage('share', 'shareinitialbalance/edit', undefined, [{ key: 'id', value: row.id.toString() }, { key: 'shareId', value: id }, { key: 'name', value: name }])
                                        }
                                        className="btn btn-outline mr-3 flex items-center rounded-xl bg-secondary-light w-9 h-9 p-0 font-iranyekan text-secondary">
                                        <i className={`fa-duotone fa-solid fa-pen-to-square text-xl`} />
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

export default ShareRelationType;
