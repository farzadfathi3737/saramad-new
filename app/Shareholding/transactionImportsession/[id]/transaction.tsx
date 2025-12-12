'use client'

import FTextField from '@/app/components/inputs/textField';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useRouter as Router } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import FSelectField from '@/app/components/inputs/selectField';
import FDateField from '@/app/components/inputs/dateField';
import FSelectModelField from '@/app/components/inputs/selectModelField';
import AnimateHeight from 'react-animate-height';
import { IconCaretDown } from '@tabler/icons-react';
import { ActionIcon, Grid, Tooltip } from '@mantine/core';
import Demo from '@/app/components/Datatable/MRT';
import FormatBytes from '@/app/components/inputs/fileSize';
import { IconHttpDelete } from '@tabler/icons-react';

import Session from './session';

interface ICompany {
    date: string;
    exceptionMessages: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    fileTypeName: string;
    hasException: boolean;
    id: string;
    importedFileId: string;
    isFailed: boolean;
    isInProgress: boolean;
    number: number;
    progress: number;
    status: string;
    statusName: string;
    transactionsCount: number;
    unknownBrokers: string | null;
    unknownSymbols: string | null;
    unknownTradingCodes: string | null;
}

interface ISession {
    creationDate: string;
    date: string;
    id: string;
    isDeletable: boolean;
    lastUpdateDate: string;
    number: number;
}
interface ISessionlist {
    items: ISession[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

const Add = () => {
    const { t } = useTranslation();
    const [model, setModel] = useState<IDataModel>();
    const [modelS, setModelS] = useState<IDataModel>();
    const [modelD, setModelD] = useState<IDataModel>();
    const [data, setData] = useState<ICompany | undefined>();
    const [dataSession, setDataSession] = useState<ISessionlist | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>();
    const [sessionId, setSessionId] = useState<string>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [modelData, setModelData] = useState<any>();

    const router = useRouter();
    const _router = Router();
    const { query } = _router;

    const [active1, setActive1] = useState<string>('1');
    const [active2, setActive2] = useState<string>('1');

    const togglePara1 = (value: string) => {
        setActive1((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const togglePara2 = (value: string) => {
        setActive2((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        setRowId(query.id?.toString());

        const _setdata = async () => {
            let _model = await getEntityModel('transactionimportsession');
            setModel(_model);

            let _modelS = await getEntityModel('sharetransactionbatchsession');
            setModelS(_modelS);

            //fetchData();
        };

        _setdata();
    }, []);

    useEffect(() => {
        setRowId(query.id?.toString());
    }, [query]);

    useEffect(() => {
        setData(undefined);
        const _setdata = async () => {
            rowId && fetchData(rowId);
        };
        _setdata();
    }, [rowId]);

    useEffect(() => {
        setDataSession(undefined);
        const _setdata = async () => {
            sessionId && fetchSessionData(sessionId);
        };
        _setdata();
    }, [sessionId]);

    const fetchData = async (id: string) => {
        setIsLoading(true);

        const res = await fetch(`${model?.read?.url.replace('{id}', id)}`);

        if (res.ok) {
            const result: ICompany = await res?.json();
            setData(result);
            console.log(result);
            setSessionId(result.id);
            setIsLoading(false);
        } else {
            setData(undefined);
            setIsLoading(false);
        }
    };

    const fetchSessionData = async (id: string) => {
        setIsLoading(true);

        const res = await fetch(`${modelS?.list?.url}?SessionId=${id}`);

        if (res.ok) {
            const result: ISessionlist = await res?.json();
            setDataSession(result);
            setIsLoading(false);
        } else {
            setDataSession(undefined);
            setIsLoading(false);
        }
    };

    const handlGetData = () => {
        const setdata = async () => {
            let _model = getEntityModel('rawtransaction'); //pagination is neded
            // console.log(_model);
            setModelData(_model);
        };
        setdata();
    };

    const handlEditClick = async (data: ICompany) => {
        setIsLoading(true);
        // console.log(data);
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
        <div className="h-auto] flex flex-col">
            <div className="panel h-full w-full px-0">
                <div className="mb-2 flex h-[3rem] items-start justify-start border-b-2 px-5 pb-3">
                    <div>
                        <Tooltip label={t('back')}>
                            <ActionIcon color="inheritans" className="flex items-center justify-center rounded-[50%] p-5 hover:bg-inherit hover:text-blue-900" onClick={() => router.back()}>
                                <i className="fa-duotone fa-solid fa-arrow-right text-lg ml-2" />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <div className="p-2">تراکنش های بارگزاری شده</div>
                </div>
                {data && (
                    <div className="flex px-0 py-0 w-full">
                        <div className="flex flex-col px-0 w-full">
                            {/* <div className="grid w-full grid-cols-1 gap-2 px-10 sm:grid-cols-2">
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div>
                                        <fieldset>
                                            <label className="text-white-dark">شماره جلسه</label>
                                            <div className="form-input pt-3 text-white-dark">{data.number}</div>
                                        </fieldset>
                                    </div>
                                    <div>
                                        <fieldset>
                                            <label className="text-white-dark">نام فایل</label>
                                            <div className="form-input pt-3 text-white-dark">{`${data.fileName} - ( ${FormatBytes(10737418, 1)} )`}</div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="grid w-full"></div>
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div>
                                        <fieldset>
                                            <label className="text-white-dark">تاریخ جلسه</label>
                                            <div className="form-input pt-3 text-white-dark">{data.date}</div>
                                        </fieldset>
                                    </div>
                                    <div>
                                        <fieldset>
                                            <label className="text-white-dark">نوع فایل</label>
                                            <div className="form-input pt-3 text-white-dark">{data.fileTypeName}</div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="grid w-full"></div>
                                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div>
                                        <fieldset>
                                            <label className="text-white-dark">وضعیت</label>
                                            <div className="form-input pt-3 text-white-dark">{data.statusName}</div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="grid w-full"></div>
                            </div> */}
                            <div className="flex px-5 pt-3 w-full">
                                <div className="flex w-full rounded-xl border-2 border-solid border-gray-200 bg-gray-100 px-5">
                                    <div className="flex w-full flex-row p-3">
                                        <div className="flex w-fit pl-5 items-center justify-center">
                                            <div className="text-white-dark pl-2">شماره جلسه</div>
                                            <div className="px-2 font-bold text-lg text-white-dark bg-white rounded-lg p-2 border">{data.number}</div>
                                        </div>

                                        <div className="flex w-fit pl-5 items-center justify-center">
                                            <div className="text-white-dark pl-2">نام فایل</div>
                                            <div className="px-2 font-bold text-lg text-white-dark bg-white rounded-lg p-2 border">{data.fileName}</div>
                                        </div>


                                        <div className="flex w-fit pl-5 items-center justify-center">
                                            <div className="text-white-dark pl-2">تاریخ جلسه</div>
                                            <div className="px-2 font-bold text-lg text-white-dark bg-white rounded-lg p-2 border">{data.date}</div>
                                        </div>


                                        <div className="flex w-fit pl-5 items-center justify-center">
                                            <div className="text-white-dark pl-2">نوع فایل</div>
                                            <div className="px-2 font-bold text-lg text-white-dark bg-white rounded-lg p-2 border">{data.fileTypeName}</div>
                                        </div>


                                        <div className="flex w-fit pl-5 items-center justify-center">
                                            <div className="text-white-dark pl-2">وضعیت</div>
                                            <div className="px-2 font-bold text-lg text-white-dark bg-white rounded-lg p-2 border">{data.statusName}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {sessionId && <Session sessionid={sessionId} />}

                            {/* <div className="grid w-full grid-cols-1 gap-2 p-5 px-10">
                                {!data.isInProgress && (
                                    <button type="button" onClick={handlGetData} className="btn btn-primary w-52">
                                        انتخاب فایل
                                    </button>
                                )}
                            </div> */}

                            {/* {!data.isInProgress && modelData && (
                                <div className="flex w-full">
                                    <div className="w-full">
                                        <div className="space-y-2 font-iranyekan">
                                            <div className="border-y border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <button
                                                    type="button"
                                                    className={`space-y-cc flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active2 === '1' ? '!#089bab' : '#089bab'}`}
                                                    onClick={() => togglePara2('1')}
                                                >
                                                    اطلاعات بارگزاری شده (پردازش نشده){' '}
                                                    <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active2 === '1' ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown />
                                                    </div>
                                                </button>
                                                <div>
                                                    <AnimateHeight duration={300} height={active2 === '1' ? 'auto' : 0}>
                                                        <div className="table-responsive px-5">
                                                            {modelData && rowId && (
                                                                <Demo
                                                                    isShowSearchForm={false}
                                                                    model={modelData}
                                                                    isShowHideCol={true}
                                                                    hideColList={['id', 'companyId', 'date', 'status', 'fileType', 'progress', 'importedFileId']}
                                                                    labaleNameList={[
                                                                        { label: 'Keyword', value: 'نام سهام' },
                                                                        { label: 'name', value: 'نام سهام' },
                                                                        { label: 'industryName', value: 'زیرصنعت' },
                                                                    ]}
                                                                    staticParams={[{ name: 'SessionId', value: rowId! }]}
                                                                    //isEditable={false}
                                                                    // action={(item: any) => (
                                                                    //     <Tooltip label="اطلاعات نماد">
                                                                    //         <ActionIcon onClick={() => router.push(`${modelData.name.toString().toLowerCase()}/${item.id}`)}>
                                                                    //             <IconEye />
                                                                    //         </ActionIcon>
                                                                    //     </Tooltip>
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
                            )} */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Add;
