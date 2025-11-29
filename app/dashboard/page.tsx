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


export default function Dashboard() {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)


    // useEffect(() => {
    //     // apiFetch('api/proxy/api/membership/role'
    //     // )
    //     //     .then(d => setData(JSON.parse(d)))
    //     //     .catch((e: any) => setError(e.message))
    //     apiFetch('api/proxy/api/membership/user/authorizedpermissions'
    //     )
    //         .then(d => setData(JSON.parse(d)))
    //         .catch((e: any) => setError(e.message))
    // }, [])

    if (error) return <div className="text-red-600">{error}</div>
    if (!data) return <div>Loading...</div>


    return (
        <div>
            <LogoutButton />
            <h2 className="text-xl mb-2">Dashboard</h2>

            {/* {data?.items && data?.items?.map((data) => {
                return (
                    <>{data.name}</>
                )
            })} */}
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
    )
}