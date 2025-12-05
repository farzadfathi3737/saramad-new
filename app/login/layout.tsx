'use client';

import { useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden" style={{ background: 'linear-gradient(to top right, #2ab0aa, #15456c)' }}>
            {/* متحرک Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-[-30%] right-[-10%] w-80 h-80 rounded-full blur-3xl animate-blob" style={{ backgroundColor: 'rgba(42, 176, 170, 0.3)' }}></div>
                <div className="absolute bottom-[-30%] left-[-10%] w-80 h-80 rounded-full blur-3xl animate-blob animation-delay-2s" style={{ backgroundColor: 'rgba(21, 69, 108, 0.3)' }}></div>
                <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl animate-blob animation-delay-4s" style={{ backgroundColor: 'rgba(42, 176, 170, 0.2)' }}></div>
            </div>

            {/* محتوای اصلی */}
            <div className="relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
                {/* کارت لاگین */}
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* کارت شیشه‌ای */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 hover:shadow-2xl hover:bg-white/15 transition-all duration-300">
                        {/* لوگو */}
                        <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-top-8 duration-700 animation-delay-200">
                            <img
                                className="w-40 h-auto drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300"
                                src="/assets/images/logo.png"
                                alt="logo"
                            />
                        </div>

                        {/* عنوان */}
                        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-6 duration-700 animation-delay-300">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                خوش آمدید
                            </h1>
                            <p className="text-white/70 text-sm">
                                برای ادامه لطفاً وارد شوید
                            </p>
                        </div>

                        {/* فرم */}
                        <div className="animate-in fade-in duration-700 animation-delay-400">
                            {children}
                        </div>

                        {/* فوتر */}
                        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/50">
                            <p>تمام حقوق برای سرآمد محفوظ است © 2024</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* استایل‌های شامل انیمیشن */}
            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animation-delay-2s {
                    animation-delay: 2s;
                }

                .animation-delay-4s {
                    animation-delay: 4s;
                }

                .animation-delay-200 {
                    animation-delay: 200ms;
                }

                .animation-delay-300 {
                    animation-delay: 300ms;
                }

                .animation-delay-400 {
                    animation-delay: 400ms;
                }
            `}</style>
        </div>
    );
}
