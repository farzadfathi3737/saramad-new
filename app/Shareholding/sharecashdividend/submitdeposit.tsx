import FDateField from '@/app/components/inputs/dateField';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const SubmitDeposit = ({ CashDividendId, tradingCode, meetingId }: { CashDividendId?: string; tradingCode?: string, meetingId?: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('sharecashdividendsubmitdeposit');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        date: Yup.string().required(t('required').toString()),
        depositAmount: Yup.string().required(t('required').toString()),
    });

    const handleAddClick = async (data: any) => {
        setLoading(true);

        data.dividendId = CashDividendId;

        const res = await fetch(`${model?.register?.url}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            ColoredToast('success', t("message.success_save_message"));
            setLoading(false);
            subPage('sharecashdividend', 'payments', undefined, [{ key: 'CashDividendId', value: CashDividendId! }, { key: 'tradingCode', value: tradingCode! }]);
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result ? result : t("message.error_save_message"));
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
                                onClick={() => subPage('sharemeeting', 'sharecashdividend', [], [{ key: 'MeetingId', value: meetingId! }])}>
                                <i className={`fa-duotone fa-solid fa-chevron-right text-xl ml-2`} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        ثبت واریز بانکی - {tradingCode}
                    </div>
                </div>

                <div className="table-responsive px-5">
                    <div className="p-5">
                        <Formik
                            initialValues={{}}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                handleAddClick(values);
                            }}
                        >
                            <Form>
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <Field id="date" name="date" label="تاریخ" component={FDateField} />
                                        </div>
                                        <div>
                                            <Field id="depositAmount" name="depositAmount" label="مبلغ" component={FTextField} isNumber={true} />
                                        </div>
                                    </div>
                                    <div className="w-full"></div>
                                    <div className="grid w-full grid-cols-1 gap-2">
                                        <div className="w-full">
                                            <Field id="depositAccountIsbn" name="depositAccountIsbn" label="شماره شبا" component={FTextField} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end">
                                    <button type="button"
                                        onClick={() => subPage('sharemeeting', 'sharecashdividend', [], [{ key: 'MeetingId', value: meetingId! }])}
                                        className="btn btn-outline-[#2D9AA0] font-iranyekan">
                                        {t('cancel')}
                                    </button>

                                    <button type="submit" disabled={loading} className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                        {loading ? (
                                            <span className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4"></span>
                                        ) : null}
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

export default SubmitDeposit;
