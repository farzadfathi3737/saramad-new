import { useTranslation } from 'react-i18next';
//import { IDataModel } from '../../../interface/dataModel';
//import IconCode from '../Icon/IconCode';
//import CodeHighlight from '../Highlight';
//import Select from 'react-select';
//import { useEffect, useState } from 'react';

// interface DFormsProps {
//     options4: string[];
// }

interface IFiled {
    name: string;
    title: string;
    placeholder: string;
    required: boolean;
}

const FInputText: React.FC<IFiled> = ({ }) => {
    const { t } = useTranslation();

    // console.log(filed)

    return (
        <div className="mb-5 w-full">
            <fieldset>
                {/* <label htmlFor="ipMask" className="text-white-dark">
                    {t(filed?.name)}
                </label>
                {filed?.required ? <input type="text" placeholder={filed.placeholder} className="form-input" required /> : <input type="text" placeholder={filed?.placeholder} className="form-input" />} */}
            </fieldset>
        </div>
    );
};

export default FInputText;
