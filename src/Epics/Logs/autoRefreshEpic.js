import { timer } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';
import { anyCredentials } from './utils';
import { refreshLogsAction, SET_AUTOREFRESH, SET_LOGS } from 'Actions/Logs';
import { emptyAction } from 'Actions';
import { PROFILE_LOADED } from 'Actions/Profile';
const refreshTimeThreshold = 30000;

export const autoRefreshEpic = (action$, $state) =>
  action$
    .pipe(
      filter(q =>
        (q.type === SET_AUTOREFRESH && q.payload.enabled) ||
        // set auto refresh on startup and after setting logs, queue next refresh
        (isAutoRefreshEnabled($state) && ((q.type === SET_LOGS) || profileLoaded(q)))
      ),
      switchMap(q => {
        return timer(refreshTimeThreshold)
          .pipe(
            map(t => isAutoRefreshEnabled($state) ? refreshLogsAction() : emptyAction())
          );
      })
    );

const isAutoRefreshEnabled = ($state) => $state.value.autoRefresh;
const profileLoaded = (action) => action.type === PROFILE_LOADED && anyCredentials(action.payload.credentials);