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

const Add = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);

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

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('stockcategorycodeoption');
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
            //setInitialRecords(result);
            //setAddModal(false);
            //fetchData();
            setLoading(false);
            ColoredToast('success', t('msgSuccess'));
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
                                onClick={() => subPage('stockcategorycode')}>
                                <i className="fa-duotone fa-solid fa-chevron-right text-xl ml-2" />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        تعریف کدینگ اوراق اختیار معامله
                    </div>
                </div>

                <div className="table-responsive">
                    <div className="pb-5">
                        <Formik
                            initialValues={{}}
                            //validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                //console.log('ok', values);
                                handleAddClick(values);
                                //alert(JSON.stringify(values, null, 2));
                            }}
                        >
                            <Form>
                                <div className="flex w-full">
                                    <div className="w-full">
                                        <div className="space-y-2 space-y-c font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active1 ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara1(true)}
                                                >
                                                    <div className="px-5">کد حساب اختیار خرید</div>
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active1 === true ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active1 ? 'auto' : 0}>
                                                        <div className="w-full text-center text-lg text-red-900">سرمایه گذاری</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="callOptionInvestmentMainCode" name="callOptionInvestmentMainCode" label={t('callOptionInvestmentMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="callOptionInvestmentSubCode" name="callOptionInvestmentSubCode" label={t('callOptionInvestmentSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                        <div className="w-full border-t-2 text-center text-lg text-red-900">بدهی</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="callOptionDeptMainCode" name="callOptionDeptMainCode" label={t('callOptionDeptMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="callOptionDeptSubCode" name="callOptionDeptSubCode" label={t('callOptionDeptSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                        <div className="w-full border-t-2 text-center text-lg text-red-900">سود و زیان</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="callOptionBenefitMainCode" name="callOptionBenefitMainCode" label={t('callOptionBenefitMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="callOptionBenefitSubCode" name="callOptionBenefitSubCode" label={t('callOptionBenefitSubCode')} component={FTextField} />
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
                                                    <div className="px-5">کد حساب اختیار فروش </div>
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active2 === true ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active2 ? 'auto' : 0}>
                                                        <div className="w-full text-center text-lg text-red-900">سرمایه گذاری</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="putOptionInvestmentMainCode" name="putOptionInvestmentMainCode" label={t('putOptionInvestmentMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="putOptionInvestmentSubCode" name="putOptionInvestmentSubCode" label={t('putOptionInvestmentSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                        <div className="w-full border-t-2 text-center text-lg text-red-900">بدهی</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="putOptionDeptMainCode" name="putOptionDeptMainCode" label={t('putOptionDeptMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="putOptionDeptSubCode" name="putOptionDeptSubCode" label={t('putOptionDeptSubCode')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                        <div className="w-full border-t-2 text-center text-lg text-red-900">سود و زیان</div>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="putOptionBenefitMainCode" name="putOptionBenefitMainCode" label={t('putOptionBenefitMainCode')} component={FTextField} />
                                                            </div>
                                                            <div className="w-full">
                                                                <Field id="putOptionBenefitSubCode" name="putOptionBenefitSubCode" label={t('putOptionBenefitSubCode')} component={FTextField} />
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
