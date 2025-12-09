import FColorField from '@/components/inputs/colorField';
import FTextField from '@/components/inputs/textField';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useRouter as Router } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
//import axios from 'axios';

interface ICompany {
    name: string;
    backgroundColor: string;
    textColor: string;
}

const Edit = () => {
    const { t } = useTranslation();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<ICompany>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>();

    const router = useRouter();
    const _router = Router();
    const { query } = _router;

    useEffect(() => {
        setRowId(query.id?.toString());

        const setdata = async () => {
            let _model = getEntityModel('vouchertemplates');
            setModel(_model);
        };

        setdata();
    }, []);

    useEffect(() => {
        const setdata = async () => {
            rowId && fetchData(rowId);
        };

        setdata();
    }, [rowId]);

    const fetchData = async (id: string) => {
        setIsLoading(true);

        const res = await fetch(`${model?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result: ICompany = await res?.json();
            setData(result);
            console.log('>>>>>.', result);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const SignupSchema = Yup.object().shape({
        name: Yup.string().required('ورود نام شرکت اجباری است'),
    });

    const handlEditClick = async (data: ICompany) => {
        setIsLoading(true);
        console.log(data);
        const res = await fetch(`${model?.update?.url.replace('{id}', rowId ? rowId : '')}`, {
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
            router.back();
        } else {
            //setInitialRecords({ pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
        }
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="mb-5 flex h-[3rem] items-start justify-start border-b-2 px-5 pb-3">
                    <div>
                        <Tooltip label={t('back')}>
                            <ActionIcon color="inheritans" className="flex items-center justify-center rounded-[50%] p-5 hover:bg-inherit hover:text-blue-900" onClick={() => router.back()}>
                                <FontAwesomeIcon icon={faArrowRight} size="lg" className="ml-2" />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <div className="p-2">{t('edit')} {t('vouchertemplates')}</div>
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
                                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div className="w-full">
                                            <Field id="name" name="name" label="نام قالب" component={FTextField} />
                                        </div>
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
