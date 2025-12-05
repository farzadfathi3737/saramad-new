import React from 'react';
import { FieldProps } from 'formik';

interface CustomInputProps extends FieldProps {
    label: string;
    type?: string;
    disabled?: boolean;
}

const FTextField: React.FC<CustomInputProps> = ({ label, field, type = 'text', form, disabled = false, ...other }) => {
    const hasError = form.touched[field.name] && form.errors[field.name];

    return (
        <div className="w-full">
            <div className="relative">
                {!disabled ? (
                    <>
                        <input
                            {...field}
                            {...other}
                            type={type}
                            id={field.name}
                            placeholder=" "
                            className={`peer w-full px-4 py-3 bg-white/5 border border-cyan-300/40 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:bg-white/15 transition-all duration-300 backdrop-blur-sm ${hasError ? 'ring-2 ring-red-500 border-red-500' : ''
                                }`}
                        />
                        <label
                            htmlFor={field.name}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 peer-focus:-translate-y-[28px] peer-focus:scale-90 peer-focus:text-cyan-400 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 transition-all duration-300 origin-right peer-focus:origin-right cursor-text"
                        >
                            {label}
                        </label>
                    </>
                ) : (
                    <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 backdrop-blur-sm">
                        {field.value}
                    </div>
                )}

                {/* خط انیمیشن زیر input */}
                <div className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 scale-x-0 peer-focus:scale-x-100 transition-transform duration-300 rounded-full" style={{ width: '100%' }}></div>
            </div>

            {/* پیام خطا با انیمیشن */}
            {hasError && (
                <p className="text-red-400 text-xs mt-2 animate-in fade-in duration-200">
                    ⚠️ {form.errors[field.name]?.toString()}
                </p>
            )}
        </div>
    );
};

export default FTextField;
