import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Select, { SingleValue } from 'react-select';
import { IOptionType } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { apiFetch } from '@/lib/apiFetch';
import FSelectModelField from '../inputs/selectModelField';
import { Field, Form, Formik } from 'formik';
import FSelectField from '../inputs/selectField';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Yup from 'yup';
import { useSubPage } from '../Notifications/useSubPage';
import FormatBytes from '../inputs/fileSize';

type UploadedFile = File;

const optionData: IOptionType[] = [
    { value: 'Ddn', label: 'بارکذاری فایل DDN' },
    { value: 'ManualEntry', label: 'بارکذاری فرمت دستی XLS' },
    { value: 'Prx', label: 'بارکذاری فایل PRX' },
    // { value: 'DepositoryOnline', label: 'DepositoryOnline' },
];



const FileUploadModal: React.FC = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedValue, setSelectedValue] = useState<SingleValue<IOptionType>>(optionData[0]);
    const [companyId, setCompanyId] = useState('');
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [fileTypeSelected, setFileTypeSelected] = useState('Ddn');

    const SignupSchema = () => Yup.object().shape({
        fileType: Yup.string().required(t('required').toString()),
    });

    const SignupSchema2 = () => Yup.object().shape({
        fileType: Yup.string().required(t('required').toString()),
        tradingCodeId: Yup.string().required(t('required').toString()),
        stockBrokerId: Yup.string().required(t('required').toString()),
    });

    const onDrop = (acceptedFiles: UploadedFile[]) => {
        setUploadedFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
    });

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setUploadedFiles([]);
        setIsModalOpen(false);
    };

    const saveFile = async (data: any) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('File', uploadedFiles[0]);

        const _url = data?.fileType !== 'Prx'
            ? `cloud/api/shareholding/TransactionImportSession?CompanyId=${companyId}&FileType=${data?.fileType}`
            : `cloud/api/shareholding/TransactionImportSession?CompanyId=${companyId}&FileType=${data?.fileType}${data?.tradingCodeId ? '&TradingCodeId=' + data?.tradingCodeId : ''}${data?.stockBrokerId ? '&StockBrokerId=' + data?.stockBrokerId : ''}`

        const res = await fetch(_url, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            const result = res && (await res?.json());
            if (result.isFailed) {
                setErrorMessage(result.exceptionMessages);
            } else {
                setErrorMessage(undefined);
            }
            setUploadedFiles([]);
            console.log(result);
            //setInitialRecords(result);
            //setAddModal(false);
            //fetchData();
            subPage('transactionimportsession', 'view', undefined, [{ key: 'id', value: result.id }])
        } else {
            setIsLoading(false);
            setErrorMessage('خطا در بارگذاری فایل رخ داده است');
            //setInitialRecords({ pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
        }

        setIsLoading(false);
        setIsModalOpen(false);
    };

    const fileList = uploadedFiles.map((file, index) => (
        <div key={index} className="grid grid-cols-2 justify-between">
            <div className="flex justify-between">
                <div className="flex text-sm">
                    <p className='text-gray-500'>نام فایل :</p>
                    <p className='pr-1'>{file.name}</p>
                </div>
                <div className="flex text-sm">
                    <p className='text-gray-500'>فرمت :</p>
                    <p className='pr-1'>excel</p>
                </div>
                <div className="flex text-sm">
                    <p className='text-gray-500'>حجم :</p>
                    <p className='pr-1'>{FormatBytes(file.size, 1)}</p>

                </div>
            </div>
        </div>
    ));

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    return (
        <div className="flex flex-col w-full">



            {/* {errorMessage && <p className="mr-5 flex w-full items-center justify-center rounded-md bg-red-100 text-red-900">{errorMessage}</p>} */}


            <div className="flex items-center justify-between mb-4 px-3">
                <h2 className="text-md text-gray-500 font-semibold">بارگزاری فایل</h2>
            </div>

            <div>
                {/* <div>
                    <label className="!text-gray-600">نوع فایل</label>
                    <Select
                        //menuPosition="fixed"
                        className="z-auto mb-5"
                        id={'SourceType'}
                        name={'SourceType'}
                        value={selectedValue}
                        onChange={(item: SingleValue<IOptionType>) => {
                            setSelectedValue(item);
                        }}
                        options={optionData}
                        isMulti={false}
                        placeholder={'نوع فایل را مشخص کنید'}
                    />


                    {/* {form.touched[field.name] && form.errors[field.name] ? <div className="text-warning">{form.errors[field.name]?.toString()}</div> : null} /}
            </div> */}



                {fileList.length > 0 ?
                    <div className="cursor-pointer rounded-lg border bg-orange-100 border-orange-400 p-6 text-center">
                        <div className="items-center justify-center">
                            <div className="cursor-pointer">
                                {/* <i className={`fa-duotone fa-solid fa-close text-xl m-1 pl-5 text-gray-500`} onClick={() => setUploadedFiles([])} /> */}
                                <div>{fileList}</div>


                                <Formik
                                    initialValues={{
                                        fileType: 'Ddn'
                                    }}
                                    validationSchema={(fileTypeSelected !== 'Prx') ? SignupSchema : SignupSchema2}
                                    onSubmit={(values) => {
                                        saveFile(values);
                                    }}
                                >
                                    <Form>
                                        <div className="grid grid-cols-2 justify-between pt-5">
                                            <div className="grid grid-cols-3 gap-5 justify-between">
                                                <div>
                                                    <Field
                                                        id="fileType"
                                                        name="fileType"
                                                        label="نوع فایل"
                                                        options={optionData}
                                                        component={FSelectField}
                                                        className="!mb-0"
                                                        haveClear={false}
                                                        onChange={(val: any) => {
                                                            setFileTypeSelected(val.value)
                                                        }}
                                                    />
                                                </div>
                                                {/* prx باید پر شود */}
                                                {(fileTypeSelected == 'Prx') ?
                                                    <>
                                                        <div>
                                                            <Field
                                                                id="tradingCodeId"
                                                                name="tradingCodeId"
                                                                label="سبد معاملاتی"
                                                                listRefName="companytradingcode"
                                                                staticParams={[{ name: 'CompanyId', value: appConfig.company.id }]}
                                                                component={FSelectModelField}
                                                                className="!mb-0"
                                                            />

                                                        </div>
                                                        <div>
                                                            <Field
                                                                id="stockBrokerId"
                                                                name="stockBrokerId"
                                                                label="کارگزاری"
                                                                listRefName="companybroker"
                                                                staticParams={[{ name: 'CompanyId', value: appConfig.company.id }]}
                                                                component={FSelectModelField}
                                                                className="!mb-0"
                                                            />
                                                        </div>
                                                    </>
                                                    : <></>
                                                }
                                            </div>

                                            <div className="mt-8 flex justify-end">
                                                <button type="button" onClick={() => setUploadedFiles([])} disabled={isLoading} className="ml-2 rounded-lg px-4 py-2 text-red-600 hover:border-red-600 hover:border disabled:opacity-50 disabled:cursor-not-allowed">
                                                    انصراف و حذف فایل
                                                </button>
                                                <button type="submit" className="rounded-lg border border-blue-500 px-4 py-2 text-blue-500 hover:text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" disabled={isLoading || fileList?.length === 0}>
                                                    {isLoading ? (
                                                        <>
                                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            در حال بارگزاری...
                                                        </>
                                                    ) : (
                                                        'ثبت و شروع بارگزاری'
                                                    )}
                                                </button>
                                            </div>
                                            {/* <div className="mt-8 flex items-center justify-end">
                                                <button type="button"
                                                    onClick={() => subPage('transfercodetocode')}
                                                    className="btn btn-outline-[#2D9AA0] font-iranyekan">
                                                    {t('cancel')}
                                                </button>

                                                <button type="submit" className="btn btn-outline mr-3 flex items-center bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                                    {t('save')}
                                                </button>
                                            </div> */}
                                        </div>
                                    </Form>
                                </Formik>

                            </div>
                        </div>
                    </div>
                    :
                    <div {...getRootProps()} className="cursor-pointer rounded-lg border-2 bg-gray-100 border-gray-300 p-10 text-center">
                        <input {...getInputProps()} />
                        <p className="text-gray-500">فایل‌ را بکشید و رها کنید</p>
                    </div>
                }
            </div>
        </div >

    );
};

export default FileUploadModal;
