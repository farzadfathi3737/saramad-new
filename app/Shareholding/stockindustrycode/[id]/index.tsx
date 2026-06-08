'use client'

import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { apiFetch } from '@/lib/apiFetch';

interface ICompany {
    industryName: string;
}

const Add = ({ id }: { id: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<ICompany>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('stockindustrycode');
            setModel(_model);

            if (_model && id) {
                await fetchData(_model, id.toString());
            }
        };

        setdata();
    }, [id]);

    const fetchData = async (_model: IDataModel, id: string) => {
        setIsLoading(true);

        const res = await apiFetch(`${_model?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result: ICompany = await res?.json();
            setData(result);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const SignupSchema = Yup.object().shape({
        accountingCode: Yup.string().required(t('required').toString()),
    });

    const handlEditClick = async (data: ICompany) => {
        setIsLoading(true);
        console.log(data);
        const res = await fetch(`${model?.update?.url.replace('{id}', id)}`, {
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
                        {t('edit')} {t('stockindustrycode')} : {appConfig.company.name}
                    </div>
                </div>

                {data && (
                    <div className="table-responsive px-5">
                        <div className="p-5">
                            <Formik
                                initialValues={data}
                                validationSchema={SignupSchema}
                                onSubmit={(values) => {
                                    console.log('ok', values);
                                    handlEditClick(values);
                                }}
                            >
                                <Form>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="w-full">
                                            <div>
                                                <label className="text-white-dark">{t('categoryId')}</label>
                                                <div className="form-input bg-white-light pt-3 text-white-dark">{data.industryName}</div>
                                            </div>
                                        </div>
                                        <div className="w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="accountingCode" name="accountingCode" label={'کد حساب صنعت'} component={FTextField} />
                                            </div>
                                            <div></div>
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
                )}
            </div>
        </div>
    );
};

export default Add;
