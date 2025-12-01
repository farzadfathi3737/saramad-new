import FTextField from '@/app/components/inputs/textField';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import FSelectField from '@/app/components/inputs/selectField';
import FDateField from '@/app/components/inputs/dateField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

interface IFiscalYear {
    name: string;
    begin: string;
    end: string;
    companyId: string;
    voucherTemplateId?: string;
    primeCostCalculationType?: string;
}

const Edit = ({ id }: { id: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<IFiscalYear>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');

    const router = useRouter();

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    useEffect(() => {
        const setdata = async () => {
            const _model = getEntityModel('fiscalyear');
            setModel(_model);
        };

        setdata();
    }, []);

    useEffect(() => {
        if (id && model) {
            fetchData(id);
        }
    }, [id, model]);

    const fetchData = async (fiscalYearId: string) => {
        setIsLoading(true);

        const res = await fetch(`${model?.read?.url.replace('{id}', fiscalYearId)}`);

        if (res.ok) {
            const result: IFiscalYear = await res?.json();
            setData(result);
            console.log('>>>>>.', result);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const SignupSchema = Yup.object().shape({
        name: Yup.string().required(t('required').toString()),
        begin: Yup.string().required(t('required').toString()),
        end: Yup.string().required(t('required').toString()),
    });

    const handlEditClick = async (data: IFiscalYear) => {
        setIsLoading(true);

        data.companyId = appConfig.company.id;

        const res = await fetch(`${model?.update?.url.replace('{id}', id)}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
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
                            {t('edit')} {t('fiscalyear')} - {appConfig.company.name}
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
                                            <Field id="name" name="name" label="نام سال مالی" component={FTextField} />
                                        </div>
                                        <div className="w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="begin" name="begin" label={t('begin')} component={FDateField} />
                                            </div>
                                            <div>
                                                <Field id="end" name="end" label={t('end')} component={FDateField} />
                                            </div>
                                        </div>
                                        <div className="w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field
                                                    id="voucherTemplateId"
                                                    name="voucherTemplateId"
                                                    label={t('voucherTemplate')}
                                                    listRefName="vouchertemplates"
                                                    staticParams={[{ name: 'CompanyId', value: companyId }]}
                                                    component={FSelectModelField}
                                                />
                                            </div>
                                            <div className="w-full"></div>
                                        </div>
                                        <div className="w-full"></div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field
                                                    id="primeCostCalculationType"
                                                    name="primeCostCalculationType"
                                                    label={t('primeCostCalculationType')}
                                                    options={model?.register?.requestBody
                                                        .find((x) => x.name == 'primeCostCalculationType')
                                                        ?.enums.map((item: string) => {
                                                            return { value: item, label: t(item.toLowerCase()) };
                                                        })}
                                                    component={FSelectField}
                                                />
                                            </div>
                                            <div className="w-full"></div>
                                        </div>
                                        <div className="w-full"></div>
                                    </div>

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
                )}
            </div>
        </div>
    );
};

export default Edit;
