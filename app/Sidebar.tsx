'use client'

import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLanguage } from '@/contexts/LanguageContext';
// import { useSelector } from 'react-redux';
import Link from 'next/link';
import AnimateHeight from 'react-animate-height';
// import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
// import IconCaretDown from '@/components/Icon/IconCaretDown';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faBars, faFile, faFolder, faGamepad, faGauge, faGears, faHeadphones, faNewspaper, faPrint, faSliders } from '@fortawesome/free-solid-svg-icons';
//import { AddTab } from './components/tabPage'
import { ITabData } from '@/interface/dataModel';

import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setActiveTab, setTabs } from '@/store/appConfigSlice';
import { useRouter } from 'next/navigation';


const Sidebar = () => {
    const { t } = useLanguage();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [lasttMenu, setLastMenu] = useState<string>('');
    const [currentSubMenu, setCurrentSubMenu] = useState<string>('');
    const [, setLastSubMenu] = useState<string>('');
    const router = useRouter();
    const dispatch = useDispatch();
    const appConf = useSelector((state: IRootState) => state.appConfig);

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            setLastMenu(value);
            return oldValue === value ? '' : value;
        });
    };

    const toggleSubMenu = (value: string, parent: string) => {
        setCurrentSubMenu((oldValue) => {
            setLastSubMenu(value + parent);
            return oldValue === value + parent ? '' : value + parent;
        });
    };

    const AddTab = (param: ITabData) => {

        //console.log(param.key, param.name)

        if (appConf.tabs.length >= 6) {
            alert("حداکثر ۶ تب مجاز است!");
            return;
        }

        const _newTab = appConf.tabs.find((x) => x.id == param.key);

        if (!_newTab) {
            const newTab: ITabData = {
                //id: Date.now(),
                id: param.id,
                key: param.key,
                name: param.name,
                orther: param.key == 'dashboard' ? 0 : appConf.tabs.length,
                filters: [],
                params: [],
            };

            // console.log(appConf.tabs)

            const updatedTabs = [...appConf.tabs, newTab];
            dispatch(setTabs(updatedTabs));
        };

        dispatch(setActiveTab(param.key));

        // console.log(appConf.tabs);
        // console.log(appConf.activeTab);

        router.replace(`?tab=${param.key}`);
    };

    const MenuData = [
        { id: 'dashboard', name: 'dashboard', title: 'داشبورد', link: '/', icon: 'fa-gauge' },
        {
            id: 'baseData',
            name: 'baseData',
            title: 'تعاریف پایه',
            link: '/',
            icon: 'fa-folder',
            childe: [
                { id: 'company', name: 'companyProfile', title: 'تعریف شرکت', link: '/Shareholding/company', icon: '' },
                { id: 'fiscalyear', name: 'fiscalYear', title: 'سال مالی شرکت', link: '/Shareholding/fiscalyear', icon: '' },
                { id: 'companytradingcode', name: 'tradingBasket', title: 'سبد معاملاتی', link: '/Shareholding/companytradingcode', icon: '' },
                { id: 'stock', name: 'securitiesList', title: 'فهرست اوراق بهادار', link: '/Shareholding/stock', icon: '' },
                { id: 'share', name: 'portfolioOfAssets', title: 'فهرست دارایی ها', link: '/Shareholding/share', icon: '' },
                { id: 'sharerelationtype', name: 'companyType', title: 'نوع وابستگی سهم', link: '/Shareholding/sharerelationtype', icon: '' },
                { id: 'companybroker', name: 'listOfBrokers', title: 'فهرست کارگزاران', link: '/Shareholding/companybroker', icon: '' },
            ],
        },
        {
            id: 'actions',
            name: 'actions',
            title: 'عملیات',
            link: '/',
            icon: 'fa-gears',
            childe: [
                { id: 'transactionimportsession', name: 'transactionimportsession', title: 'بارگزاری اطلاعات خرید و فروش', link: '/Shareholding/transactionImportsession', icon: '' },
                { id: 'buyingAndSellingListBurs', name: 'buyingAndSellingListBurs', title: 'فهرست خرید و فروش بورسی', link: '/Shareholding/sharetransactionbatch', icon: '' },
                { id: 'buyingAndSellingListNoBurs', name: 'buyingAndSellingListNoBurs', title: 'فهرست خرید و فروش غیر بورسی', link: '/pages/buyingAndSellingListNoBurs', icon: '' },
                { id: 'transferCodeToCode', name: 'transferCodeToCode', title: 'انتقال کد به کد', link: '/', icon: '' },
                { id: 'shareMeeting', name: 'shareMeeting', title: 'فهرست مجامع دارایی ها', link: '/Shareholding/shareMeeting', icon: '' },
                { id: 'brokercontradictions', name: 'brokercontradictions', title: 'مغایرت گیری با کارگزاری', link: '/Shareholding/brokercontradictions', icon: '' },
                { id: 'discrepancyWithDepositary', name: 'discrepancyWithDepositary', title: 'مغایرت گیری با سپرده گذاری', link: '/', icon: '' },
            ],
        },
        {
            id: 'optionContract',
            name: 'optionContract',
            title: 'قرارداد اختیار معامله',
            link: '/',
            icon: "fa-file",
            childe: [
                { id: 'optioncontract', name: 'optioncontract', title: 'تسویه قراردادهای باز', link: '/Shareholding/optioncontract', icon: '' },
                { id: 'optionHistorySettlement', name: 'optionHistorySettlement', title: 'تاریخچه تسویه اختیار', link: '/', icon: '' },
                { id: 'closingPositionPL', name: 'closingPositionPL', title: 'بستن موقعیت به سود و زیان', link: '/', icon: '' },
            ],
        },
        {
            id: 'accountingDocuments',
            name: 'accountingDocuments',
            title: 'اسناد حسابداری',
            link: '/',
            icon: "fa-newspaper",
            childe: [
                { id: 'issueDocument', name: 'issueDocument', title: 'صدور سند', link: '/Shareholding/accountings/journalarticle', icon: '' },
                { id: 'documentReleaseLock', name: 'documentReleaseLock', title: 'آزادسازی و بستن اسناد', link: '/pages/buyingAndSellingListBurs', icon: '' },
            ],
        },
        {
            id: 'investmentReturns',
            name: 'investmentReturns',
            title: 'بازده سرمایه گذاری',
            link: '/',
            icon: "fa-gamepad",
            childe: [
                { id: 'simpleReturn', name: 'simpleReturn', title: 'بازده ساده (ROR)', link: '/', icon: '' },
                { id: 'moneyWeightedReturn', name: 'moneyWeightedReturn', title: 'نرخ بازده پولی وزنی (MWRR)', link: '/', icon: '' },
                { id: 'timeWeightedReturn', name: 'timeWeightedReturn', title: 'نرخ بازده زمان وزنی (TWRR)', link: '/', icon: '' },
            ],
        },
        {
            id: 'reports',
            name: 'reports',
            title: 'گزارشات',
            link: '/',
            icon: 'fa-print',
            childe: [
                { id: 'stackedbuysell', name: 'stackedbuysell', title: 'خرید و فروش', link: '/reports/stackedbuysell', icon: '' },
                { id: 'shareturnover', name: 'shareturnover', title: 'گردش سهام', link: '/reports/shareturnover', icon: '' },
                { id: 'cardex', name: 'cardex', title: 'کاردکس ریز سهام', link: '/reports/cardex', icon: '' },
                { id: 'stackedcardex', name: 'stackedcardex', title: 'روند موجودی', link: '/reports/stackedcardex', icon: '' },
                { id: 'sharebalance', name: 'sharebalance', title: 'مانده سهام', link: '/reports/sharebalance', icon: '' },
                { id: 'realizedprofit', name: 'realizeedprofit', title: 'سود و زیان تحقق یافته', link: '/reports/realizedprofit', icon: '' },
                { id: 'investmentdepreciationreserve', name: 'investmentdepreciationreserve', title: 'ذخیره کاهش ارزش سرمایه گزاری', link: '/reports/investmentdepreciationreserve', icon: '' },
                { id: 'capitalraise', name: 'capitalraise', title: 'افزایش سرمایه', link: '/reports/capitalraise', icon: '' },
                { id: 'cashdividend', name: 'cashdividend', title: 'گزارش شناسایی سود اوراق بهادار ', link: '/reports/cashdividend', icon: '' },
                { id: 'cashdividenddeposit', name: 'cashdividenddeposit', title: 'گزارش واریز سود اوراق بهادار', link: '/reports/cashdividenddeposit', icon: '' },
                { id: 'openOptionReports', name: 'openOptionReports', title: 'گزارش اختیارات باز', link: '/reports/', icon: '' },
                { id: 'marketnotice', name: 'marketnotice', title: 'آگهی های کدال', link: '/reports/marketnotice', icon: '' },
                { id: 'comprehensive', name: 'comprehensive', title: 'گزارش جامع گردش سهام', link: '/commingsoon', icon: '' },
                { id: 'consolidation', name: 'consolidation', title: 'گزارش تجمیع سبد سهام', link: '/reports/consolidation', icon: '' },
            ],
        },
        {
            id: 'support',
            name: 'support',
            title: 'پشتیبان',
            link: '/',
            icon: 'fa-headphones',
            childe: [
                { id: 'buyingSellingAdjustments', name: 'buyingSellingAdjustments', title: 'تعدیلات خرید و فروش', link: '/', icon: '' },
                { id: 'calculationFormulas', name: 'calculationFormulas', title: 'فرمول های محاسباتی', link: '/', icon: '' },
                {
                    id: 'commissions',
                    name: 'commissions',
                    title: 'کارمزد ها',
                    link: '/',
                    icon: '',
                    childe: [
                        { id: 'transactioncommissionreapply', name: 'transactioncommissionreapply', title: 'محاسبه مجدد کارمزد ها', link: '/Shareholding/transactioncommission', icon: '' },
                        { id: 'transactioncommissiondiscountreapply', name: 'transactioncommissiondiscountreapply', title: 'محاسبه مجدد تخفیف ها', link: '/Shareholding/transactioncommissiondiscount', icon: '' },
                        { id: 'transactioncommissiondiscountapply', name: 'transactioncommissiondiscountapply', title: 'اعمال تخفیف دلخواه', link: '/Shareholding/transactioncommissiondiscount/apply', icon: '' },
                        { id: 'transactioncommissiondiscountremove', name: 'transactioncommissiondiscountremove', title: 'حذف تخفیف ها', link: '/Shareholding/transactioncommissiondiscount/remove', icon: '' }
                    ],
                },
                {
                    id: 'assemblies',
                    name: 'assemblies',
                    title: 'مجامع',
                    link: '/',
                    icon: '',
                    childe: [
                        { id: 'shareMeetingReapply', name: 'shareMeetingReapply', title: 'اعمال مجدد مجامع', link: '/Shareholding/shareMeeting/reapply', icon: '' },
                    ],
                },
                {
                    id: 'accounting',
                    name: 'accounting',
                    title: 'حسابداری',
                    link: '/Shareholding/accountings',
                    icon: '',
                    childe: [
                        { id: 'accountingSettings', name: 'accountingSettings', title: 'تنظیمات حسابداری', link: '/Shareholding/accountingSettings', icon: '' },
                        { id: 'stockCategoryCode', name: 'stockCategoryCode', title: 'کدینگ گروه اوراق بهادار', link: '/Shareholding/stockcategorycode', icon: '' },
                        { id: 'industrySecuritiesGroup', name: 'industrySecuritiesGroup', title: 'کدینگ صنعت اوراق بهادار', link: '/Shareholding/stockindustrycode', icon: '' },
                        { id: 'investmentType', name: 'investmentType', title: 'نوع سرمایه ‌گذاری', link: '/Shareholding/investmenttypecode', icon: '' },
                        { id: 'accountingArticleElements', name: 'accountingArticleElements', title: 'فهرست المان ها', link: '/Shareholding/accountings/articleelements', icon: '' },
                        { id: 'accountingVoucherTemplates', name: 'accountingVoucherTemplates', title: 'فهرست قالب ها', link: '/Shareholding/accountings/vouchertemplates', icon: '' },
                    ],
                },
                { id: 'periodBeginningUpload', name: 'periodBeginningUpload', title: 'بارگزاری ابتدای دوره', link: '/', icon: '' },
                { id: 'fiscalYearTransfer', name: 'fiscalYearTransfer', title: 'انتقال سال مالی', link: '/', icon: '' },
                { id: 'supportSession', name: 'supportSession', title: 'جلسه پشتیبانی', link: '/', icon: '' },
            ],
        },
        {
            id: 'system',
            name: 'system',
            title: 'سیستم',
            link: '/',
            icon: 'fa-sliders',
            childe: [
                { id: 'userManagement', name: 'userManagement', title: 'مدیریت کاربران', link: '/', icon: '' },
                { id: 'activityManagement', name: 'activityManagement', title: 'مدیریت فعالیت ها', link: '/', icon: '' },
                { id: 'eventManagement', name: 'eventManagement', title: 'مدیریت رخداد ها', link: '/', icon: '' },
            ],
        },
    ];

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);



    return (
        <div className='sidebar'>


            <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                <ul className="relative space-y-0.5 font-iranyekan">
                    <li className="nav-item">
                        <ul>
                            {MenuData.map((item) => (
                                <li
                                    key={item.name}
                                    className={`${item.childe ? 'menu nav-item' : 'nav-item'} ${currentMenu === item.name || lasttMenu == item.name ? 'rounded-[20px] bg-[#FFFFFF] text-[##089bab]' : ''
                                        } text-[#089bab]`}
                                >
                                    <ul>
                                        {!item.childe ? (
                                            <li key={item.name} className="nav-item px-2">
                                                {/* <Link href={item.link} className="group">
                                                    <div className="flex items-center">
                                                        {/* <FontAwesomeIcon icon={item.icon} size="2x" className="m-1" /> /}
                                                <i className={`fa-duotone fa-solid ${item.icon} text-[#fff] text-xl`} />
                                                <span className="ltr:pl-3 rtl:pr-3">{t(item.name)}</span>
                                            </div>
                                                </Link> */}

                                                <button
                                                    type="button"
                                                    className={`${currentMenu === item.id ? 'active' : ''} nav-link group w-full font-iranyekan flex px-2`}
                                                    onClick={() => {
                                                        const data: ITabData = {
                                                            id: item.id,
                                                            key: item.id,
                                                            name: item.name,
                                                            orther: 0
                                                        };

                                                        AddTab(data);
                                                    }
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        <i className={`fa-duotone fa-solid ${item.icon} ${currentMenu === item.name || lasttMenu === item.name ? 'text-[#089bab]' : 'text-[#fff]'} text-xl`} />
                                                        <span className="ltr:pl-3 rtl:pr-3">{t(item.name)}</span>
                                                    </div>
                                                </button>

                                            </li>
                                        ) : (
                                            <li key={item.name} className="menu nav-item my-1">
                                                <button
                                                    type="button"
                                                    className={`${currentMenu === item.name ? 'active' : ''} nav-link group w-full font-iranyekan flex px-2`}
                                                    onClick={() => toggleMenu(item.name)}

                                                >
                                                    <div className="flex items-center justify-start w-full">
                                                        {/* <FontAwesomeIcon icon={item.icon} size="2x" className="m-1" /> */}
                                                        <i className={`fa-duotone fa-solid ${item.icon} text-xl ${currentMenu === item.name || lasttMenu === item.name ? 'text-[#089bab]' : 'text-[#fff]'}`} />

                                                        <span
                                                            className={`${currentMenu === item.name || lasttMenu === item.name ? 'text-[#089bab]' : 'text-[#fff]'
                                                                } dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3`}
                                                        >
                                                            {t(item.title)}
                                                        </span>
                                                    </div>
                                                    {/* <div
                                                        className={`justify-end ${currentMenu === item.name ? '-rotate-90 rtl:rotate-90' : ''} ${lasttMenu === item.name ? '!text-[#089bab] ' : '!text-[#fff]'
                                                            }`}
                                                    >
                                                        <i className={`fa-duotone fa-solid fa-angle-down text-xl ${currentMenu === item.name || lasttMenu === item.name ? 'text-[#089bab]' : 'text-[#fff]'}`} />
                                                    </div> */}
                                                    <i className={`fa-duotone fa-solid fa-angle-down text-xl ${currentMenu === item.name ? '-rotate-90 rtl:rotate-90' : ''} ${lasttMenu === item.name ? '!text-[#089bab] ' : '!text-[#fff]'}`} />

                                                </button>

                                                <AnimateHeight duration={300} height={currentMenu === item.name ? 'auto' : 0}>
                                                    <ul className="rounded-[20px] bg-[#FFFFFF] text-gray-500">
                                                        {item.childe.map((subItem) =>
                                                            !subItem.childe ? (
                                                                <li key={subItem.title} className="nav-item">
                                                                    {/* <Link className="group" key={subItem.name + "fat"} href={subItem.link}>
                                                                        <div className="flex items-center">
                                                                            <span className="text-[#777d74] group-hover:text-[#089bab] dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                                                {t(subItem.title)}
                                                                            </span>
                                                                        </div>
                                                                    </Link> */}
                                                                    <button
                                                                        type="button"
                                                                        className={`${currentMenu === item.id ? 'active' : ''} nav-link group w-full font-iranyekan flex px-2`}
                                                                        onClick={() => {
                                                                            const data: ITabData = {
                                                                                id: subItem.id,
                                                                                key: subItem.id,
                                                                                name: subItem.name,
                                                                                orther: 0
                                                                            };


                                                                            AddTab(data);
                                                                        }
                                                                        }
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <i className={`fa-duotone fa-solid ${subItem.icon} ${currentMenu === subItem.name || lasttMenu === subItem.name ? 'text-[#089bab]' : 'text-[#fff]'} text-xl`} />
                                                                            <span className="ltr:pl-3 rtl:pr-3">{t(subItem.title)}</span>
                                                                        </div>
                                                                    </button>
                                                                </li>
                                                            ) : (
                                                                <li key={subItem.name} className="menu nav-item pl-2">
                                                                    <button
                                                                        type="button"
                                                                        className={`${currentSubMenu === subItem.name + item.name ? 'active' : ''} nav-link group w-full font-iranyekan`}
                                                                        onClick={() => toggleSubMenu(subItem.name, item.name)}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <span className={`text-[#089bab] dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3`}>
                                                                                {t(subItem.title)}
                                                                            </span>
                                                                        </div>

                                                                        <div
                                                                            className={`${currentSubMenu === subItem.name + item.name ? '-rotate-90 rtl:rotate-90' : ''} ${'!text-[#089bab] '}`}
                                                                        >
                                                                            {/* <IconCaretDown /> */}

                                                                            <i className={`fa-duotone fa-solid fa-angle-down text-xl`} />
                                                                        </div>
                                                                    </button>
                                                                    <AnimateHeight duration={300} height={currentSubMenu === subItem.name + item.name ? 'auto' : 0}>
                                                                        <ul className="sub-menu text-gray-500">
                                                                            {subItem.childe.map((sub2Item) => (
                                                                                <li key={sub2Item.name}>
                                                                                    <Link className="group" key={sub2Item.name} href={sub2Item.link}>
                                                                                        <div className="flex items-center">
                                                                                            <span className="text-[#777d74] group-hover:text-[#089bab] dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                                                                {t(sub2Item.title)}
                                                                                            </span>
                                                                                        </div>
                                                                                    </Link>

                                                                                    {/* <a href="/pages/error404" target="_blank">
                                                                                                {t(sub2Item.title)}
                                                                                            </a> */}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </AnimateHeight>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </AnimateHeight>
                                            </li>
                                        )}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </PerfectScrollbar >




        </div >
    );
};

export default Sidebar;
