import FDateField from '@/app/components/inputs/dateField';
import FSelectField from '@/app/components/inputs/selectField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import FSelectPagingModelField from '@/app/components/inputs/selectPagingModelField';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';
import { IDataModel } from '@/interface/dataModel';
import { apiFetch } from '@/lib/apiFetch';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { IconCaretDown } from '@tabler/icons-react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const Add = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [dataStock, setDataStock] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('shareadjustment');
            setModel(_model);
        };

        setdata();
    }, []);

    const [active1, setActive1] = useState<boolean>(true);
    const [active2, setActive2] = useState<boolean>(true);

    const togglePara1 = (value: boolean) => {
        setActive1((oldValue) => {
            return oldValue === value ? false : value;
        });
    };

    const togglePara2 = (value: boolean) => {
        setActive2((oldValue) => {
            return oldValue === value ? false : value;
        });
    };
    const SignupSchema = Yup.object().shape({
        // stockId: Yup.string().required(t('required').toString()),
        // investmentType: Yup.string().required(t('required').toString()),
        // relationTypeId: Yup.string().required(t('required').toString()),
    });

    const handleAddClick = async (data: any) => {
        setLoading(true);

        //data.companyId = appConfig.company.id;

        const res = await apiFetch(`${model?.register?.url}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            // const result = res && (await res?.json());
            //setInitialRecords(result);
            //setAddModal(false);
            //fetchData();
            setLoading(false);
            //router.back();
            subPage('sharetransactionbatchtadilat')
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
                                onClick={() => subPage('sharetransactionbatchtadilat')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        تعدیل جدید
                    </div>
                </div>

                <div className="table-responsive px-0">
                    <div className="py-5">
                        <Formik
                            initialValues={{}}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                console.log('ok', values);
                                handleAddClick(values);
                            }}
                        >
                            <Form>

                                <div className="flex w-full px-5">
                                    <div className="w-full">
                                        <div className="space-y-c space-y-2 font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active2 ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara2(true)}
                                                >
                                                    اطلاعات پایه
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active2 ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active2 === true ? 'auto' : 0}>
                                                        <div className="grid w-full grid-cols-1 gap-2 p-5 px-10 sm:grid-cols-5">
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
                                                                <Field
                                                                    id="brokerId"
                                                                    name="brokerId"
                                                                    label="کارگزاری"
                                                                    listRefName="stockbroker"
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
                                                                <Field id="price" name="price" label="قیمت" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="volume" name="volume" label="حجم" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="grossCost" name="grossCost" label="بهای ناخالص" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="primeCost" name="primeCost" label="بهای تمام شده" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="netSellCost" name="netSellCost" label="بهای خالص فروش" component={FTextField} />
                                                            </div>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full px-5">
                                    <div className="w-full">
                                        <div className="space-y-c space-y-2 font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active2 ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara2(true)}
                                                >
                                                    کارمزدها و هزینه ها
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active2 ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active2 === true ? 'auto' : 0}>
                                                        <div className="grid w-full grid-cols-1 gap-2 p-5 px-10 sm:grid-cols-5">


                                                            <div>
                                                                <Field id="bourseAgencyCommission" name="bourseAgencyCommission" label="کارمزد سازمان بورس" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="bourseCompanyCommission" name="bourseCompanyCommission" label="کارمزد شرکت بورس" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="bourseITCommission" name="bourseITCommission" label="کارمزد مدیریت فناوری" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="bourseRayanCommission" name="bourseRayanCommission" label="کارمزد بورس رایان" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="depositoryCommission" name="depositoryCommission" label="کارمزد سپرده گذاری" component={FTextField} />
                                                            </div>

                                                            <div>
                                                                <Field id="brokerCommission" name="brokerCommission" label="کارمزد کارگزاری" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="brokerCommissionDiscount" name="brokerCommissionDiscount" label="تخفیف کارگزاری" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="tax" name="tax" label="مالیات" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="totalCommissions" name="totalCommissions" label="جمع کارمزد ها" component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="totalCosts" name="totalCosts" label="جمع هزینه ها" component={FTextField} />
                                                            </div>

                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end px-5" >
                                    <button type="button"
                                        onClick={() => subPage('sharetransactionbatchtadilat')}
                                        className="btn btn-outline-[#2D9AA0] font-iranyekan">
                                        {t('cancel')}
                                    </button>

                                    <button type="submit" className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-white">
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
