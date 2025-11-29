import { useTranslation } from 'react-i18next';
//import { IDataModel } from '../../interface/dataModel';
//import IconCode from '../Icon/IconCode';
//import CodeHighlight from '../Highlight';
import Select from 'react-select';
import { useState } from 'react';

interface DFormsProps {
    options4: string[];
}

interface Ioption {
    value: string;
    label: string;
}

interface IFiled {
    name: string;
    title: string;
    placeholder: string;
    required: boolean;
}

interface IselectOption {
    options: DFormsProps;
    filed: IFiled;
}

const FSelect: React.FC<IselectOption> = ({ options, filed }) => {
    const { t } = useTranslation();

    const [_options, _setOptions] = useState<Ioption[]>([]);

    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    // useEffect(() => {
    //     options.map((en) => {
    //         _options.push({ value: en, label: en });
    //     });
    // }, []);

    return (
        <div className="mb-5 w-full">
            <fieldset>
                <label htmlFor="ipMask" className="text-white-dark">
                    {t(filed.name.toLowerCase().toString())}
                </label>
                {filed.required ? <Select placeholder={t("Selectanoption")} options={_options} required /> : <Select placeholder={t("Selectanoption")} options={_options} />}
            </fieldset>
        </div>
    );
};

export default FSelect;
