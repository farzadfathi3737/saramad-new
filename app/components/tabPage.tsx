"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { ActionIcon, Tooltip } from "@mantine/core";
import { setTabs, setActiveTab } from '@/store/appConfigSlice';
import { IRootState } from "@/store";
import { useLanguage } from '@/contexts/LanguageContext';

import Dashboard from "../dashboard/page";

import Company from "../Shareholding/company";
import CompanyAdd from "../Shareholding/company/add";
import CompanyEdit from "../Shareholding/company/[id]";

import FiscalYear from "../Shareholding/fiscalyear";
import FiscalYearAdd from "../Shareholding/fiscalyear/add";
import FiscalYearEdit from "../Shareholding/fiscalyear/[id]";

import CompanyTradingCode from "../Shareholding/companytradingcode";
import CompanyTradingCodeAdd from "../Shareholding/companytradingcode/add";
import CompanyTradingCodeEdit from "../Shareholding/companytradingcode/[id]";
import TradingCodeDiscount from "../Shareholding/tradingcodediscount";
import TradingCodeDiscountAdd from "../Shareholding/tradingcodediscount/add";

import Stock from "../Shareholding/stock";
import StockView from "../Shareholding/stock/[id]";

import Share from "../Shareholding/share";
import ShareAdd from "../Shareholding/share/add";
import ShareAddT from "../Shareholding/share/addt";
import ShareEdit from "../Shareholding/share/[id]";


import ShareRelationType from "../Shareholding/sharerelationtype";
import ShareRelationTypeAdd from "../Shareholding/sharerelationtype/add";
import ShareRelationTypeEdit from "../Shareholding/sharerelationtype/[id]";

import CompanyBroker from "../Shareholding/companybroker";
import CompanyBrokerAdd from "../Shareholding/companybroker/add";
import CompanyBrokerAll from "../Shareholding/companybroker/all";
import CompanyBrokerEdit from "../Shareholding/companybroker/[id]";
import CompanyBrokerCode from "../Shareholding/companybroker/code/[id]";

import Companybrokerdiscount from "../Shareholding/companybrokerdiscount";
import CompanybrokerdiscountAdd from "../Shareholding/companybrokerdiscount/add";

import Shareinitialbalance from "../Shareholding/shareinitialbalance";
import ShareinitialbalanceAdd from "../Shareholding/shareinitialbalance/add";
import ShareinitialbalanceEdit from "../Shareholding/shareinitialbalance/[id]";


import { IKeyValue, ITabData } from "@/interface/dataModel";
import { title } from "process";

