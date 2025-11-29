import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, FieldConfig, FieldProps, getIn } from 'formik';
import { fileURLToPath } from 'url';

interface CustomInputProps extends FieldProps {
    label: string;
    type?: string;
    disabled: boolean;
    rows?: number;
    placeholder?: string;
}

const FTextAreaField: React.FC<CustomInputProps> = ({ label, field, type, form, disabled = false, rows=4, placeholder="", ...other }) => {
    return (
        <div className="mb-5 w-full">
            <fieldset>
                <label htmlFor={field.name} className="text-white-dark">
                    {label}
                </label>
                {!disabled ? (
                    <textarea
                        id={field.name}
                        rows={rows}
                        {...field}
                        className="block w-full form-input"
                        placeholder={placeholder}
                    ></textarea>
                ) : (
                    <div className="form-input bg-white-light pt-3 text-white-dark">{field.value}</div>
                )}

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

export default FTextAreaField;
