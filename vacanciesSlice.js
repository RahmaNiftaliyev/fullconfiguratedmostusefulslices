import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const vacanciesAdapter = createEntityAdapter({
  selectId: (vacancie) => vacancie.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id)
});

export const fetchvacancies = createAsyncThunk('vacancies/fetch', async (vacancieId) => {
  const response = await fetch(`/api/vacancies/${vacancieId}`);
  return await response.json();
});

export const addvacancie = createAsyncThunk('vacancies/add', async (vacancie) => {
  const response = await fetch('/api/vacancies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(vacancie)
  });
  return await response.json();
});

export const updatevacancie = createAsyncThunk('vacancies/update', async (vacancie) => {
  const response = await fetch(`/api/vacancies/${vacancie.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(vacancie)
  });
  return await response.json();
});

export const deletevacancie = createAsyncThunk('vacancies/delete', async (vacancieId) => {
  const response = await fetch(`/api/vacancies/${vacancieId}`, {
    method: 'DELETE'
  });
  return await response.json();
});

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState: vacanciesAdapter.getInitialState(),
  reducers: {
    vacancieAdded: vacanciesAdapter.addOne,
    vacancieUpdated: vacanciesAdapter.updateOne,
    vacancieDeleted: vacanciesAdapter.removeOne
  },
  extraReducers: {
    [fetchvacancies.fulfilled]: (state, action) => {
      vacanciesAdapter.setAll(state, action.payload);
    },
    [addvacancie.fulfilled]: (state, action) => {
      vacanciesAdapter.addOne(state, action.payload);
    },
    [updatevacancie.fulfilled]: (state, action) => {
      vacanciesAdapter.updateOne(state, action.payload);
    },
    [deletevacancie.fulfilled]: (state, action) => {
      vacanciesAdapter.removeOne(state, action.payload.id);
    }
  }
});

export const {
  selectAll: selectAllvacancies,
  selectIds: selectvacancieIds,
  selectEntities: selectvacancieEntities,
  selectTotal: selectvacancieTotal,
  selectById: selectvacancieById
} = vacanciesAdapter.getSelectors((state) => state.vacancies);

export default vacanciesSlice.reducer;
