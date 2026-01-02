import React, { ReactNode, useState } from "react";
import FloatingLabelInput from "../inputs/floatingLabelInput";
// import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FieldProps } from "formik";

interface InputProps extends FieldProps {
  label?: string;
  maxLength?: number | undefined;
  minLength?: number | undefined;
  Length?: number | undefined;
  //onChange?: (value: string) => void;
  icon?: ReactNode;
  hasError?: boolean;
  className?: string;
}

const PasswordInput: React.FC<InputProps> = ({
  field,
  form,
  meta,
  label,
  maxLength,
  minLength,
  Length,
  hasError = false,
}) => {
  const [isShow, setIsShow] = useState(false);

  const handlerShow = () => {
    setIsShow(!isShow);
  };

  return (
    <FloatingLabelInput
      field={field}
      form={form}
      meta={meta}
      label={label ? label : "کلمه عیور"}
      type={isShow ? "text" : "password"}
      maxLength={Length ? Length : maxLength}
      minLength={Length ? Length : minLength}
      //onChange={onChange}
      hasError={hasError}
      icon={<i className={`fa-duotone fa-solid fa-lock text-lg`} />}
      iconEnd={
        <div onClick={handlerShow} className="flex h-full justify-items-center items-center">
          <i className={`fa-duotone fa-solid ${!isShow ? "fa-eye" : "fa-eye-slash"} text-lg`} />
        </div>
      }
    />
  );
};

export default PasswordInput;
