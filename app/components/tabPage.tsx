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

import Fiscalyear from "../Shareholding/fiscalyear";
import { ITabData } from "@/interface/dataModel";

export default function TabsWithRouting() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const appConf = useSelector((state: IRootState) => state.appConfig);

    // const [tabs, setTabs] = useState<ITabData[]>([]);
    // const [activeTab, setActiveTab] = useState<number | null>(null);

    useEffect(() => {

    }, []);

    // مقداردهی اولیه از localStorage و query string
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
            filters: {
                search: "",
                category: "all"
            }
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

    // // ذخیره تب‌ها در localStorage
    // useEffect(() => {
    //     localStorage.setItem("tabsData", JSON.stringify(tabs));
    // }, [tabs]);

    // useEffect(() => {
    //     localStorage.setItem("activeTab", JSON.stringify(activeTab));
    // }, [activeTab]);

    // // افزودن تب جدید (حداکثر ۶ عدد)
    // const addTab = ({ key, name }: TabData) => {
    //     if (tabs.length >= 6) {
    //         alert("حداکثر ۶ تب مجاز است!");
    //         return;
    //     }

    //     const newTab: TabData = {
    //         id: Date.now(),
    //         key: key,
    //         name: name,
    //         filters: { search: "", category: "all" },
    //     };

    //     const updatedTabs = [...tabs, newTab];
    //     setTabs(updatedTabs);
    //     setActiveTab(newTab.id);
    //     router.replace(`?tab=${newTab.id}`);
    // };

    // حذف تب
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

    // تغییر فیلتر در هر تب
    // const updateFilter = (tabId: number, key: keyof TabFilters, value: string) => {
    //     setTabs((prev) =>
    //         prev.map((tab) =>
    //             tab.id === tabId
    //                 ? { ...tab, filters: { ...tab.filters, [key]: value } }
    //                 : tab
    //         )
    //     );
    // };

    const handleTabClick = (tabId: string) => {
        dispatch(setActiveTab(tabId));
        router.replace(`?tab=${tabId}`);
    };

    const active: ITabData = appConf.tabs.find((t) => t.id === appConf.activeTab)!;
    const _tabs = [...appConf.tabs].sort((a, b) => a.orther - b.orther);

    const renderContent = () => {
        switch (active.name) {
            case "dashboard":
                return <Dashboard />;

            case "companyProfile":
                if (active.key == "companyProfile/add") return <CompanyAdd />
                if (active.key == "companyProfile/edit") return <CompanyEdit />
                return <Company />;

            case "fiscalYear":
                return <Fiscalyear />;


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
                            {t(tab.name)}
                            <Tooltip label={`حذف ${tab.name}`}>
                                <ActionIcon
                                    onClick={() => removeTab(tab.id)}
                                    className="mr-2 flex items-center rounded-xl w-9 h-9 p-0 !bg-transparent !hover:bg-red-500">
                                    <i className={`fa-duotone fa-solid fa-xmark text-sm ${appConf.activeTab === tab.id ? 'text-gray-900' : 'text-gray-600 hover:t'}`} />
                                </ActionIcon>
                            </Tooltip>
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