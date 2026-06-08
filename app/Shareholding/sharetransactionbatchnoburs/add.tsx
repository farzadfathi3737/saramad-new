import FColorField from '@/app/components/inputs/colorField';
import FDateField from '@/app/components/inputs/dateField';
import FSelectField from '@/app/components/inputs/selectField';
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
            const _model = getEntityModel('nonmarketsharetransaction');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        // name: Yup.string().required('ورود نام شرکت اجباری است'),
    });

    const handleAddClick = async (data: any) => {
        setLoading(true);

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
            subPage('sharetransactionbatchnoburs')
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
                                onClick={() => subPage('sharetransactionbatchnoburs')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        افرودن تراکنش
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
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
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
                                    <div>
                                        <Field
                                            id="tradingCodeId"
                                            name="tradingCodeId"
                                            label="سبد معاملاتی"
                                            listRefName="companytradingcode"
                                            staticParams={[{ name: 'CompanyId', value: appConfig.company.id }]}
                                            component={FSelectModelField}
                                        />
                                    </div>
                                    <div>
                                        <Field id="transactionDate" name="transactionDate" label="تاریخ تعدیل" component={FDateField} />
                                    </div>
                                    <div>
                                        <Field
                                            id="calculationType"
                                            name="calculationType"
                                            label="نوع عملیات"
                                            options={model?.register?.requestBody
                                                .find((x) => x.name == 'calculationType')
                                                ?.enums.map((item: string) => {
                                                    return { value: item, label: t(item.toLowerCase()) };
                                                })}
                                            component={FSelectField}
                                        />
                                    </div>
                                    <div>
                                        <Field id="volume" name="volume" label="تعداد" component={FTextField} />
                                    </div>
                                    <div>
                                        <Field id="price" name="price" label="قیمت" component={FTextField} />
                                    </div>

                                    <div>
                                        <Field id="grossCost" name="grossCost" label="بهای ناخالص" component={FTextField} />
                                    </div>
                                    <div>
                                        <Field id="primeCost" name="primeCost" label="بهای خالص" component={FTextField} />
                                    </div>
                                    <div>
                                        <Field id="netSellCost" name="netSellCost" label="بهای تمام شده کل" component={FTextField} />
                                    </div>


                                </div>

                                <div className="mt-8 flex items-center justify-end">
                                    <button type="button"
                                        onClick={() => subPage('sharetransactionbatchnoburs')}
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