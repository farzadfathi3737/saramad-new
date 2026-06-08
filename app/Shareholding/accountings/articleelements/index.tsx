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
    const [modelDuplicate, setModelDuplicate] = useState<IDataModel>();
    const [isLoading, setIsLoading] = useState(false);
    const [isConstValueSaving, setIsConstValueSaving] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDublicateModalOpen, setIsDublicateModalOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string>('');

    useEffect(() => {
        const setdata = () => {
            const _model = getEntityModel('articleelements');
            const _modelValue = getEntityModel('articleelementsvalue');
            const _modelDuplicate = getEntityModel('articleelementsduplicate');

            // _model?.list?.responses.map((item: IFieldsTable) => {
            //     if (['backgroundColor', 'textColor'].includes(item.accessor)) {
            //         item = {
            //             ...item,
            //             Cell: ({ cell }) => {
            //                 let _bg = cell.getValue();
            //                 return (
            //                     <div className="flex w-full items-center justify-start">
            //                         {_bg ? <div className={`h-8 w-8 rounded-md border `} style={{ backgroundColor: _bg }} /> : <div className={`h-8 w-8 rounded-md border bg-inherit`} />}
            //                         <div className="pr-2">{_bg}</div>
            //                     </div>
            //                 );
            //             },
            //         };

            //         _model.list.responses = [..._model.list.responses.filter((x: any) => x.accessor != item.accessor), item];
            //     }

            //     if (item.accessor == 'isHolding') {
            //         item = {
            //             ...item,
            //             Cell: ({ cell }) => {
            //                 let _bg = cell.getValue();
            //                 return <div className="flex w-full items-center justify-start">{_bg ? <FontAwesomeIcon icon={faCheck} size="lg" className="ml-2 text-green-700" /> : <></>}</div>;
            //             },
            //         };

            //         _model.list.responses = [..._model.list.responses.filter((x: any) => x.accessor != item.accessor), item];
            //     }
            // });

            setModelData(_model);
            setModelDataValue(_modelValue);
            setModelDuplicate(_modelDuplicate);
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

    const dublcateModalOpen = async (id: string) => {
        setSelectedRowId(id);
        setIsDublicateModalOpen(true);
    };

    const handlerAddConstValue = async (data: any) => {
        setIsConstValueSaving(true);

        data.id = selectedRowId;
        data.elementId = selectedRowId;

        const _url = await modelDataValue?.default?.url?.replaceAll('{elementId}', selectedRowId).toString();
        console.log(_url);
        const res = await fetch(_url!, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', t('message.success_save_message'));
            tableRefreshRef?.current?.fetchData();
            setIsModalOpen(false);
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
        }
        setIsConstValueSaving(false);
    };

    const handlerDublicate = async (id: string) => {
        setIsDuplicating(true);

        const _url = await modelDuplicate?.default?.url?.replace('{id}', id).toString();
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
            setIsDublicateModalOpen(false);
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
                        {t('list')} {t('accountingsArticleElements')}
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
                                { label: 'Keyword', value: 'companyName' },
                                { label: 'name', value: 'نام شرکت' },
                            ]}
                            myRef={tableRefreshRef}
                            action={(row) => {
                                return <>
                                    <Tooltip label="ایجاد مشابه">
                                        <ActionIcon onClick={() => dublcateModalOpen(row.id.toString())}
                                            variant="transparent"
                                            className="mr-3 w-9 h-9">
                                            <i className={`fa-duotone fa-solid fa-clone text-xl text-gray-400 hover:text-blue-500`} />
                                        </ActionIcon>
                                    </Tooltip>
                                    {row.valueType == 'FixedValue' &&
                                        <Tooltip label="مقدار ثابت">
                                            <ActionIcon onClick={() => changeConstValueModalOpen(row.id.toString())}
                                                variant="transparent"
                                                className="mr-3 w-9 h-9">
                                                <i className={`fa-duotone fa-solid fa-input-numeric text-xl text-gray-400 hover:text-green-500`} />
                                            </ActionIcon>
                                        </Tooltip>
                                    }
                                </>
                            }}
                            hideColList={['id', 'companyId', 'company', 'isSystem', 'valueType']}
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
                                                        <i className="fa-duotone fa-solid fa-input-numeric text-white text-lg" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold text-lg">تعریف مقدار ثابت</h3>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                    <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                </button>
                                            </div>
                                        </div>

                                        <Formik
                                            initialValues={{
                                                id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                                                elementId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                                                companyId: companyId,
                                                value: '',
                                            }}
                                            //validationSchema={{}}
                                            onSubmit={(values) => {
                                                // console.log('ok', values);
                                                handlerAddConstValue(values);
                                                //alert(JSON.stringify(values, null, 2));
                                            }}
                                        >
                                            <Form>
                                                <div className="p-6">
                                                    <Field id="value" name="value" label="مقدار" component={FTextField} isNumber={true} />
                                                </div>
                                                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                        انصراف
                                                    </button>
                                                    <button type="submit" disabled={isConstValueSaving} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                        {isConstValueSaving ? (
                                                            <>
                                                                <i className="fa-duotone fa-solid fa-spinner fa-spin" />
                                                                در حال ثبت...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa-duotone fa-solid fa-check" />
                                                                ثبت
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </Form>
                                        </Formik>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                <Transition appear show={isDublicateModalOpen} as={Fragment}>
                    <Dialog as="div" open={isDublicateModalOpen} onClose={() => setIsDublicateModalOpen(false)}>
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
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                        <i className="fa-duotone fa-solid fa-clone text-white text-lg" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold text-lg">ایجاد مشابه</h3>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => setIsDublicateModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                    <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-8 text-center">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                                <i className="fa-duotone fa-solid fa-clone text-3xl text-blue-500" />
                                            </div>
                                            <p className="text-xl font-medium text-gray-700">آیا از ایجاد مشابه این ردیف مطمئن هستید؟</p>
                                        </div>
                                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
                                            <button type="button" onClick={() => setIsDublicateModalOpen(false)} className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                                انصراف
                                            </button>
                                            <button type="button" disabled={isDuplicating} onClick={() => handlerDublicate(selectedRowId)} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
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
