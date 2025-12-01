'use client'

import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { IRootState } from '../store';
import PerfectScrollbar from 'react-perfect-scrollbar';
//import Dropdown from '../components/Dropdown';
//import { setPageTitle } from '../store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import Link from 'next/link';
// import IconHorizontalDots from '@/components/Icon/IconHorizontalDots';
// import IconDollarSign from '@/components/Icon/IconDollarSign';
// import IconInbox from '@/components/Icon/IconInbox';
// import IconTag from '@/components/Icon/IconTag';
// import IconCreditCard from '@/components/Icon/IconCreditCard';
// import IconShoppingCart from '@/components/Icon/IconShoppingCart';
// import IconArrowLeft from '@/components/Icon/IconArrowLeft';
// import IconCashBanknotes from '@/components/Icon/IconCashBanknotes';
// import IconUser from '@/components/Icon/IconUser';
// import IconNetflix from '@/components/Icon/IconNetflix';
// import IconBolt from '@/components/Icon/IconBolt';
// import IconPlus from '@/components/Icon/IconPlus';
// import IconCaretDown from '@/components/Icon/IconCaretDown';
// import IconMultipleForwardRight from '@/components/Icon/IconMultipleForwardRight';
import { useTranslation } from 'react-i18next';
import { Tab } from '@headlessui/react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
//import makData from './../generated/makData.json';
import { useRouter } from 'next/router';
// import { IconCaretDownFilled, IconCaretUp, IconCaretUpDown, IconCaretUpFilled } from '@tabler/icons-react';
import { IDataModel } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
// import IconCaretsDown from '@/components/Icon/IconCaretsDown';

import { apiFetch } from '../../lib/apiFetch'
import LogoutButton from '../login/logout'
import { useLanguage } from '@/contexts/LanguageContext';
import makData from '../../generated/makData.json';

export interface IchahkesData {
    name: string;
    indexValue: number;
    indexChange: number;
    marketValue: number;
    marketCap: number;
}

