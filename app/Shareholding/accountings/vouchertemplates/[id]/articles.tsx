import Articletemplates from '@/components/customcmp/articletemplate';
import IconPlus from '@/components/Icon/IconPlus';
import FDateField from '@/components/inputs/dateField';
import FSelectField from '@/components/inputs/selectField';
import FSelectModelField from '@/components/inputs/selectModelField';
import FTextAreaField from '@/components/inputs/textAreaField';
import FTextField from '@/components/inputs/textField';
import { ColoredToast } from '@/components/Notifications/colorNotification';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { faArrowRight, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRouter as Router } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const Add = () => {
    const { t } = useTranslation();
    const [model, setModel] = useState<IDataModel>();
    const [modelAE, setModelAE] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [rowId, setRowId] = useState<string>();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const _router = Router();
    const { query } = _router;

    useEffect(() => {
        setRowId(query.id?.toString());

        const setdata = async () => {
            let _model = await getEntityModel('articletemplates');
            let _modelAE = await getEntityModel('articleelements');

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
        console.log(data);

        data.companyId = appConfig.company.id;

        const res = await fetch(`${model?.register?.url}`, {
            method: 'post',
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
            setLoading(false);
            router.back();
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="mb-5 flex h-[3rem] items-center justify-between border-b-2 px-5 pb-3">
                    <div className="flex">
                        <div>
                            <Tooltip label={t('back')}>
                                <ActionIcon color="inheritans" className="flex items-center justify-center rounded-[50%] p-5 hover:bg-inherit hover:text-blue-900" onClick={() => router.back()}>
                                    <FontAwesomeIcon icon={faArrowRight} size="lg" className="ml-2" />
                                </ActionIcon>
                            </Tooltip>
                        </div>
                        <div className="p-2">قالب سودی زیانی آرتیکل های - {appConfig.company.name}</div>
                    </div>
                    <button type="button" onClick={() => setIsAddModalOpen(!isAddModalOpen)} className="btn btn-outline mr-3 flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-[#fff]">
                        <FontAwesomeIcon icon={faPlus} size="lg" className="ml-2" />
                        {t('add')}
                    </button>
                </div>

                <div className="table-responsive px-5">
                    {model && <Articletemplates model={model} modelAE={modelAE} VoucherTemplateId={rowId!} addModalOpen={isAddModalOpen} setAddModalOpen={setIsAddModalOpen} />}
                </div>
            </div>
        </div>
    );
};

export default Add;
