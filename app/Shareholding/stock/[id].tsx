import FTextField from '@/app/components/inputs/textField';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useRouter as Router } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import AnimateHeight from 'react-animate-height';
import { ActionIcon, Tooltip } from '@mantine/core';
import Link from 'next/link';
import { apiFetch } from '@/lib/apiFetch';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';

interface ICompany {
    name: string;
    backgroundColor: string;
    textColor: string;
    optionDetails?: {
        contractStockId: string;
    };
}

const Add = ({ id, master }: { id: string, master: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<ICompany | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    const [active2, setActive2] = useState<string>('1');

    const togglePara2 = (value: string) => {
        setActive2((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const _setdata = async () => {
            const _model = await getEntityModel('stock');
            setModel(_model);
        };

        _setdata();
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
            setData(result);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const SignupSchema = Yup.object().shape({
        categoryId: Yup.string().required(t('required').toString()),
    });

    const handlEditClick = async (data: ICompany) => {
        setIsLoading(true);

        const res = await apiFetch(`${model?.update?.url.replace('{id}', id ? id : '')}`, {
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
            subPage(model?.name.toLocaleLowerCase() ?? '')
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
                                className="btn btn-outline pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage(master)}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        <div className="p-2">سهم - {data?.name}</div>
                    </div>
                </div>

                {data && (
                    <div className="table-responsive px-0">
                        <div className="py-5">
                            <Formik
                                initialValues={data}
                                validationSchema={SignupSchema}
                                onSubmit={(values) => {
                                    handlEditClick(values);
                                }}
                            >
                                <Form>
                                    <div className="grid w-full grid-cols-1 gap-2 px-10 sm:grid-cols-2">
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="externalId" name="externalId" label={t('externalId')} component={FTextField} disabled />
                                            </div>
                                            <div>
                                                <Field id="externalId2" name="externalId2" label={t('externalId2')} component={FTextField} disabled />
                                            </div>
                                        </div>
                                        <div className="grid w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="symbol" name="symbol" label={t('symbol')} component={FTextField} disabled />
                                            </div>
                                            <div>
                                                <Field id="categoryName" name="categoryName" label={t('categoryName')} component={FTextField} disabled />
                                            </div>
                                        </div>
                                        <div className="grid w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="name" name="name" label={t('نام سهام')} component={FTextField} disabled />
                                            </div>
                                            <div>
                                                <Field id="marketName" name="marketName" label={t('marketName')} component={FTextField} disabled />
                                            </div>
                                        </div>
                                        <div className="grid w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="stockTypeName" name="stockTypeName" label={t('stockTypeName')} component={FTextField} disabled />
                                            </div>
                                            <div>
                                                <Field id="boardName" name="boardName" label={t('boardName')} component={FTextField} disabled />
                                            </div>
                                        </div>
                                        <div className="grid w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="nominalValue" name="nominalValue" label={t('nominalValue')} component={FTextField} disabled />
                                            </div>
                                            <div>
                                                <Field id="parentIndustryName" name="parentIndustryName" label={t('parentIndustryName')} component={FTextField} disabled />
                                            </div>
                                        </div>
                                        <div className="grid w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="capital" name="capital" label={'آخرین سرمایه ی ثبت شده'} component={FTextField} disabled />
                                            </div>
                                            <div>
                                                <Field id="industryName" name="industryName" label={t('زیر صنعت')} component={FTextField} disabled />
                                            </div>
                                        </div>
                                    </div>

                                    {data.optionDetails && (
                                        <div className="flex w-full">
                                            <div className="w-full">
                                                <div className="space-y-2 space-y-c font-iranyekan">
                                                    <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                        <button
                                                            type="button"
                                                            className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active2 === '1' ? '!#089bab' : '#089bab'}`}
                                                            onClick={() => togglePara2('1')}
                                                        >
                                                            مشخصات اوراق اختیار معامله
                                                            <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active2 === '1' ? 'rotate-180' : ''}`}>
                                                                <i className={`fa-duotone fa-solid fa-chevron-down text-xl ml-2`} />
                                                            </div>
                                                        </button>
                                                        <div>
                                                            <AnimateHeight duration={300} height={active2 === '1' ? 'auto' : 0}>
                                                                <div className="grid w-full grid-cols-1 gap-2 p-5 px-10 sm:grid-cols-2">
                                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                        <div>
                                                                            <Field
                                                                                id="optionDetails.expirationDate"
                                                                                name="optionDetails.expirationDate"
                                                                                label={t('expirationDate')}
                                                                                component={FTextField}
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field id="optionDetails.typeName" name="optionDetails.typeName" label={'نوع اختیار'} component={FTextField} disabled />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid w-full"></div>
                                                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                                                        <div>
                                                                            <Field
                                                                                id="optionDetails.strikePrice"
                                                                                name="optionDetails.strikePrice"
                                                                                label={t('strikePrice')}
                                                                                component={FTextField}
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Field
                                                                                id="optionDetails.contractSize"
                                                                                name="optionDetails.contractSize"
                                                                                label={t('contractSize')}
                                                                                component={FTextField}
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid w-full"></div>
                                                                    <div className="grid w-full">
                                                                        <div>
                                                                            <Link
                                                                                className="btn btn-outline flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-[#fff]"
                                                                                href={`/Shareholding/stock/${data.optionDetails?.contractStockId}`}
                                                                                onClick={() => setRowId(data.optionDetails?.contractStockId)}
                                                                            >
                                                                                نماد سهم اصلی اختیار
                                                                            </Link>
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
                                </Form>
                            </Formik>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Add;
