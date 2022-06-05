import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const ordersAdapter = createEntityAdapter({
  selectId: (order) => order.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id)
});

export const fetchorders = createAsyncThunk('orders/fetch', async (orderId) => {
  const response = await fetch(`/api/orders/${orderId}`);
  return await response.json();
});

export const addorder = createAsyncThunk('orders/add', async (order) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  });
  return await response.json();
});

export const updateorder = createAsyncThunk('orders/update', async (order) => {
  const response = await fetch(`/api/orders/${order.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  });
  return await response.json();
});

export const deleteorder = createAsyncThunk('orders/delete', async (orderId) => {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'DELETE'
  });
  return await response.json();
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: ordersAdapter.getInitialState(),
  reducers: {
    orderAdded: ordersAdapter.addOne,
    orderUpdated: ordersAdapter.updateOne,
    orderDeleted: ordersAdapter.removeOne
  },
  extraReducers: {
    [fetchorders.fulfilled]: (state, action) => {
      ordersAdapter.setAll(state, action.payload);
    },
    [addorder.fulfilled]: (state, action) => {
      ordersAdapter.addOne(state, action.payload);
    },
    [updateorder.fulfilled]: (state, action) => {
      ordersAdapter.updateOne(state, action.payload);
    },
    [deleteorder.fulfilled]: (state, action) => {
      ordersAdapter.removeOne(state, action.payload.id);
    }
  }
});

export const {
  selectAll: selectAllorders,
  selectIds: selectorderIds,
  selectEntities: selectorderEntities,
  selectTotal: selectorderTotal,
  selectById: selectorderById
} = ordersAdapter.getSelectors((state) => state.orders);

export default ordersSlice.reducer;
