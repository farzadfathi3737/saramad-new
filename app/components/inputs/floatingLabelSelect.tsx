import { FieldProps } from "formik";
import { HTMLInputTypeAttribute, ReactNode, useEffect, useState } from "react";

type IRefContent = {
  id: number;
  name: string;
};

interface InputProps extends FieldProps {
  value: number | string | null;
  label: string;
  type?: HTMLInputTypeAttribute | undefined;
  maxLength?: number | undefined;
  minLength?: number | undefined;
  Length?: number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  hasError?: boolean;
  className?: string;
  disabled?: boolean;
  title: string;
  name: string;
  //setValue?: string | undefined;
  setFieldValue: unknown;
  isLoading: boolean;
  data: [IRefContent];
  defualtValue?: number | string | null;
  require?: boolean;
}

const FloatingLabelSelect: React.FC<InputProps> = ({
  field,
  value,
  form,
  label,
  onChange,
  icon,
  name,
  //setValue,
  isLoading,
  data,
  defualtValue,
  disabled,
  require,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState<boolean>();
  const [val, setVal] = useState(value);

  const handlerchanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const _value = e.target.value;
    form.setFieldValue(
      field.name,
      typeof _value === "number" ? +_value : _value,
    );
    setHasValue(e.target.value !== "");
    setVal(_value);
    field.value = _value;
    if (onChange != null) onChange(e);
  };

  useEffect(() => {
    form.setFieldValue(field.name, value);
    setVal(value);
  }, [value]);

  return (
    <div className={`relative w-full ${className && className}`}>
      {icon && (
        <div className="text-lable-light absolute top-2/4 right-3 flex h-7 w-8 -translate-y-2/4 transform items-center justify-center border-l border-gray-300 pl-2">
          <i className={`fa-duotone fa-solid ${icon.toString()} text-lg ml-2`} />
        </div>
      )}

      <select
        id={name}
        name={name}
        disabled={disabled}
        className={`did-floating-select focus:outline-1/49 max-h-[54px] w-full rounded-xl border border-gray-300 p-4 pt-5 pr-5 pb-1 pl-3 focus:ring-0 focus:outline-gray-300 ${!icon && "pr-4"} ${disabled ? "bg-gray-100 opacity-50" : ""} ${val == "" ? "text-lable" : ""} `}
        //className={`focus:outline-1/49 max-h-[54px] w-full rounded-xl border border-gray-300 p-4 px-3 focus:ring-0 focus:outline-gray-300`}
        onChange={(e) => {
          handlerchanged(e);
          //setValue(e.target.value);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        value={defualtValue ? defualtValue : val !== null ? val : ""}
      >
        {isLoading ? (
          <option disabled>در انتظار دریافت اطلاعات...</option>
        ) : data && data?.length > 0 && !isLoading ? (
          <>
            <option value={val === 0 ? 0 : ""} selected disabled></option>
            {data
              ?.filter((y: IRefContent) =>
                typeof y.id === "number" ? y.id > 0 : y.id,
              )
              ?.map((item: IRefContent) => (
                <option className="font-iransans" value={item.id}>
                  {item.name}
                </option>
              ))}
          </>
        ) : (
          <></>
        )}
      </select>

      <div className="text-lable-left absolute top-2/4 left-3 flex h-8 w-6 -translate-y-2/4 transform items-center justify-center border-gray-300 pr-2">
        <i className={`fa-duotone fa-solid fa-arrow-down text-lg ml-2`} />
      </div>
      {/* <label
        className={`text-lable pointer-events-none absolute top-2/4 right-14 -translate-y-2/4 transform text-xs transition-all duration-200 ${
          field.value || hasValue || isFocused
            ? "top-3 px-1 text-[10px] text-blue-500"
            : "text-base"
        } ${icon ? "right-11" : "right-4"}`}
      >
        {label}
        {` را انتخاب کنید ${require ? `*` : ""}`}
      </label> */}

      <label
        className={`text-lable pointer-events-none absolute -translate-y-2/4 transform text-xs transition-all duration-200 ${field.value || hasValue || isFocused || value
          ? "top-[0px] right-[15px] bg-white px-2"
          : "top-[50%] text-base"
          } ${icon ? "right-12" : "right-5"}`}
      >
        {label}
        {field.value || hasValue || isFocused || value ? "" : ` را انتخاب کنید`}
        {require ? <span className="text-red-500">*</span> : ""}
      </label>
    </div>
  );
};

export default FloatingLabelSelect;
