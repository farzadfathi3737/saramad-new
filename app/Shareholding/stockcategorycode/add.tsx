'use client'

import FDateField from '@/app/components/inputs/dateField';
import FSelectField from '@/app/components/inputs/selectField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCaretDown } from '@tabler/icons-react';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import FSelectPagingModelField from '@/app/components/inputs/selectPagingModelField';

const Add = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    const [active1, setActive1] = useState<boolean>(true);
    const [active2, setActive2] = useState<boolean>(true);
    const [active3, setActive3] = useState<boolean>(true);
    const [active4, setActive4] = useState<boolean>(true);
    const [active5, setActive5] = useState<boolean>(true);

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

    const togglePara3 = (value: boolean) => {
        setActive3((oldValue) => {
            return oldValue === value ? false : value;
        });
    };

    const togglePara4 = (value: boolean) => {
        setActive4((oldValue) => {
            return oldValue === value ? false : value;
        });
    };

    const togglePara5 = (value: boolean) => {
        setActive5((oldValue) => {
            return oldValue === value ? false : value;
        });
    };

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('stockcategorycode');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        categoryId: Yup.string().required(t('required').toString()),
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
            ColoredToast('success', t("message.success_save_message"));
            setLoading(false);
            subPage(model?.name.toLocaleLowerCase() ?? '');
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
                                onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')}>
                                <i className="fa-duotone fa-solid fa-chevron-right text-xl ml-2" />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        تعریف کدینگ اوراق بهادار
                    </div>
                </div>

                <div className="table-responsive">
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
                                <div className="grid w-full grid-cols-1 gap-2 px-10 pb-5 sm:grid-cols-2">
                                    <div>
                                        <Field id="categoryId" name="categoryId" label={t('categoryId')}
                                            listRefName="stockcategory"
                                            staticParams={[{ name: "ExcludeOption", value: true }]}
                                            component={FSelectPagingModelField} />
                                    </div>
                                </div>

                                <div className="flex w-full">
                                    <div className="w-full">
                                        <div className="space-y-2 space-y-c font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active1 ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara1(true)}
                                                >
                                                    <div className="px-5">کد حساب سرمایه گذاری</div>
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active1 === true ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active1 ? 'auto' : 0}>
                                                        <div className="w-full text-center text-lg text-red-900">حساب کل</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="investmentMainCode" name="investmentMainCode" label={t('investmentMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="pRightMainCode" name="pRightMainCode" label={t('pRightMainCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                        <div className="w-full border-t-2 text-center text-lg text-red-900">حساب معین</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="investmentSubCode" name="investmentSubCode" label={t('investmentSubCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="pRightSubCode" name="pRightSubCode" label={t('pRightSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full">
                                    <div className="w-full">
                                        <div className="space-y-2 space-y-c font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active2 ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara2(true)}
                                                >
                                                    <div className="px-5">کد حساب قیمت تمام شده</div>
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active2 === true ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active2 ? 'auto' : 0}>
                                                        <div className="w-full text-center text-lg text-red-900">حساب کل</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="primeCostMainCode" name="primeCostMainCode" label={t('primeCostMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="pRightPrimeCostMainCode" name="pRightPrimeCostMainCode" label={t('pRightPrimeCostMainCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                        <div className="w-full border-t-2 text-center text-lg text-red-900">حساب معین</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="primeCostSubCode" name="primeCostSubCode" label={t('primeCostSubCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="pRightPrimeCostSubCode" name="pRightPrimeCostSubCode" label={t('pRightPrimeCostSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full">
                                    <div className="w-full">
                                        <div className="space-y-2 space-y-c font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active3 ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara3(true)}
                                                >
                                                    <div className="px-5">کد حساب فروش و درآمدهای عملیاتی</div>
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active3 === true ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active3 ? 'auto' : 0}>
                                                        <div className="w-full text-center text-lg text-red-900">حساب کل</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="sellIncomeMainCode" name="sellIncomeMainCode" label={t('sellIncomeMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="sellIncomeSubCode" name="sellIncomeSubCode" label={t('sellIncomeSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                        <div className="w-full border-t-2 text-center text-lg text-red-900">حساب معین</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="pRightSellIncomeMainCode" name="pRightSellIncomeMainCode" label={t('pRightSellIncomeMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="pRightSellIncomeSubCode" name="pRightSellIncomeSubCode" label={t('pRightSellIncomeSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full">
                                    <div className="w-full">
                                        <div className="space-y-2 space-y-c font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active4 ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara4(true)}
                                                >
                                                    <div className="px-5">کد حساب سود سهام دریافتنی</div>
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active4 === true ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active4 ? 'auto' : 0}>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="shareBenefitMainCode" name="shareBenefitMainCode" label={t('shareBenefitMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="shareBenefitSubCode" name="shareBenefitSubCode" label={t('shareBenefitSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-1 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="shareBenefitIncomeMainCode" name="shareBenefitIncomeMainCode" label={t('shareBenefitIncomeMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="shareBenefitIncomeSubCode" name="shareBenefitIncomeSubCode" label={t('shareBenefitIncomeSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full">
                                    <div className="w-full">
                                        <div className="space-y-2 space-y-c font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active5 ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara5(true)}
                                                >
                                                    <div className="px-5">کد حساب سود حاصل از سرمایه گذاری</div>
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active1 === true ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active5 ? 'auto' : 0}>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="investmentBenefitMainCode" name="investmentBenefitMainCode" label={t('investmentBenefitMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="investmentBenefitSubCode" name="investmentBenefitSubCode" label={t('investmentBenefitSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end px-5">
                                    <button type="button" onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')} className="btn btn-outline-[#2D9AA0] font-iranyekan">
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
