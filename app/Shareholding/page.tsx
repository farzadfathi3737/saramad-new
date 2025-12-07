'use client';

import { Suspense, useState } from "react";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";

import ChangeCompany from "../components/changeCompany";
import { DarkThemeToggle } from "flowbite-react";
import Link from "next/link";
import Sidebar from "../Sidebar";
import TabPage from "../components/tabPage";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);

  const [isOpenUser, setIsOpenUser] = useState(false);
  const handleClose = () => setIsOpenUser(false);

  return (

    <div className="flex min-h-screen flex-row w-full">
      <div
        className={`bg-Custom relative overflow-hidden transition-all duration-500 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${isOpen ? "w-[320px]" : "w-[0px]"}`}
      >
        <div
          className={`absolute w-full transition-all duration-500 ease-in-out ${isOpen ? "left-0" : "left-10"}`}
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
                <i className={`fa-duotone fa-solid fa-envelope text-xl text-gray-400 hover:text-primary-500`} />
              </button>
              <button
                type="button"
                className="p-0 bg-other-blue-gray-light hover:text-other-blue-gray-light hover:bg-text-primary h-[42px] w-[42px] flex-col rounded-full text-center text-sm text-red-600"
              >
                <i className={`fa-duotone fa-solid fa-bell text-xl text-gray-400 hover:text-orange-500`} />
              </button>
              {/* <DarkThemeToggle className="bg-gray-200 text-primary h-[42px] w-[42px] rounded-full focus:ring-0" /> */}

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




              <div className="flex justify-center items-center">
                <div className="flex" onClick={() => setIsOpenUser(true)}>
                  <div className="pl-2 h-full">
                    <button
                      type="button"
                      className=" p-0 bg-other-blue-gray-light hover:text-other-blue-gray-light hover:bg-text-primary h-[42px] w-[42px] flex rounded-full text-center text-sm text-red-600 justify-center items-center"
                    >
                      <i className={`fa-duotone fa-solid fa-circle-user text-4xl text-gray-400`} />
                    </button>
                  </div>
                  <div className="text-base flex flex-col text-gray-900">
                    <div className="text-base pb-1">سید محسن الهامی</div>
                    <span className="rounded w-fit bg-green-200 px-1 text-xs text-green-500">پشتیبان</span>
                  </div>
                </div>
                <Drawer open={isOpenUser} onClose={handleClose}>
                  <DrawerItems>
                    <div className="flex justify-between">
                      <div>اطلاعات کاربر</div>
                      <div onClick={handleClose}><svg
                        className="ms-2 h-3.5 w-3.5 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg></div>
                    </div>
                    <div>
                      <DarkThemeToggle />
                    </div>
                  </DrawerItems>
                </Drawer>
              </div>
            </div>

          </div>
        </div >
        <div className="h-full justify-items-center bg-white p-2 dark:bg-blue-950">

          <Suspense fallback={<div>Loading...</div>}>
            <TabPage />
          </Suspense>
          {/* <TabPage /> */}
        </div>
      </div >
    </div >

  );
}
