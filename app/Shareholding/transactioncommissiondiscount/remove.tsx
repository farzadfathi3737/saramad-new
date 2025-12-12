'use client'

import FSelectModel from '@/app/components/Forms/selectModel';
import FDateField from '@/app/components/inputs/dateField';
import FSelectField from '@/app/components/inputs/selectField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
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

const Reapply = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');

    useEffect(() => {
        const getData = async () => {
            await setCompanyId(appConfig.company.id);
        };

        getData();
    }, [appConfig.company]);

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('transactioncommissiondiscountremove');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        fromDate: Yup.string().required(t('required').toString()),
        toDate: Yup.string().required(t('required').toString()),
    });

    const handleAddClick = async (data: any) => {
        setLoading(true);

        data.companyId = appConfig.company.id;

        const res = await fetch(`${model?.register?.url}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            //const result = res && (await res?.json());
            ColoredToast('success', t("message.success_save_message"));
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
                    <div className="p-2">حذف تخفیف ها</div>
                </div>

                <div className="">
                    <div className="py-5">
                        <Formik
                            initialValues={{}}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                handleAddClick(values);
                            }}
                        >
                            <Form>

                                <div className="grid w-full grid-cols-4 gap-2 px-10 pt-5 sm:grid-cols-4">
                                    <div className="w-full">
                                        <Field id="fromDate" name="fromDate" label={t('fromdate')} component={FDateField} />
                                    </div>
                                    <div className="w-full">
                                        <Field id="toDate" name="toDate" label={t('todate')} component={FDateField} />
                                    </div>
                                    <div className="w-full">
                                        <Field id="stockCategoryId" name="stockCategoryId" label={t('stockcategory')} listRefName="stockcategory" component={FSelectModelField} />
                                    </div>
                                    <div className="w-full">
                                        <Field id="shareId" name="shareId" label={t('share')} listRefName="share" staticParams={[{ name: 'CompanyId', value: companyId }]} component={FSelectModelField} />
                                    </div>
                                    <div className="w-full">
                                        <Field
                                            id="BrokerId"
                                            name="BrokerId"
                                            label={t('broker')}
                                            listRefName="stockbroker"
                                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                                            component={FSelectModelField}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Field
                                            id="creDetail1Id"
                                            name="creDetail1Id"
                                            label="نوع عملیات"
                                            options={[{ value: "Increment", label: "خرید" },
                                            { value: "Decrement", label: "فروش" }]}
                                            component={FSelectField}
                                        />
                                    </div>
                                </div>


                                <div className="mt-8 flex items-center justify-end px-5">
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

export default Reapply;
