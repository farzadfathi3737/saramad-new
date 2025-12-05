'use client'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { useRouter } from 'next/router';
import { IRootState } from '../../store';
import { Field, Form, Formik } from 'formik';
import FSelectModelField from './inputs/selectModelField';
import { getEntityModel } from '@/models/entity';
import { ICompanyParam, IOptionType, IstaticParam } from '@/interface/dataModel';
import { setActiveTab, setCompany, setFiscalYear, setTabs } from '@/store/appConfigSlice';
import * as Yup from 'yup';
import { Dropdown } from 'flowbite-react';

interface IinitData {
    company: string;
    fiscalYear: string;
}

const ChangeCompany = () => {
    //const router = useRouter();
    const dispatch = useDispatch();

    const companyModel = getEntityModel('company');
    const fiscalYearModel = getEntityModel('fiscalyear');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [staticParams, setStaticParams] = useState<IstaticParam[]>();
    const [lcompany, setLCompany] = useState<ICompanyParam>();
    const [lfiscalYear, setLFiscalYear] = useState<IstaticParam>();
    const [initData, setInitData] = useState<IinitData>();

    const appConf = useSelector((state: IRootState) => state.appConfig);
    console.log("config--------------->>>>>>", appConf)
    const SignupSchema = Yup.object().shape({
        company: Yup.string().required('Required'),
        fiscalYear: Yup.string().required('Required'),
    });

    useEffect(() => {
        dispatch(setCompany(JSON.parse(localStorage.getItem('company')!) || null));
        dispatch(setFiscalYear(JSON.parse(localStorage.getItem('fiscalYear')!) || null));
    }, [])

    const changeCompany = async () => {
        const res = await fetch(`${companyModel?.read?.url.replace('{id}', lcompany?.id)}`);

        if (res.ok) {
            const result = res && (await res?.json());
            dispatch(
                setCompany({
                    name: lcompany?.name,
                    id: lcompany?.id,
                    backgroundColor: result?.backgroundColor,
                    textColor: result?.textColor,
                })
            );

            dispatch(setTabs([{
                id: "dashboard",
                key: "dashboard",
                name: "dashboard",
                orter: 0,
                filters: [], params: []
            }]));
            dispatch(setActiveTab('dashboard'));

            window.location.reload();
        } else {
        }
        dispatch(
            setFiscalYear({
                name: lfiscalYear?.name,
                id: lfiscalYear?.value,
            })
        );

        closeModal();
    };

    useEffect(() => {
        setStaticParams([{ name: 'CompanyId', value: appConf.company?.id }]);

        if (!appConf.company) {
            openModal();
        }

        console.log("config---------------", appConf)

    }, [appConf]);


    useEffect(() => {


        console.log("staticParams---------------", staticParams)

    }, [staticParams]);
    return (

        <div className="flex w-full items-center justify-start sm:rtl:ml-auto sm:rtl:mr-auto">

            {/* <div className="rounded-xl p-2 pr-2"
                style={{ backgroundColor: appConf?.company?.backgroundColor, color: appConf?.company?.textColor }}
            >
                {appConf.company?.name}
            </div>
            <div className="px-5">{
                appConf.fiscalYear?.name
            }</div>

            <button type="button" className="btn btn-outline mr-3 flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-[#fff]" onClick={openModal}>
                تغییر شرکت
            </button> */}

            <div className='flex items-center justify-between min-w-xs border rounded-full p-2' style={{ backgroundColor: appConf?.company?.backgroundColor, color: appConf?.company?.textColor }}>
                <div className='pr-2'>شرکت : {appConf.company?.name}</div>
                <div>سال : {appConf.fiscalYear?.name}</div>
                <div>
                    <button
                        type="button"
                        className="bg-white/20 flex flex-col rounded-full p-2 text-center text-sm"
                        style={{ color: appConf?.company?.textColor }}
                        onClick={openModal}
                    >
                        <i className={`fa-duotone fa-solid fa-ellipsis-stroke text-xl`} />
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold">تغییر شرکت و سال مالی</h2>

                        <Formik
                            initialValues={{
                                company: appConf.company?.id,
                                fiscalYear: appConf.fiscalYear?.id,
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                changeCompany();
                            }}
                        >
                            {({ isSubmitting, isValid, touched, errors }) => (
                                <Form>
                                    <div className="flex w-full">
                                        <div className="grid w-full grid-cols-1">
                                            <div className="pb-5">
                                                <Field
                                                    id={'company'}
                                                    name={'company'}
                                                    type="text"
                                                    label="شرکت"
                                                    //className="selectHeder"
                                                    listRefName={companyModel?.name}
                                                    component={FSelectModelField}
                                                    isSearchable={false}
                                                    onChange={(val: IOptionType) => {
                                                        setStaticParams([{ name: 'CompanyId', value: val.value }]);
                                                        setLCompany({
                                                            name: val.label,
                                                            id: val.value,
                                                            backgroundColor: '',
                                                            textColor: '',
                                                        });
                                                        if (val.value !== appConf.company?.id) {
                                                            setLFiscalYear({
                                                                name: '',
                                                                value: '',
                                                            });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="pb-5">
                                                {staticParams && <Field
                                                    id={'fiscalYear'}
                                                    name={'fiscalYear'}
                                                    //className="selectHeder"
                                                    label={'سال مالی'}
                                                    type="text"
                                                    listRefName={fiscalYearModel?.name}
                                                    component={FSelectModelField}
                                                    isSearchable={false}
                                                    staticParams={staticParams}
                                                    // value={initData?.fiscalYear}
                                                    onChange={(val: IOptionType) => {
                                                        console.log(val);
                                                        setLFiscalYear({
                                                            name: val.label,
                                                            value: val.value,
                                                        });
                                                        // setInitData({
                                                        //     company: lcompany?.id,
                                                        //     fiscalYear: val.value,
                                                        // });
                                                        // dispatch(
                                                        //     setFiscalYear({
                                                        //         name: val.label,
                                                        //         id: val.value,
                                                        //     })
                                                        // );
                                                    }}
                                                />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        {appConf.company && (
                                            <button onClick={closeModal} className="ml-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                                                انصراف
                                            </button>
                                        )}

                                        <button type="submit" disabled={isSubmitting || !isValid} className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-700">
                                            تغییر
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        {/* <div>{appConf.fiscalYear.name}</div> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangeCompany;