export default function TabsWithRouting() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const appConf = useSelector((state: IRootState) => state.appConfig);

    useEffect(() => {
        // const savedTabs: ITabData[] =
        //     JSON.parse(localStorage.getItem("tabsData") || "[]");
        // const _activeTab: number | null = Number(localStorage.getItem("activeTab")) || null;

        // setTabs(savedTabs);
        // setActiveTab(_activeTab);

        dispatch(setTabs(JSON.parse(localStorage.getItem("tabsData") || JSON.stringify([{
            id: "dashboard",
            key: "dashboard",
            name: "dashboard",
            title: "داشبورد",
            orter: 0,
            filters: [],
            params: []
        }])
        ))!);
        dispatch(setActiveTab(localStorage.getItem('activeTab'!) || 'dashboard')!);

        const tabFromQuery = searchParams.get("tab");

        if (tabFromQuery && appConf.tabs.some((t) => t.id === tabFromQuery)) {
            setActiveTab(tabFromQuery);
        } else if (appConf.tabs.length > 0) {
            setActiveTab(appConf.tabs[0].id);
        }
    }, [searchParams]);

    const removeTab = (id: string) => {
        const deletedIndex = appConf.tabs.findIndex(t => t.id === id);
        const updatedTabs = appConf.tabs.filter((tab) => tab.id !== id);

        // ابتدا تب‌ها را update کن
        dispatch(setTabs(updatedTabs));

        // فقط اگر تب حذف‌شده فعال بود، تب دیگری رو انتخاب کن
        if (id === appConf.activeTab) {
            let nextActiveTab: string;

            if (updatedTabs.length > 0) {
                if (deletedIndex < updatedTabs.length) {
                    // تب بعدی موجود است
                    nextActiveTab = updatedTabs[deletedIndex].id;
                } else {
                    // تب حذف‌شده آخرین تب بود، آخرین تب باقی‌مانده را انتخاب کن
                    nextActiveTab = updatedTabs[updatedTabs.length - 1].id;
                }
            } else {
                // اگر هیچ تب دیگری نیست، داشبرد را انتخاب کن
                nextActiveTab = 'dashboard';
            }

            // سپس tab فعال را تغییر بده
            dispatch(setActiveTab(nextActiveTab));
            router.replace(`?tab=${nextActiveTab}`);
        }
    };

    const handleTabClick = (tabId: string) => {
        dispatch(setActiveTab(tabId));
        router.replace(`?tab=${tabId}`);
    };

    const getFilterData = (key: string, tab?: ITabData) => {
        const active = appConf.tabs.find((t) => t.id === appConf.activeTab)!;
        const targetTab = tab || active;
        let _data = '';
        if (Array.isArray(targetTab?.filters)) {
            const idFilter = targetTab.filters.find((f) => f.key === key);
            _data = idFilter?.value || '';
        } else if (targetTab?.filters && typeof targetTab.filters === 'object') {
            _data = (targetTab.filters as any).value.toString() || '';
        }
        return _data;
    }

    const getParamData = (key: string, tab?: ITabData) => {
        const active = appConf.tabs.find((t) => t.id === appConf.activeTab)!;
        const targetTab = tab || active;
        let _data = '';
        if (Array.isArray(targetTab?.params)) {
            const idFilter = targetTab.params.find((f) => f.key === key);
            _data = idFilter?.value || '';
        } else if (targetTab?.params && typeof targetTab.params === 'object') {
            _data = (targetTab.params as any).value.toString() || '';
        }
        return _data;
    }

    const active: ITabData = appConf.tabs.find((t) => t.id === appConf.activeTab)!;
    const _tabs = [...appConf.tabs].sort((a, b) => a.orther - b.orther);

    const renderContent = () => {

        switch (active.id) {
            case "dashboard":
                return <Dashboard key={active.id} />;

            case "company":
                if (active.key == "add") return <CompanyAdd key={active.id} />
                if (active.key == "edit") return <CompanyEdit key={active.id} id={getParamData('id')} />;
                return <Company key={active.id} />;

            case "fiscalyear":
                if (active.key == "add") return <FiscalYearAdd key={active.id} />
                if (active.key == "edit") return <FiscalYearEdit key={active.id} id={getParamData('id')} />;
                return <FiscalYear key={active.id} />;

            case "companytradingcode":
                if (active.key == "add") return <CompanyTradingCodeAdd key={active.id} />
                if (active.key == "edit") return <CompanyTradingCodeEdit key={active.id} id={getParamData('id')} />;
                if (active.key == "tradingcodediscount") return <TradingCodeDiscount key={active.id} tradingCodeId={getFilterData('tradingCodeId')} tradingCode={getFilterData('tradingCode')} />;
                if (active.key == "tradingcodediscount/add") return <TradingCodeDiscountAdd key={active.id} tradingCodeId={getFilterData('tradingCodeId')} tradingCode={getFilterData('tradingCode')} />;
                return <CompanyTradingCode key={active.id} />;

            case "stock":
                if (active.key == "view") return <StockView key={active.id} id={getParamData('id')} master={getParamData('master')} />;
                return <Stock key={active.id} />;

            case "share":
                if (active.key == "add") return <ShareAdd key={active.id} />;
                if (active.key == "addt") return <ShareAddT key={active.id} />;
                if (active.key == "edit") return <ShareEdit key={active.id} id={getParamData('id')} />;
                if (active.key == "stock/view") return <StockView key={active.id} id={getParamData('id')} master={getParamData('master')} />;
                if (active.key == "shareinitialbalance") return <Shareinitialbalance key={active.id} id={getParamData('id')} name={getParamData('name')} />;
                if (active.key == "shareinitialbalance/add") return <ShareinitialbalanceAdd key={active.id} shareId={getParamData('shareId')} name={getParamData('name')} />;
                if (active.key == "shareinitialbalance/edit") return <ShareinitialbalanceEdit key={active.id} id={getParamData('id')} shareId={getParamData('shareId')} name={getParamData('name')} />;

                return <Share key={active.id} />;

            case "sharerelationtype":
                if (active.key == "add") return <ShareRelationTypeAdd key={active.id} />;
                if (active.key == "edit") return <ShareRelationTypeEdit key={active.id} id={getParamData('id')} />;
                return <ShareRelationType key={active.id} />;

            case "companybroker":
                if (active.key == "add") return <CompanyBrokerAdd key={active.id} />;
                if (active.key == "all") return <CompanyBrokerAll key={active.id} />;
                if (active.key == "edit") return <CompanyBrokerEdit key={active.id} id={getParamData('id')} />;
                if (active.key == "code") return <CompanyBrokerCode key={active.id} id={getParamData('id')} brokerName={getParamData('brokerName')} master={getParamData('master')} />;
                if (active.key == "companybrokerdiscount") return <Companybrokerdiscount key={active.id} id={getParamData('id')} brokerName={getParamData('brokerName')} />;
                if (active.key == "companybrokerdiscount/add") return <CompanybrokerdiscountAdd key={active.id} id={getParamData('id')} brokerName={getParamData('brokerName')} />;
                return <CompanyBroker key={active.id} />;

            default:
                return <></>;
        }
    };

    return (
        <div className="w-full mx-auto mt-1">
            {/* نوار تب‌ها */}
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap w-full gap-2">
                    {_tabs.map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`pr-4 pl-2 py-2 rounded-b-none rounded-t-lg border border-b-0 transition-all border-gray-300 bg-gray-100 ${appConf.activeTab === tab.id
                                ? "border-gray-400 text-gray-900 bg-white border-b"
                                : "border hover:text-black hover:bg-gray-300"
                                }`}
                        >
                            {tab.id == 'dashboard' ? <div className="flex h-full">
                                <i className={`fa-duotone fa-solid fa-gauge text-2xl ${appConf.activeTab === tab.id ? 'text-gray-900' : 'text-gray-600 hover:t'}`} />
                            </div> :
                                <>{t(tab.title)}
                                    <Tooltip label={`حذف ${tab.id}`}>
                                        <ActionIcon
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeTab(tab.id);
                                            }}
                                            className="mr-2 flex items-center rounded-xl w-9 h-9 p-0 !bg-transparent !hover:bg-red-500">
                                            <i className={`fa-duotone fa-solid fa-xmark text-sm ${appConf.activeTab === tab.id ? 'text-gray-900' : 'text-gray-600 hover:t'}`} />
                                        </ActionIcon>
                                    </Tooltip></>
                            }

                        </div>
                    ))}
                </div>
            </div>

            {/* محتوای تب فعال */}
            <div className="bg-white rounded-b-md shadow border border-gray-200">
                <div className="space-y-3">
                    {_tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={appConf.activeTab === tab.id ? 'block' : 'hidden'}
                        >
                            {tab.id === "dashboard" && <Dashboard />}

                            {tab.id === "company" && (
                                <>
                                    {tab.key === "add" && <CompanyAdd />}
                                    {tab.key === "edit" && <CompanyEdit id={getParamData('id', tab)} />}
                                    {tab.key === "company" && <Company />}
                                </>
                            )}

                            {tab.id === "fiscalyear" && (
                                <>
                                    {tab.key === "add" && <FiscalYearAdd />}
                                    {tab.key === "edit" && <FiscalYearEdit id={getParamData('id', tab)} />}
                                    {tab.key === "fiscalyear" && <FiscalYear />}
                                </>
                            )}

                            {tab.id === "companytradingcode" && (
                                <>
                                    {tab.key === "add" && <CompanyTradingCodeAdd />}
                                    {tab.key === "edit" && <CompanyTradingCodeEdit id={getParamData('id', tab)} />}
                                    {tab.key === "tradingcodediscount" && <TradingCodeDiscount tradingCodeId={getFilterData('tradingCodeId', tab)} tradingCode={getFilterData('tradingCode', tab)} />}
                                    {tab.key === "tradingcodediscount/add" && <TradingCodeDiscountAdd tradingCodeId={getFilterData('tradingCodeId', tab)} tradingCode={getFilterData('tradingCode', tab)} />}
                                    {tab.key === "companytradingcode" && <CompanyTradingCode />}
                                </>
                            )}

                            {tab.id === "stock" && (
                                <>
                                    {tab.key === "view" && <StockView id={getParamData('id', tab)} master={getParamData('master', tab)} />}
                                    {tab.key === "stock" && <Stock />}
                                </>
                            )}

                            {tab.id === "share" && (
                                <>
                                    {tab.key === "add" && <ShareAdd />}
                                    {tab.key === "addt" && <ShareAddT />}
                                    {tab.key === "edit" && <ShareEdit id={getParamData('id', tab)} />}
                                    {tab.key === "stock/view" && <StockView id={getParamData('id', tab)} master={getParamData('master', tab)} />}
                                    {tab.key === "shareinitialbalance" && <Shareinitialbalance id={getParamData('id', tab)} name={getParamData('name', tab)} />}
                                    {tab.key === "shareinitialbalance/add" && <ShareinitialbalanceAdd shareId={getParamData('shareId', tab)} name={getParamData('name', tab)} />}
                                    {tab.key === "shareinitialbalance/edit" && <ShareinitialbalanceEdit id={getParamData('id', tab)} shareId={getParamData('shareId', tab)} name={getParamData('name', tab)} />}
                                    {tab.key === "share" && <Share />}
                                </>
                            )}

                            {tab.id === "sharerelationtype" && (
                                <>
                                    {tab.key === "add" && <ShareRelationTypeAdd />}
                                    {tab.key === "edit" && <ShareRelationTypeEdit id={getParamData('id', tab)} />}
                                    {tab.key === "sharerelationtype" && <ShareRelationType />}
                                </>
                            )}

                            {tab.id === "companybroker" && (
                                <>
                                    {tab.key === "add" && <CompanyBrokerAdd />}
                                    {tab.key === "all" && <CompanyBrokerAll />}
                                    {tab.key === "edit" && <CompanyBrokerEdit id={getParamData('id', tab)} />}
                                    {tab.key === "code" && <CompanyBrokerCode id={getParamData('id', tab)} brokerName={getParamData('brokerName', tab)} master={getParamData('master', tab)} />}
                                    {tab.key === "companybrokerdiscount" && <Companybrokerdiscount id={getParamData('id', tab)} brokerName={getParamData('brokerName', tab)} />}
                                    {tab.key === "companybrokerdiscount/add" && <CompanybrokerdiscountAdd id={getParamData('id', tab)} brokerName={getParamData('brokerName', tab)} />}
                                    {tab.key === "companybroker" && <CompanyBroker />}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}