import { accountActionTypes } from 'Modules/Account/Actions';
import { apiKeyAccountActionTypes } from 'Modules/Account/Actions/ApiKey';

export function availableApiKeyAppsReducer(state, action) {
  if (action.type !== accountActionTypes.PROFILE_LOADED && action.type !== apiKeyAccountActionTypes.SET_APIKEY_APPS) return;

  if (action.payload.availableApps) {
    state.account.appVaults.apiKey.availableApps = action.payload.availableApps;
  }

  return { ...state };
}