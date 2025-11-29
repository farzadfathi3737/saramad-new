'use client';

import { useState } from "react";

import ChangeCompany from "../components/changeCompany";
import { DarkThemeToggle } from "flowbite-react";
import Link from "next/link";
import Sidebar from "../Sidebar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);

    return (

        <div className="flex justify-center min-h-screen flex-row w-full p-52 bg-Custom">
            <div className="flex flex-col bg-white/10 rounded-2xl shadow-lg w-full max-w-md h-full p-6">
                <div className="justify-items-center p-2">
                    <img className="ml-[5px] w-[200px] flex-none" src="/assets/images/logo.png" alt="logo" />
                </div>
                <div className="h-full justify-items-center pt-5">
                    {children}
                </div>
            </div>
        </div >

    );
}
