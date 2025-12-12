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
    const [modelStock, setModelStock] = useState<IDataModel>();
    const [dataStock, setDataStock] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('share');
            setModel(_model);

            const _modelStock = getEntityModel('stock');
            setModelStock(_modelStock);
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
        stockId: Yup.string().required(t('required').toString()),
        investmentType: Yup.string().required(t('required').toString()),
        relationTypeId: Yup.string().required(t('required').toString()),
    });

    const handleAddClick = async (data: any) => {
        setLoading(true);

        data.companyId = appConfig.company.id;

        const res = await apiFetch(`${model?.register?.url}`, {
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

    const handleChange = async (id: string) => {
        setLoading(true);

        const res = await apiFetch(`${modelStock?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result = res && (await res?.json());
            console.log('result', result);
            setDataStock(result);
            setLoading(false);
        } else {
            //setInitialRecords({ pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
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
                                className="btn btn-outline pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        {t('add')} {t('share')} : {appConfig.company?.name}
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
                                <div className="grid w-full grid-cols-1 gap-2 px-10 pb-5 sm:grid-cols-2">
                                    <div className="w-full">
                                        <Field
                                            id="stockId"
                                            name="stockId"
                                            label="نام سهام"
                                            listRefName="stock"
                                            component={FSelectModelField}
                                            onChange={(item: any) => {
                                                // console.log(item);
                                                handleChange(item.value);
                                            }}
                                            placeholder="لطفا یک مورد را انتخاب کنید"
                                        />
                                    </div>
                                    <div className="w-full"></div>
                                </div>
                                <hr />
                                <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <fieldset>
                                                <label className="!text-gray-600">{t('symbol')}</label>
                                                <div className="form-input !bg-gray-200 pt-3 !text-gray-600 flex items-center">{dataStock?.symbol}</div>
                                            </fieldset>
                                        </div>
                                        <div>
                                            <fieldset>
                                                <label className="!text-gray-600">نوع سهام</label>
                                                <div className="form-input !bg-gray-200 pt-3 !text-gray-600 flex items-center">{dataStock?.stockTypeName}</div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="flex w-full"></div>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <fieldset>
                                                <label className="!text-gray-600">نام سهام</label>
                                                <div className="form-input !bg-gray-200 pt-3 !text-gray-600 flex items-center">{dataStock?.name}</div>
                                            </fieldset>
                                        </div>
                                        <div>
                                            <Field
                                                id="investmentType"
                                                name="investmentType"
                                                label={t('investmentType')}
                                                options={model?.register?.requestBody
                                                    .find((x) => x.name == 'investmentType')
                                                    ?.enums.map((item: string) => {
                                                        return { value: item, label: t(item.toLowerCase()) };
                                                    })}
                                                component={FSelectField}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex w-full"></div>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <fieldset>
                                                <label className="!text-gray-600">گروه</label>
                                                <div className="form-input !bg-gray-200 pt-3 !text-gray-600 flex items-center">{dataStock?.categoryName}</div>
                                            </fieldset>
                                        </div>
                                        <div>
                                            <Field
                                                id="relationTypeId"
                                                name="relationTypeId"
                                                label={t('relationTypeId')}
                                                listRefName="sharerelationtype"
                                                staticParams={[{ name: 'CompanyId', value: appConfig.company.id }]}
                                                component={FSelectModelField}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex w-full"></div>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <fieldset>
                                                <label className="!text-gray-600">صنعت</label>
                                                <div className="form-input !bg-gray-200 pt-3 !text-gray-600 flex items-center">{dataStock?.industryName}</div>
                                            </fieldset>
                                        </div>
                                        <div></div>
                                    </div>
                                    <div className="flex w-full"></div>
                                    <div className="mb-5 w-full"></div>
                                </div>

                                {dataStock?.optionDetails && (
                                    <div className="flex w-full">
                                        <div className="w-full">
                                            <div className="space-y-c space-y-2 font-iranyekan">
                                                <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                    <button
                                                        type="button"
                                                        className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active2 ? '!#089bab' : '#089bab'}`}
                                                        onClick={() => togglePara2(true)}
                                                    >
                                                        مشخصات اوراق اختیار معامله
                                                        <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active2 ? 'rotate-180' : ''}`}>
                                                            <IconCaretDown />
                                                        </div>
                                                    </button>
                                                    <div>
                                                        <AnimateHeight duration={300} height={active2 === true ? 'auto' : 0}>
                                                            <div className="grid w-full grid-cols-1 gap-2 p-5 px-10 sm:grid-cols-2">
                                                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                    <div>
                                                                        <fieldset>
                                                                            <label className="!text-gray-600">{t('expirationDate')}</label>
                                                                            <div className="form-input !bg-gray-200 pt-3 !text-gray-600 flex items-center">{dataStock?.optionDetails.expirationDate}</div>
                                                                        </fieldset>
                                                                    </div>
                                                                    <div>
                                                                        <fieldset>
                                                                            <label className="!text-gray-600">{'نوع اختیار'}</label>
                                                                            <div className="form-input !bg-gray-200 pt-3 !text-gray-600 flex items-center">{dataStock?.optionDetails.typeName}</div>
                                                                        </fieldset>
                                                                    </div>
                                                                </div>
                                                                <div className="grid w-full"></div>
                                                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                    <div>
                                                                        <fieldset>
                                                                            <label className="!text-gray-600">{t('strikePrice')}</label>
                                                                            <div className="form-input !bg-gray-200 pt-3 !text-gray-600 flex items-center">{dataStock?.optionDetails.strikePrice}</div>
                                                                        </fieldset>
                                                                    </div>
                                                                    <div>
                                                                        <fieldset>
                                                                            <label className="!text-gray-600">{t('contractSize')}</label>
                                                                            <div className="form-input !bg-gray-200 pt-3 !text-gray-600 flex items-center">{dataStock?.optionDetails.contractSize}</div>
                                                                        </fieldset>
                                                                    </div>
                                                                </div>
                                                                <div className="grid w-full"></div>
                                                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                    <div>
                                                                        <fieldset>
                                                                            <label className="!text-gray-600">{'نماد سهم اصلی اختیار'}</label>
                                                                            <div className="form-input !bg-gray-200 pt-3 !text-gray-600 flex items-center">{dataStock?.optionDetails.contractStockName}</div>
                                                                        </fieldset>
                                                                    </div>
                                                                    <div></div>
                                                                </div>
                                                                <div className="grid w-full">
                                                                    <div>
                                                                        {/* <Link
                                                                            className="btn btn-outline flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                                                            href={`/Shareholding/stock/${data.optionDetails?.contractStockId}`}
                                                                            onClick={() => setRowId(data.optionDetails?.contractStockId)}
                                                                        >
                                                                            نماد سهم اصلی اختیار
                                                                        </Link> */}
                                                                    </div>
                                                                </div>
                                                                <div className="grid w-full"></div>
                                                            </div>
                                                        </AnimateHeight>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-c space-y-2 font-iranyekan">
                                    <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                        <button
                                            type="button"
                                            className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active1 ? '!#089bab' : '#089bab'}`}
                                            onClick={() => togglePara1(true)}
                                        >
                                            <div className="px-5">مشخصات کدینگ حسابداری</div>
                                            <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active1 === true ? 'rotate-180' : ''}`}>
                                                <IconCaretDown />
                                            </div>
                                        </button>
                                        <div>
                                            <AnimateHeight duration={300} height={active1 ? 'auto' : 0}>
                                                <div className="grid w-full grid-cols-1 gap-2 px-10 sm:grid-cols-2">
                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                        <div>
                                                            <Field id="accountingMainCode" name="accountingMainCode" label={t('accountingMainCode')} component={FTextField} />
                                                        </div>
                                                        <div>
                                                            <Field id="accountingSubCode" name="accountingSubCode" label={t('accountingSubCode')} component={FTextField} />
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full"></div>
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end px-5" >
                                    <button type="button"
                                        onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')}
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
