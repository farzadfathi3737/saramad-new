'use client'

import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Yup from 'yup';
import { apiFetch } from '@/lib/apiFetch';

interface ICompany {
    name: string;
    backgroundColor: string;
    textColor: string;
}

const Edit = ({ id }: { id: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<ICompany>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('vouchertemplates');
            setModel(_model);
            await fetchData(_model, id);
        };
        console.log('id', id);
        setdata();
    }, [id]);

    const fetchData = async (_model: IDataModel, id: string) => {

        setIsFetching(true);
        const res = await apiFetch(`${_model?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result: ICompany = await res?.json();
            setData(result);
        } else {
            setData(undefined);
            ColoredToast('danger', t('msgError'));
        }
        setIsFetching(false);
    };

    const SignupSchema = Yup.object().shape({
        name: Yup.string().required('ورود نام شرکت اجباری است'),
    });

    const handlEditClick = async (data: ICompany) => {
        setIsLoading(true);
        const res = await apiFetch(`${model?.update?.url.replace('{id}', id)}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const result = res && (await res?.json());
            setIsLoading(false);
            ColoredToast('success', t('msgSuccess'));
            subPage(model?.name.toLocaleLowerCase() ?? '');
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
            setIsLoading(false);
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
                        {t('edit')} {t('vouchertemplates')}
                    </div>
                </div>
                {isFetching ? (
                    <div className="flex items-center justify-center p-10">
                        <i className="fa-duotone fa-solid fa-spinner fa-spin text-4xl text-gray-400" />
                    </div>
                ) : data ? (
                    <div className="table-responsive px-5">
                        <div className="p-5">
                            <Formik
                                initialValues={data}
                                validationSchema={SignupSchema}
                                onSubmit={(values) => {
                                    handlEditClick(values);
                                }}
                            >
                                <Form>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="w-full">
                                            <Field id="name" name="name" label="نام قالب" component={FTextField} />
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')} className="btn btn-outline-[#2D9AA0] font-iranyekan">
                                            {t('cancel')}
                                        </button>

                                        <button type="submit" disabled={isLoading} className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                            {isLoading && <i className="fa-duotone fa-solid fa-spinner fa-spin ml-2" />}
                                            {t('save')}
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-10">
                        <p className="text-gray-500">{t('noData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Edit;
