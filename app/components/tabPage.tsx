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
        const updatedTabs = appConf.tabs.filter((tab) => tab.id !== id);
        dispatch(setTabs(updatedTabs));

        console.log(updatedTabs[0].id);

        if (updatedTabs.length > 0) {
            dispatch(setActiveTab(updatedTabs[0].id));
            router.replace(`?tab=${updatedTabs[0].id}`);
        } else {
            dispatch(setActiveTab(null));
            router.replace(`?`);
        }
    };

    const handleTabClick = (tabId: string) => {
        dispatch(setActiveTab(tabId));
        router.replace(`?tab=${tabId}`);
    };

    const active: ITabData = appConf.tabs.find((t) => t.id === appConf.activeTab)!;
    const _tabs = [...appConf.tabs].sort((a, b) => a.orther - b.orther);

    const getFilterData = (key: string) => {
        let _data = '';
        if (Array.isArray(active?.filters)) {
            const idFilter = active.filters.find((f) => f.key === key);
            _data = idFilter?.value || '';
        } else if (active?.filters && typeof active.filters === 'object') {
            _data = (active.filters as any).value.toString() || '';
        }
        return _data;
    }

    const getParamData = (key: string) => {
        let _data = '';
        if (Array.isArray(active?.params)) {
            const idFilter = active.params.find((f) => f.key === key);
            _data = idFilter?.value || '';
        } else if (active?.params && typeof active.params === 'object') {
            _data = (active.params as any).value.toString() || '';
        }
        return _data;
    }


    const renderContent = () => {

        switch (active.id) {
            case "dashboard":
                return <Dashboard />;

            case "company":
                if (active.key == "add") return <CompanyAdd />
                if (active.key == "edit") return <CompanyEdit id={getParamData('id')} />;
                return <Company />;

            case "fiscalyear":
                if (active.key == "add") return <FiscalYearAdd />
                if (active.key == "edit") return <FiscalYearEdit id={getParamData('id')} />;
                return <FiscalYear />;

            case "companytradingcode":
                if (active.key == "add") return <CompanyTradingCodeAdd />
                if (active.key == "edit") return <CompanyTradingCodeEdit id={getParamData('id')} />;
                if (active.key == "tradingcodediscount") return <TradingCodeDiscount tradingCodeId={getFilterData('tradingCodeId')} tradingCode={getFilterData('tradingCode')} />;
                if (active.key == "tradingcodediscount/add") return <TradingCodeDiscountAdd tradingCodeId={getFilterData('tradingCodeId')} tradingCode={getFilterData('tradingCode')} />;
                return <CompanyTradingCode />;

            case "stock":
                if (active.key == "view") return <StockView id={getParamData('id')} master={getParamData('master')} />;
                return <Stock />;

            case "share":
                if (active.key == "add") return <ShareAdd />;
                if (active.key == "addt") return <ShareAddT />;
                if (active.key == "edit") return <ShareEdit id={getParamData('id')} />;
                if (active.key == "stock/view") return <StockView id={getParamData('id')} master={getParamData('master')} />;
                if (active.key == "shareinitialbalance") return <Shareinitialbalance id={getParamData('id')} name={getParamData('name')} />;
                if (active.key == "shareinitialbalance/add") return <ShareinitialbalanceAdd shareId={getParamData('shareId')} name={getParamData('name')} />;
                if (active.key == "shareinitialbalance/edit") return <ShareinitialbalanceEdit id={getParamData('id')} shareId={getParamData('shareId')} name={getParamData('name')} />;

                return <Share />;

            case "sharerelationtype":
                if (active.key == "add") return <ShareRelationTypeAdd />;
                if (active.key == "edit") return <ShareRelationTypeEdit id={getParamData('id')} />;
                return <ShareRelationType />;

            case "companybroker":
                if (active.key == "add") return <CompanyBrokerAdd />;
                if (active.key == "all") return <CompanyBrokerAll />;
                if (active.key == "edit") return <CompanyBrokerEdit id={getParamData('id')} />;
                if (active.key == "code") return <CompanyBrokerCode id={getParamData('id')} brokerName={getParamData('brokerName')} master={getParamData('master')} />;
                if (active.key == "companybrokerdiscount") return <Companybrokerdiscount id={getParamData('id')} brokerName={getParamData('brokerName')} />;
                if (active.key == "companybrokerdiscount/add") return <CompanybrokerdiscountAdd id={getParamData('id')} brokerName={getParamData('brokerName')} />;
                return <CompanyBroker />;

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
                                <>{t(tab.name)}
                                    <Tooltip label={`حذف ${tab.id}`}>
                                        <ActionIcon
                                            onClick={() => removeTab(tab.id)}
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
            {active ? (
                <div className={`bg-white rounded-b-md shadow border border-gray-400 `}>
                    <div className="space-y-3">
                        {renderContent()}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">هنوز تبی ایجاد نشده است.</p>
            )}
        </div>
    );
}