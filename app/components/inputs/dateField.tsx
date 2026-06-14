'use client';
import React, { useEffect, useState } from 'react';
import { FieldProps } from 'formik';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface CustomInputProps extends FieldProps {
    label: string;
    type?: string;
    required?: boolean;
    minDate?: string;
    maxDate?: string;
}

const FDateField: React.FC<CustomInputProps> = ({ label, field, type, form, required = false, minDate, maxDate, ...other }) => {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const update = () => setIsDark(document.documentElement.classList.contains('dark'));
        update();
        const obs = new MutationObserver(update);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);

    const clear = () => {
        form.setFieldValue(field.name, undefined);
    };

    const handleChange = (date: any) => {
        if (!date) {
            form.setFieldValue(field.name, undefined);
            return;
        }
        const formatted = date.year + '/' + date.month.toString().padStart(2, '0') + '/' + date.day.toString().padStart(2, '0');
        form.setFieldValue(field.name, formatted, false);
    };

    return (
        <div className="flex flex-col relative mb-5 w-full">

            <label htmlFor={field.name} className="text-gray-600 dark:text-slate-300">
                {label}{required && <span className="text-red-500 mr-1">*</span>}
            </label>
            <DatePicker
                id={field.name}
                inputClass={`form-input${form.touched[field.name] && form.errors[field.name] ? ' border-red-500' : ''}`}
                value={field.value}
                name={field.name}
                onChange={handleChange}
                style={{ fontFamily: 'iranyekan', width: '100%' }}
                calendar={persian}
                locale={persian_fa}
                minDate={minDate}
                maxDate={maxDate}
                className={isDark ? 'rmdp-dark bg-dark' : ''}
            />
            {field.value && (
                <div className="absolute bottom-0 left-0 p-3 !text-gray-600" onClick={clear}>
                    {/* <FontAwesomeIcon icon={faXmark} size="lg" className="ml-2" /> */}
                    <i className={`fa-duotone fa-solid fa-xmark text-lg ml-2`} />
                </div>
            )}
            {/* </input> */}
            {form.touched[field.name] && form.errors[field.name] ? <div className="text-red-500">{form.errors[field.name]?.toString()}</div> : null}

        </div>
    );
};

export default FDateField;