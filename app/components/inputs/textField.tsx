import React from 'react';
import { FieldProps } from 'formik';

interface CustomInputProps extends FieldProps {
    label: string;
    type?: string;
    disabled: boolean;
}

const FTextField: React.FC<CustomInputProps> = ({ label, field, type, form, disabled = false, ...other }) => {
    return (
        <div className="mb-5 w-full">
            <fieldset>
                <label htmlFor={field.name} className="text-white-dark">
                    {label}
                </label>
                {!disabled ? (
                    <input
                        defaultValue={field.value}
                        type={type}
                        id={field.name}
                        {...field}
                        {...other}
                        className="form-input" />
                ) : (
                    <div className="form-input bg-white text-gray-800 pt-3" >{field.value}</div>
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

export default FTextField;
