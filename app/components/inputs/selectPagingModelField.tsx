import React, { useEffect, useState } from 'react';
import { FieldProps } from 'formik';
import Select from 'react-select';
import { IListRef, IstaticParam, IOptionType } from '@/interface/dataModel';
import { getEntityModel } from '@/models/entity';
import { useLanguage } from '@/contexts/LanguageContext';

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

const FSelectPagingModelField: React.FC<CustomSelectProps> = ({
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
    const { t } = useLanguage();
    const [options, setOptions] = useState<IOptionType[]>([]);
    const [selectedValue, setSelectedValue] = useState<IOptionType | IOptionType[] | undefined>(undefined);
    const [defaultValue, setDefaultValue] = useState<IOptionType | undefined>(undefined);
    //const [value, setValue] = useState<IOptionType | undefined>(undefined);

    const [loading, setLoading] = useState<boolean>(false);
    const [listRef, setListRef] = useState<IListRef>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const getModel = async () => {
            const _model = await getEntityModel(listRefName?.toString().toLowerCase());

            setListRef(_model?.listRef);
        };
        // console.log("======++++++", value)
        // console.log("======++++++", field.value)
        getModel();
    }, []);

    const fetchData = async (page: number = 1, search: string = '', append: boolean = false) => {
        // اگر در حال append است و hasMore false است، fetch نکن
        if (append && !hasMore) {
            return;
        }

        let filteData: string = '';

        filteData = `pageSize=${20}&pageNumber=${page}`;

        if (search) {
            filteData += `&Keyword=${encodeURIComponent(search)}`;
        }

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

            if (result.items.length > 0 && field.value == undefined && page === 1 && !search) {
                onChange && onChange({ value: result.items[0].id, label: result.items[0].name });
            }

            if (append) {
                setOptions(prev => [...prev, ..._options]);
            } else {
                setOptions(_options);
            }

            // بررسی اینکه آیا داده بیشتری وجود دارد
            setHasMore(result.items.length === 20);

            // if (_options.length > 0){ field.value = _options[0].value;}
            // else{
            //     field.value = undefined
            // }

            //form.setFieldValue(field.name, _options.length > 0 ? _options[0]?.value : '');
        } else {
            if (!append) {
                setOptions([]);
            }
            setHasMore(false);
            //form.setFieldValue(field.name, '');
        }

        //selectedValue = undefined;
        setLoading(false);
    };

    useEffect(() => {
        //console.log(listRef, staticParams);
        const getData = async () => {
            setPageNumber(1);
            setSearchTerm('');
            await fetchData(1, '');

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
                const foundOption = options.find((x: IOptionType) => x.value == field.value);
                setSelectedValue(foundOption);
            } else {
                //setSelectedValue(options[0]);
            }
        } else {
            setSelectedValue(undefined);
        }
    }, [options, field.value]);

    const handleChange = (selectedOption: any) => {
        //console.log(selectedOption);
        const value = isMulti ? selectedOption.map((option: IOptionType) => option.value) : selectedOption?.value;
        form.setFieldValue(field.name, value);
        onChange && onChange(selectedOption);
    };

    const clear = () => {
        form.setFieldValue(field.name, undefined);
        onChange && onChange(undefined);
    };

    const handleMenuScrollToBottom = () => {
        if (hasMore && !loading) {
            const nextPage = pageNumber + 1;
            setPageNumber(nextPage);
            fetchData(nextPage, searchTerm, true);
        }
    };

    const handleInputChange = (newInputValue: string, actionMeta: any) => {
        // فقط برای input-change واکنش نشان بده، نه برای menu-close یا set-value
        if (actionMeta.action !== 'input-change') {
            return;
        }

        setInputValue(newInputValue);

        // پاک کردن timer قبلی
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // ایجاد timer جدید با debounce 500ms
        const timer = setTimeout(() => {
            setSearchTerm(newInputValue);
            setPageNumber(1);
            setHasMore(true);
            fetchData(1, newInputValue, false);
        }, 500);

        setDebounceTimer(timer);
    };

    //setSelectedValue(isMulti ? options.filter((option) => (field.value || []).includes(option.value)) : options.find((option) => option.value === field.value));

    return (
        <div className="relative">
            {label && <label className="!text-gray-600">{label}</label>}
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
                        onMenuScrollToBottom={handleMenuScrollToBottom}
                        onInputChange={handleInputChange}
                        options={options}
                        isMulti={isMulti}
                        placeholder={placeholder}
                        isSearchable={isSearchable}
                        isLoading={loading}
                        //defaultValue={options[0]}
                        menuPosition="absolute"
                        noOptionsMessage={() => t('noOptions')}
                    />
                    {field.value && (
                        <div className="absolute bottom-0 left-8 p-3 !text-gray-600 flex items-center h-[48px]" onClick={clear}>

                            <i className="fa-duotone fa-solid fa-xmark text-gray-700 text-lg"></i>

                        </div>
                    )}
                </>
            )}
            {form.touched[field.name] && form.errors[field.name] ? <div className="text-warning">{form.errors[field.name]?.toString()}</div> : null}
        </div>
    );
};

export default FSelectPagingModelField;
