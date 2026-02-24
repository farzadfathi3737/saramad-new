'use client'

import FDateField from '@/app/components/inputs/dateField';
import FSelectField from '@/app/components/inputs/selectField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const ReApply = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState("");

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('sharemeetingreapply');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        reApplyFromDate: Yup.string().required(t('required').toString()),
        //shareId: Yup.string().required(t('required').toString()),
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
            ColoredToast('success', t('message.success_save_message'));
            setLoading(false);
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex items-center pr-5'>
                        <span className="mr-2">اعمال مجدد مجامع</span>
                    </div>

                    <div className='p-2 h-full flex flex-col justify-center align-middle pl-2'>
                    </div>
                </div>
                <div className="px-0">
                    <div className="py-5">
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
                                <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <Field id="reApplyFromDate" name="reApplyFromDate" label="اعمال از تاریخ" component={FDateField} />
                                        </div>
                                        <div>
                                            <Field id="shareId" name="shareId" label={t('shareid')} listRefName="share" staticParams={[{ name: 'CompanyId', value: companyId }]} component={FSelectModelField} />
                                        </div>
                                    </div>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div></div>
                                    </div>
                                    <div className="flex w-full"></div>
                                    <div className="mb-5 w-full"></div>
                                </div>

                                <div className="mt-8 flex items-center justify-end px-5">
                                    <button type="button" onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')} className="btn btn-outline-[#2D9AA0] font-iranyekan">
                                        {t('cancel')}
                                    </button>

                                    <button type="submit" disabled={loading} className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                        {loading ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin ml-2" />
                                                در حال پردازش...
                                            </>
                                        ) : (
                                            t('save')
                                        )}
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

export default ReApply;
