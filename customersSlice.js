import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const customersAdapter = createEntityAdapter({
  selectId: (customer) => customer.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id)
});

export const fetchcustomers = createAsyncThunk('customers/fetch', async (customerId) => {
  const response = await fetch(`/api/customers/${customerId}`);
  return await response.json();
});

export const addcustomer = createAsyncThunk('customers/add', async (customer) => {
  const response = await fetch('/api/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customer)
  });
  return await response.json();
});

export const updatecustomer = createAsyncThunk('customers/update', async (customer) => {
  const response = await fetch(`/api/customers/${customer.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customer)
  });
  return await response.json();
});

export const deletecustomer = createAsyncThunk('customers/delete', async (customerId) => {
  const response = await fetch(`/api/customers/${customerId}`, {
    method: 'DELETE'
  });
  return await response.json();
});

const customersSlice = createSlice({
  name: 'customers',
  initialState: customersAdapter.getInitialState(),
  reducers: {
    customerAdded: customersAdapter.addOne,
    customerUpdated: customersAdapter.updateOne,
    customerDeleted: customersAdapter.removeOne
  },
  extraReducers: {
    [fetchcustomers.fulfilled]: (state, action) => {
      customersAdapter.setAll(state, action.payload);
    },
    [addcustomer.fulfilled]: (state, action) => {
      customersAdapter.addOne(state, action.payload);
    },
    [updatecustomer.fulfilled]: (state, action) => {
      customersAdapter.updateOne(state, action.payload);
    },
    [deletecustomer.fulfilled]: (state, action) => {
      customersAdapter.removeOne(state, action.payload.id);
    }
  }
});

export const {
  selectAll: selectAllcustomers,
  selectIds: selectcustomerIds,
  selectEntities: selectcustomerEntities,
  selectTotal: selectcustomerTotal,
  selectById: selectcustomerById
} = customersAdapter.getSelectors((state) => state.customers);

export default customersSlice.reducer;