export default function Dashboard() {
    const { t } = useLanguage();
    const [modelDataMarketIndex, setModelDataMarketIndex] = useState<IDataModel>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>();
    const [initialRecords, setInitialRecords] = useState<IchahkesData[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isDark = false;
    const isRtl = true;

    useEffect(() => {
        setIsMounted(true);
    });

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFetch(modelDataMarketIndex?.list?.url!);
            if (!response.ok) {
                throw new Error('خطا در دریافت داده');
            }
            const result = await response.json();
            setInitialRecords(result?.items);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const _setdata = async () => {
            await fetchData();
        };

        _setdata();

        const intervalId = setInterval(() => {
            _setdata();
        }, 300000); // 5 min 5*60*1000

        return () => {
            clearInterval(intervalId);
        };
    }, [modelDataMarketIndex]);

    useEffect(() => {
        const setdata = async () => {
            const _modelInProg = await getEntityModel('marketindex');
            setModelDataMarketIndex(_modelInProg);
        };

        setdata();
    }, []);

    const revenueChart: any = {
        series: [
            {
                name: makData.chart.ravand.values[0].name,
                data: makData.chart.ravand.values[0].data,
            },
            {
                name: makData.chart.ravand.values[1].name,
                data: makData.chart.ravand.values[1].data,
            },
        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'iranyekan, Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: makData.chart.ravand.date,

            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value + '%';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };

    const salesByCategory: any = {
        series: makData.chart.maleiyat.series,
        options: {
            chart: {
                type: 'pie',
                height: 800,
                fontFamily: 'iranyekan, Nunito, sans-serif',
            },
            dataLabels: {
                enabled: true,
            },
            // stroke: {
            //     show: true,
            //     width: 25,
            //     colors: isDark ? '#0e1726' : '#fff',
            // },
            //colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 195,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '60%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val + '%';
                                },
                            },
                            total: {
                                show: true,
                                label: 'کل',
                                color: '#888ea8',
                                fontSize: '12px',
                                formatter: (w: any) => {
                                    return (
                                        w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                            return a + b;
                                        }, 0) + '%'
                                    );
                                },
                            },
                        },
                    },
                },
            },
            labels: makData.chart.maleiyat.labels,
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    const columnChart: any = {
        series: [
            {
                name: '',
                data: makData.chart.salaneh.series,
            },
            // {
            //     name: 'Revenue',
            //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            // },
        ],
        options: {
            chart: {
                height: 400,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#805dca', '#e7515a'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                    colors: {
                        ranges: [
                            {
                                from: -100,
                                to: 0,
                                color: '#e7515a',
                            },
                            {
                                from: 1,
                                to: 100,
                                color: '#00e396',
                            },
                        ],
                    },
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            xaxis: {
                categories: makData.chart.salaneh.labels,
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: function (val: any) {
                        return val + '%';
                    },
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 150,
                offsetY: 20,
            },
        },
    };

    const columnChart2: any = {
        series: [
            {
                name: '',
                data: makData.chart.symbol.persent,
            },
            // {
            //     name: 'Revenue',
            //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            // },
        ],
        options: {
            chart: {
                height: 400,
                type: 'bar',
                zoom: {
                    enabled: true,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#0eff00', '#e7515a'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                    colors: {
                        ranges: [
                            {
                                from: -100,
                                to: 0,
                                color: '#e7515a',
                            },
                            {
                                from: 1,
                                to: 100,
                                color: '#00e396',
                            },
                        ],
                    },
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            xaxis: {
                categories: makData.chart.symbol.symbol,
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
                labels: {
                    offsetX: isRtl ? -20 : 0,
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? 0 : -10,
                },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: function (val: any) {
                        return val + '%';
                    },
                },
            },
            legend: {
                position: 'right',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: 20,
                },
                height: 150,
                offsetY: 20,
            },
        },
    };

    return (
        <>
            <div className='p-5 bg-gray-100'>
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link href="/" className="text-primary-50 hover:underline">
                            {t('dashboard')}
                        </Link>
                    </li>
                </ul>

                <div className="pt-5 dashboard">
                    {initialRecords && !loading ? (
                        <>
                            <div className="mb-3 grid gap-6 bg-transparent xl:grid-cols-6">
                                <div className="panel flex h-full xl:col-span-2">
                                    <div className="h-full w-2 rounded-xl bg-primary-50"></div>
                                    <div className="flex w-full flex-col px-5">
                                        <h1 className="pb-1 text-lg text-gray-500">شاخص کل</h1>
                                        <p className="w-full pb-1 text-2xl font-bold">{initialRecords[0]?.indexValue.toLocaleString('fa-IR')}</p>
                                        <p className="w-full text-lg">{initialRecords[0]?.name}</p>
                                    </div>
                                    {initialRecords[0]?.indexChange < 0 ? (
                                        <div className="flex h-full items-center rounded-xl p-3 text-xl text-red-400">
                                            <div>%</div>
                                            <div>{initialRecords[0]?.indexChange}</div>
                                            <div>
                                                {/* <IconCaretDownFilled className="text-xl" /> */}
                                                <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-full items-center rounded-xl p-3 text-xl text-green-400">
                                            <div>%</div>
                                            <div>{initialRecords[0]?.indexChange}</div>
                                            <div>
                                                {/* <IconCaretUpFilled className="text-xl" /> */}
                                                <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="panel flex h-full xl:col-span-2">
                                    <div className="h-full w-2 rounded-xl bg-gray-400"></div>
                                    <div className="flex w-full flex-col px-5">
                                        <h1 className="pb-1 text-lg text-gray-500">ارزش بازار</h1>
                                        <p className="w-full pb-1 text-2xl font-bold">{initialRecords[0]?.marketValue.toLocaleString('fa-IR')}</p>
                                        <p className="w-full text-lg">{initialRecords[0]?.name}</p>
                                    </div>
                                    <div className="text-md flex h-full w-56 items-center rounded-xl p-3 justify-end text-gray-500">(میلیون ریال)</div>
                                </div>
                                <div className="panel flex h-full xl:col-span-2">
                                    <div className="h-full w-2 rounded-xl bg-[#ffb177]"></div>
                                    <div className="flex w-full flex-col px-5">
                                        <h1 className="pb-1 text-lg text-gray-500">ارزش معاملات</h1>
                                        <p className="w-full pb-1 text-2xl font-bold">{initialRecords[0]?.marketCap.toLocaleString('fa-IR')}</p>
                                        <p className="w-full text-lg">{initialRecords[0]?.name}</p>
                                    </div>
                                    <div className="text-md flex h-full w-56 items-center rounded-xl p-3 justify-end text-gray-500">(میلیون ریال)</div>
                                </div>
                            </div>

                            <div className="mb-3 grid gap-6 bg-transparent xl:grid-cols-6">
                                <div className="panel flex h-full xl:col-span-2">
                                    <div className="h-full w-2 rounded-xl bg-primary-50"></div>
                                    <div className="flex w-full flex-col px-5">
                                        <h1 className="pb-1 text-lg text-gray-500">شاخص کل</h1>
                                        <p className="w-full pb-1 text-2xl font-bold">{initialRecords[1]?.indexValue.toLocaleString('fa-IR')}</p>
                                        <p className="w-full text-lg">{initialRecords[1]?.name}</p>
                                    </div>
                                    {initialRecords[1]?.indexChange < 0 ? (
                                        <div className="flex h-full items-center rounded-xl p-3 text-xl text-red-400">
                                            <div>%</div>
                                            <div>{initialRecords[1]?.indexChange}</div>
                                            <div>
                                                {/* <IconCaretDownFilled className="text-xl" /> */}
                                                <i className={`fa-duotone fa-solid fa-caredownfilled text-lg ml-2`} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-full items-center rounded-xl p-3 text-xl text-green-400">
                                            <div>%</div>
                                            <div>{initialRecords[1]?.indexChange}</div>
                                            <div>
                                                {/* <IconCaretUpFilled className="text-xl" /> */}
                                                <i className={`fa-duotone fa-solid fa-plus text-lg ml-2`} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="panel flex h-full xl:col-span-2">
                                    <div className="h-full w-2 rounded-xl bg-gray-400"></div>
                                    <div className="flex w-full flex-col px-5">
                                        <h1 className="pb-1 text-lg text-gray-500">ارزش بازار</h1>
                                        <p className="w-full pb-1 text-2xl font-bold">{initialRecords[1]?.marketValue.toLocaleString('fa-IR')}</p>
                                        <p className="w-full text-lg">{initialRecords[1]?.name}</p>
                                    </div>
                                    <div className="text-md flex h-full w-56 items-center rounded-xl p-3 justify-end text-gray-500">(میلیون ریال)</div>
                                </div>
                                <div className="panel flex h-full xl:col-span-2">
                                    <div className="h-full w-2 rounded-xl bg-[#ffb177]"></div>
                                    <div className="flex w-full flex-col px-5">
                                        <h1 className="pb-1 text-lg text-gray-500">ارزش معاملات</h1>
                                        <p className="w-full pb-1 text-2xl font-bold">{initialRecords[1]?.marketCap.toLocaleString('fa-IR')}</p>
                                        <p className="w-full text-lg">{initialRecords[1]?.name}</p>
                                    </div>
                                    <div className="text-md flex h-full w-56 items-center rounded-xl p-3 justify-end text-gray-500">(میلیون ریال)</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-3 grid gap-6 bg-transparent xl:grid-cols-6">
                                <div className="panel flex h-full w-full xl:col-span-2">
                                    <div className="flex w-full animate-pulse space-x-4">
                                        <div className="h-full w-2 rounded-xl bg-gray-200"></div>
                                        <div className="flex-1 space-y-6 px-5 py-1">
                                            <div className="h-2 w-[30%] rounded bg-gray-200"></div>
                                            <div className="space-y-3">
                                                <div className="flex w-full pb-2">
                                                    <div className="h-4 w-[60%] rounded bg-gray-200"></div>
                                                </div>
                                                <div className="h-2 rounded bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel flex h-full w-full xl:col-span-2">
                                    <div className="flex w-full animate-pulse space-x-4">
                                        <div className="h-full w-2 rounded-xl bg-gray-200"></div>
                                        <div className="flex-1 space-y-6 px-5 py-1">
                                            <div className="h-2 w-[30%] rounded bg-gray-200"></div>
                                            <div className="space-y-3">
                                                <div className="flex w-full pb-2">
                                                    <div className="h-4 w-[60%] rounded bg-gray-200"></div>
                                                </div>
                                                <div className="h-2 rounded bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel flex h-full w-full xl:col-span-2">
                                    <div className="flex w-full animate-pulse space-x-4">
                                        <div className="h-full w-2 rounded-xl bg-gray-200"></div>
                                        <div className="flex-1 space-y-6 px-5 py-1">
                                            <div className="h-2 w-[30%] rounded bg-gray-200"></div>
                                            <div className="space-y-3">
                                                <div className="flex w-full pb-2">
                                                    <div className="h-4 w-[60%] rounded bg-gray-200"></div>
                                                </div>
                                                <div className="h-2 rounded bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 grid gap-6 bg-transparent xl:grid-cols-6">
                                <div className="panel flex h-full w-full xl:col-span-2">
                                    <div className="flex w-full animate-pulse space-x-4">
                                        <div className="h-full w-2 rounded-xl bg-gray-200"></div>
                                        <div className="flex-1 space-y-6 px-5 py-1">
                                            <div className="h-2 w-[30%] rounded bg-gray-200"></div>
                                            <div className="space-y-3">
                                                <div className="flex w-full pb-2">
                                                    <div className="h-4 w-[60%] rounded bg-gray-200"></div>
                                                </div>
                                                <div className="h-2 rounded bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel flex h-full w-full xl:col-span-2">
                                    <div className="flex w-full animate-pulse space-x-4">
                                        <div className="h-full w-2 rounded-xl bg-gray-200"></div>
                                        <div className="flex-1 space-y-6 px-5 py-1">
                                            <div className="h-2 w-[30%] rounded bg-gray-200"></div>
                                            <div className="space-y-3">
                                                <div className="flex w-full pb-2">
                                                    <div className="h-4 w-[60%] rounded bg-gray-200"></div>
                                                </div>
                                                <div className="h-2 rounded bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel flex h-full w-full xl:col-span-2">
                                    <div className="flex w-full animate-pulse space-x-4">
                                        <div className="h-full w-2 rounded-xl bg-gray-200"></div>
                                        <div className="flex-1 space-y-6 px-5 py-1">
                                            <div className="h-2 w-[30%] rounded bg-gray-200"></div>
                                            <div className="space-y-3">
                                                <div className="flex w-full pb-2">
                                                    <div className="h-4 w-[60%] rounded bg-gray-200"></div>
                                                </div>
                                                <div className="h-2 rounded bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="panel mb-6 flex w-full flex-col">
                        <div className="w-full pb-5 text-center">
                            <p className="text-2xl">سبد سهام</p>
                        </div>
                        <div className="grid grid-cols-5">
                            <div className="flex flex-col items-center justify-center border-l border-l-gray-400">
                                <h1 className="pb-3 text-xl text-green-800">بهای تمام شده</h1>
                                <p className="text-xl text-gray-500">25,855,207,077,443</p>
                            </div>
                            <div className="flex flex-col items-center justify-center border-l border-l-gray-400">
                                <h1 className="pb-3 text-xl text-secondary">سود و زیان تحقق یافته</h1>
                                <p className="text-xl text-gray-500">1,560,133,191,410</p>
                            </div>
                            <div className="flex flex-col items-center justify-center border-l border-l-gray-400">
                                <h1 className="pb-3 text-xl text-green-500">سود</h1>
                                <p className="text-xl text-gray-500">4,527,998,863,645</p>
                            </div>
                            <div className="flex flex-col items-center justify-center border-l border-l-gray-400">
                                <h1 className="pb-3 text-xl text-red-600">ارزش بازار</h1>
                                <p className="text-xl text-gray-500">56,551,577,990,533</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="pb-3 text-xl text-orange-600">بازده</h1>
                                <p className="text-xl text-gray-500">118</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-6">
                        <div className="panel col-span-2 h-full">
                            <div className="mb-5 flex items-center justify-between dark:text-white-light">
                                <h5 className="text-lg font-semibold">روند کلی سود و زیان (تحقق یافته) نسبت به شاخص کل</h5>
                            </div>

                            <div className="relative">
                                <div className="rounded-lg bg-white dark:bg-black" style={{ direction: "ltr" }}>
                                    {isMounted ? (
                                        <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={760} width={'100%'} />
                                    ) : (
                                        <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                            <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="panel h-full">
                            <div className="mb-5 flex items-center">
                                <h5 className="text-lg font-semibold dark:text-white-light">درصد مالکیت به تفکیک صنعت</h5>
                            </div>
                            <div>
                                <div className="rounded-lg bg-white dark:bg-black">
                                    {isMounted ? (
                                        <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={750} width={'100%'} />
                                    ) : (
                                        <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                            <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 grid h-[600px] gap-6 sm:grid-cols-2 xl:grid-cols-2">
                        <div className="panel h-full sm:col-span-2 xl:col-span-1">
                            <div className="mb-5 flex items-center">
                                <h5 className="text-lg font-semibold dark:text-white-light">
                                    بازده سالانه به تفکیک صنعت
                                </h5>
                            </div>

                            <div className="h-[95%] rounded-lg bg-white dark:bg-black">
                                {isMounted ? (
                                    <ReactApexChart series={columnChart.series} options={columnChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={'95%'} width={'100%'} />
                                ) : (
                                    <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="panel h-full sm:col-span-2 xl:col-span-1">
                            <div className="mb-5 flex items-center">
                                <h5 className="text-lg font-semibold dark:text-white-light">
                                    نماد های تاثیرگذار در سود و زیان پورتفوی (تحقق نیافته)
                                </h5>
                            </div>

                            <div className="h-[95%] rounded-lg bg-white dark:bg-black">
                                {isMounted ? (
                                    <ReactApexChart
                                        series={columnChart2.series}
                                        options={columnChart2.options}
                                        className="rounded-lg bg-white dark:bg-black"
                                        type="bar"
                                        height={'95%'}
                                        width={'100%'}
                                    />
                                ) : (
                                    <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
                        <div className="panel h-full">
                            <div className="mb-5 flex items-center justify-between dark:text-white-light">
                                <h5 className="text-lg font-semibold">مجامع پیش رو</h5>
                            </div>
                            <div className="max-h-[500px] overflow-x-hidden overflow-y-scroll">
                                <div className="space-y-6">
                                    {makData.majameh.map((item, i) => {
                                        return (
                                            <div key={i}>
                                                <a href={item.link} className="flex">
                                                    <div className="flex-1 px-3">
                                                        <div>{item.symbol}</div>
                                                        <div className="text-xs text-white-dark dark:text-gray-500">{item.des}</div>
                                                    </div>
                                                    <span className="whitespace-pre px-1 text-base text-secondary ltr:ml-auto rtl:mr-auto">{item.date}</span>
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}