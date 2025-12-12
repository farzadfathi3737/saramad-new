import React, { ReactElement, ReactNode } from 'react';

export interface IDataModel {
    name: string;
    uniqueCols?: [object];
    haveAction?: boolean;
    headerController?: ReactNode | Element | object | any;
    list?: IList;
    listRef?: IListRef;
    register?: IRegister;
    default?: IRegister;
    read?: IRead;
    update?: IUpdate;
    delete?: IDelete
    fieldsTable: IFieldsTable[];
    filter: IFilter;
    urls: IUrls;
    accessorKey: string;
}

export interface IList {
    metod: string;
    url: string;
    responses: IFieldsTable[];
    parameters: IParameter[];
}

export interface IDelete {
    metod: string;
    url: string;
    responses: IFieldsTable[];
    parameters: IParameter[];
}

export interface IListRef {
    metod: string;
    url: string;
    responses: IFieldsTable[];
    parameters: IParameter[];
}

export interface IRegister {
    metod: string;
    url: string;
    responses: IFieldsTable[];
    requestBody: IParameter[];
    parameters: IParameter[];
}

export interface IRead {
    metod: string;
    url: string;
    responses: IFieldsTable[];
}

export interface IUpdate {
    metod: string;
    url: string;
    responses: IFieldsTable[];
    requestBody: IParameter[];
}

export interface IFieldsTable {
    accessor: string;
    title: string;
    sortable: boolean;
    hidden: boolean;
    ordering: number;
    render?: any;
    Cell?: ({ cell }: { cell: any }) => React.JSX.Element;
}

export interface IFieldsFilter {
    name: string;
    type: string;
}

export interface IFilter {
    fieldsFilter: [IFieldsFilter];
    data: object;
}

export interface IUrls {
    list: string;
}

export interface InitialState {
    company: {
        id: string;
        name: string;
        backgroundColor: string;
        textColor: string;
    };
    fiscalYear: {
        id: string;
        name: string;
        beginDate?: string;
        endDate?: string;
    };
    tabs: ITabData[];
    activeTab?: string;
}

export interface IstaticParam {
    name: string;
    value: string;
}

export interface ICompanyParam {
    name: string;
    id: string;
    backgroundColor: string,
    textColor: string
}


export interface IParameter {
    enums: any;
    name: string;
    format: string;
    in: string;
    required: boolean;
    schema: string;
    type: string;
}

export interface IOptionType {
    value: string;
    label: string;
}

export interface IFilterData {
    PageNumber: number;
    PageSize: number;
    SortBy: string[];
}

export interface DatatableProps {
    model: IDataModel;
    loadingDataInit?: boolean;
    isPagination?: boolean;
    isRtl?: boolean;
    isShowHideCol?: boolean;
    defaulthidenCol?: string[];
    showHideColList?: IFieldsTable[];
    staticParams?: IstaticParam[];
    hideColList?: string[];
    labaleNameList?: IOptionType[];
    changeColumnName?: IOptionType[];
    addSepratorFildes?: string[];
    addLinkFildes?: string[];
    addFooterSumFildes?: string[];
    //action?: (rowId: any, table?: MRT_TableInstance<any>) => ReactElement<any, string | import('react').JSXElementConstructor<any>>;
    action?: (rowId: any) => ReactElement<any, string | import('react').JSXElementConstructor<any>>;
    //detailPanel?: (rowId: any, table?: MRT_TableInstance<any>) => ReactElement<any, string | import('react').JSXElementConstructor<any>>;
    detailPanel?: (rowId: any) => ReactElement<any, string | import('react').JSXElementConstructor<any>>;
    headerAction?: ReactElement<any, string | import('react').JSXElementConstructor<any>>;
    isEditable?: boolean;
    isDeleteable?: boolean;
}

export interface ITabFilters {
    search?: string;
    category?: string;
    [key: string]: string | undefined;
}

export interface ITabData {
    id: string;
    key: string;
    name: string;
    title: string;
    orther: number;
    filters?: IKeyValue[] | ITabFilters;
    params?: IKeyValue[] | ITabFilters;
}

export interface IAuth {
    username: string;
    password: string;
}

export interface IKeyValue {
    key: string;
    value: string;
}