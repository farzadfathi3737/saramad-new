'use client'

import FSelectModelField from '@/app/components/inputs/selectModelField';
import FTextField from '@/app/components/inputs/textField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { useSubPage } from '@/app/components/Notifications/useSubPage';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { Dialog, Transition } from '@headlessui/react';
import { Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { Fragment, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { apiFetch } from '@/lib/apiFetch';
import Articletemplates from '@/app/components/customcmp/articletemplate';

const Edit = ({ id }: { id: string }) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    const [modelAE, setModelAE] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        const setdata = () => {
            const _model = getEntityModel('articletemplates');
            const _modelAE = getEntityModel('articleelements');

            setModel(_model);
            setModelAE(_modelAE);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        title: Yup.string().required(t('required').toString()),
        value: Yup.string().required(t('required').toString()),
    });

    const handleAddClick = async (data: any) => {
        setLoading(true);

        data.companyId = appConfig.company.id;
        data.voucherTemplateId = id;

        const res = await apiFetch(`${model?.register?.url}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const result = res && (await res?.json());
            setLoading(false);
            setIsAddModalOpen(false);
            ColoredToast('success', t('msgSuccess'));
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300 pl-3 pr-3">
                    <div className="flex h-full items-center">
                        <div className='flex border-l h-full border-inherit justify-center items-center'>
                            <Tooltip label={t('back')}>
                                <div
                                    className="btn pr-3 flex items-center w-full h-full bg-none hover:bg-gray-500 text-secondary text-gray-900 hover:text-gray-50"
                                    onClick={() => subPage(model?.name.toLocaleLowerCase() ?? '')}>
                                    <i className="fa-duotone fa-solid fa-chevron-right text-xl ml-2" />
                                </div>
                            </Tooltip>
                        </div>
                        <div className="px-2">قالب سودی زیانی آرتیکل ها</div>
                    </div>
                    <button type="button" onClick={() => setIsAddModalOpen(!isAddModalOpen)} className="btn btn-outline flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-white hover:bg-[#257d82]">
                        <i className="fa-duotone fa-solid fa-plus text-xl ml-2" />
                        {t('add')}
                    </button>
                </div>

                <div className="table-responsive p-5">
                    {model && <Articletemplates model={model} modelAE={modelAE} VoucherTemplateId={id!} addModalOpen={isAddModalOpen} setAddModalOpen={setIsAddModalOpen} />}
                </div>
            </div>

        </div>
    );
};

export default Edit;
