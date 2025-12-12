import React, { useState, useEffect } from 'react';
import { FieldProps } from 'formik';
import Select from 'react-select';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface OptionType {
    value: string;
    label: string;
}

interface CustomSelectProps extends FieldProps {
    label: string;
    options: OptionType[];
    placeholder: string;
    isMulti?: boolean;
    disabled: boolean;
    onChange?: any;
}

const FSelectField: React.FC<CustomSelectProps> = ({ field, form, options, label, onChange, placeholder = '', isMulti = false, disabled = false }) => {

    const [selectedValue, setSelectedValue] = useState<any>(isMulti ? options.filter((option) => (field.value || []).includes(option.value)) : options?.find((option) => option.value === field.value));

    useEffect(() => {
        const newValue = isMulti
            ? options.filter((option) => (field.value || []).includes(option.value))
            : options?.find((option) => option.value === field.value);
        setSelectedValue(newValue);
    }, [field.value, options, isMulti]);

    const handleChange = (selectedOption: any) => {
        const value = isMulti ? selectedOption.map((option: OptionType) => option.value) : selectedOption?.value;
        form.setFieldValue(field.name, value);
        onChange && onChange(selectedOption);
    };

    const clear = () => {
        form.setFieldValue(field.name, undefined);
        onChange && onChange(undefined);
    };

    return (
        <div className='mb-5 w-full'>
            <fieldset>
                <label htmlFor={field.name} className="text-gray-600">{label}</label>
                <div className='relative'>
                    <Select
                        menuPosition="absolute"
                        className=""
                        id={field.name}
                        name={field.name}
                        value={selectedValue}
                        onChange={handleChange}
                        options={options}
                        isMulti={isMulti}
                        placeholder={placeholder}
                        isDisabled={disabled}
                    />
                    {field.value && !disabled && (
                        <div className="absolute bottom-0 left-8 p-3 !text-gray-600 flex items-center h-[48px]" onClick={clear}>
                            <i className={`fa-duotone fa-solid fa-xmark text-lg`} />
                        </div>
                    )}
                </div>
                {form.touched[field.name] && form.errors[field.name] ? <div className="text-red-500">{form.errors[field.name]?.toString()}</div> : null}
            </fieldset>
        </div>
    );
};

export default FSelectField;
