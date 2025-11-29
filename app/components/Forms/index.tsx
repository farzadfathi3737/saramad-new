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
                onSubmit={(values) => {
                    //console.log('ok', values);
                    onClick(values);
                    //alert(JSON.stringify(values, null, 2));
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
                                                <Field id={item.name} name={item.name} label={t(_header ? _header : item.name.toLowerCase().toString())} component={FCheckboxField} />
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
                            <button type="button" onClick={() => setModal(false)} className="btn btn-outline-[#2D9AA0] rounded-xl font-iranyekan">
                                {t(cancelBtnText)}
                            </button>
                        )}

                        {sucsesBtnText && (
                            <button type="submit" className="btn btn-outline px-15 mr-3 flex items-center rounded-xl bg-[#2D9AA0] font-iranyekan text-[#fff]">
                                {/* <IconPencil className="ltr:mr-1 rtl:ml-1 rtl:rotate-180" /> */}
                                {t(sucsesBtnText)}
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
