import React, {
  HTMLInputTypeAttribute,
  ReactNode,
  useEffect,
  useState,
} from "react";
import BaseInput from "../inputs/baseInput";
import { FieldProps } from "formik";

interface InputProps extends FieldProps {
  value?: unknown;
  pattern?: string;
  label: string;
  type?: HTMLInputTypeAttribute | undefined;
  maxLength?: number | undefined;
  minLength?: number | undefined;
  Length?: number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  hasError?: boolean;
  className?: string;
  baseClassName?: string;
  disabled?: boolean;
  innerRef?: (instance: unknown) => void;
  require?: boolean;
  lang?: string;
}

const FloatingLabelInput: React.FC<InputProps> = ({
  field,
  value,
  form,
  pattern,
  meta,
  label,
  type,
  maxLength,
  minLength,
  Length,
  onChange,
  innerRef,
  icon,
  iconEnd,
  hasError = false,
  className,
  baseClassName,
  disabled,
  require,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState<boolean>();
  //const [val, setVal] = useState(value);

  const handlerchanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value !== "");
    form.setFieldValue(field.name, e.target.value);
    //setVal(e.target.value);
    field.value = value;
    onChange?.(e);
  };

  useEffect(() => {
    form.setFieldValue(field.name, value);
    field.value = value;
    //setVal(value);
  }, [value]);

  return (
    <div className={`relative w-full ${className && className}`}>
      <BaseInput
        field={field}
        //value={val}
        form={form}
        pattern={pattern}
        meta={meta}
        type={type}
        maxLength={Length ? Length : maxLength}
        minLength={Length ? Length : minLength}
        onChange={(e) => {
          handlerchanged(e);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        innerRef={innerRef}
        hasError={hasError}
        icon={icon}
        iconEnd={iconEnd}
        // className={`focus:outline-1/2 focus:outline-secondary w-full rounded-md border px-4 pt-5 pb-1 focus:ring-0 ${
        className={`${baseClassName && baseClassName} focus:outline-1/49 max-h-[54px] w-full rounded-xl border border-gray-300 p-4 px-3 text-lg focus:ring-0 focus:outline-gray-300`}
        disabled={disabled}
      />

      <label
        className={`text-lable pointer-events-none absolute -translate-y-2/4 transform text-xs text-gray-400 transition-all duration-200 ${field.value || hasValue || isFocused || value
          ? "top-[0px] right-[15px] bg-inherit px-2"
          : "top-[50%] text-base"
          } ${icon ? "right-12" : "right-5"}`}
      >
        {label}
        {require ? <span className="text-red-500">*</span> : ""}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
