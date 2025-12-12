'use client'

import { IconCaretDown } from '@tabler/icons-react';
import FDateField from '@/app/components/inputs/dateField';
import FSelectField from '@/app/components/inputs/selectField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';

import { ActionIcon, Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useRouter as Router } from 'next/router';
import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const Nominalvaluepayment = () => {
    const { t } = useTranslation();
    const [model, setModel] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [rowId, setRowId] = useState<string>();
    const [tradingCodeId, setTradingCodeId] = useState<string>();
    const [tradingCode, setTradingCode] = useState<string>();

    const router = useRouter();
    const _router = Router();
    const { query } = _router;

    useEffect(() => {
        const setdata = async () => {
            setRowId(query.MeetingId?.toString());
            setTradingCodeId(query.TradingCodeId?.toString());
            setTradingCode(query.tradingCode?.toString());

            let _model = await getEntityModel('sharemeetingnominalvaluepayment');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        date: Yup.string().required(t('required').toString()),
        count: Yup.string().required(t('required').toString()),
    });

    const handleAddClick = async (data: any) => {
        setLoading(true);

        data.meetingId = rowId;
        data.tradingCodeId = tradingCodeId;

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
            router.back();
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result ? result : t("message.error_save_message"));
        }

        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="mb-5 flex h-[3rem] items-start justify-start border-b-2 px-5 pb-3">
                    <div>
                        <Tooltip label={t('back')}>
                            <ActionIcon color="inheritans" className="flex items-center justify-center rounded-[50%] p-5 hover:bg-inherit hover:text-blue-900" onClick={() => router.back()}>
                                <i className="fa-duotone fa-solid fa-arrow-right text-lg ml-2" />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <div className="p-2">ثبت پرداخت ارزش اسمی - {tradingCode}</div>
                </div>

                <div className="">
                    <div className="">
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
                                <div className="grid w-full grid-cols-1 gap-2 px-10 sm:grid-cols-2">
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <Field id="date" name="date" label="تاریخ" component={FDateField} />
                                        </div>
                                        <div>
                                            <Field id="count" name="count" label="مبلغ" component={FTextField} />
                                        </div>
                                    </div>
                                    <div className="w-full"></div>
                                    <div className="grid w-full grid-cols-2 gap-2">
                                        <div >
                                            <Field
                                                id="type"
                                                name="type"
                                                label={"نوع پرداخت"}
                                                disabled={true}
                                                options={model?.register?.requestBody
                                                    .find((x) => x.name == 'type')
                                                    ?.enums.map((item: string) => {
                                                        return { value: item, label: t(item.toLowerCase()) };
                                                    })}
                                                component={FSelectField}
                                            />
                                        </div>
                                        <div >
                                            <Field id="receiptNumber" name="receiptNumber" label="شماره فیش" component={FTextField} />
                                        </div>
                                    </div>
                                    <div className="w-full"></div>
                                </div>

                                <div className="mt-8 flex items-center justify-end px-10">
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

export default Nominalvaluepayment;
