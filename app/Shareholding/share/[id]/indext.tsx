import FTextField from '@/app/components/inputs/textField';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import FSelectField from '@/app/components/inputs/selectField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import { Tooltip } from '@mantine/core';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiFetch } from '@/lib/apiFetch';
import AnimateHeight from 'react-animate-height';
import { IconCaretDown } from '@tabler/icons-react';

interface ICompany {
    name: string;
    backgroundColor: string;
    stockName: string;
    isNonMarket: boolean;
}

const Edit = ({ id }: { id: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<ICompany>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    const [active1, setActive1] = useState<boolean>(true);

    const togglePara1 = (value: boolean) => {
        setActive1((oldValue) => {
            return oldValue === value ? false : value;
        });
    };

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('nonmarketshare');
            setModel(_model);
        };

        setdata();
    }, []);

    useEffect(() => {
        if (id && model) {
            fetchData(id);
        }
    }, [id, model]);

    const fetchData = async (id: string) => {
        setIsLoading(true);

        const res = await apiFetch(`${model?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result: ICompany = await res?.json();

            console.log(result);

            setData(result);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const SignupSchema = Yup.object().shape({
        stockId: Yup.string().required(t('required').toString()),
        investmentType: Yup.string().required(t('required').toString()),
        relationTypeId: Yup.string().required(t('required').toString()),
    });

    const handlEditClick = async (data: ICompany) => {
        setIsLoading(true);

        const res = await apiFetch(`${model?.update?.url.replace('{id}', id)}`, {
            method: 'put',
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
            setIsLoading(false);
            subPage('share');
        } else {
            //setInitialRecords({ pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
        }
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">

                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>
                        <Tooltip label={t('back')}>
                            <div
                                //className="flex items-center justify-center rounded-full p-5 !hover:bg-[#2D9AA0] hover:text-blue-900" 
                                className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('share')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        <div className="p-2">
                            {t('edit')} {'دارایی غیر بورسی'}
                        </div>
                    </div>
                </div>

                {data && (
                    <div className="table-responsive px-0">
                        <div className="py-5">
                            <Formik
                                initialValues={data}
                                //validationSchema={SignupSchema}
                                onSubmit={(values) => {
                                    handlEditClick(values);
                                }}
                            >
                                <Form>
                                    <div className="grid w-full grid-cols-1 gap-2 px-10 sm:grid-cols-2">
                                        {/* <div className="w-full">
                                        <Field id="stockId" name="stockId" label={t('stock')} listRefName="stock" component={FSelectModelField} />
                                    </div> */}
                                        {/* <div className="w-full"></div> */}
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="symbol" name="symbol" label={t('symbol')} component={FTextField} />
                                            </div>
                                            <div>
                                                <fieldset>
                                                    <label className="!text-gray-600">گروه</label>
                                                    <div className="form-input bg-white-light pt-3 !text-gray-600">غیر بورسی</div>
                                                </fieldset>
                                            </div>
                                        </div>
                                        <div className="flex w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="name" name="name" label={t('companyName')} component={FTextField} />
                                            </div>
                                            <div>
                                                <fieldset>
                                                    <label className="!text-gray-600">صنعت</label>
                                                    <div className="form-input bg-white-light pt-3 !text-gray-600">سایر سرمایه گذاری غیر بورسی</div>
                                                </fieldset>
                                            </div>
                                        </div>
                                        <div className="flex w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
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
                                        <div className="mb-5 w-full"></div>
                                    </div>

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
                                                                <Field id="accountingCode" name="accountingCode" label={t('accountingCode')} component={FTextField} />
                                                            </div>
                                                            <div>
                                                                <Field id="accountingCode2" name="accountingCode2" label={t('accountingCode2')} component={FTextField} />
                                                            </div>
                                                        </div>
                                                        <div className="flex w-full"></div>
                                                    </div>
                                                </AnimateHeight>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-end px-10">
                                        <button type="button"
                                            onClick={() => subPage('share')}
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
                )
                }
            </div>
        </div>
    );
};

export default Edit;
