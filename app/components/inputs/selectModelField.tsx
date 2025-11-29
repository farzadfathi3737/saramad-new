import React, { useEffect, useState } from 'react';
import { FieldProps } from 'formik';
import Select from 'react-select';
import { IListRef, IstaticParam, IOptionType } from '@/interface/dataModel';
import { useTranslation } from 'react-i18next';
import { getEntityModel } from '@/models/entity';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface CustomSelectProps extends FieldProps {
    label: string;
    //listRef?: IListRef;
    listRefName: string;
    placeholder: string;
    isMulti?: boolean;
    isSearchable?: boolean;
    staticParams?: IstaticParam[];
    onChange?: any;
    className?: string;
    value?: any;
}

const FSelectModelField: React.FC<CustomSelectProps> = ({
    field,
    form,
    value,
    listRefName,
    label,
    onChange,
    placeholder = '',
    isMulti = false,
    isSearchable = true,
    staticParams = null,
    className = '',
}) => {
    const { t } = useTranslation();
    const [options, setOptions] = useState<IOptionType[]>([]);
    const [selectedValue, setSelectedValue] = useState<IOptionType | IOptionType[] | undefined>(undefined);
    const [defaultValue, setDefaultValue] = useState<IOptionType | undefined>(undefined);
    //const [value, setValue] = useState<IOptionType | undefined>(undefined);

    const [loading, setLoading] = useState<boolean>(false);
    const [listRef, setListRef] = useState<IListRef>();

    useEffect(() => {
        const getModel = async () => {
            const _model = await getEntityModel(listRefName?.toString().toLowerCase());

            setListRef(_model?.listRef);
        };
        console.log("======++++++", value)
        console.log("======++++++", field.value)
        getModel();
    }, []);

    const fetchData = async () => {
        let filteData: string = '';

        filteData = `pageSize=${10000}&pageNumber=${1}`;

        if (staticParams && listRef?.parameters) {
            //console.log('test', staticParams);
            listRef?.parameters?.map((item) => {
                //console.log('test1', item);
                const val = staticParams?.find((x) => x.name === item.name)?.value;
                if (val) {
                    filteData = filteData + `${filteData != '' ? '&' : ''}${item.name}=${val}`;
                }
            });
        }
        //console.log(staticParams);
        setLoading(true);
        const res = await fetch(`${listRef?.url}${filteData != '' ? `?${filteData}` : ''}`);

        if (res.ok) {
            const result = res && (await res?.json());
            const _options: IOptionType[] = [];

            result.items.map((item: any) => {
                _options.push({ value: item.id, label: item.name });
            });

            if (result.items.length > 0 && field.value == undefined) {
                onChange && onChange({ value: result.items[0].id, label: result.items[0].name });
            }

            setOptions(_options);

            // if (_options.length > 0){ field.value = _options[0].value;}
            // else{
            //     field.value = undefined
            // }

            //form.setFieldValue(field.name, _options.length > 0 ? _options[0]?.value : '');
        } else {
            setOptions([]);
            //form.setFieldValue(field.name, '');
        }

        //selectedValue = undefined;
        setLoading(false);
    };

    useEffect(() => {
        //console.log(listRef, staticParams);
        setSelectedValue([]);
        const getData = async () => {
            await fetchData();

            // field?.value && setSelectedValue(field.value)
        };
        listRef?.url && getData();
    }, [listRef, staticParams]);

    // useEffect(() => {
    //     const getData = async () => {
    //         await fetchData();
    //     };
    //     getData();
    // }, [staticParams]);

    useEffect(() => {
        if (options.length > 0) {
            if (value || field.value) {
                setSelectedValue(options[options.findIndex((x: IOptionType) => x.value == field.value)]);
            } else {
                //setSelectedValue(options[0]);
            }
        } else {
            setSelectedValue([]);
        }
    }, [options]);

    const handleChange = (selectedOption: any) => {
        //console.log(selectedOption);
        onChange && onChange(selectedOption);
        const value = isMulti ? selectedOption.map((option: IOptionType) => option.value) : selectedOption?.value;
        form.setFieldValue(field.name, value);
        field.value = value;
        setSelectedValue(isMulti ? options.filter((option) => (field.value || []).includes(option.value)) : options.find((option) => option.value === field.value));
    };

    const clear = () => {
        form.setFieldValue(field.name, undefined);
        setSelectedValue([]);
        field.value = undefined;
        onChange && onChange(undefined);
    };
    //setSelectedValue(isMulti ? options.filter((option) => (field.value || []).includes(option.value)) : options.find((option) => option.value === field.value));

    return (
        <div className="relative">
            {label && <label className="text-white-dark">{label}</label>}
            {loading && options.length < 1 ? (
                <div className="form-input w-full"></div>
            ) : (
                <>
                    <Select
                        className={`${className}`}
                        id={field.name}
                        name={field.name}
                        value={selectedValue}
                        onChange={(event: any) => {
                            handleChange(event);
                            //onChange && onChange(event);
                        }}
                        options={options}
                        isMulti={isMulti}
                        placeholder={placeholder}
                        isSearchable={isSearchable}
                        //defaultValue={options[0]}
                        menuPosition="absolute"
                        noOptionsMessage={() => t('noOptions')}
                    />
                    {field.value && (
                        <div className="absolute bottom-0 left-8 p-3 text-white-dark" onClick={clear}>
                            {/* <FontAwesomeIcon icon={faXmark} className="ml-2" /> */}
                            <i className="fa-duotone fa-solid fa-xmark text-gray-700 text-lg"></i>
                        </div>
                    )}
                </>
            )}
            {form.touched[field.name] && form.errors[field.name] ? <div className="text-warning">{form.errors[field.name]?.toString()}</div> : null}
        </div>
    );
};

export default FSelectModelField;
