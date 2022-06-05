import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const emailsAdapter = createEntityAdapter({
  selectId: (email) => email.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id)
});

export const fetchemails = createAsyncThunk('emails/fetch', async (emailId) => {
  const response = await fetch(`/api/emails/${emailId}`);
  return await response.json();
});

export const addemail = createAsyncThunk('emails/add', async (email) => {
  const response = await fetch('/api/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(email)
  });
  return await response.json();
});

export const updateemail = createAsyncThunk('emails/update', async (email) => {
  const response = await fetch(`/api/emails/${email.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(email)
  });
  return await response.json();
});

export const deleteemail = createAsyncThunk('emails/delete', async (emailId) => {
  const response = await fetch(`/api/emails/${emailId}`, {
    method: 'DELETE'
  });
  return await response.json();
});

const emailsSlice = createSlice({
  name: 'emails',
  initialState: emailsAdapter.getInitialState(),
  reducers: {
    emailAdded: emailsAdapter.addOne,
    emailUpdated: emailsAdapter.updateOne,
    emailDeleted: emailsAdapter.removeOne
  },
  extraReducers: {
    [fetchemails.fulfilled]: (state, action) => {
      emailsAdapter.setAll(state, action.payload);
    },
    [addemail.fulfilled]: (state, action) => {
      emailsAdapter.addOne(state, action.payload);
    },
    [updateemail.fulfilled]: (state, action) => {
      emailsAdapter.updateOne(state, action.payload);
    },
    [deleteemail.fulfilled]: (state, action) => {
      emailsAdapter.removeOne(state, action.payload.id);
    }
  }
});

export const {
  selectAll: selectAllemails,
  selectIds: selectemailIds,
  selectEntities: selectemailEntities,
  selectTotal: selectemailTotal,
  selectById: selectemailById
} = emailsAdapter.getSelectors((state) => state.emails);

export default emailsSlice.reducer;
