import { combineReducers, configureStore } from '@reduxjs/toolkit';
//import themeConfigSlice from './themeConfigSlice';
import appConfigSlice from './appConfigSlice';

const rootReducer = combineReducers({
    //themeConfig: themeConfigSlice,
    appConfig: appConfigSlice,
});

export default configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
