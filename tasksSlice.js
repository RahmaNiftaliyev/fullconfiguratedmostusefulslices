import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const tasksAdapter = createEntityAdapter({
  selectId: (task) => task.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id)
});

export const fetchtasks = createAsyncThunk('tasks/fetch', async (taskId) => {
  const response = await fetch(`/api/tasks/${taskId}`);
  return await response.json();
});

export const addtask = createAsyncThunk('tasks/add', async (task) => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });
  return await response.json();
});

export const updatetask = createAsyncThunk('tasks/update', async (task) => {
  const response = await fetch(`/api/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });
  return await response.json();
});

export const deletetask = createAsyncThunk('tasks/delete', async (taskId) => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE'
  });
  return await response.json();
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState(),
  reducers: {
    taskAdded: tasksAdapter.addOne,
    taskUpdated: tasksAdapter.updateOne,
    taskDeleted: tasksAdapter.removeOne
  },
  extraReducers: {
    [fetchtasks.fulfilled]: (state, action) => {
      tasksAdapter.setAll(state, action.payload);
    },
    [addtask.fulfilled]: (state, action) => {
      tasksAdapter.addOne(state, action.payload);
    },
    [updatetask.fulfilled]: (state, action) => {
      tasksAdapter.updateOne(state, action.payload);
    },
    [deletetask.fulfilled]: (state, action) => {
      tasksAdapter.removeOne(state, action.payload.id);
    }
  }
});

export const {
  selectAll: selectAlltasks,
  selectIds: selecttaskIds,
  selectEntities: selecttaskEntities,
  selectTotal: selecttaskTotal,
  selectById: selecttaskById
} = tasksAdapter.getSelectors((state) => state.tasks);

export default tasksSlice.reducer;
