import FTextField from '@/app/components/inputs/textField';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { apiFetch } from '@/lib/apiFetch';
import FSelectModelField from '@/app/components/inputs/selectModelField';

interface ICompany {
    name: string;
    accountingCode: string;
    creationDate: string;
}

const Edit = ({ id, shareId, name }: { id: string, shareId: string, name: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<ICompany>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('shareinitialbalance');
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
        newInitialBalance: Yup.number().required(t('required').toString()),
        newTotalPrimeCost: Yup.number().required(t('required').toString()),
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
            ColoredToast('success', t('message.success_save_message'));
            setIsLoading(false);
            subPage('share', 'shareinitialbalance', undefined, [{ key: 'id', value: shareId }, { key: 'name', value: name }])
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
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
                                className="btn btn-outline pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                onClick={() => subPage('share', 'shareinitialbalance', undefined, [{ key: 'id', value: shareId }, { key: 'name', value: name }])}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        <div className="p-2">ویرایش مانده ابتدای دوره- {name}</div>
                    </div>
                </div>

                {data && (
                    <div className="table-responsive px-5">
                        <div className="p-5">
                            <Formik
                                initialValues={data}
                                validationSchema={SignupSchema}
                                onSubmit={(values) => {
                                    handlEditClick(values);
                                }}
                            >
                                <Form>
                                    <div className="grid w-full grid-cols-1 gap-2 px-10 pt-5 sm:grid-cols-2">
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field id="shareCount" name="shareCount" label="مانده ابتدای دوره" component={FTextField} />
                                            </div>
                                            <div>
                                                <Field id="sharePrimeCost" name="sharePrimeCost" label="بهای تمام شده" component={FTextField} />
                                            </div>
                                        </div>
                                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <Field
                                                    id="tradingCodeId"
                                                    name="tradingCodeId"
                                                    label="سبد معاملاتی"
                                                    listRefName="companytradingcode"
                                                    staticParams={[{ name: 'CompanyId', value: appConfig.company.id }]}
                                                    component={FSelectModelField}
                                                    placeholder="لطفا یک مورد را انتخاب کنید"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-end px-5">
                                        <button type="button"
                                            onClick={() => subPage('share', 'shareinitialbalance', undefined, [{ key: 'id', value: shareId }, { key: 'name', value: name }])}
                                        >
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
