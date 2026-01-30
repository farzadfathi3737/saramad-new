'use client'

import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { apiFetch } from '@/lib/apiFetch';

interface IData {
    voucherDescription: string | null;
    id: string;
}

const Add = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<IData>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const router = useRouter();

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('accountingsettings');
            setModel(_model);
        };

        setdata();
    }, []);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);


    // useEffect(() => {
    //     const setdata = async () => {
    //         companyId && (await fetchData(companyId));
    //     };

    //     setdata();
    // }, [companyId]);

    useEffect(() => {
        if (companyId && model) {
            fetchData(companyId);
        }
    }, [companyId, model]);

    const fetchData = async (id: string) => {
        setIsLoading(true);

        const res = await apiFetch(`${model?.list?.url}?companyId=${id}`);

        if (res.ok) {
            const result: IData = await res?.json();

            if (result.voucherDescription == null || result.voucherDescription == undefined) {
                result.voucherDescription = '';
            }

            setData(result);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const SignupSchema = Yup.object().shape({
        voucherDescription: Yup.string().required('ورود شرح سند اجباری است'),
        //id: Yup.string().required(),
    });

    const handlEditClick = async (data: IData) => {
        setIsLoading(true);
        console.log(data);
        const res = await fetch(`${model?.update?.url.replace('{companyId}', companyId ? companyId : '')}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const result = res && (await res?.json());
            ColoredToast('success', t("message.success_save_message"));
            setIsLoading(false);
            //router.back();
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', t("message.error_save_message"));
            //setInitialRecords({ pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
        }
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex items-center pr-5'>
                        <span className="mr-2">تنظیمات سند حسابداری</span>
                    </div>

                    <div className='p-2 h-full flex flex-col justify-center align-middle pl-2'>
                    </div>
                </div>

                {data &&
                    <div className="table-responsive px-5">
                        <div className="p-5">
                            <Formik
                                initialValues={data}
                                validationSchema={SignupSchema}
                                //initialValues={{}}
                                onSubmit={(values) => {
                                    handlEditClick(values);
                                    //alert(JSON.stringify(values, null, 2));
                                }}
                            >
                                <Form>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="w-full">
                                            <Field
                                                id="voucherDescription"
                                                name="voucherDescription"
                                                //value={data?.voucherDescription}
                                                label="شرح سند حسابداری"
                                                component={FTextField}
                                            />
                                        </div>
                                        <div className="w-full" hidden>
                                            {/* <Field id="id" hidden name="id" label="شرح سند حسابداری" component={FTextField} /> */}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-end">
                                        {/* <button type="button" onClick={() => router.back()} className="btn btn-outline-[#2D9AA0] font-iranyekan">
                                            {t('cancel')}
                                        </button> */}

                                        <button type="submit" className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                            {/* <IconPencil className="ltr:mr-1 rtl:ml-1 rtl:rotate-180" /> */}
                                            {t('save')}
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Add;
