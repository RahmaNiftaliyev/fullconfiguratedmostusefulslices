import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const eventsAdapter = createEntityAdapter({
  selectId: (event) => event.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id)
});

export const fetchevents = createAsyncThunk('events/fetch', async (eventId) => {
  const response = await fetch(`/api/events/${eventId}`);
  return await response.json();
});

export const addevent = createAsyncThunk('events/add', async (event) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });
  return await response.json();
});

export const updateevent = createAsyncThunk('events/update', async (event) => {
  const response = await fetch(`/api/events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });
  return await response.json();
});

export const deleteevent = createAsyncThunk('events/delete', async (eventId) => {
  const response = await fetch(`/api/events/${eventId}`, {
    method: 'DELETE'
  });
  return await response.json();
});

const eventsSlice = createSlice({
  name: 'events',
  initialState: eventsAdapter.getInitialState(),
  reducers: {
    eventAdded: eventsAdapter.addOne,
    eventUpdated: eventsAdapter.updateOne,
    eventDeleted: eventsAdapter.removeOne
  },
  extraReducers: {
    [fetchevents.fulfilled]: (state, action) => {
      eventsAdapter.setAll(state, action.payload);
    },
    [addevent.fulfilled]: (state, action) => {
      eventsAdapter.addOne(state, action.payload);
    },
    [updateevent.fulfilled]: (state, action) => {
      eventsAdapter.updateOne(state, action.payload);
    },
    [deleteevent.fulfilled]: (state, action) => {
      eventsAdapter.removeOne(state, action.payload.id);
    }
  }
});

export const {
  selectAll: selectAllevents,
  selectIds: selecteventIds,
  selectEntities: selecteventEntities,
  selectTotal: selecteventTotal,
  selectById: selecteventById
} = eventsAdapter.getSelectors((state) => state.events);

export default eventsSlice.reducer;
