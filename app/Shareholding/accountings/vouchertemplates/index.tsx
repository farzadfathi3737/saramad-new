'use client'

import { getEntityModel } from '@/models/entity';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '@/app/components/Datatable/MRT';
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
    const [isDuplicating, setIsDuplicating] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string>('');

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('vouchertemplates');
            console.log(_model.list);
            const _modelValue = await getEntityModel('vouchertemplatesduplicate');

            _model?.list?.responses.map((item: IFieldsTable) => {
                if (item.accessor == 'isSystem') {
                    item = {
                        ...item,
                        Cell: ({ cell }) => {
                            const _bg = cell.getValue();
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
        setIsDuplicating(true);
        console.log(selectedRowId);
        const _url = await modelDataValue?.default?.url?.replaceAll('{id}', id).toString();
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
        setIsDuplicating(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        {t('list')} {t('accountingsVouchertemplates')}
                    </div>

                    <div className='p-2 h-full flex flex-col justify-center align-middle pl-2'>
                        <button type="button" className="btn btn-outline flex items-center rounded-lg p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]"
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
                                                onClick={() => subPage(`${modelData?.name.toLocaleLowerCase()}`, 'articles', undefined, [{ key: 'id', value: row.id }])}
                                                variant="transparent"
                                                className="mr-3 w-9 h-9">
                                                <i className={`fa-duotone fa-solid fa-newspaper text-xl text-gray-400 hover:text-blue-500`} />
                                            </ActionIcon>
                                        </Tooltip>

                                        <Tooltip label="ایجاد مشابه">
                                            <ActionIcon
                                                onClick={() => changeConstValueModalOpen(row.id.toString())}
                                                variant="transparent"
                                                className="mr-3 w-9 h-9">
                                                <i className={`fa-duotone fa-solid fa-clone text-xl text-gray-400 hover:text-green-500`} />
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
                                    <Dialog.Panel className="rounded-xl bg-white shadow-2xl overflow-hidden">
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                        <i className="fa-duotone fa-solid fa-clone text-white text-lg" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold text-lg">ایجاد مشابه</h3>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                    <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-8 text-center">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                                <i className="fa-duotone fa-solid fa-clone text-3xl text-green-500" />
                                            </div>
                                            <p className="text-xl font-medium text-gray-700">آیا از ایجاد مشابه این ردیف مطمئن هستید؟</p>
                                        </div>
                                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                انصراف
                                            </button>
                                            <button type="button" disabled={isDuplicating} onClick={() => handlerAddConstValue(selectedRowId)} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                {isDuplicating ? (
                                                    <>
                                                        <i className="fa-duotone fa-solid fa-spinner fa-spin" />
                                                        در حال ایجاد...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-duotone fa-solid fa-clone" />
                                                        ایجاد مشابه
                                                    </>
                                                )}
                                            </button>
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
