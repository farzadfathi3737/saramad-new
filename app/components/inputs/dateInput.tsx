import React, {
  FocusEventHandler,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
  ReactNode
} from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FieldProps } from "formik";

interface InputProps extends FieldProps {
  id?: string | undefined;
  type?: HTMLInputTypeAttribute | undefined;
  // maxLength?: number | undefined;
  // minLength?: number | undefined;
  // Length?: number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: KeyboardEventHandler | undefined;
  onFocus?: FocusEventHandler | undefined;
  onBlur?: FocusEventHandler | undefined;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  hasError?: boolean;
  errorMessage?: string | undefined;
  other?: any;
  className?: string;
}

const DateInput: React.FC<InputProps> = ({
  field,
  form,
  // maxLength,
  // minLength,
  // Length,
  onKeyDown,
  onFocus,
  onBlur,
  icon,
  iconEnd,
  errorMessage = undefined,
  other,
  className,
}) => {
  // const [val, setVal] = useState<string | undefined>();

  // const handlerchanged = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setVal(e.target.value);
  //   onChange && onChange(e);
  //   // value = value;
  // };

  return (
    <div className="relative w-full h-[48px]">
      {icon && (
        <div className="flex items-center absolute right-3 top-2/4 transform -translate-y-2/4 text-lable-light border-l h-7 border-gray-300 pl-2 ">
          {icon}
        </div>
      )}
      <DatePicker
        //portal
        calendar={persian}
        locale={persian_fa}
        render={
          <input
            id={field.name}
            //maxLength={Length ? Length : maxLength}
            //minLength={Length ? Length : minLength}
            maxLength={10}
            minLength={10}
            type="text"
            //value={val}
            //onChange={handlerchanged}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            className={`
          ${
            className
              ? className
              : "w-full px-4 pt-3 pb-3 text-right rounded-md border focus:outline-1/2 focus:outline-secondary focus:ring-0"
          }
          ${
            form.errors[field.name]
              ? "border-danger focus:ring-danger-light"
              : "border-gray-300 focus:ring-blue-300"
          }
          ${icon ? "pr-14" : ""}
          ${iconEnd ? "pl-14" : ""}
          `}
            placeholder=" "
            {...other}
          />
        }
      />
      {iconEnd && (
        <div className="flex items-center absolute left-3 top-2/4 transform -translate-y-2/4 text-lable-light border-r h-7 border-gray-300 pr-2 ">
          {iconEnd}
        </div>
      )}

      {form.touched[field.name] && (
        <label className="w-full text-xs text-danger my-2">{errorMessage}</label>
      )}
    </div>
  );
};

export default DateInput;

// import React, { FocusEventHandler, HTMLInputTypeAttribute, KeyboardEventHandler, ReactNode, useState } from "react";
// import DatePicker from 'react-multi-date-picker';
// import persian from 'react-date-object/calendars/persian';
// import persian_fa from 'react-date-object/locales/persian_fa';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import BaseInput from "./baseInput";

// interface InputProps<T> {
//   id?: string | undefined;
//   name?: string | undefined;
//   value?: string;
//   type?: HTMLInputTypeAttribute | undefined;
//   maxLength?: number | undefined;
//   minLength?: number | undefined;
//   Length?: number | undefined;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onKeyDown?: KeyboardEventHandler<T> | undefined;
//   onFocus?: FocusEventHandler<T> | undefined;
//   onBlur?: FocusEventHandler<T> | undefined;
//   icon?: ReactNode;
//   iconEnd?: ReactNode;
//   hasError?: boolean;
//   errorMessage?: string | undefined;
//   other?: any;
//   className?: string;
// }

// const DateInput: React.FC<InputProps<HTMLInputElement>> = ({
//   id,
//   name,
//   value,
//   type,
//   maxLength,
//   minLength,
//   Length,
//   onChange,
//   onKeyDown,
//   onFocus,
//   onBlur,
//   icon,
//   iconEnd,
//   hasError = false,
//   errorMessage = undefined,
//   other,
//   className
// }) => {
//   const [val, setVal] = useState<string | undefined>(value);

//   const handlerchanged = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setVal(e.target.value);
//     onChange && onChange(e);
//     value = value;
//   }

//   return (
//     <div className="relative w-full h-[48px]">

//       {icon && (
//         <div className="flex items-center absolute right-3 top-2/4 transform -translate-y-2/4 text-lable-light border-l h-7 border-gray-300 pl-2 ">
//           {icon}
//         </div>
//       )}

//       <DatePicker
//       render={<input
//         id={id}
//         maxLength={Length ? Length : maxLength}
//         minLength={Length ? Length : minLength}
//         type={type}
//         value={val}
//         onChange={handlerchanged}
//         onKeyDown={onKeyDown}
//         onFocus={onFocus}
//         onBlur={onBlur}
//         className={`
//           ${className ? className : 'w-full px-4 pt-3 pb-3 text-right rounded-md border focus:outline-1/2 focus:outline-secondary focus:ring-0'}
//           ${hasError
//             ? "border-danger focus:ring-danger-light"
//             : "border-gray-300 focus:ring-blue-300"
//           }
//           ${icon ? "pr-14" : ""}
//           ${iconEnd ? "pl-14" : ""}
//           `
//         }
//         placeholder=" "
//         {...other}
//       />}
//         // id={name}
//         // render={<BaseInput/>}
//         // //inputClass="w-full px-4 pt-5 pb-1 text-right rounded-md border focus:outline-1/2 focus:outline-secondary focus:ring-0"
//         // value={value}
//         // name={name}
//         // onPropsChange={(props) => console.log(props)}
//         // onPositionChange={data => console.log(data)}
//         // onChange={(date, options) => {
//         //   //options.input.onfocus(onFocus)
//         //   //form.setFieldValue(field.name, date?.year + '/' + date?.month.toString().padStart(2, "0") + '/' + date?.day.toString().padStart(2, "0"), false);
//         //   console.log(date?.isValid, options);
//         // }}
//         // // onFocusedDateChange={(dateFocused, dateClicked) => {

//         // //   console.log(dateFocused?.day, dateClicked?.day);
//         // // }}

//         portal
//         calendar={persian}
//         locale={persian_fa}
//         // inputClass={`
//         //   ${className ? className : 'w-full px-4 pt-3 pb-3 text-left rounded-md border focus:outline-1/2 focus:outline-secondary focus:ring-0'}
//         //   ${hasError
//         //     ? "border-danger focus:ring-danger-light"
//         //     : "border-gray-300 focus:ring-blue-300"
//         //   }
//         //   ${icon ? "pr-14" : ""}
//         //   ${iconEnd ? "pl-14" : ""}
//         //   `
//         // }
//       />

//       {iconEnd &&
//         (
//           <div className="flex items-center absolute left-3 top-2/4 transform -translate-y-2/4 text-lable-light border-r h-7 border-gray-300 pr-2 ">
//             {iconEnd}
//           </div>
//         )}

//       {hasError &&
//         <label className="w-full text-xs text-danger">
//           {errorMessage}
//         </label>
//       }
//     </div>
//   );
// };

// export default DateInput;

// // import React, { HTMLInputTypeAttribute, ReactNode, useState } from "react";
// // import BaseInput from "./baseInput";
// // import { faCalendar } from "@fortawesome/free-solid-svg-icons";
// // import DatePicker from 'react-multi-date-picker';
// // import persian from 'react-date-object/calendars/persian';
// // import persian_fa from 'react-date-object/locales/persian_fa';

// // interface InputProps {
// //   label: string;
// //   name: string;
// //   value?: string;
// //   type?: HTMLInputTypeAttribute | undefined;
// //   maxLength?: number | undefined;
// //   minLength?: number | undefined;
// //   Length?: number | undefined;
// //   onChange?: (value: string) => void;
// //   icon?: ReactNode;
// //   iconEnd?: ReactNode;
// //   hasError?: boolean;
// //   className?: string;
// // }

// // const DateInput: React.FC<InputProps> = ({
// //   label,
// //   name,
// //   value,
// //   type,
// //   maxLength,
// //   minLength,
// //   Length,
// //   onChange,
// //   icon,
// //   iconEnd,
// //   hasError = false,
// //   className
// // }) => {

// //   const [isFocused, setIsFocused] = useState(false);

// //   return (

// //     <div className={`relative w-full ${className}`}>

// //       <DatePicker
// //         id={name}
// //         inputClass="w-full px-4 pt-5 pb-1 text-right rounded-md border focus:outline-1/2 focus:outline-secondary focus:ring-0"
// //         value={value}
// //         name={name}
// //         onChange={(date) => {
// //           //form.setFieldValue(field.name, date?.year + '/' + date?.month.toString().padStart(2, "0") + '/' + date?.day.toString().padStart(2, "0"), false);
// //           //console.log(date);
// //         }}
// //         style={{ fontFamily: 'iranyekan', width: "100%" }}
// //         calendar={persian}
// //         locale={persian_fa}
// //       />

// //       {/* <BaseInput
// //         value={value}
// //         type={type}
// //         maxLength={Length ? Length : maxLength}
// //         minLength={Length ? Length : minLength}
// //         onChange={onChange}
// //         onFocus={() => { setIsFocused(true) }}
// //         onBlur={() => { setIsFocused(false) }}
// //         hasError={hasError}
// //         icon={icon}
// //         iconEnd={iconEnd}
// //         className={'w-full px-4 pt-5 pb-1 text-right rounded-md border focus:outline-1/2 focus:outline-secondary focus:ring-0'}
// //       /> */}

// //       <label
// //         className={`absolute right-14 top-2/4 transform -translate-y-2/4 text-lable transition-all duration-200 pointer-events-none
// //          ${value || isFocused
// //             ? "top-3 right-11 text-[10px] text-blue-500 px-1"
// //             : "text-base"
// //           }`}
// //       >
// //         {label ? label : "تاریخ"}
// //       </label>
// //     </div>
// //   );
// // };

// // export default DateInput;
