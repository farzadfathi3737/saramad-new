import { getEntityModel } from '@/models/entity';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Demo from '@/app/components/Datatable/MRT';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';
import { IDataModel, IFieldsTable } from '@/interface/dataModel';

import Link from 'next/link';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useRouter as Router } from 'next/router';

const Payments = () => {
    const { t } = useTranslation();
    const [model, setModel] = useState<IDataModel>();
    const [modelData, setModelData] = useState<IDataModel>();
    const [isLoading, setIsLoading] = useState(false);
    const tableRefreshRef = useRef<{ fetchData: () => void }>(null);
    const [rowId, setRowId] = useState<string>();

    const router = useRouter();
    const _router = Router();
    const { query } = _router;

    useEffect(() => {
        const setdata = async () => {
            setRowId(query.CashDividendId?.toString());
            let _model = getEntityModel('sharecashdividendpayments');
            setModelData(_model);
        };
        setdata();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
        </div>
    );
};

export default Payments;
