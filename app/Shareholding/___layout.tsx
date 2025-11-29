'use client';

import { useState } from "react";

import ChangeCompany from "../components/changeCompany";
import { DarkThemeToggle } from "flowbite-react";
import Link from "next/link";
import Sidebar from "../Sidebar";

export function DefaultLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);

    return (

        <div className="flex min-h-screen flex-row w-full">
            <div
                className={`bg-Custom relative overflow-hidden transition-all duration-500 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${isOpen ? "w-[320px]" : "w-[0px]"}`}
            >
                <div
                    className={`absolute w-[270px] transition-all duration-500 ease-in-out ${isOpen ? "left-0" : "left-10"}`}
                >
                    <div className="justify-items-center bg-inherit pb-1 bt-0 ">
                        <div className="container flex flex-row justify-between gap-2.5">
                            <div className="container flex flex-row justify-between gap-2.5">


                                <div className="flex w-full flex-col justify-items-center py-1">
                                    <Link href="/" className="main-logo flex shrink-0 items-center">
                                        <img className="ml-[5px] w-[150px] flex-none" src="/assets/images/logo-white.png" alt="logo" />
                                    </Link>
                                </div>

                                <div className="flex flex-col items-end justify-center">
                                    <div className="flex flex-row gap-2">
                                        <button
                                            type="button"
                                            className="bg-text-link-interactive text-other-blue-gray-light h-[44px] rounded-r-xl px-5"
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            <i className="fa-duotone fa-solid fa-bars text-white text-3xl"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <Sidebar />
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col">
                <div className="justify-items-center border-b border-b-gray-200 bg-white py-2 dark:border-b-gray-800 dark:bg-gray-900">
                    <div
                        className={`absolute my-1 transition-all ease-in-out ${!isOpen ? "right-0 duration-1000" : "right-[-36px] duration-100"}`}
                    >
                        <button
                            type="button"
                            className="bg-text-link-interactive text-other-blue-gray-light h-[44px] rounded-l-xl px-1"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <i className="fa-duotone fa-solid fa-bars text-[#15456c] text-3xl"></i>
                        </button>
                    </div>
                    <div className={`flex flex-row justify-between gap-2.5 w-full pl-6 ${!isOpen ? "pr-12" : "pr-3"}`}>
                        <div
                            className={`flex flex-col justify-center transition-all duration-500 ease-in-out ${!isOpen ? "w-[270px]" : "w-[0px]"}`}
                        >
                            <img className="ml-[5px] w-[150px] flex-none" src="/assets/images/logo.png" alt="logo" />
                        </div>
                        <div>
                            <ChangeCompany />
                        </div>

                        <div className="flex min-h-[56px] grow flex-row justify-items-start py-4">
                            <div>
                                {/* layoutTitle */}
                            </div>
                        </div>


                        <div className="flex flex-row justify-center items-center gap-2">
                            <button
                                type="button"
                                className="p-0 bg-other-blue-gray-light hover:text-other-blue-gray-light hover:bg-text-primary h-[42px] w-[42px] flex-col rounded-full text-center text-sm text-red-600"
                            >
                                <i className={`fa-duotone fa-solid fa-envelope text-xl text-primary-500`} />
                            </button>
                            <button
                                type="button"
                                className="p-0 bg-other-blue-gray-light hover:text-other-blue-gray-light hover:bg-text-primary h-[42px] w-[42px] flex-col rounded-full text-center text-sm text-red-600"
                            >
                                <i className={`fa-duotone fa-solid fa-bell text-xl text-primary-500`} />
                            </button>
                            {/* <DarkThemeToggle className="bg-gray-200 text-primary h-[42px] w-[42px] rounded-full focus:ring-0" /> */}
                            <button
                                type="button"
                                className="p-0 bg-other-blue-gray-light hover:text-other-blue-gray-light hover:bg-text-primary h-[42px] w-[42px] flex-col rounded-full text-center text-sm text-red-600"
                            >
                                <i className={`fa-duotone fa-solid fa-circle-user text-4xl text-gray-400`} />
                            </button>
                            <DarkThemeToggle />
                            {/* <button
                  type="button"
                  className="bg-other-blue-gray-light text-text-primary h-[42px] w-[42px] flex-col rounded-full p-2.5 text-center text-sm hover:bg-gray-700 focus:ring-gray-300 focus:outline-none"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <TaksaIcon
                    icon="icon-user"
                    className={"h-full"}
                    color={"text-gray-500"}
                    fontSize={"20px"}
                  />
                </button> */}
                            {/* <IconButton /> */}




                            <div className="flex">
                                {/* <div>
                                {/* <img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpeg" alt="userProfile" /> /}
                                <button
                                    type="button"
                                    className="p-0 bg-other-blue-gray-light hover:text-other-blue-gray-light hover:bg-text-primary h-[42px] w-[42px] flex-col rounded-full text-center text-sm text-red-600"
                                >
                                    <i className={`fa-duotone fa-solid fa-circle-user text-4xl text-gray-600 h-full w-full`} />
                                </button>
                            </div> */}
                                <div className="text-base flex flex-col text-gray-900">
                                    <div className="text-base pb-1">سید محسن الهامی</div>
                                    <span className="rounded w-fit bg-green-200 px-1 text-xs text-green-500">پشتیبان</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="h-full justify-items-center bg-white p-2 dark:bg-blue-950">

                    {children}
                </div>
            </div>
        </div >

    );
}
