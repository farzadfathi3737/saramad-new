import React, { useState, useEffect } from 'react';
import { ErrorMessage, FieldConfig, FieldProps, getIn } from 'formik';
import { useTranslation } from 'react-i18next';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { far } from '@fortawesome/free-regular-svg-icons';

interface CustomInputProps extends FieldProps {
    label: string;
    value: boolean | null;
    type?: string;
    icon?: any | Iterable<any>;
    placeholder?: string;
    disabled: boolean;
}

const FswitchField: React.FC<CustomInputProps> = ({ label, field, value = null, type, icon, placeholder, disabled = false, form, ...other }) => {
    const { t } = useTranslation();
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
                <label htmlFor={field.name} className="!text-gray-600 mb-2 block text-sm">
                    {label}
                </label>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => !disabled && handlerClick()}
                        disabled={disabled}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${
                            disabled 
                                ? 'bg-gray-300 cursor-not-allowed opacity-50' 
                                : active 
                                    ? 'bg-green-500' 
                                    : 'bg-gray-300'
                        }`}
                    >
                        <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                                active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                    <span className={`text-sm ${disabled ? 'text-gray-400' : active ? 'text-gray-700' : 'text-gray-500'}`}>
                        {active ? t('active') : t('dactive')}
                    </span>
                </div>
                {form.touched[field.name] && form.errors[field.name] ? <div className="text-red-500 text-xs mt-1">{form.errors[field.name]?.toString()}</div> : null}
            </fieldset>
        </div>
    );
};

export default FswitchField;