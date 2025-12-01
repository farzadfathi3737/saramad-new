import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';

import { useEffect, useMemo, useState, Ref, useImperativeHandle, Fragment } from 'react';
import {
    MantineReactTable,
    MRT_GroupColumnDef,
    MRT_PaginationState,
    MRT_RowSelectionState,
    MRT_TablePagination,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';
import { MRT_Localization_FA } from '../../../locales/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { DatatableProps, IDataModel, IstaticParam } from '../../../interface/dataModel';
import { ActionIcon, Box, Flex, Tooltip } from '@mantine/core';
import { IconCaretDown, IconRefresh, IconSearch } from '@tabler/icons-react';
import AnimateHeight from 'react-animate-height';
import { Dialog, Transition } from '@headlessui/react';

import { ColoredToast } from '../Notifications/colorNotification';
import DForms from '../Forms';

import { apiFetch } from '@/lib/apiFetch';
import { useSubPage } from '../Notifications/useSubPage';

interface GroupColumn {
    header: string;
    columnsName: string[];
    bodyClassName?: string;
    groupHeaderClassName?: string;
    headerClassName?: string;
    footerClassName?: string;
}

interface CostomMRT extends DatatableProps {
    myRef?: Ref<any> | undefined;
    isShowSearchForm?: boolean;
    enableRowSelection?: boolean;
    enableMultiRowSelection?: boolean;
    enableStickyFooter?: boolean;
    enableStickyHeader?: boolean;
    mantineTableBodyRowBackgroundColor?: string | undefined;
    mantineTableBodyRowBackgroundColorChangeByField?: string | undefined;
    groupColumn?: GroupColumn[] | undefined;
    manualPagination?: boolean;
}

const MRT_DataTable: React.FC<CostomMRT> = ({
    model,
    staticParams = null,
    isShowSearchForm = true,
    loadingDataInit = true,
    hideColList = ['id'],
    labaleNameList = [],
    changeColumnName = [],
    addSepratorFildes = [],
    addLinkFildes = [],
    addFooterSumFildes = [],
    action = null,
    detailPanel = undefined,
    headerAction = null,
    isEditable = true,
    isDeleteable = true,
    myRef = undefined,
    enableRowSelection = false,
    enableMultiRowSelection = true,
    enableStickyFooter = false,
    groupColumn = null,
    manualPagination = false,
    mantineTableBodyRowBackgroundColor,
    mantineTableBodyRowBackgroundColorChangeByField,
}) => {
    const { t } = useLanguage();
    const subPage = useSubPage();
    const [columns, setColumns] = useState(useMemo(() => model?.list?.responses.filter((f) => !hideColList.includes(f?.accessor)) as unknown as MRT_ColumnDef<any[0]>[], [hideColList, model?.list?.responses]));
    // const [cols, setCols] = useState<IFieldsTable[] | undefined>(model?.list?.responses.filter((f) => !hideColList.includes(f.accessor)));
    const [initialRecords, setInitialRecords] = useState({ pageNumber: 1, numberOfElements: 10, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
    const [filedNotShow, setFiledNotShow] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [, setIsDeleting] = useState(false);
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [filterdata, setFilterdata] = useState<Record<string, any>>({});
    const [active2, setActive2] = useState<string>('0');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentRowId, setCurrentRowId] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const [currentModel, setCurrentModel] = useState<IDataModel>();
    const [currentStaticParams, setCurrentStaticParams] = useState<IstaticParam[] | null>(null);

    const [rowCount, setRowCount] = useState(0);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: initialRecords.pageNumber - 1,
        pageSize: 10,
    });

    const [changeGrouping, setChangeGrouping] = useState<string[]>([]);



    const togglePara2 = (value: string) => {
        setActive2((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    const [, setFilterModal] = useState(false);

    const handleClick = (data: IstaticParam) => {
        console.log(data);
        setFilterdata(data);
    };

    const _filedNotShow: string[] = ['PageSize', 'PageNumber', 'IsDescending', 'SortBy'];

    const handlerDelete = async (id: string) => {
        setIsDeleting(true);
        //console.log(model);
        const res = await fetch(model?.delete?.url.replace('{id}', id) as string, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            ColoredToast('success', 'ردیف موردنظر با موفقیت حذف گردید');
            setIsDeleting(false);
            FetchData();
            setIsDeleteModalOpen(false);
        } else {
            const responce = await res.json();
            //console.log(responce);
            ColoredToast('danger', responce.title);
            setIsDeleting(false);
        }
    };

    const handlerShowDeleteModal = (id: string, message: string) => {
        setCurrentRowId(id);
        setModalMessage(message);
        setIsDeleteModalOpen(true);
    };

    // let columns = useMemo(
    //     () => model?.list?.responses['0_main'] as MRT_ColumnDef<(any)[0]>[],
    //     [model],
    // );

    // const averageScore = useMemo(() => {
    //     const totalPoints = data.reduce((acc, row) => acc + 2, 0);
    //     const totalPlayers = data.length;
    //     return totalPoints / totalPlayers;
    // }, [data]);

    const FetchData = async () => {
        let filteData: string = '';

        if (manualPagination) {
            filteData = `pageSize=${pagination.pageSize}&pageNumber=${pagination.pageIndex + 1}`;
        }
        // const filter: IFilterData = {
        //     PageNumber: 0,
        //     PageSize: 10,
        //     SortBy: []
        //     //sort: [`${sortStatus.id},${sortStatus.desc ? 'desc' : 'asc'}`]
        // }

        if (staticParams && model.list?.parameters) {
            model.list?.parameters?.map((item) => {
                const val = staticParams.find((x) => x.name === item.name)?.value;
                if (val) {
                    filteData = filteData + `${filteData != '' ? '&' : ''}${item.name}=${val}`;
                }
            });
        }
        //console.log(staticParams, model.list?.parameters, filterdata);
        if (filterdata) {
            Object.keys(filterdata).map((keyName) => {
                //console.log(keyName);
                // console.log(filterdata);
                filteData = filteData + `${filteData != '' ? '&' : ''}${keyName}=${filterdata[keyName]}`;
            });
        }

        setIsLoading(true);

        // const { data, error, isLoading } = useSWR(`${model.list?.url}${filteData != '' ? `?${filteData}` : ''}`, fetcher);

        // if (error) {
        //     setInitialRecords({ pageNumber: 1, numberOfElements: 10, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
        //     setIsLoading(false);
        // } else {
        //     const result = data?.json();
        //     setInitialRecords(result);
        //     setRowCount(result.totalCount);
        //     setIsLoading(false);
        // }

        //const res = await fetch(`${model.list?.url}${filteData != '' ? `?${filteData}` : ''}`);
        const fetchUrl = `${model.list?.url}${filteData != '' ? `?${filteData}` : ''}`;
        // console.log('🔗 FetchURL:', fetchUrl);
        const res = await apiFetch(fetchUrl);
        // console.log(res);
        // const res = await axios.post(model?.list?.url as string,
        //     JSON.stringify(filter)
        // );

        // const res = await fetch(
        //     model?.list?.url as string,
        //     {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(filter),
        //     });

        // if (res.status === 200) {
        //     console.log(res)
        //     //const result = res && await res?.data.json();
        //     //setInitialRecords(result);
        //     setInitialRecords(res.data);
        //     //toggelGroup();
        // } else {
        //     setInitialRecords({ number: 1, numberOfElements: 10, size: 10, totalPages: 1, totalCount: 10, content: [] });
        // }

        if (res.ok) {
            const result = await res?.json();
            setInitialRecords(result);
            setRowCount(result.totalCount);
            setIsLoading(false);
        } else {
            setInitialRecords({ pageNumber: 1, numberOfElements: 10, pageSize: 10, totalPages: 1, totalCount: 10, items: [] });
            setIsLoading(false);
        }

        //console.log('2222222222', result);
    };

    useImperativeHandle(
        myRef,
        () => ({
            fetchData: FetchData,
        }),
        []
    );

    useEffect(() => {
        if (model != currentModel || JSON.stringify(staticParams) != JSON.stringify(currentStaticParams)) {
            setCurrentModel(model);
            setCurrentStaticParams(staticParams);
            setColumns(model?.list?.responses.filter((f) => !hideColList.includes(f.accessor)) as unknown as MRT_ColumnDef<any[0]>[]);
            // console.log("  fgf ggfgf fg", model?.list?.responses)

            staticParams?.map((item) => {
                //setFiledNotShow([...filedNotShow, item.name ])
                _filedNotShow.push(item.name);
            });

            setFiledNotShow(_filedNotShow);

            changeColumnName?.map((item) => {
                // console.log(item);
                const updatedColumns = columns.map((x) => {
                    if (x.accessorKey == item.label) {
                        return { ...x, accessorKey: item.value };
                    }
                    return x;
                });
                setColumns(updatedColumns);
            });

            // console.log(columns);
            // const updateColumn = changeColumnName

            // columns.map((column) =>
            //     column.accessorKey === "type"
            //       ? { ...column, header: newHeader } // تغییر مقدار header
            //       : column
            //   );
            //   setColumns(updatedColumns);

            columns.map((item, i) => {
                const _header = labaleNameList.find((x) => x.label == item.accessorKey)?.value;
                const _format = addSepratorFildes.find((x) => x == item.accessorKey);
                const _isLink = addLinkFildes.find((x) => x == item.accessorKey);
                const _Footersum = addFooterSumFildes.find((x) => x == item.accessorKey);

                item.header = t(_header ? _header : item.header);

                if (_format) {
                    columns[i] = {
                        ...columns[i],
                        Cell: ({ cell }) => {
                            const _value = Number(cell.getValue() ?? 0);

                            return _value < 0 ? <div className="text-red-600">({(_value * -1).toLocaleString('fa-IR')})</div> : <div>{_value.toLocaleString('fa-IR')}</div>;
                        },
                    };
                }

                if (_isLink) {
                    columns[i] = {
                        ...columns[i],
                        Cell: ({ cell }) => {
                            const _value = cell.getValue();

                            return (
                                <a href={`${_value ? _value : '#'}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                                    مشاهده
                                </a>
                            );
                        },
                    };
                }

                if (_Footersum) {
                    columns[i] = {
                        ...columns[i],
                        Footer: (props) => {
                            const totalFilter = props.table.getFilteredRowModel().rows.reduce((sum, row) => {
                                const value = Number(row.getValue(_Footersum!));
                                return sum + (isNaN(value) ? 0 : value);
                            }, 0);

                            const total = props.table.options.data.reduce((sum, row) => {
                                const value = Number(row[_Footersum!]);
                                return sum + (isNaN(value) ? 0 : value);
                            }, 0);

                            return (
                                <div className="w-full">
                                    {totalFilter != total && <div className="">{totalFilter.toLocaleString('fa-IR')}</div>}
                                    <div className="text-lg">{total.toLocaleString('fa-IR')}</div>
                                </div>
                            );
                        },
                    };
                }

                //console.log(columns);
                //console.log(labaleNameList, _header, item);
                // if (item.accessorKey == "provincePrephone") {
                //     columns[i] = {
                //         ...item,
                //         Footer: () => <div>میانگین: {averageScore}</div>
                //     };
                // }
            });

            if (groupColumn) {
                let _groupColumns: MRT_GroupColumnDef<any | { header: string; columns: (MRT_ColumnDef<any> | undefined | unknown)[][] }>[] = [];

                groupColumn.map((item) => {
                    console.log(item);
                    _groupColumns = [
                        ..._groupColumns,
                        {
                            header: item.header,
                            meta: {
                                groupHeaderClassName: item?.groupHeaderClassName ?? '',
                            },
                            columns: item.columnsName.map((cild) => {
                                let _col = columns.find((x) => x.accessorKey == cild);

                                if (_col && item.bodyClassName) {
                                    _col = {
                                        ..._col,
                                        meta: {
                                            headerClassName: item?.headerClassName ?? '',
                                            footerClassName: item?.footerClassName ?? '',
                                            bodyClassName: item.bodyClassName,
                                        },
                                    };
                                }

                                return _col!;
                            }),
                        },
                    ];
                });
                //console.log(_groupColumns);
                setColumns(_groupColumns);
            } else {
                setColumns(columns);
            }

            if (loadingDataInit) {
                FetchData();
            }
        }
    }, [model, staticParams]);

    useEffect(() => {
        if (Object.keys(filterdata)?.length > 0) {
            FetchData();
        }
    }, [filterdata]);

    useEffect(() => {
        if (manualPagination && pagination.pageIndex > 0) {
            FetchData();
        }
    }, [pagination]);

    // const csvConfig = mkConfig({
    //     fieldSeparator: ',',
    //     decimalSeparator: '.',
    //     useKeysAsHeaders: true,
    // });

    // const handleExportRows = (rows: MRT_Row<any>[]) => {
    //     const rowData = rows.map((row) => row.original);
    //     const csv = generateCsv(csvConfig)(rowData);
    //     download(csvConfig)(csv);
    // };

    // const handleExportData = () => {
    //     const csv = generateCsv(csvConfig)(initialRecords.items);
    //     download(csvConfig)(csv);
    // };

    const table = useMantineReactTable({
        renderFallbackValue: true,
        columns: columns,
        data: initialRecords.items,
        paginationDisplayMode: 'pages',
        state: { isLoading, rowSelection, expanded: expandedRow ? { [expandedRow]: true } : {}, grouping: changeGrouping, pagination: pagination },
        initialState: {
            density: 'xs',
            columnPinning: { right: ['mrt-row-actions'] },
        },
        enablePagination: true,
        manualPagination: manualPagination,
        onPaginationChange: setPagination,
        renderTopToolbarCustomActions: () => (
            <div
                className="flex w-full"
                style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                {/* <Tooltip label="Export All Data">
                    <ActionIcon color="inheritans" onClick={handleExportData}>
                        <IconDownload className="text-gray-400" />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Export All Rows">
                    <ActionIcon disabled={table.getPrePaginationRowModel().rows.length === 0} color="inheritans" onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}>
                        <IconDownload className="text-gray-400" />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Export Page Rows">
                    <ActionIcon disabled={table.getRowModel().rows.length === 0} color="inheritans" onClick={() => handleExportRows(table.getRowModel().rows)}>
                        <IconDownload className="text-gray-400" />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Export Selected Rows">
                    <ActionIcon disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} color="inheritans" onClick={() => handleExportRows(table.getSelectedRowModel().rows)}>
                        <IconDownload className="text-gray-400" />
                    </ActionIcon>
                </Tooltip> */}

                <Tooltip label="بروز رسانی">
                    <ActionIcon color="inheritans" onClick={() => FetchData()} style={{ '--ai-hover': 'rgba(134, 142, 150, 0.12)' }}>
                        <IconRefresh className="text-gray-400 hover:text-blue-600" />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="دانلود اکسل">
                    <ActionIcon
                        color="inheritans"
                        style={{ '--ai-hover': 'rgba(134, 142, 150, 0.12)' }}
                    //</Tooltip>onClick={() => fetchData()}
                    >
                        {/* <IconExcel className="text-gray-400" /> */}
                        <i className={`fa-duotone fa-solid fa-file-excel text-gray-500 hover:text-green-600 text-xl`} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="دانلود PDF">
                    <ActionIcon
                        color="inheritans"
                        style={{ '--ai-hover': 'rgba(134, 142, 150, 0.12)' }}
                    //onClick={() => fetchData()}
                    >
                        {/* <IconPDF className="text-gray-400" /> */}
                        <i className={`fa-duotone fa-solid fa-file-pdf text-gray-500 hover:text-red-600 text-xl`} />
                    </ActionIcon>
                </Tooltip>

                {headerAction && headerAction}
            </div>
        ),
        enableColumnPinning: true,
        localization: MRT_Localization_FA,
        enableRowSelection: enableRowSelection,
        enableMultiRowSelection: enableMultiRowSelection,
        enableStickyFooter: enableStickyFooter,

        // mantineTableBodyRowProps: ({ row }) => ({
        //     onClick: row.getToggleSelectedHandler(),
        //     style: { cursor: 'pointer' },
        //   }),
        //mantineTableContainerProps: { style: { maxHeight: '600px' } },
        onRowSelectionChange: setRowSelection,
        mantineTopToolbarProps: { className: 'toolbars' },
        mantineBottomToolbarProps: { className: 'toolbars' },
        positionActionsColumn: 'last',
        positionExpandColumn: 'first',
        enableRowActions: isEditable || isDeleteable || action ? true : false,
        mantineTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                if (detailPanel) {
                    setExpandedRow(row.original.id);
                }
            },
            style: {
                backgroundColor: row.original[mantineTableBodyRowBackgroundColorChangeByField!] ? mantineTableBodyRowBackgroundColor : '',
            },
        }),

        // displayColumnDefOptions: {
        //     'mrt-row-actions': {
        //     //   header: 'actions', //change header text
        //        size: 100, //make actions column wider
        //     },
        //   },
        renderBottomToolbar: ({ table }) => (
            <Flex align="center" justify="space-between">
                <MRT_TablePagination table={table} />
                <div className="m-2 rounded-md border p-2">{`تعدا کل ردیف ها : ${initialRecords?.totalCount?.toLocaleString('fa-IR')}`}</div>
            </Flex>
        ),
        enableGrouping: true,
        groupedColumnMode: 'reorder', //false, //'remove','reorder'
        positionToolbarAlertBanner: 'top', //: 'none',
        enableExpanding: detailPanel || changeGrouping.length > 0 ? true : false,
        onGroupingChange: (newGrouping) => {
            setChangeGrouping(newGrouping);
        },
        rowCount: rowCount,
        getRowId: (row) => row?.id?.toString(),
        onExpandedChange: (updater) => {
            setExpandedRow((old) => {
                const newExpanded = typeof updater === 'function' ? updater({}) : updater;
                const expandedIds = Object.keys(newExpanded);
                const newRowId = expandedIds[0];
                // اگر روی ردیف قبلی کلیک شده، آن را ببندد، وگرنه ردیف جدید را باز کند
                return newRowId && newRowId !== old ? newRowId : null;
            });
        },

        renderDetailPanel: detailPanel,
        renderRowActions: ({ row }) => (
            <Box className="flex">
                {isEditable && (
                    <Tooltip label="ویرایش">
                        <ActionIcon
                            //onClick={() => router.push(`${model.name.toString().toLowerCase()}/${row.original.id}`)}
                            onClick={() => subPage(model.name.toLowerCase(), 'edit', undefined, [{ key: 'id', value: row.original.id.toString() }])}
                            className="btn btn-outline mr-3 flex items-center rounded-xl bg-secondary-light w-9 h-9 p-0 font-iranyekan text-secondary">

                            {/* <IconEdit className="color-red-400" /> */}
                            <i className={`fa-duotone fa-solid fa-pen-to-square text-xl`} />
                        </ActionIcon>

                        {/* <Link
                            href=""
                            onClick={() => router.push(`${model.name.toString().toLowerCase()}/${row.original.id}`)}
                            className="btn btn-outline mr-3 flex items-center rounded-xl bg-secondary-light px-2 font-iranyekan text-secondary"
                        >
                            <IconEdit />
                        </Link> */}
                    </Tooltip>
                )
                }
                {isDeleteable && model.delete && (
                    <Tooltip label="حذف">
                        <ActionIcon
                            onClick={() => handlerShowDeleteModal(row.original.id.toString(), row?.original.name)}
                            className="btn btn-outline mr-3 flex items-center rounded-xl bg-secondary-light w-9 h-9 p-0 font-iranyekan text-secondary"
                        >
                            {/* <IconTrash className="color-red-400" /> */}
                            <i className={`fa-duotone fa-solid fa-trash color-red-400`} />
                        </ActionIcon>
                        {/* <Link
                            href=""
                            onClick={() =>{
                                console.log(row) ;
                                //handlerShowDeleteModal(row.original.id.toString(), row?.original.name)
                                }
                            }
                            className="btn btn-outline mr-3 flex items-center rounded-xl bg-secondary-light px-2 font-iranyekan text-secondary"
                        >
                            <IconTrash className="color-red-400" />
                        </Link> */}
                    </Tooltip>
                )}
                {/* <ActionIcon onClick={() => console.info('Delete')}>
                    <IconEdit />
                </ActionIcon> */}
                {action && action(row.original)}
            </Box >
        ),
        mantineTableBodyCellProps: ({ cell }) => {
            const meta = cell.column.columnDef.meta as { bodyClassName?: string };
            return {
                className: meta?.bodyClassName ?? '',
            };
        },
        mantineTableHeadCellProps: ({ column }) => {
            const meta = column.columnDef.meta as { headerClassName?: string; groupHeaderClassName?: string };
            return {
                className: `${meta?.headerClassName ?? ''} ${meta?.groupHeaderClassName ?? ''}`,
            };
        },
        mantineTableFooterCellProps: ({ column }) => {
            const meta = column.columnDef.meta as { footerClassName?: string };
            return {
                className: meta?.footerClassName ?? '',
            };
        },
    });

    useEffect(() => {
        //console.log('fathitest', table, initialRecords);
        //fetchedDatas = initialRecords?.content ?? [];
        //table.data = initialRecords.content;
    }, [initialRecords.items]);
    // console.log(model?.list?.parameters);

    return (
        <>
            {isShowSearchForm &&
                model?.list?.parameters.filter((f) => !filedNotShow.includes(f.name)) &&
                model?.list?.parameters.filter((f) => !filedNotShow.includes(f.name)).length > 0 &&
                (model?.list?.parameters?.length == 5 ? (
                    <div className="flex w-full">
                        <div className="mb-5 w-full">
                            <div className="space-y-2 font-iranyekan">
                                <div className="rounded-2xl border border-[#d3d3d3] dark:border-[#1b2e4b]">
                                    <div className="p-5">
                                        <DForms
                                            model={undefined}
                                            parameter={model?.list?.parameters}
                                            filedNotShow={filedNotShow}
                                            onClick={handleClick}
                                            setModal={setFilterModal}
                                            sucsesBtnText="search"
                                            cancelBtnText={''}
                                            staticParams={staticParams}
                                            labaleNameList={labaleNameList}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex w-full">
                        <div className="mb-5 w-full">
                            <div className="space-y-2 font-iranyekan">
                                <div className="rounded-2xl border border-[#d3d3d3] dark:border-[#1b2e4b]">
                                    <button
                                        type="button"
                                        className={`flex w-full items-center p-4 font-iranyekan text-[#089bab] dark:bg-[#1b2e4b] ${active2 === '1' ? '!#089bab' : '#089bab'}`}
                                        onClick={() => togglePara2('1')}
                                    >
                                        <IconSearch className="shrink-0 text-[#089bab] ltr:mr-2 rtl:ml-2" />
                                        {t('searchin')} {t(model.name.toLowerCase().toString())}
                                        <div className={`text-[#089bab] ltr:ml-auto rtl:mr-auto ${active2 === '1' ? 'rotate-180' : ''}`}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <div>
                                        <AnimateHeight duration={300} height={active2 === '1' ? 'auto' : 0}>
                                            <div className="p-5">
                                                <DForms
                                                    model={undefined}
                                                    parameter={model?.list?.parameters}
                                                    filedNotShow={filedNotShow}
                                                    onClick={(data: IstaticParam) => {
                                                        handleClick(data);
                                                        togglePara2('0');
                                                    }}
                                                    setModal={setFilterModal}
                                                    sucsesBtnText="search"
                                                    cancelBtnText={''}
                                                    staticParams={staticParams}
                                                    labaleNameList={labaleNameList}
                                                />
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            <Transition appear show={isDeleteModalOpen} as={Fragment}>
                <Dialog as="div" open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel relative z-50 my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark bg-white">
                                    <div className="flex items-center justify-between border-b-2 border-gray-300 bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <div className="flex text-lg font-bold ">
                                            <div className="w-40 pl-2 text-red-500 flex items-center">
                                                <i className={`fa-duotone fa-solid fa-trash ml-2`} />
                                                حذف
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="text-gray-600 hover:text-gray-900 flex items-center justify-center px-1">
                                            <i className={`fa-duotone fa-solid fa-close text-xl`} />
                                        </button>
                                    </div>
                                    <div className="p-5 text-center text-2xl">آیا از حذف این ردیف مطمئن هستید؟</div>
                                    {modalMessage && <div className="p-1 text-center text-xl text-gray-900">{`( ${modalMessage} )`}</div>}
                                    <div className="p-5">
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn outline outline-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                                انصراف
                                            </button>
                                            <button type="button" onClick={() => handlerDelete(currentRowId)} className={`btn bg-red-500 text-white flex w-32 ltr:ml-4 rtl:mr-4 items-center justify-center ${isLoading ? 'disabled' : ''}}`}>
                                                {isLoading ? (
                                                    <span className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4"></span>
                                                ) : (
                                                    // <IconTrash className="ml-2" />
                                                    <i className={`fa-duotone fa-solid fa-trash ml-2`} />
                                                )}
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <MantineReactTable
                key={model.name}
                table={table}
            // mantineTableBodyCellProps={({ column }: { column: MRT_Column<any>; row: MRT_Row<any> }) => {
            //     const meta = column.columnDef.meta as MyColumnMeta;
            //     return {
            //         style: {
            //             backgroundColor: meta?.backgroundColor || undefined,
            //         },
            //     };
            // }}
            //renderFallbackValue={true}
            //columns={columns}
            //data={initialRecords.content}
            // enableGrouping={true}
            // groupedColumnMode={false}
            // state={{ isLoading }}
            // localization={MRT_Localization_FA}
            // mantineSelectCheckboxProps={({ row }) => ({
            //     color: 'violet',
            //     disabled: row.original.isAccountLocked, //access the row data to determine if the checkbox should be disabled
            // })}
            //enableColumnPinning={true}
            // initialState={{
            //     columnPinning: { left: ['mrt-row-actions'] },
            // }}
            />
        </>
    );
};

export default MRT_DataTable;
