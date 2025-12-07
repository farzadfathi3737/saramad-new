import { FieldProps } from "formik";
import React, {
  FocusEventHandler,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
  ReactNode,
  useEffect,
  useState,
} from "react";

interface InputProps extends FieldProps {
  value: string;
  pattern?: string;
  regExp?: RegExp;
  id?: string | undefined;
  type?: HTMLInputTypeAttribute | undefined;
  maxLength?: number | undefined;
  minLength?: number | undefined;
  Length?: number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: KeyboardEventHandler | undefined;
  onFocus?: FocusEventHandler | undefined;
  onBlur?: FocusEventHandler | undefined;
  innerRef?: (instance: any) => void;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  hasError?: boolean;
  errorMessage?: string | undefined;
  other?: any;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const BaseInput: React.FC<InputProps> = ({
  field,
  value,
  pattern,
  regExp,
  form,
  meta,
  type,
  maxLength,
  minLength,
  Length,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  innerRef,
  icon,
  iconEnd,
  hasError = false,
  errorMessage = undefined,
  className,
  placeholder,
  disabled,
  ...other
}) => {
  const [val, setVal] = useState<string | undefined>(field.value);

  // const handlerchanged = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // setVal(e.target.value);
  //   // onChange && onChange(e);
  //   // field.value = field.value;
  // };


  return (
    <>
      <div className="relative w-full h-[48px]">
        {icon && (
          <div className="flex items-center justify-center absolute right-3 top-2/4 transform -translate-y-2/4 text-lable-light border-l h-7 border-gray-300 pl-2 w-8">
            {icon}
          </div>
        )}

        <input
          id={field.name}
          maxLength={Length ? Length : maxLength}
          minLength={Length ? Length : minLength}
          type={type}
          pattern={pattern}
          // value={field.value}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          //onBlur={onBlur}
          ref={innerRef}
          className={`
          ${className
              ? className
              : "w-full h-full px-4 pt-3 pb-3 text-right rounded-md border focus:outline-1/2 focus:outline-secondary focus:ring-0"
            }
          ${form.touched[field.name] && form.errors[field.name]
              ? "border-danger focus:ring-danger-light"
              : "border-gray-300 focus:ring-blue-300"
            }
          ${icon ? "pr-14" : ""}
          ${iconEnd ? "pl-14" : ""}
          ${disabled && " bg-gray-100 opacity-50 "}
          `}
          placeholder={placeholder ? placeholder : ""}
          disabled={disabled}
          {...field}
          value={field.value ?? val}

          onChange={(e) => {
            pattern
              ? setVal((prev) =>
                e.target.validity.valid ? e.target.value : prev
              )
              : setVal(e.target.value);
            // if (pattern){
            //   e.target.value = e.target.value.replace(pattern, '');
            //   setVal(e.target.value.replace(pattern, ''));
            // }
            // const target = e.target as HTMLInputElement;
            // target.value = target.value.replace(pattern ?? "", "");
            // setVal(target.value);
            onChange?.(e);
          }}
          {...other}
        />

        {iconEnd && (
          <div className="flex items-center justify-center absolute left-3 top-2/4 transform -translate-y-2/4 text-lable-light border-r h-7 border-gray-300 pr-2 w-8">
            {iconEnd}
          </div>
        )}
      </div>
      {form.touched[field.name] && (
        <label
          className={`w-full text-xs text-danger mt-3 ${!form.values[field.name] ? " block " : " none "
            }`}
        >
          {form.errors[field.name]?.toString()}
        </label>
      )}
    </>
  );
};

export default BaseInput;
