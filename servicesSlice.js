import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const servicesAdapter = createEntityAdapter({
  selectId: (service) => service.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id)
});

export const fetchservices = createAsyncThunk('services/fetch', async (serviceId) => {
  const response = await fetch(`/api/services/${serviceId}`);
  return await response.json();
});

export const addservice = createAsyncThunk('services/add', async (service) => {
  const response = await fetch('/api/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(service)
  });
  return await response.json();
});

export const updateservice = createAsyncThunk('services/update', async (service) => {
  const response = await fetch(`/api/services/${service.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(service)
  });
  return await response.json();
});

export const deleteservice = createAsyncThunk('services/delete', async (serviceId) => {
  const response = await fetch(`/api/services/${serviceId}`, {
    method: 'DELETE'
  });
  return await response.json();
});

const servicesSlice = createSlice({
  name: 'services',
  initialState: servicesAdapter.getInitialState(),
  reducers: {
    serviceAdded: servicesAdapter.addOne,
    serviceUpdated: servicesAdapter.updateOne,
    serviceDeleted: servicesAdapter.removeOne
  },
  extraReducers: {
    [fetchservices.fulfilled]: (state, action) => {
      servicesAdapter.setAll(state, action.payload);
    },
    [addservice.fulfilled]: (state, action) => {
      servicesAdapter.addOne(state, action.payload);
    },
    [updateservice.fulfilled]: (state, action) => {
      servicesAdapter.updateOne(state, action.payload);
    },
    [deleteservice.fulfilled]: (state, action) => {
      servicesAdapter.removeOne(state, action.payload.id);
    }
  }
});

export const {
  selectAll: selectAllservices,
  selectIds: selectserviceIds,
  selectEntities: selectserviceEntities,
  selectTotal: selectserviceTotal,
  selectById: selectserviceById
} = servicesAdapter.getSelectors((state) => state.services);

export default servicesSlice.reducer;
