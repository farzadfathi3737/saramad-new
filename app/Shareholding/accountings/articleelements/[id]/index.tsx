'use client'

import FTextAreaField from '@/app/components/inputs/textAreaField';
import FTextField from '@/app/components/inputs/textField';
import FSelectField from '@/app/components/inputs/selectField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { apiFetch } from '@/lib/apiFetch';

interface IData {
    title: string;
    group: string;
    valueType: string;
    formula: string;
    value: string;
}

const Edit = ({ id }: { id: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<IData>();
    const [loading, setLoading] = useState<boolean>(false);
    const [currentValueType, setCurrentValueType] = useState<string>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const setdata = () => {
            const _model = getEntityModel('articleelements');
            setModel(_model);
            fetchData(_model, id);
        };

        setdata();
    }, [id]);

    const fetchData = async (_model: IDataModel, id: string) => {
        setIsLoading(true);

        const res = await apiFetch(`${_model?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result: IData = await res?.json();
            setData(result);
            console.log('result.valueType', result);
            setCurrentValueType(result.valueType);
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
        });

    const handleEditClick = async (data: any) => {
        setLoading(true);
        const res = await apiFetch(`${model?.update?.url.replace('{id}', id)}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const result = res && (await res?.json());
            setLoading(false);
            ColoredToast('success', t('msgSuccess'));
            subPage(model?.name.toLocaleLowerCase() ?? '');
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')}>
                                <i className="fa-duotone fa-solid fa-chevron-right text-xl ml-2" />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        ویرایش المان {data?.title}
                    </div>
                </div>
                {data && (
                    <div className="table-responsive p-5">
                        <div className="p-5">
                            <Formik
                                initialValues={data}
                                validationSchema={SignupSchema}
                                onSubmit={(values) => {
                                    handleEditClick(values);
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
                                        <button type="button" onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')} className="btn btn-outline-[#2D9AA0] font-iranyekan">
                                            {t('cancel')}
                                        </button>

                                        <button type="submit" disabled={loading} className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                            {loading && <i className="fa-duotone fa-solid fa-spinner fa-spin ml-2" />}
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
