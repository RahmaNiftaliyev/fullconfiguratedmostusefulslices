import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const workersAdapter = createEntityAdapter({
  selectId: (worker) => worker.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id)
});

export const fetchworkers = createAsyncThunk('workers/fetch', async (workerId) => {
  const response = await fetch(`/api/workers/${workerId}`);
  return await response.json();
});

export const addworker = createAsyncThunk('workers/add', async (worker) => {
  const response = await fetch('/api/workers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(worker)
  });
  return await response.json();
});

export const updateworker = createAsyncThunk('workers/update', async (worker) => {
  const response = await fetch(`/api/workers/${worker.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(worker)
  });
  return await response.json();
});

export const deleteworker = createAsyncThunk('workers/delete', async (workerId) => {
  const response = await fetch(`/api/workers/${workerId}`, {
    method: 'DELETE'
  });
  return await response.json();
});

const workersSlice = createSlice({
  name: 'workers',
  initialState: workersAdapter.getInitialState(),
  reducers: {
    workerAdded: workersAdapter.addOne,
    workerUpdated: workersAdapter.updateOne,
    workerDeleted: workersAdapter.removeOne
  },
  extraReducers: {
    [fetchworkers.fulfilled]: (state, action) => {
      workersAdapter.setAll(state, action.payload);
    },
    [addworker.fulfilled]: (state, action) => {
      workersAdapter.addOne(state, action.payload);
    },
    [updateworker.fulfilled]: (state, action) => {
      workersAdapter.updateOne(state, action.payload);
    },
    [deleteworker.fulfilled]: (state, action) => {
      workersAdapter.removeOne(state, action.payload.id);
    }
  }
});

export const {
  selectAll: selectAllworkers,
  selectIds: selectworkerIds,
  selectEntities: selectworkerEntities,
  selectTotal: selectworkerTotal,
  selectById: selectworkerById
} = workersAdapter.getSelectors((state) => state.workers);

export default workersSlice.reducer;
