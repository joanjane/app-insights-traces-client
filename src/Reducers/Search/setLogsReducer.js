import { searchActionTypes } from 'Actions/Search';

export function setLogsReducer(state, action) {
  if (action.type !== searchActionTypes.SET_LOGS) return;

  state.search.logs = action.payload.logs;
  state.search.appName = action.payload.appName;
  state.search.fetchTime = action.payload.fetchTime;
  state.search.loading = false;
  state.error = null;

  return { ...state };
}