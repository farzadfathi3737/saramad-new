import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Select, { SingleValue } from 'react-select';
import { IOptionType } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { apiFetch } from '@/lib/apiFetch';

type UploadedFile = File;

const optionData: IOptionType[] = [
    { value: 'Ddn', label: 'بارکذاری فایل DDN' },
    { value: 'ManualEntry', label: 'بارکذاری فرمت دستی XLS' },
];

const FileUploadModal: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedValue, setSelectedValue] = useState<SingleValue<IOptionType>>(optionData[0]);
    const [companyId, setCompanyId] = useState('');
    const appConfig = useSelector((state: IRootState) => state.appConfig);

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

    const saveFile = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('File', uploadedFiles[0]);

        const res = await fetch(`cloud/api/shareholding/TransactionImportSession?CompanyId=${companyId}&FileType=${selectedValue?.value}`, {
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
            //console.log(result);
            //setInitialRecords(result);
            //setAddModal(false);
            //fetchData();
        } else {
            setIsLoading(false);
            setErrorMessage('خطا در بارگزاری فایل رخ داده است');
            //setInitialRecords({ pageNumber: 1, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
        }

        setIsLoading(false);
        setIsModalOpen(false);
    };

    const fileList = uploadedFiles.map((file, index) => (
        <li key={index} className="text-sm">
            {file.name}
        </li>
    ));

    useEffect(() => {
        setCompanyId(appConfig.company.id);
    }, [appConfig.company]);

    return (
        <div className="flex w-full">
            <button type="button" onClick={() => openModal()} className="btn btn-outline mr-3 flex items-center rounded-lg p-2 px-4 bg-[#2D9AA0] font-iranyekan text-[#fff]">
                انتخاب فایل
            </button>
            {errorMessage && <p className="mr-5 flex w-full items-center justify-center rounded-md bg-red-100 text-red-900">{errorMessage}</p>}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" open={isModalOpen} onClose={() => openModal()}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
                        <div className="w-full max-w-lg">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="rounded-lg bg-white p-6 shadow-lg relative">
                                    {isLoading && (
                                        <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#00000042]">
                                            <div role="status">
                                                <svg
                                                    aria-hidden="true"
                                                    className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentFill"
                                                    />
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold">آپلود فایل‌</h2>
                                        <button type="button" onClick={() => closeModal()} className="text-gray-500 hover:text-gray-700">
                                            <i className="fa-duotone fa-solid fa-xmark text-xl" />
                                        </button>
                                    </div>

                                    <div>
                                        <div>
                                            <label className="!text-gray-600">نوع فایل</label>
                                            <Select
                                                //menuPosition="fixed"
                                                className="z-auto mb-5"
                                                id={'FileType'}
                                                name={'FileType'}
                                                value={selectedValue}
                                                onChange={(item: SingleValue<IOptionType>) => {
                                                    setSelectedValue(item);
                                                }}
                                                options={optionData}
                                                isMulti={false}
                                                placeholder={'نوع فایل را مشخص کنید'}
                                            />
                                            {/* {form.touched[field.name] && form.errors[field.name] ? <div className="text-warning">{form.errors[field.name]?.toString()}</div> : null} */}
                                        </div>
                                        <div {...getRootProps()} className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                                            <input {...getInputProps()} />
                                            <p className="text-gray-500">فایل‌ها را اینجا بکشید یا کلیک کنید تا فایل‌ها را انتخاب کنید</p>
                                            <div className="flex items-center justify-center pt-5 ">
                                                {fileList.length > 0 ? (
                                                    <div className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-2 text-center">
                                                        {/* <FontAwesomeIcon icon={faClose} size="1x" className="m-1 pl-5 text-gray-500" onClick={() => setUploadedFiles([])} /> */}
                                                        <i className={`fa-duotone fa-solid fa-close text-xl m-1 pl-5 text-gray-500`} onClick={() => setUploadedFiles([])} />
                                                        <ul>{fileList}</ul>
                                                    </div>
                                                ) : (
                                                    // <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" className="m-1 text-gray-500" />
                                                    <i className={`fa-duotone fa-solid fa-close text-xl m-1 text-gray-500`} />
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-end">
                                            <button type="button" onClick={() => closeModal()} className="ml-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                                                انصراف
                                            </button>
                                            <button type="button" onClick={() => saveFile()} className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-700" disabled={fileList?.length > 0 ? false : true}>
                                                شروع بارگزاری
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div >

    );
};

export default FileUploadModal;
