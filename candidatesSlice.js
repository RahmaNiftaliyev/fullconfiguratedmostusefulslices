import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const candidatesAdapter = createEntityAdapter({
  selectId: (candidate) => candidate.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id)
});

export const fetchCandidates = createAsyncThunk('candidates/fetch', async (candidateId) => {
  const response = await fetch(`/api/candidates/${candidateId}`);
  return await response.json();

});

export const addCandidate = createAsyncThunk('candidates/add', async (candidate) => {
  const response = await fetch('/api/candidates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(candidate)
  });
  return await response.json();

});

export const updateCandidate = createAsyncThunk('candidates/update', async (candidate) => {
  const response = await fetch(`/api/candidates/${candidate.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(candidate)
  });
  return await response.json();

});

export const deleteCandidate = createAsyncThunk('candidates/delete', async (candidateId) => {
  const response = await fetch(`/api/candidates/${candidateId}`, {
    method: 'DELETE'
  });
  return await response.json();
 
});

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: candidatesAdapter.getInitialState(),
  reducers: {
    candidateAdded: candidatesAdapter.addOne,
    candidateUpdated: candidatesAdapter.updateOne,
    candidateDeleted: candidatesAdapter.removeOne
  },
  extraReducers: {
    [fetchCandidates.fulfilled]: (state, action) => {
      candidatesAdapter.setAll(state, action.payload);
    },
    [addCandidate.fulfilled]: (state, action) => {
      candidatesAdapter.addOne(state, action.payload);
    },
    [updateCandidate.fulfilled]: (state, action) => {
      candidatesAdapter.updateOne(state, action.payload);
    },
    [deleteCandidate.fulfilled]: (state, action) => {
      candidatesAdapter.removeOne(state, action.payload.id);
    }
  }
});

export const {
  selectAll: selectAllCandidates,
  selectIds: selectCandidateIds,
  selectEntities: selectCandidateEntities,
  selectTotal: selectCandidateTotal,
  selectById: selectCandidateById
} = candidatesAdapter.getSelectors((state) => state.candidates);

export default candidatesSlice.reducer;
