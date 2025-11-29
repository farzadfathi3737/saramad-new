import { getEntityModel } from '@/models/entity';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../../components/Datatable/MRT';
// import 'tippy.js/dist/tippy.css';
//import axios from 'axios';
import { IDataModel, IFieldsTable, ITabData } from '@/interface/dataModel';
import Link from 'next/link';
import { ActionIcon, keys, Tooltip } from '@mantine/core';
import { apiFetch } from '@/lib/apiFetch';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setTabs } from '@/store/appConfigSlice';

const Company = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const [isLoading, setIsLoading] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);

    const appConf = useSelector((state: IRootState) => state.appConfig);
    const dispatch = useDispatch();

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('company');

            _model?.list?.responses.map((item: IFieldsTable) => {
                if (['backgroundColor', 'textColor'].includes(item.accessor)) {
                    item = {
                        ...item,
                        Cell: ({ cell }) => {
                            const _bg = cell.getValue();
                            return (
                                <div className="flex w-full items-center justify-start">
                                    {_bg ? <div className={`h-8 w-8 rounded-md border `} style={{ backgroundColor: _bg }} /> : <div className={`h-8 w-8 rounded-md border bg-inherit`} />}
                                    <div className="pr-2">{_bg}</div>
                                </div>
                            );
                        },
                    };

                    _model.list.responses = [..._model.list.responses.filter((x: any) => x.accessor != item.accessor), item];
                }

                if (item.accessor == 'isHolding') {
                    item = {
                        ...item,
                        Cell: ({ cell }) => {
                            const _bg = cell.getValue();
                            return <div className="flex w-full items-center justify-start">{_bg ?
                                // <FontAwesomeIcon icon={faCheck} size="lg" className="ml-2 text-green-700" /> 
                                <i className={`fa-duotone fa-solid fa-check text-lg ml-2 text-green-700`} />
                                : <></>}</div>;
                        },
                    };

                    _model.list.responses = [..._model.list.responses.filter((x: any) => x.accessor != item.accessor), item];
                }
            });

            setModelData(_model);
            //setModel(_model);
        };
        setdata();
    }, []);

    const SetIsHolding = async (id: any) => {
        setIsLoading(true);

        const _modelholding = getEntityModel('companysetasholding');

        const res = await apiFetch(_modelholding?.register?.url as string, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyId: id,
            }),
        });

        if (res.ok) {
            tableRefreshRef?.current?.fetchData();
        } else {
        }

        setIsLoading(false);
    };

    const loadSubPage = (name: string) => {
        const _newTabs: ITabData[] = appConf.tabs.filter((x) => x.id !== "companyProfile")!;
        const _newTab: ITabData = appConf.tabs.find((x) => x.id == "companyProfile")!;

        if (_newTab) {
            const newTab = { ..._newTab, key: name, filters: [] };
            console.log(newTab);
            const updatedTabs = [..._newTabs, newTab];
            dispatch(setTabs(updatedTabs));
        };
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">

                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        {t('list')} {t('companes')}
                    </div>

                    <div className='p-2 h-full flex flex-col justify-center align-middle pl-2'>
                        <button type="button" className="btn btn-outline mr-3 flex items-center rounded-xl p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                            onClick={() => loadSubPage('companyProfile/add')}>
                            <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                            {t('add')}
                        </button>
                    </div>
                </div>


                {/* <div className="mb-5 flex h-[3rem] items-center justify-between border-b border-gray-300 px-5 pb-3">
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        {t('list')} {t('companes')}
                    </div>

                    <button type="button" className="btn btn-outline mr-3 flex items-center rounded-xl p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
                        onClick={() => loadSubPage('companyProfile/add')}>
                        <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                        {t('add')}
                    </button>
                </div> */}

                <div className="table-responsive px-5 pt-5">
                    {modelData && (
                        <Demo
                            model={modelData}
                            isShowHideCol={true}
                            hideColList={['shareId', 'id']}
                            labaleNameList={[
                                { label: 'Keyword', value: 'companyName' },
                                { label: 'name', value: 'نام شرکت' },
                            ]}
                            myRef={tableRefreshRef}
                            action={(row) => {
                                return (
                                    <Tooltip label="انتخواب به عنوان هلدینگ">
                                        <ActionIcon
                                            onClick={() => SetIsHolding(row.id.toString())}
                                            className="btn btn-outline mr-3 flex items-center rounded-xl bg-secondary-light w-9 h-9 p-0 font-iranyekan text-secondary">
                                            <i className={`fa-duotone fa-solid fa-check text-xl`} />
                                        </ActionIcon>
                                    </Tooltip>
                                );
                            }}
                        />
                    )}
                </div>
            </div>
        </div >
    );
};

export default Company;
