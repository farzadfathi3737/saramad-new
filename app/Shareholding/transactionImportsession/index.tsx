import { getEntityModel } from '@/models/entity';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Demo from '@/app/components/Datatable/MRT';
// import 'tippy.js/dist/tippy.css';
import { IDataModel } from '@/interface/dataModel';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import AnimateHeight from 'react-animate-height';
import { IconCaretDown } from '@tabler/icons-react';
import Inprogress from './inprogress';
import { useSubPage } from '@/app/components/Notifications/useSubPage';

const Company = () => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [model, setModel] = useState<IDataModel>();
    //const [modelData, setModelData] = useState<any>();
    const appConfig = useSelector((state: IRootState) => state.appConfig);
    const [companyId, setCompanyId] = useState('');
    const router = useRouter();
    const [active1, setActive1] = useState<boolean>(true);

    console.log('companyId');

    const togglePara1 = (value: boolean) => {
        setActive1((oldValue) => {
            return oldValue === value ? false : value;
        });
    };

    useEffect(() => {
        setCompanyId(appConfig.company.id);

        const setdata = async () => {
            const _model = await getEntityModel('transactionimportsession');
            setModel(_model);
        };
        setdata();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <div className="panel h-full w-full px-0">
                <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-300">
                    <div className='p-2 h-full flex flex-col justify-center align-middle pr-5'>
                        بارگزاری اطلاعات خرید و فروش
                    </div>
                </div>
                <div className="table-responsive px-5 pb-5 pt-5">
                    <Inprogress />
                </div>

                <div className="space-y-2 font-iranyekan">
                    <div className="border-[#d3d3d3] dark:border-[#1b2e4b]">
                        <button
                            type="button"
                            className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active1 ? '!#089bab' : '#089bab'}`}
                            onClick={() => togglePara1(true)}
                        >
                            <div className="px-5">بارگزاری های پیشین</div>
                            <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active1 === true ? 'rotate-180' : ''}`}>
                                <IconCaretDown />
                            </div>
                        </button>
                        <div>
                            <AnimateHeight duration={300} height={active1 ? 'auto' : 0}>
                                <div className="table-responsive px-5">
                                    {model && (
                                        <Demo
                                            model={model}
                                            isShowHideCol={true}
                                            hideColList={['id', 'companyId', 'date', 'status', 'fileType', 'progress', 'importedFileId', 'includeInProgress']}
                                            addSepratorFildes={['transactionsCount']}
                                            addFooterSumFildes={['transactionsCount']}
                                            labaleNameList={[
                                                { label: 'Keyword', value: 'نام سهام' },
                                                { label: 'name', value: 'نام سهام' },
                                                { label: 'industryName', value: 'زیرصنعت' },
                                            ]}
                                            staticParams={[{ name: 'CompanyId', value: companyId }]}
                                            isEditable={false}
                                            action={(item) => (
                                                <>
                                                    <Tooltip label="نمایش اطلاعات">
                                                        <ActionIcon
                                                            //onClick={() => router.push(`transactionImportsession/${item.id}`)}
                                                            onClick={() => subPage('transactionimportsession', 'view', undefined, [{ key: 'id', value: item.id.toString() }])}
                                                            variant="transparent"
                                                            className="mr-3 flex items-center rounded-xl w-9 h-9 p-0">
                                                            <i className="fa-duotone fa-solid fa-info text-xl text-gray-400 hover:text-blue-500" />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="نمایش تراکنش ها">
                                                        <ActionIcon
                                                            onClick={() => router.push(`transactionImportsession/${item.id}/transaction`)}
                                                            variant="transparent"
                                                            className="mr-3 flex items-center rounded-xl w-9 h-9 p-0">
                                                            <i className="fa-duotone fa-solid fa-list-check text-xl text-gray-400 hover:text-green-500" />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </>
                                            )}
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
