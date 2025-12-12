'use client'

import FDateField from '@/app/components/inputs/dateField';
import FSelectField from '@/app/components/inputs/selectField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { IRootState } from '@/store';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

type UploadedFile = File;

interface IData {
    date: string;
    brokerDebit: number;
    brokerCredit: number;
    portfolioDebit: number;
    portfolioCredit: number;
    contradictDebit: number;
    contradictCredit: number;
}

const BrokerContradictions = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [data, setData] = useState<IData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    useEffect(() => {
        const setdata = async () => {
            const _model = await getEntityModel('brokercontradictions');
            setModel(_model);
        };

        setdata();
    }, []);

    const SignupSchema = Yup.object().shape({
        FromDate: Yup.string().required(t('required').toString()),
        ToDate: Yup.string().required(t('required').toString()),
        TradingCodeId: Yup.string().required(t('required').toString()),
        BrokerId: Yup.string().required(t('required').toString()),
        ReconciliationType: Yup.string().required(t('required').toString()),
        //BrokerTurnoverFile: Yup.string().required(t('required').toString()),
    });

    const onDrop = (acceptedFiles: UploadedFile[]) => {
        setUploadedFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
    });

    const fileList = uploadedFiles.map((file, index) => (
        <li key={index} className="text-sm">
            {file.name}
        </li>
    ));

    const handleAddClick = async (data: any) => {
        console.log(uploadedFiles);
        setLoading(true);

        const formData = new FormData();
        formData.append('BrokerTurnoverFile', uploadedFiles[0]);

        const res = await fetch(
            `${model?.register?.url}?FromDate=${data.FromDate}&ToDate=${data.ToDate}&TradingCodeId=${data.TradingCodeId}&BrokerId=${data.BrokerId}&ReconciliationType=${data.ReconciliationType}`,
            {
                method: 'post',
                body: formData,
            }
        );

        if (res.ok) {
            const result = res && (await res?.json());
            setData(result.items);
            console.log(result);
            setUploadedFiles([]);
            setLoading(false);
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result.errors.BrokerTurnoverFile[0]);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="mb-5 flex h-[3rem] items-start justify-start border-b-2 px-5 pb-3">
                    <div className="p-2">مغایرت گیری با کارگزاری</div>
                </div>

                <div className="">
                    <div className="">
                        <Formik
                            initialValues={{
                                FromDate: "",
                                ToDate: "",
                                TradingCodeId: "",
                                BrokerId: "",
                                ReconciliationType: ""
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => {
                                //console.log('ok', values);
                                handleAddClick(values);
                                //alert(JSON.stringify(values, null, 2));
                            }}
                        >
                            <Form>
                                <div className="grid w-full grid-cols-2 gap-2 px-10 sm:grid-cols-4">
                                    <div>
                                        <Field id="FromDate" name="FromDate" label={t('fromdate')} component={FDateField} />
                                    </div>
                                    <div>
                                        <Field id="ToDate" name="ToDate" label={t('todate')} component={FDateField} />
                                    </div>
                                    <div>
                                        <Field
                                            id="TradingCodeId"
                                            name="TradingCodeId"
                                            label={t('tradingCode')}
                                            listRefName="companytradingcode"
                                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                                            component={FSelectModelField}
                                        />
                                    </div>
                                    <div>
                                        <Field
                                            id="BrokerId"
                                            name="BrokerId"
                                            label={t('broker')}
                                            listRefName="stockbroker"
                                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                                            component={FSelectModelField}
                                        />
                                    </div>
                                    <div>
                                        <Field
                                            id="ReconciliationType"
                                            name="ReconciliationType"
                                            label={t('ReconciliationType')}
                                            options={model?.register?.parameters
                                                .find((x) => x.name == 'ReconciliationType')
                                                ?.enums.map((item: string) => {
                                                    return { value: item, label: t(item.toLowerCase()) };
                                                })}
                                            component={FSelectField}
                                        />
                                    </div>
                                    <div className="col-span-2 h-full">
                                        <div {...getRootProps()} className="flex h-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-3 text-center">
                                            <input {...getInputProps()} />
                                            <p className="flex flex-col justify-center text-gray-500">فایل‌ها را اینجا بکشید یا کلیک کنید تا فایل‌ها را انتخاب کنید</p>
                                            <div className="flex items-center justify-center pr-3">
                                                {fileList.length > 0 ? (
                                                    <div className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-2 text-center">
                                                        <i className="fa-duotone fa-solid fa-xmark text-xl m-1 pl-5 text-gray-500 cursor-pointer" onClick={() => setUploadedFiles([])} />
                                                        <ul>{fileList}</ul>
                                                    </div>
                                                ) : (
                                                    <i className="fa-duotone fa-solid fa-cloud-arrow-up text-4xl m-1 text-gray-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-7">
                                        <button disabled={uploadedFiles.length == 0 || loading} type="submit" className="btn btn-outline flex h-full w-full items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                            {!loading ? 'مغایرت گیری' : <div className='animate-spin'>
                                                <i className="fa-duotone fa-solid fa-spinner fa-spin text-xl" />
                                            </div>}
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        </Formik>
                    </div>

                    <div className="table-responsive w-full p-10 ">
                        <div className="relative">
                            {data?.length < 1 ? (
                                <div className="flex w-full items-center justify-center rounded-md border-2 border-solid border-gray-200 bg-gray-50 p-5">مغایرتی در حال پردازش نمی باشد ...</div>
                            ) : (
                                <table className="border-collapse border border-gray-400">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-300 text-center" colSpan={2}>
                                                کارگزاری
                                            </th>
                                            <th className="border border-gray-300 text-center" colSpan={2}>
                                                پورتفو
                                            </th>
                                            <th className="border border-gray-300 text-center" colSpan={2}>
                                                مغایرت
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="border border-gray-300 text-center">بدهکار</th>
                                            <th className="border border-gray-300 text-center">بستانکار</th>
                                            <th className="border border-gray-300 text-center">بدهکار</th>
                                            <th className="border border-gray-300 text-center">بستانکار</th>
                                            <th className="border border-gray-300 text-center">بدهکار</th>
                                            <th className="border border-gray-300 text-center">بستانکار</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="border border-gray-300">{item['brokerDebit']}</td>
                                                    <td className="border border-gray-300">{item['brokerCredit']}</td>
                                                    <td className="border border-gray-300">{item['portfolioDebit']}</td>
                                                    <td className="border border-gray-300">{item['portfolioCredit']}</td>
                                                    <td className="border border-gray-300">{item['contradictDebit']}</td>
                                                    <td className="border border-gray-300">{item['contradictCredit']}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                            {/* <MantineReactTable key={modelDataInProg?.name} table={table} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrokerContradictions;
