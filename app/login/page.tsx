'use client'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import FTextField from '../components/inputs/textField'
import * as Yup from 'yup';
import { useLanguage } from '@/contexts/LanguageContext';
import { IAuth } from '@/interface/dataModel';

export default function LoginPage() {
    const { t } = useLanguage();
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const LoginSchema = Yup.object().shape({
        username: Yup.string().required('ورود نام کاربری اجباری است'),
        password: Yup.string().required('ورود کامه عبور اجباری است'),
    });

    const handleLoginClick = async (loginData: IAuth) => {
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            })

            if (res.status === 200) {
                // لاگین موفق → هدایت به داشبورد
                window.location.href = '/'
                return
            }

            const data = await res.json()
            setError(data?.error || 'خطایی رخ داد')
        } catch (err: any) {
            setError(err.message || 'خطا در ارتباط')
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='space-y-4'>
            <Formik
                initialValues={{ password: "", username: "" }}
                validationSchema={LoginSchema}
                onSubmit={(values: IAuth) => {
                    handleLoginClick(values);
                }}
            >
                {({ errors, touched }) => (
                    <Form className="space-y-4">
                        {/* نام کاربری */}
                        <div className="group animate-in fade-in slide-in-from-bottom-3 duration-500 animation-delay-200">
                            <div className="relative">
                                <Field
                                    id="username"
                                    name="username"
                                    label={t("username")}
                                    component={FTextField}
                                    className="group-focus-within:ring-2 ring-blue-400"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            {errors.username && touched.username && (
                                <p className="text-red-400 text-xs mt-1 animate-in fade-in duration-200">{errors.username}</p>
                            )}
                        </div>

                        {/* کلمه عبور */}
                        <div className="group animate-in fade-in slide-in-from-bottom-3 duration-500 animation-delay-300">
                            <div className="relative">
                                <Field
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    label={t("password")}
                                    component={FTextField}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                                >
                                    <i className={`fa-duotone fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`} />
                                </button>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            {errors.password && touched.password && (
                                <p className="text-red-400 text-xs mt-1 animate-in fade-in duration-200">{errors.password}</p>
                            )}
                        </div>

                        {/* پیام خطا */}
                        {error && (
                            <div className="animate-in fade-in shake duration-500 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* دکمه لاگین */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-6 relative group animate-in fade-in slide-in-from-bottom-3 duration-500 animation-delay-400 overflow-hidden rounded-xl font-semibold text-white transition-all duration-300"
                            style={{ background: 'linear-gradient(to bottom right, #2ab0aa, #1a5f5a)' }}
                        >
                            {/* افکت براق */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>

                            {/* متن */}
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        درحال ورود...
                                    </>
                                ) : (
                                    <>
                                        {t('login')}
                                    </>
                                )}
                            </span>
                        </button>

                        {/* توضیح زیر دکمه */}
                        <p className="text-center text-xs text-gray-400 animate-in fade-in duration-700 animation-delay-500">
                            ورود به حساب کاربری خود
                        </p>
                    </Form>
                )}
            </Formik>

            {/* استایل‌های اضافی */}
            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .shake {
                    animation: shake 0.5s ease-in-out;
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

                .animation-delay-500 {
                    animation-delay: 500ms;
                }
            `}</style>
        </div>
    )
}