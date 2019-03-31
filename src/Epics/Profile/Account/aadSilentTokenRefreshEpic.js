import { mergeMap, map, filter } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { emptyAction } from 'Actions';
import { AAD_SILENT_REFRESH } from 'Actions/Profile/Account';
import AuthenticationType from 'Models/AuthenticationType';

export const aadSilentTokenRefreshEpic = (action$, state$, { inject }) => {
  const aadAuthService = inject('AadAuthService');

  return action$
    .pipe(
      ofType(AAD_SILENT_REFRESH),
      filter(action => {
        const state = state$.value;
        return state.credentials.authenticationType === AuthenticationType.aad;
      }),
      mergeMap((action) => {
        return aadAuthService.silentTokenRefresh()
          .pipe(
            map(result => {
              if (!result.success) {
                alert(`An error has occurred while refreshing token silently: ${result.errorMessage}`);
              }
              const retryAction = action.payload.retryAction;
              return retryAction ? retryAction : emptyAction();
            })
          );
      })
    )
  ;
}