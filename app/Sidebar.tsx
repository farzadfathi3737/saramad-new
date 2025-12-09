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
import { ColoredToast } from './components/Notifications/colorNotification';


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

        // بررسی: اگر تب قبلاً وجود دارد، فقط آن را فعال کن
        const _existingTab = appConf.tabs.find((x) => x.id == param.id);

        if (_existingTab) {
            // تب قبلاً وجود دارد - فقط فعال کن
            dispatch(setActiveTab(param.id));
            router.replace(`?tab=${param.id}`);
            return;
        }

        // اگر تب جدید است و تعداد < 6، اضافه کن
        if (appConf.tabs.length >= 7) {
            ColoredToast('warning', 'حداکثر 7 تب مجاز است!');
            return;
        }

        // اضافه کردن تب جدید
        const newTab: ITabData = {
            id: param.id,
            key: param.key,
            name: param.name,
            title: param.title,
            orther: param.key == 'dashboard' ? 0 : appConf.tabs.length,
            filters: [],
            params: [],
        };

        const updatedTabs = [...appConf.tabs, newTab];
        dispatch(setTabs(updatedTabs));

        // فعال کردن تب جدید
        dispatch(setActiveTab(param.id));
        router.replace(`?tab=${param.id}`);
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
                { id: 'company', name: 'companyProfile', title: 'تعریف شرکت', link: '/Shareholding/company', icon: 'fa-building' },
                { id: 'fiscalyear', name: 'fiscalYear', title: 'سال مالی شرکت', link: '/Shareholding/fiscalyear', icon: 'fa-calendar' },
                { id: 'companytradingcode', name: 'tradingBasket', title: 'سبد معاملاتی', link: '/Shareholding/companytradingcode', icon: 'fa-basket-shopping' },
                { id: 'stock', name: 'securitiesList', title: 'فهرست اوراق بهادار', link: '/Shareholding/stock', icon: 'fa-list' },
                { id: 'share', name: 'portfolioOfAssets', title: 'فهرست دارایی ها', link: '/Shareholding/share', icon: 'fa-money-bill-wave' },
                { id: 'sharerelationtype', name: 'companyType', title: 'نوع وابستگی سهم', link: '/Shareholding/sharerelationtype', icon: 'fa-share-nodes' },
                { id: 'companybroker', name: 'listOfBrokers', title: 'فهرست کارگزاران', link: '/Shareholding/companybroker', icon: 'fa-users' },
            ],
        },
        {
            id: 'actions',
            name: 'actions',
            title: 'عملیات',
            link: '/',
            icon: 'fa-gears',
            childe: [
                { id: 'transactionimportsession', name: 'transactionimportsession', title: 'بارگزاری اطلاعات خرید و فروش', link: '/Shareholding/transactionImportsession', icon: 'fa-upload' },
                { id: 'buyingAndSellingListBurs', name: 'buyingAndSellingListBurs', title: 'فهرست خرید و فروش بورسی', link: '/Shareholding/sharetransactionbatch', icon: 'fa-chart-line' },
                { id: 'buyingAndSellingListNoBurs', name: 'buyingAndSellingListNoBurs', title: 'فهرست خرید و فروش غیر بورسی', link: '/pages/buyingAndSellingListNoBurs', icon: 'fa-rectangle-list' },
                { id: 'transferCodeToCode', name: 'transferCodeToCode', title: 'انتقال کد به کد', link: '/', icon: 'fa-shuffle' },
                { id: 'shareMeeting', name: 'shareMeeting', title: 'فهرست مجامع دارایی ها', link: '/Shareholding/shareMeeting', icon: 'fa-people-group' },
                { id: 'brokercontradictions', name: 'brokercontradictions', title: 'مغایرت گیری با کارگزاری', link: '/Shareholding/brokercontradictions', icon: 'fa-triangle-exclamation' },
                { id: 'discrepancyWithDepositary', name: 'discrepancyWithDepositary', title: 'مغایرت گیری با سپرده گذاری', link: '/', icon: 'fa-scale-balanced' },
            ],
        },
        {
            id: 'optionContract',
            name: 'optionContract',
            title: 'قرارداد اختیار معامله',
            link: '/',
            icon: "fa-file",
            childe: [
                { id: 'optioncontract', name: 'optioncontract', title: 'تسویه قراردادهای باز', link: '/Shareholding/optioncontract', icon: 'fa-handshake' },
                { id: 'optionHistorySettlement', name: 'optionHistorySettlement', title: 'تاریخچه تسویه اختیار', link: '/', icon: 'fa-history' },
                { id: 'closingPositionPL', name: 'closingPositionPL', title: 'بستن موقعیت به سود و زیان', link: '/', icon: 'fa-check-circle' },
            ],
        },
        {
            id: 'accountingDocuments',
            name: 'accountingDocuments',
            title: 'اسناد حسابداری',
            link: '/',
            icon: "fa-newspaper",
            childe: [
                { id: 'issueDocument', name: 'issueDocument', title: 'صدور سند', link: '/Shareholding/accountings/journalarticle', icon: 'fa-file-contract' },
                { id: 'documentReleaseLock', name: 'documentReleaseLock', title: 'آزادسازی و بستن اسناد', link: '/pages/buyingAndSellingListBurs', icon: 'fa-lock-open' },
            ],
        },
        {
            id: 'investmentReturns',
            name: 'investmentReturns',
            title: 'بازده سرمایه گذاری',
            link: '/',
            icon: "fa-gamepad",
            childe: [
                { id: 'simpleReturn', name: 'simpleReturn', title: 'بازده ساده (ROR)', link: '/', icon: 'fa-chart-simple' },
                { id: 'moneyWeightedReturn', name: 'moneyWeightedReturn', title: 'نرخ بازده پولی وزنی (MWRR)', link: '/', icon: 'fa-coins' },
                { id: 'timeWeightedReturn', name: 'timeWeightedReturn', title: 'نرخ بازده زمان وزنی (TWRR)', link: '/', icon: 'fa-hourglass-end' },
            ],
        },
        {
            id: 'reports',
            name: 'reports',
            title: 'گزارشات',
            link: '/',
            icon: 'fa-print',
            childe: [
                { id: 'stackedbuysell', name: 'stackedbuysell', title: 'خرید و فروش', link: '/reports/stackedbuysell', icon: 'fa-columns' },
                { id: 'shareturnover', name: 'shareturnover', title: 'گردش سهام', link: '/reports/shareturnover', icon: 'fa-arrow-right-arrow-left' },
                { id: 'cardex', name: 'cardex', title: 'کاردکس ریز سهام', link: '/reports/cardex', icon: 'fa-cards' },
                { id: 'stackedcardex', name: 'stackedcardex', title: 'روند موجودی', link: '/reports/stackedcardex', icon: 'fa-arrows-up-down' },
                { id: 'sharebalance', name: 'sharebalance', title: 'مانده سهام', link: '/reports/sharebalance', icon: 'fa-scale-balanced' },
                { id: 'realizedprofit', name: 'realizeedprofit', title: 'سود و زیان تحقق یافته', link: '/reports/realizedprofit', icon: 'fa-dollar-sign' },
                { id: 'investmentdepreciationreserve', name: 'investmentdepreciationreserve', title: 'ذخیره کاهش ارزش سرمایه گزاری', link: '/reports/investmentdepreciationreserve', icon: 'fa-piggy-bank' },
                { id: 'capitalraise', name: 'capitalraise', title: 'افزایش سرمایه', link: '/reports/capitalraise', icon: 'fa-arrow-up-long' },
                { id: 'cashdividend', name: 'cashdividend', title: 'گزارش شناسایی سود اوراق بهادار ', link: '/reports/cashdividend', icon: 'fa-hand-holding-dollar' },
                { id: 'cashdividenddeposit', name: 'cashdividenddeposit', title: 'گزارش واریز سود اوراق بهادار', link: '/reports/cashdividenddeposit', icon: 'fa-credit-card' },
                { id: 'openOptionReports', name: 'openOptionReports', title: 'گزارش اختیارات باز', link: '/reports/', icon: 'fa-book-open' },
                { id: 'marketnotice', name: 'marketnotice', title: 'آگهی های کدال', link: '/reports/marketnotice', icon: 'fa-bell' },
                { id: 'comprehensive', name: 'comprehensive', title: 'گزارش جامع گردش سهام', link: '/commingsoon', icon: 'fa-diagram-project' },
                { id: 'consolidation', name: 'consolidation', title: 'گزارش تجمیع سبد سهام', link: '/reports/consolidation', icon: 'fa-layer-group' },
            ],
        },
        {
            id: 'support',
            name: 'support',
            title: 'پشتیبان',
            link: '/',
            icon: 'fa-headphones',
            childe: [
                { id: 'buyingSellingAdjustments', name: 'buyingSellingAdjustments', title: 'تعدیلات خرید و فروش', link: '/', icon: 'fa-sliders' },
                { id: 'calculationFormulas', name: 'calculationFormulas', title: 'فرمول های محاسباتی', link: '/', icon: 'fa-calculator' },
                {
                    id: 'commissions',
                    name: 'commissions',
                    title: 'کارمزد ها',
                    link: '/',
                    icon: 'fa-percent',
                    childe: [
                        { id: 'transactioncommissionreapply', name: 'transactioncommissionreapply', title: 'محاسبه مجدد کارمزد ها', link: '/Shareholding/transactioncommission', icon: 'fa-rotate' },
                        { id: 'transactioncommissiondiscountreapply', name: 'transactioncommissiondiscountreapply', title: 'محاسبه مجدد تخفیف ها', link: '/Shareholding/transactioncommissiondiscount', icon: 'fa-rotate' },
                        { id: 'transactioncommissiondiscountapply', name: 'transactioncommissiondiscountapply', title: 'اعمال تخفیف دلخواه', link: '/Shareholding/transactioncommissiondiscount/apply', icon: 'fa-check' },
                        { id: 'transactioncommissiondiscountremove', name: 'transactioncommissiondiscountremove', title: 'حذف تخفیف ها', link: '/Shareholding/transactioncommissiondiscount/remove', icon: 'fa-trash' }
                    ],
                },
                {
                    id: 'assemblies',
                    name: 'assemblies',
                    title: 'مجامع',
                    link: '/',
                    icon: 'fa-users',
                    childe: [
                        { id: 'shareMeetingReapply', name: 'shareMeetingReapply', title: 'اعمال مجدد مجامع', link: '/Shareholding/shareMeeting/reapply', icon: 'fa-rotate' },
                    ],
                },
                {
                    id: 'accounting',
                    name: 'accounting',
                    title: 'حسابداری',
                    link: '/Shareholding/accountings',
                    icon: 'fa-receipt',
                    childe: [
                        { id: 'accountingSettings', name: 'accountingSettings', title: 'تنظیمات حسابداری', link: '/Shareholding/accountingSettings', icon: 'fa-gear' },
                        { id: 'stockCategoryCode', name: 'stockCategoryCode', title: 'کدینگ گروه اوراق بهادار', link: '/Shareholding/stockcategorycode', icon: 'fa-code' },
                        { id: 'industrySecuritiesGroup', name: 'industrySecuritiesGroup', title: 'کدینگ صنعت اوراق بهادار', link: '/Shareholding/stockindustrycode', icon: 'fa-code' },
                        { id: 'investmentType', name: 'investmentType', title: 'نوع سرمایه ‌گذاری', link: '/Shareholding/investmenttypecode', icon: 'fa-tag' },
                        { id: 'accountingArticleElements', name: 'accountingArticleElements', title: 'فهرست المان ها', link: '/Shareholding/accountings/articleelements', icon: 'fa-cubes' },
                        { id: 'accountingVoucherTemplates', name: 'accountingVoucherTemplates', title: 'فهرست قالب ها', link: '/Shareholding/accountings/vouchertemplates', icon: 'fa-file-pdf' },
                    ],
                },
                { id: 'periodBeginningUpload', name: 'periodBeginningUpload', title: 'بارگزاری ابتدای دوره', link: '/', icon: 'fa-upload' },
                { id: 'fiscalYearTransfer', name: 'fiscalYearTransfer', title: 'انتقال سال مالی', link: '/', icon: 'fa-arrow-right' },
                { id: 'supportSession', name: 'supportSession', title: 'جلسه پشتیبانی', link: '/', icon: 'fa-phone' },
            ],
        },
        {
            id: 'system',
            name: 'system',
            title: 'سیستم',
            link: '/',
            icon: 'fa-sliders',
            childe: [
                { id: 'userManagement', name: 'userManagement', title: 'مدیریت کاربران', link: '/', icon: 'fa-user-tie' },
                { id: 'activityManagement', name: 'activityManagement', title: 'مدیریت فعالیت ها', link: '/', icon: 'fa-tasks' },
                { id: 'eventManagement', name: 'eventManagement', title: 'مدیریت رخداد ها', link: '/', icon: 'fa-calendar-check' },
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

    // باز کردن منوی والد وقتی تب فعال تغییر می‌کنه
    useEffect(() => {
        if (appConf.activeTab) {
            // پیدا کردن منوی والد برای تب فعال
            MenuData.forEach((menu) => {
                if (menu.childe) {
                    const hasActiveChild = menu.childe.some((child: any) => {
                        if (child.id === appConf.activeTab) {
                            return true;
                        }
                        // چک کردن زیرمنوهای تو در تو
                        if (child.childe) {
                            return child.childe.some((subChild: any) => subChild.id === appConf.activeTab);
                        }
                        return false;
                    });

                    if (hasActiveChild && currentMenu !== menu.name) {
                        setCurrentMenu(menu.name);
                    }
                }
            });
        }
    }, [appConf.activeTab]);


    return (
        <div className='sidebar'>


            <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                <ul className="relative space-y-0.5 font-iranyekan">
                    <li className="nav-item">
                        <ul>
                            {MenuData.map((item) => (
                                <li
                                    key={item.name}
                                    className={`${item.childe ? 'menu nav-item' : 'nav-item'} ${currentMenu === item.name || lasttMenu == item.name ? 'rounded-lg bg-[#FFFFFF] text-[#0f337a]' : ''
                                        } text-[#0f337a]`}
                                >
                                    <ul>
                                        {!item.childe ? (
                                            <li key={item.name} className="nav-item">
                                                <button
                                                    type="button"
                                                    className={`nav-link group w-full font-iranyekan flex py-2 rounded-lg transition-all ${appConf.activeTab === item.id
                                                        ? 'bg-[#2691bf] text-white'
                                                        : 'hover:bg-[#2691bf]/20 text-gray-200 hover:text-white'
                                                        }`}
                                                    onClick={() => {
                                                        const data: ITabData = {
                                                            id: item.id,
                                                            key: item.id,
                                                            name: item.name,
                                                            title: item.title,
                                                            orther: 0
                                                        };

                                                        AddTab(data);
                                                    }
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        <i className={`fa-duotone fa-solid ${item.icon} text-lg ml-0`} />
                                                        <span className="text-sm ltr:pl-3 rtl:pr-3">{t(item.name)}</span>
                                                    </div>
                                                </button>

                                            </li>
                                        ) : (
                                            <li key={item.name} className="menu nav-item my-1">
                                                <button
                                                    type="button"
                                                    className={`${currentMenu === item.name ? 'active' : ''} nav-link group w-full font-iranyekan flex px-2 transition-all duration-300 hover:bg-[#2ab0aa]/10 rounded-lg py-2`}
                                                    onClick={() => toggleMenu(item.name)}

                                                >
                                                    <div className="flex items-center justify-start w-full">
                                                        <i className={`fa-duotone fa-solid ${item.icon} text-xl transition-colors duration-300 ${currentMenu === item.name || lasttMenu === item.name ? 'text-[#0f337a]' : 'text-[#fff]'}`} />
                                                        <span
                                                            className={`text-sm transition-colors duration-300 ${currentMenu === item.name || lasttMenu === item.name ? 'text-[#0f337a] font-bold' : 'text-white'
                                                                } dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3`}
                                                        >
                                                            {t(item.title)}
                                                        </span>
                                                    </div>
                                                    <i className={`fa-duotone fa-solid fa-angle-down text-lg transition-transform duration-300 ${currentMenu === item.name ? '-rotate-180 rtl:rotate-180' : ''} ${lasttMenu === item.name ? 'text-[#0f337a]!' : 'text-white!'}`} />
                                                </button>

                                                <AnimateHeight duration={300} height={currentMenu === item.name ? 'auto' : 0}>
                                                    <ul className="rounded-lg bg-[#FFFFFF] text-gray-500 p-1">
                                                        {item.childe.map((subItem) =>
                                                            !subItem.childe ? (
                                                                <li key={subItem.title} className="nav-item">
                                                                    <button
                                                                        type="button"
                                                                        className={`nav-link group w-full font-iranyekan flex px-2 py-2 rounded-lg transition-all ${appConf.activeTab === subItem.id
                                                                            ? 'bg-[#2691bf] text-white hover:text-[#0f337a]'
                                                                            : 'text-gray-600 hover:bg-[#2691bf]/30 hover:text-gray-700'
                                                                            }`}
                                                                        onClick={() => {
                                                                            const data: ITabData = {
                                                                                id: subItem.id,
                                                                                key: subItem.id,
                                                                                name: subItem.name,
                                                                                title: subItem.title,
                                                                                orther: 0
                                                                            };


                                                                            AddTab(data);
                                                                        }
                                                                        }
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <i className={`fa-duotone fa-solid ${subItem.icon} text-base ml-2`} />
                                                                            <span className="text-xs">{t(subItem.title)}</span>
                                                                        </div>
                                                                    </button>
                                                                </li>
                                                            ) : (
                                                                <li key={subItem.name} className="menu nav-item pl-2">
                                                                    <button
                                                                        type="button"
                                                                        className={`${currentSubMenu === subItem.name + item.name ? 'active' : ''} nav-link group w-full font-iranyekan transition-all duration-300 hover:bg-[#2ab0aa]/20 rounded-lg py-2 px-2`}
                                                                        onClick={() => toggleSubMenu(subItem.name, item.name)}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <span className={`text-[#0f337a] transition-colors text-xs duration-300 dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3`}>
                                                                                {t(subItem.title)}
                                                                            </span>
                                                                        </div>

                                                                        <div
                                                                            className={`transition-transform duration-300 ${currentSubMenu === subItem.name + item.name ? '-rotate-180 rtl:rotate-180' : ''} ${'!text-[#089bab] '}`}
                                                                        >
                                                                            <i className={`fa-duotone fa-solid fa-angle-down text-xl text-[#0f337a]`} />
                                                                        </div>
                                                                    </button>
                                                                    <AnimateHeight duration={300} height={currentSubMenu === subItem.name + item.name ? 'auto' : 0}>
                                                                        <ul className="sub-menu text-gray-500">
                                                                            {subItem.childe.map((sub2Item) => (
                                                                                <li key={sub2Item.name}>
                                                                                    <Link className="group" key={sub2Item.name} href={sub2Item.link}>
                                                                                        <div className="flex items-center">
                                                                                            <span className="text-[#777d74] text-xs  dark:text-[#506690] ltr:pl-3 rtl:pr-3">
                                                                                                {t(sub2Item.title)}
                                                                                            </span>
                                                                                        </div>
                                                                                    </Link>
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
