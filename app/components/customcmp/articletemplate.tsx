import { IDataModel } from '@/interface/dataModel';
import { Field, Form, Formik } from 'formik';
import { Fragment, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import FSelectField from '../inputs/selectField';
import FTextField from '../inputs/textField';
import { Dialog, Transition } from '@headlessui/react';
import { Tooltip } from '@mantine/core';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ColoredToast } from '../Notifications/colorNotification';
import { getEntityModel } from '@/models/entity';
import { apiFetch } from '@/lib/apiFetch';

interface IData {
    model: IDataModel | undefined;
    modelAE: IDataModel | undefined;
    VoucherTemplateId: string;
    addModalOpen: boolean;
    setAddModalOpen: any;
}

const customStyles = {
    singleValue: (base: any) => ({
        ...base,
        fontSize: '14px',
    }),
    menu: (base: any) => ({
        ...base,
        fontSize: '14px',
    }),
}

const Articletemplates: React.FC<IData> = ({ model, modelAE, VoucherTemplateId, addModalOpen, setAddModalOpen }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>();
    const [dataRow, setDataRow] = useState<any>();
    const [valueData, setValueData] = useState<any>();
    const [conditionData, setConditionData] = useState<any>();
    const [groupingData, setGroupingData] = useState<any>();
    const [accountingCodeData, setAccountingCodeData] = useState<any>();
    const { t } = useLanguage();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    //const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [isDoubelModalOpen, setIsDoubelModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentRowId, setCurrentRowId] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const getData = async () => {
            await setCompanyId(appConfig.company.id);
        };

        getData();
    }, [appConfig.company]);

    useEffect(() => {
        const getData = async () => {
            setConditionData(await fetchDataAE('Condition'));
            setValueData(await fetchDataAE('Value'));
            setGroupingData(await fetchDataAE('Grouping'));
            setAccountingCodeData(await fetchDataAE('AccountingCode'));
        };

        companyId && getData();
    }, [companyId]);

    useEffect(() => {
        const getData = async () => {
            await fetchData(VoucherTemplateId);
            //await setCompanyId(appConfig.company.id);

            // setConditionData(await fetchDataAE('Condition'));
            // setValueData(await fetchDataAE('Value'));
            // setGroupingData(await fetchDataAE('Grouping'));
            // setAccountingCodeData(await fetchDataAE('AccountingCode'));
        };

        getData();

        //console.log(valueData);
    }, []);

    // useEffect(() => {
    //     console.log(addModalOpen);
    //     //addModalOpen > 0 && setIsAddModalOpen(true);
    //     //setIsAddModalOpen(true);
    //     setAddModalOpen(true);
    // }, [addModalOpen]);

    const handlerShowDeleteModal = (id: string, message: string) => {
        setCurrentRowId(id);
        setModalMessage(message);
        setIsDeleteModalOpen(true);
    };

    const handlerShowDoubleModal = (id: string, message: string) => {
        setCurrentRowId(id);
        setModalMessage(message);
        setIsDoubelModalOpen(true);
    };


    const fetchData = async (id: string) => {
        setIsLoading(true);

        const res = await apiFetch(`${model?.list?.url}?VoucherTemplateId=${id}`);

        if (res.ok) {
            const result: any = await res?.json();
            setData(result);
        } else {
            setData(undefined);
            ColoredToast('danger', t('msgError'));
        }
        setIsLoading(false);
    };


    const fetchDataRow = async (id: string) => {
        setIsLoading(true);

        const res = await apiFetch(`${model?.read?.url.replace("{id}", id)}`);

        if (res.ok) {
            const result: any = await res?.json();
            setDataRow(result);
        } else {
            setDataRow(undefined);
            ColoredToast('danger', t('msgError'));
        }
        setIsLoading(false);
    };

    const fetchDataAE: any = async (group: string) => {
        setIsLoading(true);

        const res = await apiFetch(`${modelAE?.listRef?.url}?CompanyId=${companyId}&Group=${group}`);

        if (res.ok) {
            const result: any = await res?.json();
            setIsLoading(false);
            return result.items;
        } else {
            setIsLoading(false);
            return undefined;
        }
    };

    const editModalOpen = async (item: any) => {
        await fetchDataRow(item.id);
        setIsEditModalOpen(true);
    };

    const handleAddClick = async (data: any) => {
        setLoading(true);

        data.companyId = companyId;
        data.voucherTemplateId = VoucherTemplateId;

        const res = await apiFetch(`${model?.register?.url}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', t('msgSuccess'));
            await fetchData(VoucherTemplateId);
            setAddModalOpen(false);
        } else {
            const responce = await res.json();
            ColoredToast('danger', responce.title || t('msgError'));
        }
        setLoading(false);
    };
    const handleEditClick = async (data: any) => {
        setLoading(true);

        data.companyId = companyId;
        data.voucherTemplateId = VoucherTemplateId;

        const res = await apiFetch(`${model?.update?.url.replace("{id}", data.id)}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', t('msgSuccess'));
            await fetchData(VoucherTemplateId);
            setIsEditModalOpen(false);
        } else {
            const responce = await res.json();
            ColoredToast('danger', responce.title || t('msgError'));
        }
        setLoading(false);
    };

    const handlerDelete = async (id: string) => {
        setLoading(true);

        const res = await apiFetch(model?.delete?.url.replace('{id}', id) as string, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            ColoredToast('success', t('msgSuccess'));
            await fetchData(VoucherTemplateId);
            setIsDeleteModalOpen(false);
        } else {
            const responce = await res.json();
            ColoredToast('danger', responce.title || t('msgError'));
        }
        setLoading(false);
    };

    const handlerDouble = async (id: string) => {
        setLoading(true);

        const _model = getEntityModel('articletemplatesduplicate');
        const res = await apiFetch(_model?.default?.url.replace('{id}', id) as string, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            ColoredToast('success', t('msgSuccess'));
            await fetchData(VoucherTemplateId);
            setIsDoubelModalOpen(false);
        } else {
            const responce = await res.json();
            ColoredToast('danger', responce.title || t('msgError'));
        }
        setLoading(false);
    };

    return (
        <>
            <div className="mb-4 overflow-hidden rounded-xl border border-gray-300 shadow-md">
                <div className="grid grid-cols-2">
                    <div>
                        <div className="bg-gradient-to-r from-orange-300 to-orange-400 py-3 text-center">
                            <span className="text-lg font-bold text-white">بدهکار</span>
                        </div>
                        <div className="bg-orange-50/50">
                            <div>
                                <div className="grid grid-cols-4 border-b border-gray-200">
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">کل</div>
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 1</div>
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 3</div>
                                    <div className="flex-1 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 5</div>
                                </div>
                                <div className="grid grid-cols-4 border-b border-gray-200">
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">معین</div>
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 2</div>
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 4</div>
                                    <div className="flex-1 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 6</div>
                                </div>
                                <div className="grid grid-cols-1">
                                    <div className="flex-1 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">شرح</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-r border-gray-300">
                        <div className="bg-gradient-to-r from-green-300 to-green-400 py-3 text-center">
                            <span className="text-lg font-bold text-white">بستانکار</span>
                        </div>
                        <div className="bg-green-50/50">
                            <div>
                                <div className="grid grid-cols-4 border-b border-gray-200">
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">کل</div>
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 1</div>
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 3</div>
                                    <div className="flex-1 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 5</div>
                                </div>
                                <div className="grid grid-cols-4 border-b border-gray-200">
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">معین</div>
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 2</div>
                                    <div className="flex-1 border-l border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 4</div>
                                    <div className="flex-1 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">تفضیلی 6</div>
                                </div>
                                <div className="grid grid-cols-1">
                                    <div className="flex-1 px-3 py-2.5 text-center text-sm font-semibold text-gray-700">شرح</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {data?.items?.length > 0 ? (
                data.items?.map((item: any, index: number) => {
                    return (
                        <>
                            <div className="mb-2 rounded-t-md border border-gray-400">
                                <div className="grid grid-cols-4 gap-4 rounded-md border-b-2 bg-gray-200 px-5 py-2">
                                    <div className="flex w-full items-center justify-center">
                                        <div className="flex items-center justify-center pl-5">
                                            <div className="flex-none">ردیف : </div>
                                            <div className="flex-1 px-2 text-lg font-bold text-white-dark">{item.order}</div>
                                        </div>
                                        <div className="flex-none">مقدار : </div>
                                        <div className="flex-1 px-2 text-lg font-bold text-white-dark">{item.valueTitle}</div>
                                    </div>
                                    <div className="flex w-full items-center justify-center">
                                        <div className="flex-none">شرایط:</div>
                                        <div className="flex-1 px-2 text-lg font-bold text-white-dark">{item.conditionTitle}</div>
                                    </div>
                                    <div className="flex w-full items-center justify-center">
                                        <div className="flex-none">گروه:</div>
                                        <div className="flex-1 px-2 text-lg font-bold text-white-dark">{item.groupingTitle}</div>
                                    </div>
                                    <div className="flex w-full items-end justify-end">
                                        <div className="flex flex-row">
                                            {!item.isSystem && (
                                                <>
                                                    <Tooltip label="ایجاد مشابه">
                                                        <div onClick={() => handlerShowDoubleModal(item.id.toString(), item.name)}
                                                            className="cursor-pointer">
                                                            <i className="fa-duotone fa-solid fa-clone text-xl text-gray-400 hover:text-green-500" />
                                                        </div>
                                                    </Tooltip>
                                                    <Tooltip label="ویرایش">
                                                        <div onClick={() => editModalOpen(item)}
                                                            className="cursor-pointer mr-3">
                                                            <i className="fa-duotone fa-solid fa-pen-to-square text-xl text-gray-400 hover:text-orange-500" />
                                                        </div>
                                                    </Tooltip>
                                                    <Tooltip label="حذف">
                                                        <div onClick={() => handlerShowDeleteModal(item.id.toString(), item.name)}
                                                            className="cursor-pointer mr-3">
                                                            <i className="fa-duotone fa-solid fa-trash text-xl text-gray-400 hover:text-red-500" />
                                                        </div>
                                                    </Tooltip>
                                                </>
                                            )}

                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1">
                                    <div className="rounded-md">
                                        <div>
                                            <div className="grid grid-cols-8 h-full">
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-orange-50 text-white-dark">{item.debGeneralTitle ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-orange-50 text-white-dark">{item.debDetail1Title ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-orange-50 text-white-dark">{item.debDetail3Title ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-orange-50 text-white-dark">{item.debDetail5Title ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-green-50 text-white-dark">{item.creGeneralTitle ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-green-50 text-white-dark">{item.creDetail1Title ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-green-50 text-white-dark">{item.creDetail3Title ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-green-50 text-white-dark">{item.creDetail5Title ?? "-"}</div>
                                            </div>
                                            <div className="grid grid-cols-8 h-full">
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-orange-50 text-white-dark">{item.debSubsidiaryTitle ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-orange-50 text-white-dark">{item.debDetail2Title ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-orange-50 text-white-dark">{item.debDetail4Title ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-orange-50 text-white-dark">{item.debDetail6Title ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-green-50 text-white-dark">{item.creSubsidiaryTitle ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-green-50 text-white-dark">{item.creDetail2Title ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-green-50 text-white-dark">{item.creDetail4Title ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-green-50 text-white-dark">{item.creDetail6Title ?? "-"}</div>
                                            </div>
                                            <div className="grid grid-cols-2 h-full">
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-orange-50 text-white-dark">{item.debDescription ?? "-"}</div>
                                                <div className="flex-1 border p-2 px-2 text-md font-bold bg-green-50 text-white-dark">{item.creDescription ?? "-"}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="rounded-md">
                                        <div className="bg-green-50">
                                            <div>
                                                <div className="grid grid-cols-4">
                                                    <div className="flex-1 border p-2 px-2 text-md font-bold text-white-dark">{item.creGeneralTitle ?? "-"}</div>
                                                    <div className="flex-1 border p-2 px-2 text-md font-bold text-white-dark">{item.creDetail1Title ?? "-"}</div>
                                                    <div className="flex-1 border p-2 px-2 text-md font-bold text-white-dark">{item.creDetail3Title ?? "-"}</div>
                                                    <div className="flex-1 border p-2 px-2 text-md font-bold text-white-dark">{item.creDetail5Title ?? "-"}</div>
                                                </div>
                                                <div className="grid grid-cols-4">
                                                    <div className="flex-1 border p-2 px-2 text-md font-bold text-white-dark">{item.creSubsidiaryTitle ?? "-"}</div>
                                                    <div className="flex-1 border p-2 px-2 text-md font-bold text-white-dark">{item.creDetail2Title ?? "-"}</div>
                                                    <div className="flex-1 border p-2 px-2 text-md font-bold text-white-dark">{item.creDetail4Title ?? "-"}</div>
                                                    <div className="flex-1 border p-2 px-2 text-md font-bold text-white-dark">{item.creDetail6Title ?? "-"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                            {/* <Formik
                            initialValues={item}
                            //validationSchema={{}}
                            onSubmit={(values) => {
                                //handlEditClick(values);
                                //alert(JSON.stringify(values, null, 2));
                            }}
                        >
                            <Form>
                                {/* <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="w-full disabled">
                                            <Field id="accountingCode" name="tradingCode" label={t('tradingCode')} component={FTextField} disabled={true} />
                                        </div>
                                        <div className="w-full"></div>
                                        <div className="w-full">
                                            <div>
                                                <Field
                                                    id="type"
                                                    name="type"
                                                    label={t('type')}
                                                    disabled={true}
                                                    options={model?.register?.requestBody
                                                        .find((x) => x.name == 'type')
                                                        ?.enums.map((item: string) => {
                                                            return { value: item, label: t(item.toLowerCase()) };
                                                        })}
                                                    component={FSelectField}
                                                />
                                            </div>
                                        
                                        </div>
                                        <div className="w-full"></div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" onClick={() => router.back()} className="btn btn-outline-[#2D9AA0] font-iranyekan">
                                            {t('cancel')}
                                        </button>

                                        <button type="submit" className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                            {t('save')}
                                        </button>
                                    </div> /}

                                <div className="rounded-md border p-5">
                                    <div className="grid grid-cols-2 gap-4 pb-3">
                                        <div>
                                            <Field
                                                id="type"
                                                name="type"
                                                label="مقدار"
                                                disabled={true}
                                                options={model?.register?.requestBody
                                                    .find((x) => x.name == 'type')
                                                    ?.enums.map((item: string) => {
                                                        return { value: item, label: t(item.toLowerCase()) };
                                                    })}
                                                component={FSelectField}
                                            />
                                        </div>
                                        <div>
                                            <Field
                                                id="type"
                                                name="type"
                                                label="شرایط"
                                                disabled={true}
                                                options={model?.register?.requestBody
                                                    .find((x) => x.name == 'type')
                                                    ?.enums.map((item: string) => {
                                                        return { value: item, label: t(item.toLowerCase()) };
                                                    })}
                                                component={FSelectField}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 rounded-md">
                                        <div className="rounded-md border">
                                            <div className="rounded-t-md bg-orange-500 p-2 text-center">بدهکار</div>
                                            <div className="p-2">
                                                <div>
                                                    
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="کل"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 1"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 3"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 5"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="معین"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 2"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 4"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 6"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Field
                                                            id="creDescription"
                                                            name="creDescription"
                                                            label="شرح"
                                                            component={FTextField}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Field
                                                            id="type"
                                                            name="type"
                                                            label="گروه"
                                                            disabled={true}
                                                            options={model?.register?.requestBody
                                                                .find((x) => x.name == 'type')
                                                                ?.enums.map((item: string) => {
                                                                    return { value: item, label: t(item.toLowerCase()) };
                                                                })}
                                                            component={FSelectField}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-md border">
                                            <div className="bg-green-500 p-2 text-center">بستانکار</div>
                                            <div className="p-2">
                                                <div>
                                                    
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="کل"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 1"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 3"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 5"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="معین"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 2"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 4"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="type"
                                                                name="type"
                                                                label="تفصیلی 6"
                                                                disabled={true}
                                                                options={model?.register?.requestBody
                                                                    .find((x) => x.name == 'type')
                                                                    ?.enums.map((item: string) => {
                                                                        return { value: item, label: t(item.toLowerCase()) };
                                                                    })}
                                                                component={FSelectField}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Field
                                                            id="debDescription"
                                                            name="debDescription"
                                                            label="شرح"
                                                            component={FTextField}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Field
                                                            id="type"
                                                            name="type"
                                                            label="گروه"
                                                            disabled={true}
                                                            options={model?.register?.requestBody
                                                                .find((x) => x.name == 'type')
                                                                ?.enums.map((item: string) => {
                                                                    return { value: item, label: t(item.toLowerCase()) };
                                                                })}
                                                            component={FSelectField}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </Formik> */}
                        </>
                    );
                })
            ) : (
                <div className="flex w-full justify-center">اطلاعاتی برای نمایش وجود ندارد</div>
            )}

            <Transition appear show={addModalOpen} as={Fragment}>
                <Dialog as="div" open={addModalOpen} onClose={() => setAddModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                <Dialog.Panel className="my-16 w-full max-w-full overflow-hidden rounded-xl bg-white shadow-2xl">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                                                    <i className="fa-duotone fa-solid fa-plus text-2xl text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white">افزایش قالب سودی زیانی آرتیکل ها</h3>
                                            </div>
                                            <button type="button" onClick={() => setAddModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                                <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                            </button>
                                        </div>
                                    </div>

                                    <Formik
                                        initialValues={{}}
                                        //validationSchema={{}}
                                        onSubmit={(values) => {
                                            //handlEditClick(values);
                                            handleAddClick(values);
                                            //alert(JSON.stringify(values, null, 2));
                                        }}
                                    >
                                        <Form>
                                            <div className="p-5 text-xl">
                                                <div className="p-2">
                                                    <div className="grid grid-cols-4 gap-4 pb-3">
                                                        <div>
                                                            <Field
                                                                id="order"
                                                                name="order"
                                                                label="ردیف"
                                                                component={FTextField}
                                                                classNameLabel={"text-lg"}
                                                                classNameValue={"text-md"}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="valueId"
                                                                name="valueId"
                                                                label="مقدار"
                                                                options={valueData?.map((item: any) => {
                                                                    return { value: item.id, label: item.name };
                                                                })}
                                                                component={FSelectField}
                                                                classNameLabel={"text-lg"}
                                                                classNameValue={"text-md"}
                                                                customStyles={customStyles}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="conditionId"
                                                                name="conditionId"
                                                                label="شرایط"
                                                                disabled={true}
                                                                options={conditionData?.map((item: any) => {
                                                                    return { value: item.id, label: item.name };
                                                                })}
                                                                component={FSelectField}
                                                                classNameLabel={"text-lg"}
                                                                classNameValue={"text-md"}
                                                                customStyles={customStyles}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="groupingId"
                                                                name="groupingId"
                                                                label="گروه"
                                                                disabled={true}
                                                                options={groupingData?.map((item: any) => {
                                                                    return { value: item.id, label: item.name };
                                                                })}
                                                                component={FSelectField}
                                                                classNameLabel={"text-lg"}
                                                                classNameValue={"text-md"}
                                                                customStyles={customStyles}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 rounded-md">
                                                        <div className="rounded-md border">
                                                            <div className="rounded-t-md bg-orange-200 p-2 text-center">بدهکار</div>
                                                            <div className="p-2">
                                                                <div>
                                                                    <div className="grid grid-cols-4 gap-2">
                                                                        <div>
                                                                            <Field
                                                                                id="debGeneralId"
                                                                                name="debGeneralId"
                                                                                label="کل"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail1Id"
                                                                                name="debDetail1Id"
                                                                                label="تفصیلی 1"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail3Id"
                                                                                name="debDetail3Id"
                                                                                label="تفصیلی 3"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail5Id"
                                                                                name="debDetail5Id"
                                                                                label="تفصیلی 5"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-4 gap-2">
                                                                        <div>
                                                                            <Field
                                                                                id="debSubsidiaryId"
                                                                                name="debSubsidiaryId"
                                                                                label="معین"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail2Id"
                                                                                name="debDetail2Id"
                                                                                label="تفصیلی 2"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail4Id"
                                                                                name="debDetail4Id"
                                                                                label="تفصیلی 4"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail6Id"
                                                                                name="debDetail6Id"
                                                                                label="تفصیلی 6"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-1 gap-4">
                                                                    <div>
                                                                        <Field id="debDescription" name="debDescription" label="شرح" component={FTextField} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="rounded-md border">
                                                            <div className="rounded-t-md bg-green-200 p-2 text-center">بستانکار</div>
                                                            <div className="p-2">
                                                                <div>
                                                                    <div className="grid grid-cols-4 gap-2">
                                                                        <div>
                                                                            <Field
                                                                                id="creGeneralId"
                                                                                name="creGeneralId"
                                                                                label="کل"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail1Id"
                                                                                name="creDetail1Id"
                                                                                label="تفصیلی 1"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail3Id"
                                                                                name="creDetail3Id"
                                                                                label="تفصیلی 3"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail5Id"
                                                                                name="creDetail5Id"
                                                                                label="تفصیلی 5"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-4 gap-2">
                                                                        <div>
                                                                            <Field
                                                                                id="creSubsidiaryId"
                                                                                name="creSubsidiaryId"
                                                                                label="معین"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail2Id"
                                                                                name="creDetail2Id"
                                                                                label="تفصیلی 2"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail4Id"
                                                                                name="creDetail4Id"
                                                                                label="تفصیلی 4"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail6Id"
                                                                                name="creDetail6Id"
                                                                                label="تفصیلی 6"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-1 gap-4">
                                                                    <div>
                                                                        <Field id="creDescription" name="creDescription" label="شرح" component={FTextField} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button type="button" onClick={() => setAddModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                                                        انصراف
                                                    </button>
                                                    <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center gap-2">
                                                        {loading && <i className="fa-duotone fa-solid fa-spinner fa-spin" />}
                                                        {!loading && <i className="fa-duotone fa-solid fa-plus" />}
                                                        افزایش
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    </Formik>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isEditModalOpen} as={Fragment}>
                <Dialog as="div" open={isEditModalOpen} onClose={() => setIsEditModalOpen?.(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                <Dialog.Panel className="my-16 w-full max-w-full overflow-hidden rounded-xl bg-white shadow-2xl">
                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                                                    <i className="fa-duotone fa-solid fa-pen-to-square text-2xl text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white">ویرایش قالب سودی زیانی آرتیکل ها</h3>
                                            </div>
                                            <button type="button" onClick={() => setIsEditModalOpen?.(false)} className="text-white/80 hover:text-white transition-colors">
                                                <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                            </button>
                                        </div>
                                    </div>

                                    <Formik
                                        initialValues={dataRow}
                                        //validationSchema={{}}
                                        onSubmit={(values) => {
                                            //handlEditClick(values);
                                            handleEditClick(values);
                                            //alert(JSON.stringify(values, null, 2));
                                        }}
                                    >
                                        <Form>
                                            <div className="p-5 text-xl">
                                                <div className="p-2">
                                                    <div className="grid grid-cols-4 gap-4 pb-3">
                                                        <div>
                                                            <Field
                                                                id="order"
                                                                name="order"
                                                                label="ردیف"
                                                                component={FTextField}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="valueId"
                                                                name="valueId"
                                                                label="مقدار"
                                                                options={valueData?.map((item: any) => {
                                                                    return { value: item.id, label: item.name };
                                                                })}
                                                                component={FSelectField}
                                                                classNameLabel={"text-lg"}
                                                                classNameValue={"text-md"}
                                                                customStyles={customStyles}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="conditionId"
                                                                name="conditionId"
                                                                label="شرایط"
                                                                disabled={true}
                                                                options={conditionData?.map((item: any) => {
                                                                    return { value: item.id, label: item.name };
                                                                })}
                                                                component={FSelectField}
                                                                classNameLabel={"text-lg"}
                                                                classNameValue={"text-md"}
                                                                customStyles={customStyles}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="groupingId"
                                                                name="groupingId"
                                                                label="گروه"
                                                                disabled={true}
                                                                options={groupingData?.map((item: any) => {
                                                                    return { value: item.id, label: item.name };
                                                                })}
                                                                component={FSelectField}
                                                                classNameLabel={"text-lg"}
                                                                classNameValue={"text-md"}
                                                                customStyles={customStyles}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 rounded-md">
                                                        <div className="rounded-md border">
                                                            <div className="rounded-t-md bg-orange-200 p-2 text-center">بدهکار</div>
                                                            <div className="p-2">
                                                                <div>
                                                                    <div className="grid grid-cols-4 gap-2">
                                                                        <div>
                                                                            <Field
                                                                                id="debGeneralId"
                                                                                name="debGeneralId"
                                                                                label="کل"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail1Id"
                                                                                name="debDetail1Id"
                                                                                label="تفصیلی 1"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail3Id"
                                                                                name="debDetail3Id"
                                                                                label="تفصیلی 3"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail5Id"
                                                                                name="debDetail5Id"
                                                                                label="تفصیلی 5"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-4 gap-2">
                                                                        <div>
                                                                            <Field
                                                                                id="debSubsidiaryId"
                                                                                name="debSubsidiaryId"
                                                                                label="معین"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail2Id"
                                                                                name="debDetail2Id"
                                                                                label="تفصیلی 2"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail4Id"
                                                                                name="debDetail4Id"
                                                                                label="تفصیلی 4"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="debDetail6Id"
                                                                                name="debDetail6Id"
                                                                                label="تفصیلی 6"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-1 gap-4">
                                                                    <div>
                                                                        <Field id="debDescription" name="debDescription" label="شرح" component={FTextField} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="rounded-md border">
                                                            <div className="rounded-t-md bg-green-200 p-2 text-center">بستانکار</div>
                                                            <div className="p-2">
                                                                <div>
                                                                    <div className="grid grid-cols-4 gap-2">
                                                                        <div>
                                                                            <Field
                                                                                id="creGeneralId"
                                                                                name="creGeneralId"
                                                                                label="کل"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail1Id"
                                                                                name="creDetail1Id"
                                                                                label="تفصیلی 1"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail3Id"
                                                                                name="creDetail3Id"
                                                                                label="تفصیلی 3"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail5Id"
                                                                                name="creDetail5Id"
                                                                                label="تفصیلی 5"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-4 gap-2">
                                                                        <div>
                                                                            <Field
                                                                                id="creSubsidiaryId"
                                                                                name="creSubsidiaryId"
                                                                                label="معین"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail2Id"
                                                                                name="creDetail2Id"
                                                                                label="تفصیلی 2"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail4Id"
                                                                                name="creDetail4Id"
                                                                                label="تفصیلی 4"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="creDetail6Id"
                                                                                name="creDetail6Id"
                                                                                label="تفصیلی 6"
                                                                                options={accountingCodeData?.map((item: any) => {
                                                                                    return { value: item.id, label: item.name };
                                                                                })}
                                                                                component={FSelectField}
                                                                                classNameLabel={"text-lg"}
                                                                                classNameValue={"text-md"}
                                                                                customStyles={customStyles}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-1 gap-4">
                                                                    <div>
                                                                        <Field id="creDescription" name="creDescription" label="شرح" component={FTextField} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button type="button" onClick={() => setIsEditModalOpen?.(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                                                        انصراف
                                                    </button>
                                                    <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center gap-2">
                                                        {loading && <i className="fa-duotone fa-solid fa-spinner fa-spin" />}
                                                        {!loading && <i className="fa-duotone fa-solid fa-pen-to-square" />}
                                                        ویرایش
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    </Formik>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isDeleteModalOpen} as={Fragment}>
                <Dialog as="div" open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                            <div className="flex w-40 pl-2 text-danger">
                                                <i className="fa-duotone fa-solid fa-trash ml-2" />
                                                حذف
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="text-white-dark hover:text-dark">
                                            <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                        </button>
                                    </div>
                                    <div className="p-5 text-center text-2xl">آیا از حذف این ردیف مطمئن هستید؟</div>
                                    {modalMessage && <div className="p-1 text-center text-xl text-gray-900">{`( ${modalMessage} )`}</div>}
                                    <div className="p-5">
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn btn-outline-danger">
                                                انصراف
                                            </button>
                                            <button type="button" onClick={() => handlerDelete(currentRowId)} disabled={loading} className="btn btn-danger flex w-32 ltr:ml-4 rtl:mr-4">
                                                {loading ? (
                                                    <i className="fa-duotone fa-solid fa-spinner fa-spin ml-2" />
                                                ) : (
                                                    <i className="fa-duotone fa-solid fa-trash ml-2" />
                                                )}
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isDoubelModalOpen} as={Fragment}>
                <Dialog as="div" open={isDoubelModalOpen} onClose={() => setIsDoubelModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                            <div className="flex w-40 pl-2 text-success">
                                                <i className="fa-duotone fa-solid fa-clone ml-2" />
                                                ایجاد مشابه
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setIsDoubelModalOpen(false)} className="text-white-dark hover:text-dark">
                                            <i className="fa-duotone fa-solid fa-xmark text-2xl" />
                                        </button>
                                    </div>
                                    <div className="p-5 text-center text-2xl">آیا از ایجاد مشابه این ردیف مطمئن هستید؟</div>
                                    {modalMessage && <div className="p-1 text-center text-xl text-gray-900">{`( ${modalMessage} )`}</div>}
                                    <div className="p-5">
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" onClick={() => setIsDoubelModalOpen(false)} className="btn btn-outline-danger">
                                                انصراف
                                            </button>
                                            <button type="button" onClick={() => handlerDouble(currentRowId)} disabled={loading} className="btn btn-success flex w-32 ltr:ml-4 rtl:mr-4">
                                                {loading ? (
                                                    <i className="fa-duotone fa-solid fa-spinner fa-spin ml-2" />
                                                ) : (
                                                    <i className="fa-duotone fa-solid fa-clone ml-2" />
                                                )}
                                                ایجاد
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </>
    );
};

export default Articletemplates;
