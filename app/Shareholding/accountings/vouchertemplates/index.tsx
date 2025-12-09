'use client'

import { getEntityModel } from '@/models/entity';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../../../components/Datatable/MRT';
import { IDataModel, IFieldsTable } from '@/interface/dataModel';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { Dialog, Transition } from '@headlessui/react';
import { Field, Form, Formik } from 'formik';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

const ArticleElements = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const [modelDataValue, setModelDataValue] = useState<IDataModel>();
    const [isLoading, setIsLoading] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string>('');

    useEffect(() => {
        const setdata = async () => {
            let _model = await getEntityModel('vouchertemplates');
            console.log(_model.list);
            let _modelValue = await getEntityModel('vouchertemplatesduplicate');

            _model?.list?.responses.map((item: IFieldsTable) => {
                if (item.accessor == 'isSystem') {
                    item = {
                        ...item,
                        Cell: ({ cell }) => {
                            let _bg = cell.getValue();
                            return <div className="flex w-full items-center justify-start">{_bg ? <i className={`fa-duotone fa-solid fa-check text-lg ml-2 text-green-700`} /> : <></>}</div>;
                        },
                    };

                    _model.list.responses = [..._model.list.responses.filter((x: any) => x.accessor != item.accessor), item];
                }
            });

            setModelData(_model);
            setModelDataValue(_modelValue);
            //setModel(_model);
        };
        setdata();
    }, []);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    const changeConstValueModalOpen = async (id: string) => {
        setSelectedRowId(id);
        setIsModalOpen(true);
    };

    const handlerAddConstValue = async (id: string) => {
        //setLoading(true);
        console.log(selectedRowId);
        let _url = await modelDataValue?.default?.url?.replaceAll('{id}', id).toString();
        console.log(_url);
        const res = await fetch(_url!, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (res.ok) {
            ColoredToast('success', t('message.success_save_message'));
            tableRefreshRef?.current?.fetchData();
            setIsModalOpen(false);
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
        }
        //setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        {t('list')} {t('accountingsVouchertemplates')}
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
                                { label: 'Keyword', value: 'name' },
                                { label: 'name', value: 'نام' },
                                { label: 'isSystem', value: 'سیستمی است' },
                            ]}
                            myRef={tableRefreshRef}
                            action={(row) => {
                                return (
                                    <>
                                        <Tooltip label="آرتیکل ها">
                                            <ActionIcon
                                                onClick={() => subPage(`${modelData?.name.toLocaleLowerCase()}/${row.id}`, 'articles')}
                                                variant="transparent"
                                                className="mr-3 hover:bg-blue-100 w-9 h-9">
                                                <i className={`fa-duotone fa-solid fa-newspaper text-xl text-blue-500`} />
                                            </ActionIcon>
                                        </Tooltip>

                                        <Tooltip label="ایجاد مشابه">
                                            <ActionIcon
                                                onClick={() => changeConstValueModalOpen(row.id.toString())}
                                                variant="transparent"
                                                className="mr-3 hover:bg-green-100 w-9 h-9">
                                                <i className={`fa-duotone fa-solid fa-copy text-xl text-green-500`} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </>
                                );
                            }}
                            hideColList={['id', 'companyId', 'company', 'isTemplate']}
                        />
                    )}
                </div>

                <Transition appear show={isModalOpen} as={Fragment}>
                    <Dialog as="div" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-start justify-center px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="panel relative my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between border-b-2 bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <div className="flex text-lg font-bold">
                                                <div className="flex w-40 pl-2 text-info">
                                                    ایجاد مقدار مشابه
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-white-dark hover:text-dark">
                                                <i className={`fa-duotone fa-solid fa-xmark text-2xl text-gray-500`} />
                                            </button>
                                        </div>
                                        <div className="p-5 text-center text-2xl">آیا از ایجاد مشابه این ردیف مطمئن هستید؟</div>
                                        <div className="p-5">
                                            <div className="mt-8 flex items-center justify-end">
                                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline-info">
                                                    انصراف
                                                </button>
                                                <button type="button" onClick={() => handlerAddConstValue(selectedRowId)} className={`btn btn-info flex w-42 ltr:ml-4 rtl:mr-4 ${isLoading ? 'disabled' : ''}}`}>
                                                    <i className={`fa-duotone fa-solid fa-copy text-lg mx-1`} />
                                                    ایجاد مشابه
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default ArticleElements;
