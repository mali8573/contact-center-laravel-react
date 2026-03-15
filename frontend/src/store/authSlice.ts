import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

// הגדרת טיפוס למשתמש - עוזר למנוע שגיאות כתיב ב-UI
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// שליפת נתונים מה-localStorage בטעינה ראשונית
const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
  isAuthenticated: !!savedToken,
  loading: false,
  error: null,
};

// פעולת ההתחברות מול ה-API
export const login = createAsyncThunk('auth/login', async (credentials: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/login', credentials);
    
    // שליפת הנתונים מהתשובה של לארוול
    const { access_token, user } = response.data; 
    
    if (access_token) {
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user)); // שמירת המשתמש בדיסק
    }
    
    return { token: access_token, user };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'התחברות נכשלה');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;