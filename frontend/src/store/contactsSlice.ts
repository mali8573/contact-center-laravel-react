import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

// --- 1. Interfaces ---
export interface Interaction {
  id: number;
  contact_id: number;
  type: string;
  timestamp: string;
  note: string;
  deleted_at?: string | null;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  interactions?: Interaction[];
  deleted_at?: string | null;
}

interface ContactsState {
  items: Contact[];
  loading: boolean;
  error: string | null;
  selectedContact: Contact | null;
  currentInteraction: Interaction | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
}

const initialState: ContactsState = {
  items: [],
  loading: false,
  error: null,
  selectedContact: null,
  currentInteraction: null,
  pagination: { currentPage: 1, lastPage: 1, total: 0 }
};

// --- 2. Thunks ---
export const fetchContacts = createAsyncThunk('contacts/fetchAll', async ({ page = 1, search = '' }: { page?: number, search?: string }) => {
  const response = await api.get(`/contacts?page=${page}&search=${search}`);
  return response.data; 
});

export const fetchContactById = createAsyncThunk('contacts/fetchById', async (id: number) => {
  const response = await api.get(`/contacts/${id}`);
  return response.data.data;
});

export const createContact = createAsyncThunk('contacts/create', async (data: Omit<Contact, 'id'>) => {
  const response = await api.post('/contacts', data);
  return response.data.data;
});

export const updateContact = createAsyncThunk('contacts/update', async ({ id, data }: { id: number, data: Partial<Contact> }) => {
  const response = await api.put(`/contacts/${id}`, data);
  return response.data.data;
});

export const deleteContact = createAsyncThunk('contacts/delete', async (id: number) => {
  await api.delete(`/contacts/${id}`);
  return id;
});

export const restoreContact = createAsyncThunk('contacts/restore', async (id: number) => {
  const response = await api.post(`/contacts/${id}/restore`);
  return response.data.data;
});

export const fetchInteractionsByContact = createAsyncThunk('interactions/fetchByContact', async (contactId: number) => {
  const response = await api.get(`/interactions?contact_id=${contactId}`);
  return response.data.data;
});

export const fetchInteractionById = createAsyncThunk('interactions/fetchById', async (id: number) => {
  const response = await api.get(`/interactions/${id}`);
  return response.data.data;
});

export const createInteraction = createAsyncThunk('interactions/create', async (data: Omit<Interaction, 'id'>) => {
  const response = await api.post('/interactions', data);
  return response.data.data;
});

export const updateInteraction = createAsyncThunk('interactions/update', async ({ id, data }: { id: number, data: Partial<Interaction> }) => {
  const response = await api.put(`/interactions/${id}`, data);
  return response.data.data;
});

export const deleteInteraction = createAsyncThunk('interactions/delete', async (id: number) => {
  await api.delete(`/interactions/${id}`);
  return id;
});

export const restoreInteraction = createAsyncThunk('interactions/restore', async (id: number) => {
  const response = await api.post(`/interactions/${id}/restore`);
  return response.data.data;
});

// --- 3. The Slice ---
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearSelectedContact: (state) => { state.selectedContact = null; },
    clearCurrentInteraction: (state) => { state.currentInteraction = null; }
  },
extraReducers: (builder) => {
    builder
      // Matchers - טיפול גלובלי בטעינה ושגיאות
    
      // Contacts Cases
      .addCase(fetchContacts.fulfilled, (state: ContactsState, action: PayloadAction<any>) => {
        state.items = action.payload.data;
        state.pagination = {
          currentPage: action.payload.meta?.current_page || 1,
          lastPage: action.payload.meta?.last_page || 1,
          total: action.payload.meta?.total || 0
        };
      })
      .addCase(fetchContactById.fulfilled, (state: ContactsState, action: PayloadAction<Contact>) => {
        state.selectedContact = action.payload;
      })
      .addCase(createContact.fulfilled, (state: ContactsState, action: PayloadAction<Contact>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateContact.fulfilled, (state: ContactsState, action: PayloadAction<Contact>) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selectedContact?.id === action.payload.id) state.selectedContact = action.payload;
      })
      .addCase(deleteContact.fulfilled, (state: ContactsState, action: PayloadAction<number>) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      })
      .addCase(restoreContact.fulfilled, (state: ContactsState, action: PayloadAction<Contact>) => {
        state.items.unshift(action.payload);
      })
      // Interactions Cases
      .addCase(createInteraction.fulfilled, (state: ContactsState, action: PayloadAction<Interaction>) => {
        if (state.selectedContact?.id === action.payload.contact_id) {
          if (!state.selectedContact.interactions) state.selectedContact.interactions = [];
          state.selectedContact.interactions.unshift(action.payload);
        }
      })
      .addCase(updateInteraction.fulfilled, (state: ContactsState, action: PayloadAction<Interaction>) => {
        if (state.selectedContact?.interactions) {
          const idx = state.selectedContact.interactions.findIndex(i => i.id === action.payload.id);
          if (idx !== -1) state.selectedContact.interactions[idx] = action.payload;
        }
      })
      .addCase(deleteInteraction.fulfilled, (state: ContactsState, action: PayloadAction<number>) => {
        if (state.selectedContact?.interactions) {
          state.selectedContact.interactions = state.selectedContact.interactions.filter(i => i.id !== action.payload);
        }
      })
      .addCase(restoreInteraction.fulfilled, (state: ContactsState, action: PayloadAction<Interaction>) => {
        if (state.selectedContact?.id === action.payload.contact_id) {
          if (!state.selectedContact.interactions) state.selectedContact.interactions = [];
          state.selectedContact.interactions.unshift(action.payload);
        }
      })
      .addCase(fetchInteractionsByContact.fulfilled, (state: ContactsState, action: PayloadAction<Interaction[]>) => {
        if (state.selectedContact) state.selectedContact.interactions = action.payload;
      })
      .addCase(fetchInteractionById.fulfilled, (state: ContactsState, action: PayloadAction<Interaction>) => {
        state.currentInteraction = action.payload;
      })
        .addMatcher(
        (action): action is any => action.type.endsWith('/pending'),
        (state: ContactsState) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is any => action.type.endsWith('/fulfilled'),
        (state: ContactsState) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action): action is any => action.type.endsWith('/rejected'),
        (state: ContactsState, action: any) => {
          state.loading = false;
          state.error = action.error?.message || 'אירעה שגיאה בפעולה';
   }
      );
  },
});

export const { clearSelectedContact, clearCurrentInteraction } = contactsSlice.actions;
export default contactsSlice.reducer;