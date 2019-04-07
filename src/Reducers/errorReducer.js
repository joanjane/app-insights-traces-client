import { commonActionTypes } from 'Actions';

export function errorReducer(state, action) {
  if (action.type !== commonActionTypes.ERROR) return;

  state.error = action.payload;
  state.search.loading = false;

  return { ...state };
}