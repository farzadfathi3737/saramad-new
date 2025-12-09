'use client'

import { getEntityModel } from '@/models/entity';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '../../../components/Datatable/MRT';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import AnimateHeight from 'react-animate-height';
import { IconCaretDown } from '@tabler/icons-react';
import FileUploadModal from '@/app/components/Forms/uploadFile';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { MRT_Localization_FA } from '@/public/locales/fa';
import { Field, Form, Formik } from 'formik';
import FDateField from '@/app/components/inputs/dateField';
import * as Yup from 'yup';
import { ColoredToast } from '@/app/components/Notifications/colorNotification';

const Company = () => {
    const { t } = useLanguage();
    const [model, setModel] = useState<IDataModel>();
    const [modelCreate, setModelCreate] = useState<IDataModel>();
    const [modelInProg, setModelInProg] = useState<IDataModel>();
    const [modelExport, setModelExport] = useState<IDataModel>();

    const [modelData, setModelData] = useState<any>();
    const [modelDataCreate, setModelDataCreate] = useState<any>();
    const [modelDataInProg, setModelDataInProg] = useState<any>();

    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    //const [columns, setColumns] = useState(useMemo(() => modelDataInProg?.list?.responses as unknown as MRT_ColumnDef<any[0]>[], []));
    const [initialRecords, setInitialRecords] = useState({ number: 1, numberOfElements: 10, size: 10, totalPages: 1, totalCount: 10, items: [] });
    const [active1, setActive1] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>();
    const [data, setData] = useState<any>();

    const togglePara1 = (value: boolean) => {
        setActive1((oldValue) => {
            return oldValue === value ? false : value;
        });
    };

    useEffect(() => {
        setCompanyId(appConfig.company.id);

        const setdata = async () => {
            const _model = await getEntityModel('journalarticle');
            setModel(_model);

            const _modelCreate = await getEntityModel('journalsessionstart');
            setModelCreate(_modelCreate);

            const _modelExport = await getEntityModel('journalarticleexport');
            setModelExport(_modelExport);

            const _modelInProg = await getEntityModel('journalsession');
            setModelInProg(_modelInProg);

            setData({
                FromDate: appConfig.fiscalYear.beginDate,
                ToDate: appConfig.fiscalYear.endDate
            })
        };

        setdata();

    }, []);

    // useEffect(() => {
    //         console.log(data)
    //     }, [data]);

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    const SignupSchema = Yup.object().shape({
        FromDate: Yup.string().required(t('required').toString()),
        ToDate: Yup.string().required(t('required').toString()),
    });

    const handleCreateClick = async (data: any) => {
        setLoading(true);

        data.CompanyId = appConfig.company.id;
        // console.log(data);
        // console.log(modelCreate);
        const res = await fetch(`${modelCreate?.register?.url}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const result = res && (await res?.json());
            setModelDataCreate(result);
            fetchData();
            tableRefreshRef?.current?.fetchData();
            setLoading(false);
        } else {
            const result = res && (await res?.json());
            ColoredToast('danger', result);
        }
        setLoading(false);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // console.log(columns);
            const response = await fetch(modelInProg?.list?.url! + '?companyId=' + companyId);
            if (!response.ok) {
                throw new Error('خطا در دریافت داده');
            }
            const result = await response.json();
            setModelDataInProg(result);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const exportData = async (templateType: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${modelExport?.register?.url}`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companyId: companyId,
                    templateType: templateType
                }),
            });


            if (!res.ok) {
                throw new Error('خطا در دریافت داده');
            }

            const contentDisposition = res.headers.get('content-disposition');

            let fileName = `${templateType}-file.xlsx`;
            if (contentDisposition && contentDisposition.includes('filename')) {
                const matches = contentDisposition.match(/filename\*=UTF-8''(.+)|filename="?(.+?)"?($|;)/i);
                fileName = matches?.[1]
                    ? decodeURIComponent(matches[1])
                    : matches?.[2]
                        ? matches[2]
                        : fileName;
            }
            console.log(fileName);

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    modelExport

    useEffect(() => {
        const _setdata = async () => {
            await fetchData();
        };

        _setdata();

        const intervalId = setInterval(() => {
            if (['InitialCheck', 'InProgress'].includes(modelDataInProg?.status)) {
                clearInterval(intervalId);
                return;
            }

            _setdata();
        }, 10000); // 10 Seqend

        return () => {
            clearInterval(intervalId);
        };
    }, [modelInProg]);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        صدور سند حسابداری
                    </div>
                </div>

                {/* {['None', 'Failed', 'Completed'].includes(modelDataInProg?.status) && ( */}
                <div className="z-50 px-5">
                    {data && <Formik
                        initialValues={data}
                        validationSchema={SignupSchema}
                        onSubmit={(values) => {
                            handleCreateClick(values);
                        }}
                    >
                        <Form>
                            <div className="grid w-full grid-cols-1 gap-2 px-10 sm:grid-cols-2">
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div>
                                        <Field id="FromDate" name="FromDate" label={t('fromdate')} component={FDateField} />
                                    </div>
                                    <div>
                                        <Field id="ToDate" name="ToDate" label={t('todate')} component={FDateField} />
                                    </div>
                                </div>
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div className="relative mb-5 flex w-full items-end">
                                        <button type="submit" className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] p-3 px-12 font-iranyekan text-[#fff]">
                                            صدور اسناد
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Formik>
                    }
                </div>
                {/* )} */}

                {modelDataInProg?.status == 'Failed' && (
                    <div className="flex w-full">
                        <div className="w-full">
                            <div className="space-y-c space-y-2 font-iranyekan">
                                <div className="flex w-full p-5">
                                    <div className="flex w-full flex-col rounded-md border-2 border-red-800 bg-red-50 p-5">
                                        {modelDataInProg?.undefinedShares && (
                                            <div className="flex w-full py-2">
                                                <div className="text-lg text-red-950">نماد های نامشخص :</div>
                                                <div className="pr-5 text-red-800">{modelDataInProg?.undefinedShares}</div>
                                            </div>
                                        )}
                                        {modelDataInProg?.undefinedBrokers && (
                                            <div className="flex w-full py-2">
                                                <div className="text-lg text-red-950">کارگزار های نامشخص :</div>
                                                <div className="pr-5 text-red-800">{modelDataInProg?.undefinedBrokers}</div>
                                            </div>
                                        )}
                                        {modelDataInProg?.exceptionMessages && (
                                            <div className="flex w-full py-2">
                                                <div className="text-lg text-red-950">خطا :</div>
                                                <div className="pr-5 text-red-800">{modelDataInProg?.exceptionMessages}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {modelDataInProg?.status == 'Completed' && (
                    <div className="flex w-full">
                        <div className="w-full">
                            <div className="space-y-c space-y-2 font-iranyekan">
                                <div className="flex w-full p-5">
                                    <div className="flex w-full flex-col rounded-md border border-green-800 bg-green-50 p-5">
                                        <div className="flex w-full flex-col py-2 text-center text-green-800">سند حسابداری با موفقیت صادر شد</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {modelDataInProg?.status == 'InProgress' && (
                    <div className="flex w-full">
                        <div className="w-full">
                            <div className="space-y-c space-y-2 font-iranyekan">
                                <div className="flex w-full p-5">
                                    <div className="flex w-full flex-col rounded-md border border-gray-800 bg-gray-50 p-5">
                                        <div className="flex w-full flex-col py-2">
                                            <div className="w-full pb-3 text-center text-green-800">درحال پردازش می باشد ...</div>
                                            <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                                <div className="h-2.5 rounded-full bg-green-500" style={{ width: `${modelDataCreate?.progress}%` }}></div>
                                                <div className="flex w-full items-center justify-center">{`${modelDataCreate?.progress}%`}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {modelDataInProg?.status == 'InitialCheck' && (
                    <div className="flex w-full">
                        <div className="w-full">
                            <div className="space-y-c space-y-2 font-iranyekan">
                                <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                    <div className="flex w-full p-5">
                                        <div className="flex w-full flex-col rounded-md border border-blue-800 bg-blue-50 p-5">
                                            <div className="flex w-full flex-col py-2 text-center text-blue-800">در حال بررسی اولیه می باشد ...</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className=" space-y-2 font-iranyekan">
                    <div className="border-[#d3d3d3] dark:border-[#1b2e4b]">
                        <button
                            type="button"
                            className={`space-y-cc flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active1 ? '!#089bab' : '#089bab'}`}
                            onClick={() => togglePara1(true)}
                        >
                            <div className="px-5 flex">
                                <div className='pl-10'>اسناد صادر شده</div>
                                <div>{`تاریخ صدور  : ${modelDataInProg?.requestDate}`}</div>
                            </div>
                        </button>
                        <div>
                            <AnimateHeight duration={300} height={active1 ? 'auto' : 0}>
                                <div className="table-responsive px-5">
                                    <div className='flex flex-row w-full justify-between'>
                                        <div className="table-responsive px-5 pb-3">
                                            بازه زمانی اسناد از {modelDataInProg?.fromDate} تا {modelDataInProg?.toDate}
                                        </div>
                                        <div className="table-responsive px-5 pb-3 flex">
                                            <div className={`${loading ? 'text-gray-600' : 'text-[#089bab]'} ltr:ml-auto rtl:mr-auto flex`}>
                                                <Tooltip label="دانلود">
                                                    <div onClick={() => !loading && exportData('Sepidar')}>
                                                        <i className={`fa-duotone fa-solid fa-cloud-download text-2xl ml-5`} />
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <div>نرم افزار مقصد {modelDataInProg?.targetSoftware}</div>
                                        </div>
                                    </div>

                                    {model && (
                                        <Demo
                                            model={model}
                                            isShowHideCol={true}
                                            myRef={tableRefreshRef}
                                            hideColList={['id', 'companyId', 'status', 'fileType', 'progress', 'importedFileId', 'includeInProgress']}
                                            addSepratorFildes={['transactionsCount']}
                                            addFooterSumFildes={['transactionsCount']}
                                            labaleNameList={[
                                                { label: 'Keyword', value: 'نام سهام' },
                                                { label: 'name', value: 'نام سهام' },
                                                { label: 'industryName', value: 'زیرصنعت' },
                                            ]}
                                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                                            isEditable={false}
                                            isDeleteable={false}
                                        // action={(item) => (
                                        //     <>
                                        //         <Tooltip label="نمایش اطلاعات">
                                        //             <Link
                                        //                 href="#"
                                        //                 onClick={() => router.push(`transactionImportsession/${item.id}`)}
                                        //                 className="btn btn-outline mr-3 flex items-center rounded-xl bg-secondary-light px-2 font-iranyekan text-secondary"
                                        //             >
                                        //                 <IconEye className="color-red-400" />
                                        //             </Link>
                                        //             {/* <ActionIcon onClick={() => router.push(`transactionImportsession/${item.id}`)}>
                                        //                 <IconEye />
                                        //             </ActionIcon> */}
                                        //         </Tooltip>
                                        //         <Tooltip label="نمایش تراکنش ها">
                                        //             <Link
                                        //                 href="#"
                                        //                 onClick={() => router.push(`transactionImportsession/${item.id}/transaction`)}
                                        //                 className="btn btn-outline mr-3 flex items-center rounded-xl bg-secondary-light px-2 font-iranyekan text-secondary"
                                        //             >
                                        //                 <IconEye className="color-red-400" />
                                        //             </Link>
                                        //             {/* <ActionIcon onClick={() => router.push(`transactionImportsession/${item.id}/transaction`)}>
                                        //                 <IconEye />
                                        //             </ActionIcon> */}
                                        //         </Tooltip>
                                        //     </>
                                        // )}
                                        />
                                    )}
                                </div>
                            </AnimateHeight>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Company;
