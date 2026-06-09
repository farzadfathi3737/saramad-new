import React, { useState, useEffect } from 'react';
import { FieldProps } from 'formik';

interface CustomInputProps extends FieldProps {
    label: string;
    type?: string;
    disabled?: boolean;
    classNameLabel?: string;
    classNameValue?: string;
    isNumber?: boolean;
    required?: boolean;
}

const formatWithSeparator = (val: string | number): string => {
    if (val === '' || val === null || val === undefined) return '';
    const raw = String(val).replace(/,/g, '');
    if (raw === '' || raw === '-') return raw;
    const num = Number(raw);
    if (isNaN(num)) return String(val);
    return num.toLocaleString('en-US');
};

const FTextField: React.FC<CustomInputProps> = ({ label, field, type = 'text', form, classNameLabel, classNameValue, disabled = false, isNumber = false, required = false, ...other }) => {
    const [displayValue, setDisplayValue] = useState<string>(
        isNumber ? formatWithSeparator(field.value) : ''
    );

    useEffect(() => {
        if (isNumber) {
            setDisplayValue(formatWithSeparator(field.value));
        }
    }, [field.value, isNumber]);

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, '');
        if (raw !== '' && !/^-?\d*\.?\d*$/.test(raw)) return;
        setDisplayValue(raw);
        form.setFieldValue(field.name, raw === '' ? '' : raw);
    };

    const handleNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, '');
        setDisplayValue(formatWithSeparator(raw));
        field.onBlur(e);
    };

    const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', '-', '.'];
        if (allowed.includes(e.key)) return;
        if (e.ctrlKey || e.metaKey) return;
        if (!/^\d$/.test(e.key)) e.preventDefault();
    };

    return (
        <div className="mb-5 w-full">
            <fieldset>
                <label htmlFor={field.name} className={`!text-gray-600 ${classNameLabel}`}>
                    {label}{required && <span className="text-red-500 mr-1">*</span>}
                </label>
                {!disabled ? (
                    <input
                        type={type}
                        id={field.name}
                        {...field}
                        {...other}
                        value={isNumber ? displayValue : (field.value ?? '')}
                        onChange={isNumber ? handleNumberChange : field.onChange}
                        onBlur={isNumber ? handleNumberBlur : field.onBlur}
                        onKeyDown={isNumber ? handleNumberKeyDown : undefined}
                        className={`form-input ${classNameValue}`}
                    />
                ) : (
                    <div className={`form-input bg-gray-300 text-gray-500 pt-3 flex items-center ${classNameValue}`}>
                        {isNumber ? formatWithSeparator(field.value) : field.value}
                    </div>
                )}

                {form.touched[field.name] && form.errors[field.name] ? <div className="text-red-500">{form.errors[field.name]?.toString()}</div> : null}
            </fieldset>
        </div>
    );
};

export default FTextField;
