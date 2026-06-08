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
                    isNumber ? (
                        <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={displayValue}
                            onChange={handleNumberChange}
                            onBlur={handleNumberBlur}
                            onKeyDown={handleNumberKeyDown}
                            className={`form-input text-left ltr ${classNameValue}`}
                            dir="ltr"
                            {...(other as any)}
                        />
                    ) : (
                        <input
                            type={type}
                            id={field.name}
                            {...field}
                            {...other}
                            className={`form-input ${classNameValue}`} />
                    )
                ) : (
                    <div className={`form-input bg-gray-300 text-gray-500 pt-3 flex items-center ${classNameValue}`}>
                        {isNumber ? formatWithSeparator(field.value) : field.value}
                    </div>
                )}

                {form.touched[field.name] && form.errors[field.name] ? <div className="text-red-500">{form.errors[field.name]?.toString()}</div> : null}
            </fieldset>
        </div>
        // <div className="w-full">
        //     <div className="relative">
        //         {!disabled ? (
        //             <>
        //                 <input
        //                     {...field}
        //                     {...other}
        //                     type={type}
        //                     id={field.name}
        //                     placeholder=" "
        //                     className={`peer w-full px-4 py-3 bg-white/5 border border-cyan-300/40 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent focus:bg-white/15 transition-all duration-300 backdrop-blur-sm ${hasError ? 'ring-2 ring-red-500 border-red-500' : ''
        //                         }`}
        //                 />
        //                 <label
        //                     htmlFor={field.name}
        //                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 peer-focus:-translate-y-[28px] peer-focus:scale-90 peer-focus:text-gray-600 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300 origin-right peer-focus:origin-right cursor-text"
        //                 >
        //                     {label}
        //                 </label>
        //             </>
        //         ) : (
        //             <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 backdrop-blur-sm">
        //                 {field.value}
        //             </div>
        //         )}

        //         {/* خط انیمیشن زیر input */}
        //         <div className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-r from-cyan-600 to-teal-500 scale-x-0 peer-focus:scale-x-100 transition-transform duration-300 rounded-full" style={{ width: '100%' }}></div>
        //     </div>

        //     {/* پیام خطا با انیمیشن */}
        //     {hasError && (
        //         <p className="text-red-400 text-xs mt-2 animate-in fade-in duration-200">
        //             ⚠️ {form.errors[field.name]?.toString()}
        //         </p>
        //     )}
        // </div>
    );
};

export default FTextField;
