import React, { useEffect, useState } from 'react';
//import PropTypes from 'prop-types';
import { ErrorMessage, Field, FieldConfig, FieldProps, getIn } from 'formik';
import { SketchPicker } from 'react-color';

interface CustomInputProps extends FieldProps {
    label: string;
    type?: string;
}

interface IColorData {
    displayColorPicker: boolean;
    color?: string;
}

const FColorField: React.FC<CustomInputProps> = ({ label, field, type, form, ...other }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
    const [selectedColor, setSelectedColor] = useState<string>(field.value ? field.value : '#fff');

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
    };

    const handleChange = (color: any) => {
        const value = color.hex;
        form.setFieldValue(field.name, value);
        setSelectedColor(value);
    };

    return (
        <div className="mb-5 w-full">
            <fieldset>
                <label htmlFor={field.name} className="text-white-dark">
                    {label}
                </label>
                {/* <input type={type} id={field.name} {...field} className={`form-input bg-[#36030a] bg-[${selectedColor}]`} onClick={ handleClick }/> */}
                <div id={field.name} {...field} className="form-input" onClick={handleClick}>
                    <div className="flex">
                        <div className='w-8 h-8 border rounded-md' style={{ backgroundColor: selectedColor }}></div>
                        <div className='px-5 py-1'>{selectedColor}</div>
                    </div>
                </div>
                {displayColorPicker ? (
                    <div>
                        <div onClick={handleClose} />
                        <SketchPicker color={selectedColor} onChange={handleChange} />
                    </div>
                ) : null}
                {form.touched[field.name] && form.errors[field.name] ? <div className="text-warning">{form.errors[field.name]?.toString()}</div> : null}
            </fieldset>
        </div>

        // <TextField

        //   label={label}
        //   InputLabelProps={field.value && {shrink: true}}
        //   error={hasError}
        //   helperText={hasError ? errorText : ""}
        //   {...(type && {type:type})}
        //   {...field}
        //   {...other}
        // />
    );
};

export default FColorField;
