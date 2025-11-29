//import IconCaretDown from '@/components/Icon/IconCaretDown';
//import IconSearch from '@/components/Icon/IconSearch';
import FColorField from '@/app/components/inputs/colorField';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { IDataModel, ITabData } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { setTabs } from '@/store/appConfigSlice';
//import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
//import AnimateHeight from 'react-animate-height';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

const Add = () => {
    const { t } = useTranslation();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [active1, setActive1] = useState<boolean>(true);

    const appConf = useSelector((state: IRootState) => state.appConfig);
    const dispatch = useDispatch();

    const togglePara1 = (value: boolean) => {
        setActive1((oldValue) => {
            return oldValue === value ? false : value;
        });
    };

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('company');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        name: Yup.string().required('ورود نام شرکت اجباری است'),
    });

    const handleAddClick = async (data: any) => {
        setLoading(true);

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
                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                //className="flex items-center justify-center rounded-full p-5 !hover:bg-[#2D9AA0] hover:text-blue-900" 
                                className="btn btn-outline pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('companyProfile')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        تعریف شرکت جدید
                    </div>
                </div>

                <div className="table-responsive px-5">
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
                                        <Field id="name" name="name" label="نام شرکت" component={FTextField} />
                                    </div>
                                    <div className="w-full"></div>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <Field id="backgroundColor" name="backgroundColor" label="رنگ زمینه" component={FColorField} />
                                        </div>
                                        <div>
                                            <Field id="textColor" name="textColor" label="رنگ متن" component={FColorField} />
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="flex w-full">
                                    <div className="mb-5 w-full">
                                        <div className="space-y-2 font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active1 ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara1(true)}
                                                >
                                                    <div className="px-5">مشخصات سند حسابداری</div>
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active1 === true ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active1 ? 'auto' : 0}>
                                                        <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                                            <div className="w-full">
                                                                <Field id="name" name="name" label="شرح سند حسابداری" component={FTextField} />
                                                            </div>
                                                            <div className="w-full"></div>
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

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
