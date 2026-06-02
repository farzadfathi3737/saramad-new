import FDateField from '@/app/components/inputs/dateField';
import FSelectField from '@/app/components/inputs/selectField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { useLanguage } from '@/contexts/LanguageContext';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const FiscalYearTransfer = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState("");
    const [active1, setActive1] = useState<boolean>(true);
    const [active2, setActive2] = useState<boolean>(true);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('shareinitialbalancetransfer-company-share-balances');
            setModel(_model);
        };

        setdata();
    }, []);

    const handleAddClick = async () => {
        setLoading(true);

        const res = await fetch(`${model?.register?.url}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyId: appConfig.company.id,
                fiscalYearId: appConfig.fiscalYear.id
            }),
        });

        if (res.ok) {
            ColoredToast('success', "انتقال سال مالی با موفقیت انجام شد.");
            setLoading(false);
            subPage(model?.name.toLocaleLowerCase() ?? '')
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3rem] items-start justify-start border-b border-gray-300 pl-3">
                    <div className='flex border-l h-full border-inherit justify-center items-center'>

                    </div>
                    <div className='px-2 h-full flex flex-col justify-center align-middle'>
                        <div className="p-2">انتقال سال مالی</div>
                    </div>
                </div>

                <div className="table-responsive px-5">
                    <div className="p-5">
                        <Formik
                            initialValues={{}}
                            //validationSchema={{}}
                            onSubmit={() => {
                                handleAddClick();
                            }}
                        >
                            <Form>
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div className="w-full text-3xl text-red-400">
                                        در صورتی که از انتقال سال مالی مطمئن هستید دکمه ثبت را بزنید.
                                    </div>

                                </div>



                                <div className="mt-8 flex items-center justify-end">
                                    <button type="button" onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')} className="btn btn-outline-[#2D9AA0] font-iranyekan">
                                        {t('cancel')}
                                    </button>

                                    <button type="submit" className="btn btn-outline mr-3 flex items-center font-iranyekan text-[#fff]">
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

export default FiscalYearTransfer;
