'use client'

import FDateField from '@/app/components/inputs/dateField';
import FSelectField from '@/app/components/inputs/selectField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import FTextAreaField from '@/app/components/inputs/textAreaField';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

interface IData {
    title: string;
    group: string;
    valueType: string;
    formula: string;
    value: string;
}

const Edit = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<IData>();
    const [loading, setLoading] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>();
    const [currentValueType, setCurrentValueType] = useState<string>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // rowId should be passed as prop or from URL params in App Router

        const setdata = async () => {
            let _model = await getEntityModel('articleelements');
            setModel(_model);
        };

        setdata();
    }, []);

    useEffect(() => {
        const setdata = async () => {
            rowId && fetchData(rowId);
        };

        setdata();
    }, [rowId]);

    const fetchData = async (id: string) => {
        setIsLoading(true);

        const res = await fetch(`${model?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result: IData = await res?.json();
            setData(result);
            setCurrentValueType(result.valueType);
            console.log('>>>>>.', result);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const SignupSchema = () =>
        Yup.object().shape({
            title: Yup.string().required(t('required').toString()),
            group: Yup.string().required(t('required').toString()),
            valueType: Yup.string().required(t('required').toString()),
            //value: Yup.string().required(t('required').toString()),
            //formula: Yup.string().required(t('required').toString()),
        });

    const handleAddClick = async (data: any) => {
        setLoading(true);
        console.log(data);
        const res = await fetch(`${model?.update?.url.replace('{id}', rowId ? rowId : '')}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const result = res && (await res?.json());
            //setInitialRecords(result);
            //setAddModal(false);
            //fetchData();
            setLoading(false);
            router.back();
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="mb-5 flex h-[3rem] items-start justify-start border-b-2 px-5 pb-3">
                    <div>
                        <Tooltip label={t('back')}>
                            <ActionIcon color="inheritans" className="flex items-center justify-center rounded-[50%] p-5 hover:bg-inherit hover:text-blue-900" onClick={() => router.back()}>
                                <i className={`fa-duotone fa-solid fa-arrow-right text-xl ml-2`} />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <div className="p-2">
                        ویرایش المان {data?.title} - {appConfig.company.name}
                    </div>
                </div>
                {data && (
                    <div className="table-responsive px-5">
                        <div className="p-5">
                            <Formik
                                initialValues={data}
                                validationSchema={SignupSchema}
                                onSubmit={(values) => {
                                    //console.log('ok', values);
                                    handleAddClick(values);
                                    //alert(JSON.stringify(values, null, 2));
                                }}
                            >
                                <Form>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="title" name="title" label={t('title')} component={FTextField} />
                                            </div>
                                            <div>
                                                <Field
                                                    id="group"
                                                    name="group"
                                                    label={t('group')}
                                                    options={model?.register?.requestBody
                                                        .find((x) => x.name == 'group')
                                                        ?.enums.map((item: string) => {
                                                            return { value: item, label: t(item.toLowerCase()) };
                                                        })}
                                                    component={FSelectField}
                                                />
                                            </div>
                                            <div>
                                                <Field
                                                    id="valueType"
                                                    name="valueType"
                                                    label={t('valueType')}
                                                    onChange={(item: any) => {
                                                        setCurrentValueType(item.value);
                                                        console.log(item);
                                                    }}
                                                    options={model?.register?.requestBody
                                                        .find((x) => x.name == 'valueType')
                                                        ?.enums.map((item: string) => {
                                                            return { value: item, label: t(item.toLowerCase()) };
                                                        })}
                                                    component={FSelectField}
                                                />
                                            </div>
                                            {currentValueType == 'FixedValue' && (
                                                <div>
                                                    <Field id="value" name="value" label={t('value')} component={FTextField} />
                                                </div>
                                            )}
                                            {currentValueType == 'Formula' && (
                                                <div>
                                                    <Field id="formula" name="formula" rows={4} label={t('formula')} component={FTextAreaField} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" onClick={() => router.back()} className="btn btn-outline-[#2D9AA0] font-iranyekan">
                                            {t('cancel')}
                                        </button>

                                        <button type="submit" className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                            {/* <IconPencil className="ltr:mr-1 rtl:ml-1 rtl:rotate-180" /> */}
                                            {t('save')}
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Edit;
