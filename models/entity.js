//import { schemas } from "../utils/schemas";
//import Models from "../generated/modelToFeild.json";
import Models from "../generated/modelsD.json";
// impocrt ModelsStatic from '../generated/modelsStatic.json';

export const getEntityModel = (name) => {
  if (uiLists[name]) {
    return uiLists[name];
  }
  return undefined;
};

export const makeStateObject = (model) => {
  const entityModel = getEntityModel(model.parent);
  return model.parent
    ? {
        //((model.name == 'country' || model.name == 'province') && console.log(model)),
        ...makeStateObject(entityModel),
        [entityModel.name]: undefined,
      }
    : undefined;
};

export const uiLists = {
  ...Models,
  // ModelsStatic,
  articleelementsvalue: {
    ...Models.articleelementsvalue,
    register: {
      metod: "post",
      url: "/cloud/api/accounting/ArticleElements/Value/{elementId}",
      requestBody: [
        {
          name: "companyId",
          title: "companyId",
          required: true,
          type: "string",
          format: "----",
        },
        { name: "value", title: "value", type: "string", format: "----" },
      ],
      responses: [
        {
          accessorKey: "id",
          header: "id",
          accessor: "id",
          title: "id",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "elementId",
          header: "elementId",
          accessor: "elementId",
          title: "elementId",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "companyId",
          header: "companyId",
          accessor: "companyId",
          title: "companyId",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "value",
          header: "value",
          accessor: "value",
          title: "value",
          sortable: true,
          hidden: false,
        },
      ],
      parameters: [
        {
          name: "elementId",
          in: "path",
          required: true,
          type: "string",
          format: "uuid",
        },
      ],
    },
  },

  rawtransaction: {
    ...Models.rawtransaction,
    list: {
      ...Models.rawtransaction.list,
      responses: [
        {
          accessorKey: "id",
          header: "id",
          accessor: "id",
          title: "id",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "symbol",
          header: "symbol",
          accessor: "symbol",
          title: "نماد",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "brokerCode",
          header: "brokerCode",
          accessor: "brokerCode",
          title: "کد کارگزاری",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "brokerName",
          header: "brokerName",
          accessor: "brokerName",
          title: "نام کارگزار",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "tradingCode",
          header: "tradingCode",
          accessor: "tradingCode",
          title: "کد معاملاتی",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "transactionDate",
          header: "transactionDate",
          accessor: "transactionDate",
          title: "transactionDate",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "ticketNumber",
          header: "ticketNumber",
          accessor: "ticketNumber",
          title: "ترتیب",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "price",
          header: "price",
          accessor: "price",
          title: "قیمت",
          sortable: true,
          hidden: false,
          // Cell: ({ cell }) => <>{cell.getValue()?.toLocaleString('fa-IR')}</>,

          // Footer: (props) => {
          //     const totalpage = props.table.getRowModel().rows.reduce((sum, row) => sum + (row.getValue('price') || 0), 0);
          //     const totalfilter = props.table.getFilteredRowModel().rows.reduce((sum, row) => sum + (row.getValue('price') || 0), 0);
          //     const total = props.table.options.data.reduce((sum, row) => sum + (row.price || 0), 0);

          //     return (
          //         <div className='w-full'>
          //             {(totalfilter != total) && <div className="">{totalfilter.toLocaleString('fa-IR')}</div>}
          //             <div className="text-lg">{total.toLocaleString('fa-IR')}</div>
          //         </div>
          //     );
          // },
        },
        {
          accessorKey: "volume",
          header: "volume",
          accessor: "volume",
          title: "حجم",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "type",
          header: "type",
          accessor: "type",
          title: "نوع عملیات",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "isEdited",
          header: "isEdited",
          accessor: "isEdited",
          title: "ویرایش شده",
          sortable: true,
          hidden: false,
        },
      ],
    },
  },

  vouchertemplates: {
    ...Models.vouchertemplates,
    list: {
      ...Models.vouchertemplates.list,
      responses: [
        {
          accessorKey: "id",
          header: "id",
          accessor: "id",
          title: "id",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "name",
          header: "name",
          accessor: "name",
          title: "name",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "isTemplate",
          header: "isTemplate",
          accessor: "isTemplate",
          title: "isTemplate",
          sortable: true,
          hidden: false,
        },
        {
          accessorKey: "isSystem",
          header: "isSystem",
          accessor: "isSystem",
          title: "isSystem",
          sortable: true,
          hidden: false,
        },
      ],
    },
    // listRef: {
    //     metod: "get",
    //     url: "/cloud/api/accounting/VoucherTemplates/ref",
    //     responses: [
    //         { "accessorKey": "id", "header": "id", "accessor": "id", "title": "id", "sortable": true, "hidden": false },
    //         { "accessorKey": "name", "header": "name", "accessor": "name", "title": "name", "sortable": true, "hidden": false }
    //     ],
    //     parameters: [
    //         { "name": "CompanyId", "in": "query", "required": true, "type": "string", "format": "uuid" },
    //         { "name": "Keyword", "in": "query", "type": "string" },
    //         { "name": "PageSize", "in": "query", "type": "integer", "format": "int32" },
    //         { "name": "PageNumber", "in": "query", "type": "integer", "format": "int32" }
    //     ]
    // }
  },

  // Company: {
  //     ...Models['Company'],
  //     haveAction: true,
  //     // fieldsTable: [...Models['Report/BuySell'].fieldsTable,
  //     // { accessor: 'action', title: 'تست', sortable: true, hidden: false }],
  // },
  //just for test

  // commonProfile: {
  //   name: "commonProfile",
  //   req: schemas.portalSchema.PersonSimpleProfile,
  //   // req: {
  //   //   ...schemas.portalSchema.PersonSimpleProfile,
  //   //   map: { type: "string" },
  //   // },
  //   //res: schemas.portalSchema.UserResponse,
  //   //search: schemas.portalSchema.UserSearchFilter,
  //   urls: {
  //     list: "/authenticate/common-profile",
  //     load: "/authenticate/common-profile"
  //   },
  //   micro: "portal-service",
  // },
};
