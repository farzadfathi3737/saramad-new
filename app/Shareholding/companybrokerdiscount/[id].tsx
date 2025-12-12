import FDateField from '@/app/components/inputs/dateField';
import FTextField from '@/app/components/inputs/textField';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { apiFetch } from '@/lib/apiFetch';

const Edit = ({ id, brokerName }: { id: string, brokerName: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<any>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    console.log("id------------------", id);
    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('companybrokerdiscount');
            setModel(_model);
        };

        setdata();
    }, []);

    useEffect(() => {
        if (id && model) {
            fetchData(id);
        }
    }, [id, model]);

    const fetchData = async (tradingCodeId: string) => {
        setIsLoading(true);

        const res = await apiFetch(`${model?.read?.url.replace('{id}', tradingCodeId)}`);

        if (res.ok) {
            const result = await res?.json();
            setData(result);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const SignupSchema = Yup.object().shape({
        percentage: Yup.string().required(t('required').toString()),
        validFrom: Yup.string().required(t('required').toString()),
        validTo: Yup.string().required(t('required').toString()),
    });

    const handlEditClick = async (data: any) => {
        setIsLoading(true);

        data.companyBrokerId = id;

        const res = await apiFetch(`${model?.update?.url.replace('{id}', id)}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', t("message.success_save_message"));
            setIsLoading(false);
            subPage('companybroker', 'companybrokerdiscount', undefined, [{ key: 'id', value: id }, { key: 'brokerName', value: brokerName }])
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result ? result : t("message.error_save_message"));
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
                                onClick={() => subPage('companybroker', 'companybrokerdiscount', undefined, [{ key: 'id', value: id }, { key: 'brokerName', value: brokerName }])}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        <div className="p-2">
                            ویرایش تخفیف - {brokerName}
                        </div>
                    </div>
                </div>

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
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-1">
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
                                        {/* <div>
                                            <label className="!text-gray-600">{t('companyBroker')}</label>
                                            <div className="form-input bg-white-light pt-3 !text-gray-600">{data2.broker}</div>
                                        </div> */}
                                        <div>
                                            <Field id="percentage" name="percentage" label={t('percentage')} component={FTextField} />
                                        </div>
                                        <div>
                                            <Field id="validFrom" name="validFrom" label={t('validFrom')} component={FDateField} />
                                        </div>
                                        <div>
                                            <Field id="validTo" name="validTo" label={t('validTo')} component={FDateField} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end">
                                    <button type="button"
                                        onClick={() => subPage('companybroker', 'companybrokerdiscount', undefined, [{ key: 'id', value: id }, { key: 'brokerName', value: brokerName }])}
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
            </div>
        </div>
    );
};

export default Edit;
