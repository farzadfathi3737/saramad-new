import React, { useState } from 'react';
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

    const handleChange = (selectedOption: any) => {
        const value = isMulti ? selectedOption.map((option: OptionType) => option.value) : selectedOption?.value;
        form.setFieldValue(field.name, value);
        onChange && onChange(selectedOption);
        field.value = value;
        setSelectedValue(isMulti ? options.filter((option) => (field.value || []).includes(option.value)) : options?.find((option) => option.value === field.value));
    };

    //setSelectedValue(isMulti ? options.filter((option) => (field.value || []).includes(option.value)) : options?.find((option) => option.value === field.value));

    const clear = () => {
        form.setFieldValue(field.name, undefined);
        setSelectedValue([]);
        field.value = undefined;
        onChange && onChange(undefined);
    };

    return (
        <div className='relative'>
            <label className="text-white-dark">{label}</label>
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
            />
            {field.value && (
                <div className="absolute bottom-0 left-8 p-3 text-white-dark" onClick={clear}>
                    {/* <FontAwesomeIcon icon={faXmark} size="lg" className="ml-2" /> */}
                    <i className={`fa-duotone fa-solid fa-xmark text-lg ml-2`} />
                </div>
            )}
            {form.touched[field.name] && form.errors[field.name] ? <div className="text-warning">{form.errors[field.name]?.toString()}</div> : null}
        </div>
    );
};

export default FSelectField;
