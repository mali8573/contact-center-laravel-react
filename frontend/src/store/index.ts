import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import contactsReducer from './contactsSlice'; // 1. ייבוא ה-Reducer החדש

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    contacts: contactsReducer, // 2. רישום ה-Slice במחסן המרכזי
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;