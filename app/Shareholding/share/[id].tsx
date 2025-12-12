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

interface ICompany {
    name: string;
    backgroundColor: string;
    stockName: string;
}

const Edit = ({ id }: { id: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<ICompany>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('share');
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
        console.log(data);
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
                                onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        <div className="p-2">
                            {t('edit')} {t('share')} : {appConfig.company.name}
                        </div>
                    </div>
                </div>



                {data && (
                    <div className="table-responsive px-5">
                        <div className="p-5">
                            <Formik
                                initialValues={data}
                                validationSchema={SignupSchema}
                                onSubmit={(values) => {
                                    console.log('ok', values);
                                    handlEditClick(values);
                                    //alert(JSON.stringify(values, null, 2));
                                }}
                            >
                                <Form>
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="w-full">
                                            <fieldset>
                                                <label className="!text-gray-600">{t('stock')}</label>
                                                <div className="form-input bg-white-light pt-3 !text-gray-600">{data.stockName}</div>
                                            </fieldset>
                                        </div>
                                        <div className="w-full"></div>
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
                                                    label={t('relationType')}
                                                    listRefName="sharerelationtype"
                                                    staticParams={[{ name: 'CompanyId', value: appConfig.company.id }]}
                                                    component={FSelectModelField}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="accountingMainCode" name="accountingMainCode" label={t('accountingMainCode')} component={FTextField} />
                                            </div>
                                            <div>
                                                <Field id="accountingSubCode" name="accountingSubCode" label={t('accountingSubCode')} component={FTextField} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button"
                                            onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')}
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
                )}
            </div>
        </div>
    );
};

export default Edit;
