'use client'

import FColorField from '@/app/components/inputs/colorField';
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

interface ICompany {
    name: string;
}

const Add = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<ICompany>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const router = useRouter();
    const _router = Router();
    const { query } = _router;

    useEffect(() => {
        const setdata = async () => {
            let _model = getEntityModel('vouchertemplates');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        name: Yup.string().required('ورود نام شرکت اجباری است'),
    });

    const handlEditClick = async (data: any) => {
        setIsLoading(true);

        data.companyId = appConfig.company.id;

        const res = await fetch(`${model?.register?.url}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', t('message.success_save_message'));
            setIsLoading(false);
            router.back();
        } else {
            //console.log(res.body)
            const result = res && (await res?.json());
            ColoredToast('danger', result);
        }

        setIsLoading(false);
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
                        {t('add')} {t('vouchertemplates')}
                    </div>
                </div>
                <div className="table-responsive px-5">
                    <div className="p-5">
                        <Formik
                            initialValues={{}}
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
            </div>
        </div>
    );
};

export default Add;
