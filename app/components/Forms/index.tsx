import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { IDataModel, IOptionType, IParameter, IstaticParam } from '../../../interface/dataModel';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import FTextField from '../inputs/textField';
//import * as Yup from 'yup';
import FSelectField from '../inputs/selectField';
import FDateField from '../inputs/dateField';
import FSelectModelField from '../inputs/selectModelField';
import FCheckboxField from '../inputs/checkboxField';
import FswitchField from '../inputs/switchField';
import { useState } from 'react';

interface DFormsProps {
    model: IDataModel | undefined;
    parameter: IParameter[] | undefined;
    filedNotShow: string[];
    onClick: (data: any) => void;
    setModal: (data: boolean) => void;
    sucsesBtnText: string;
    cancelBtnText: string;
    staticParams?: IstaticParam[] | null;
    labaleNameList?: IOptionType[];
    initialValues?: any | {};
}

const DForms: React.FC<DFormsProps> = ({
    model = undefined,
    parameter,
    initialValues,
    filedNotShow = [],
    onClick,
    setModal,
    sucsesBtnText,
    cancelBtnText,
    staticParams = null,
    labaleNameList = [],
}) => {
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // useEffect(() => {
    // console.log('>>>>>>', labaleNameList);
    // }, []);

    // const SignupSchema = Yup.object().shape({
    //     name: Yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required('Required'),
    //     email: Yup.string().email('Invalid email').required('Required'),
    // });

    return (
        <div className="">
            <Formik
                initialValues={{}}
                //validationSchema={SignupSchema}
                onSubmit={async (values) => {
                    setIsSubmitting(true);
                    try {
                        await onClick(values);
                    } finally {
                        setIsSubmitting(false);
                    }
                }}
            >
                <Form>
                    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
                        {parameter?.map((item) => {
                            if (!filedNotShow.includes(item.name)) {
                                const _header = labaleNameList.find((x) => x.label == item.name)?.value;

                                //console.log('>>>>>>', _header, item.name);
                                switch (item?.type) {
                                    case 'string':
                                    case 'integer':
                                        switch (item?.format) {
                                            case 'enum':
                                                return (
                                                    <div className="w-full" key={item.name.toString()}>
                                                        <Field
                                                            id={item.name}
                                                            name={item.name}
                                                            type="text"
                                                            label={t(_header ? _header : item.name.toLowerCase().toString())}
                                                            options={item.enums.map((item: string) => {
                                                                return { value: item, label: t(item.toLowerCase()) };
                                                            })}
                                                            component={FSelectField}
                                                        />
                                                    </div>
                                                );
                                            case 'uuid':
                                                return (
                                                    <div className="w-full" key={item.name.toString()}>
                                                        <Field
                                                            id={item.name}
                                                            name={item.name}
                                                            listRefName={item.name.replace('Id', '').toLowerCase()}
                                                            staticParams={staticParams}
                                                            type="text"
                                                            label={t(_header ? _header : item.name.toLowerCase().toString())}
                                                            component={FSelectModelField}
                                                        />
                                                    </div>
                                                );
                                            case 'date':
                                                return (
                                                    <div className="w-full" key={item.name.toString()}>
                                                        <Field id={item.name} name={item.name} label={t(_header ? _header : item.name.toLowerCase().toString())} component={FDateField} />
                                                    </div>
                                                );
                                            default:
                                                if (item.name == 'Keyword') {
                                                    return (
                                                        <div className="w-full" key={item.name.toString()}>
                                                            <Field id={item.name} name={item.name} label={t(_header ? _header : item.name.toLowerCase().toString())} component={FTextField} />
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div className="w-full" key={item.name.toString()}>
                                                            <Field id={item.name} name={item.name} label={t(_header ? _header : item.name.toLowerCase().toString())} component={FTextField} />
                                                        </div>
                                                    );
                                                }
                                        }
                                    case 'boolean':
                                        return (
                                            <div className="w-full" key={item.name.toString()}>
                                                <Field id={item.name} name={item.name} label={t(_header ? _header : item.name.toLowerCase().toString())} component={FswitchField} />
                                            </div>
                                        );
                                }
                            }

                            // if (!filedNotShow.includes(item.name) && item.enums) {
                            //     return (
                            //         <div key={item.name.toString()}>
                            //             <Field
                            //                 id={item.name}
                            //                 name={item.name}
                            //                 type="text"
                            //                 label={t(item.name.toLowerCase().toString())}
                            //                 options={item.enums.map((item: string) => {
                            //                     return { value: item, label: t(item.toLowerCase()) };
                            //                 })}
                            //                 component={FSelectField}
                            //             />
                            //         </div>
                            //     );
                            // } else {
                            //     if (!filedNotShow.includes(item.name)) {
                            //         return (
                            //             <div key={item.name.toString()}>
                            //                 <Field id={item.name} name={item.name} label={t(item.name.toLowerCase().toString())} component={FTextField} />
                            //             </div>
                            //         );
                            //     }
                            // }
                        })}
                    </div>
                    <div className="mt-8 flex items-center justify-end">
                        {cancelBtnText && (
                            <button type="button" onClick={() => setModal(false)} disabled={isSubmitting} className="btn btn-outline-[#2D9AA0] rounded-lg font-iranyekan disabled:opacity-50 disabled:cursor-not-allowed">
                                {t(cancelBtnText)}
                            </button>
                        )}

                        {sucsesBtnText && (
                            <button type="submit" disabled={isSubmitting} className="btn btn-outline px-15 mr-3 flex items-center justify-center gap-2 rounded-lg bg-[#2D9AA0] font-iranyekan text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('loading')}
                                    </>
                                ) : (
                                    t(sucsesBtnText)
                                )}
                            </button>
                        )}
                    </div>
                </Form>
            </Formik>

            {/* {model?.list?.parameters?.map((item) => {
                if (!filedNotShow.includes(item.name) && item.enums) {
                    return (
                        <div key={item.name}>
                            <FSelect options={item?.enums} filed={item} />
                        </div>
                    );
                } else {
                    if (!filedNotShow.includes(item.name)) {
                        return (
                            <div key={item.name}>
                                <FInputText filed={item} />
                            </div>
                        );
                    }
                }
            })} */}
        </div>
    );
};

export default DForms;
