'use client'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import FTextField from '../components/inputs/textField'
import * as Yup from 'yup';
import { useLanguage } from '@/contexts/LanguageContext';
import { IAuth } from '@/interface/dataModel';

export default function LoginPage() {
    const { t } = useLanguage();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)


    const LoginSchema = Yup.object().shape({
        username: Yup.string().required('ورود نام کاربری اجباری است'),
        password: Yup.string().required('ورود کامه عبور اجباری است'),
    });

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
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
        }
    }

    const handleLoginClick = async (loginData: IAuth) => {

        //setLoading(true);
        setError(null);

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
        }

        // const res = await fetch(`${model?.register?.url}`, {
        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // });

        // if (res.ok) {
        //     const result = res && (await res?.json());
        //     //setInitialRecords(result);
        //     //setAddModal(false);
        //     //fetchData();
        //     setLoading(false);
        //     router.back();
        // } else {
        //     const result = res && (await res?.json());
        //     ColoredToast('danger', result);
        // }

        //setLoading(false);
    };

    return (
        <div className='text-gray-800'>
            <h2 className="text-xl mb-2">ورود</h2>
            {/* <form onSubmit={submit} className="space-y-2 max-w-sm">
                <div>
                    <label>نام کاربری</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} className="border p-1 w-full" />
                </div>
                <div>
                    <label>کلمه عبور</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border p-1 w-full" />
                </div>
                {error && <div className="text-red-600">{error}</div>}
                <button className="btn btn-outline flex w-full justify-center items-center rounded-xl p-2 px-4 bg-[#2D9AA0] border border-[#247d81] font-iranyekan text-[#fff]">ورود</button>
            </form> */}

            <Formik
                initialValues={{ password: "", username: "" }}
                validationSchema={LoginSchema}
                onSubmit={(values: IAuth) => {
                    handleLoginClick(values);
                }}
            >
                <Form>
                    <div className="grid w-full grid-cols-1 gap-2">
                        <div className="w-full">
                            <Field id="username" name="username" label={t("username")} component={FTextField} />
                        </div>

                        <div className="w-full">
                            <Field type="password" id="password" name="password" label={t("password")} component={FTextField} />
                        </div>
                    </div>


                    <div className="mt-8 flex items-center justify-end">
                        <button type="submit" className="btn btn-outline flex w-full justify-center items-center rounded-xl p-2 px-4 bg-[#2D9AA0] border border-[#247d81] font-iranyekan text-[#fff]">
                            {t('login')}
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}