'use client'

import FDateField from '@/app/components/inputs/dateField';
import FSelectField from '@/app/components/inputs/selectField';
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

const Settlement = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('companytradingcode');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        tradingCode: Yup.string().required(t('required').toString()),
        type: Yup.string().required(t('required').toString()),
    });

    const handleAddClick = async (data: any) => {
        setLoading(true);
        console.log(data);

        data.companyId = appConfig.company.id;

        const res = await fetch(`${model?.register?.url}`, {
            method: 'post',
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
                                <i className="fa-duotone fa-solid fa-arrow-right text-lg ml-2" />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <div className="p-2">افزودن سبد معاملاتی - {appConfig.company.name}</div>
                </div>

                <div className="px-5">
                    <div className="p-5">
                        <Formik
                            initialValues={{}}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                //console.log('ok', values);
                                handleAddClick(values);
                                //alert(JSON.stringify(values, null, 2));
                            }}
                        >
                            <Form>
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div className="w-full">
                                        <Field id="accountingCode" name="tradingCode" label={t('tradingCode')} component={FTextField} />
                                    </div>
                                    <div className="w-full"></div>
                                    <div className="w-full">
                                        <div>
                                            <Field
                                                id="type"
                                                name="type"
                                                label={t('type')}
                                                options={model?.register?.requestBody
                                                    .find((x) => x.name == 'type')
                                                    ?.enums.map((item: string) => {
                                                        return { value: item, label: t(item.toLowerCase()) };
                                                    })}
                                                component={FSelectField}
                                            />
                                        </div>

                                        {/* <div>
                                            <Field id="accountingCode" name="accountingCode" label={t('accountingCode')} component={FTextField} />
                                        </div> */}
                                    </div>
                                    <div className="w-full"></div>
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

export default Settlement;
