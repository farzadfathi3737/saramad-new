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

const FCheckboxField: React.FC<CustomInputProps> = ({ label, field, value = null, type, icon, placeholder, disabled = false, form, ...other }) => {
    const { t } = useTranslation();
    const [active, setActive] = useState(field.value);

    const handlerClick = () => {
        setActive(active == null ? true : active ? false : null);
        form.setFieldValue(field.name, active == null ? true : active ? false : null);
        field.value = active == null ? true : active ? false : null;
    };

    return (
        <div className="w-full">
            <fieldset>
                <label htmlFor={field.name} className="text-white-dark">
                    {label}
                </label>
                <div className={`flex items-center border ${disabled && 'bg-gray-50'} rounded border-gray-200 dark:border-gray-700`}>
                    <label
                        htmlFor={field.name}
                        onClick={() => !disabled && handlerClick()}
                        className={`m-0 flex w-full items-center p-3 text-sm font-medium  ${active ? 'text-dark' : 'text-white-dark'} dark:text-gray-300`}
                    >
                        <div className={`flex h-4 w-4 items-center pl-3 ${disabled || !active ? 'text-gray-400' : 'text-blue-400'}`}>
                            {active == null ? (
                                // <FontAwesomeIcon icon={far['faSquareMinus']} size="xl" />
                                <i className={`fa-duotone fa-solid fa-square-minus text-xl`} />
                            ) : active ? (
                                // <FontAwesomeIcon icon={far['faSquareCheck']} size="xl" />
                                <i className={`fa-duotone fa-solid fa-square-check text-xl`} />
                            ) : (
                                // <FontAwesomeIcon icon={far['faSquare']} size="xl" />
                                <i className={`fa-duotone fa-solid fa-square text-xl`} />
                            )}
                        </div>
                        <div className="pr-3">{active == null ? t('empty') : active ? t('active') : t('dactive')}</div>
                    </label>
                </div>
                {form.touched[field.name] && form.errors[field.name] ? <div className="text-warning">{form.errors[field.name]?.toString()}</div> : null}
            </fieldset>
        </div>
    );
};

export default FCheckboxField;
