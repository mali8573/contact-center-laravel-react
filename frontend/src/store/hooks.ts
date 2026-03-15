import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
// הנקודה הבודדת אומרת "חפש קובץ index בתיקייה הזו"
import type { RootState, AppDispatch } from './'; 

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;