import { InitialState, ITabData } from '@/interface/dataModel';
import { createSlice } from '@reduxjs/toolkit';

const initialState: InitialState = {
    company: {
        id: '',
        name: '',
        backgroundColor: '',
        textColor: ''
    },
    fiscalYear: {
        id: '',
        name: '',
        begin: '',
        end: ''
    },
    tabs: [],
    activeTab: ''
};

const themeConfigSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setCompany(state, { payload }) {

            localStorage.setItem('company', JSON.stringify(payload));
            state.company = payload;
        },
        setFiscalYear(state, { payload }) {

            localStorage.setItem('fiscalYear', JSON.stringify(payload));
            state.fiscalYear = payload;
        },
        setTabs(state, { payload }) {
            console.log("stor --- ", payload);
            localStorage.setItem('tabsData', JSON.stringify(payload));
            state.tabs = payload;
        },
        setActiveTab(state, { payload }) {

            localStorage.setItem('activeTab', payload);
            state.activeTab = payload;
        },
    },
});

export const { setCompany, setFiscalYear, setTabs, setActiveTab } = themeConfigSlice.actions;

export default themeConfigSlice.reducer;
