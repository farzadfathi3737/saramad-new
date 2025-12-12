import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, FieldConfig, FieldProps, getIn } from 'formik';
import Select from 'react-select';

interface CustomInputProps extends FieldProps {
    label: string;
    options: DFormsProps;
    type?: string;
}

interface DFormsProps {
    find(arg0: (option: Ioption) => boolean): unknown;
    options: String[];
}

interface Ioption {
    value: String;
    label: String;
}

const FSelectField1: React.FC<CustomInputProps> = ({ label, options, field, form, ...other }) => {
    const handleChange = (selectedOption: any) => {
        const value = selectedOption?.value;
        form.setFieldValue(field.name, value);
    };

    const [_options, _setOptions] = useState<Ioption[]>([]);

    // useEffect(() => {
    //     options.map((en: String) => {
    //         _options.push({ value: en, label: en });
    //     });
    // }, []);


    const selectedValue = _options.find((option: Ioption) => _options.values === field.value);

    return (
        <div className="mb-5 w-full">
            <fieldset>
                <label htmlFor={field.name} className="!text-gray-600">
                    {label}
                </label>
                <Select
                    id={field.name}
                    placeholder="Select an option"
                    options={_options}
                    //value={selectedValue}
                    // onChange={(e, newValue) => {
                    //     field.onChange(field.value ? field.value(newValue) : newValue);
                    // }}
                    {...field}
                    {...other}
                />
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

// FTextField.propTypes = {
//     label: PropTypes.string.isRequired,
//     field: PropTypes.shape({
//         name: PropTypes.string,
//         onChange: PropTypes.func,
//         value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     }).isRequired,
//     form: PropTypes.shape({
//         dirty: PropTypes.bool,
//         errors: PropTypes.object,
//     }).isRequired,
//     fullWidth: PropTypes.bool,
//     margin: PropTypes.oneOf(['none', 'dense', 'normal']),
// };

// FTextField.defaultProps = {
//     fullWidth: true,
//     margin: 'normal',
// };

export default FSelectField1;
