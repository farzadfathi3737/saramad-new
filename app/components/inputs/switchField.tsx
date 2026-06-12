import React, { useState, useEffect } from 'react';
import { FieldProps } from 'formik';
import { useLanguage } from '@/contexts/LanguageContext';

interface CustomInputProps extends FieldProps {
    label: string;
    value?: boolean | null;
    type?: string;
    icon?: any | Iterable<any>;
    placeholder?: string;
    disabled?: boolean;
}

const FswitchField: React.FC<CustomInputProps> = ({ label, field, value = null, type, icon, placeholder, disabled = false, form, ...other }) => {
    const { t } = useLanguage();
    const [active, setActive] = useState(field.value);

    useEffect(() => {
        setActive(field.value);
    }, [field.value]);

    const handlerClick = () => {
        const newValue = !active;
        setActive(newValue);
        form.setFieldValue(field.name, newValue);
    };

    return (
        <div className="w-full">
            <fieldset>
                <label htmlFor={field.name} className="!text-gray-600 dark:!text-slate-300 mb-2 block text-sm">
                    {label}
                </label>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => !disabled && handlerClick()}
                        disabled={disabled}
                        dir="ltr"
                        style={{ padding: 0, borderRadius: '9999px' }}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${disabled
                                ? 'bg-gray-300 cursor-not-allowed opacity-50'
                                : active
                                    ? 'bg-green-500'
                                    : 'bg-gray-300 dark:bg-slate-600'
                            }`}
                    >
                        <span
                            className={`inline-block h-5 w-5 transform rounded-full shadow-md transition-transform duration-200 ease-in-out ${active ? 'translate-x-5' : 'translate-x-0.5'}`}
                            style={{ backgroundColor: '#ffffff' }}
                        />
                    </button>
                    <span className={`text-sm ${disabled ? 'text-gray-400 dark:text-slate-500' : active ? 'text-gray-700 dark:text-slate-200' : 'text-gray-500 dark:text-slate-400'}`}>
                        {active ? t('active') : t('dactive')}
                    </span>
                </div>
                {form.touched[field.name] && form.errors[field.name] ? <div className="text-red-500 text-xs mt-1">{form.errors[field.name]?.toString()}</div> : null}
            </fieldset>
        </div>
    );
};

export default FswitchField;