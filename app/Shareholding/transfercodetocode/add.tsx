import FColorField from '@/app/components/inputs/colorField';
import FDateField from '@/app/components/inputs/dateField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';
import { IDataModel } from '@/interface/dataModel';
import { apiFetch } from '@/lib/apiFetch';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const Add = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('sharetransfer');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        transferDate: Yup.string().required('لطفا تاریخ را وارد کنید'),
        fromTradingCodeId: Yup.string().required('لطفا سبد معاملاتی مبدا را مشخص کنید'),
        toTradingCodeId: Yup.string().required('لطفا سبد معاملاتی مقصد را مشخص کنید'),
        amount: Yup.string().required('تعداد انتقالی را وارد کنید'),
    });

    const handleAddClick = async (data: any) => {
        setLoading(true);

        console.log(model);

        const res = await apiFetch(`${model?.register?.url}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const result = res && (await res?.json());
            setLoading(false);
            subPage('transfercodetocode')
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('transfercodetocode')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        کد به کد جدید
                    </div>
                </div>

                <div className="table-responsive px-5">
                    <div className="p-5">
                        <Formik
                            initialValues={{}}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                handleAddClick(values);
                            }}
                        >
                            <Form>
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <Field id="transferDate" name="transferDate" label="تاریخ" component={FDateField} />
                                        </div>
                                        <div>
                                            <Field
                                                id="shareId"
                                                name="shareId"
                                                label="سهم"
                                                listRefName="share"
                                                staticParams={[{ name: 'CompanyId', value: appConfig.company.id }]}
                                                component={FSelectModelField}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full"></div>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">

                                        <div>
                                            <Field
                                                id="fromTradingCodeId"
                                                name="fromTradingCodeId"
                                                label="از سبد معاملاتی"
                                                listRefName="companytradingcode"
                                                staticParams={[{ name: 'CompanyId', value: appConfig.company.id }]}
                                                component={FSelectModelField}
                                            />
                                        </div>
                                        <div>
                                            <div>
                                                <Field
                                                    id="toTradingCodeId"
                                                    name="toTradingCodeId"
                                                    label="به سبد معاملاتی"
                                                    listRefName="companytradingcode"
                                                    staticParams={[{ name: 'CompanyId', value: appConfig.company.id }]}
                                                    component={FSelectModelField}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full"></div>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <Field id="amount" name="amount" label="تعداد انتقالی" component={FTextField} isNumber={true} />
                                        </div>
                                    </div>
                                    <div className="w-full"></div>
                                </div>

                                <div className="mt-8 flex items-center justify-end">
                                    <button type="button"
                                        onClick={() => subPage('transfercodetocode')}
                                        className="btn btn-outline-[#2D9AA0] font-iranyekan">
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