import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import AuthenticationType from 'Models/AuthenticationType';
import {
  accountActionTypes,
  setAuthenticationTypeAction
} from 'Actions/Account';
import {
  setQueryAction,
  setSearchPeriodAction,
  getLogsAction
} from 'Actions/Search';
import {
  setApiKeyAppsAction,
  setApiKeyCredentialsAction
} from 'Actions/Account/ApiKey';
import {
  setAADSubscriptionAction,
  setAADResourceAction,
  aadAuthenticatedAction,
  aadSilentTokenRefreshAction
} from 'Actions/Account/AAD';

export const loadProfileEpic = (action$, state$, { inject }) => {
  const profileRepository = inject('ProfileRepository');
  const consoleDoc = inject('ConsoleDoc');
  const aadAuthService = inject('AadAuthService');

  return action$.pipe(
    ofType(accountActionTypes.LOAD_PROFILE),
    mergeMap(q => {
      profileRepository.runMigrations();

      consoleDoc.printHelpOnConsole();
      const query = profileRepository.getQuery();
      const searchPeriod = profileRepository.getSearchPeriod();
      const apiKeyAccount = profileRepository.getApiKeyAccount();
      const availableApiKeyApps = profileRepository.getAllApiKeyAccounts();
      const aadAccount = profileRepository.getAADAccount();
      let aadAuthenticated = aadAuthService.isAuthenticated();
      let authenticationType = profileRepository.getAuthenticationType();

      if (authenticationType !== AuthenticationType.apiKey && aadAccount && aadAccount.authenticated) {
        authenticationType = AuthenticationType.aad;
      }

      let actions = [
        setApiKeyAppsAction(availableApiKeyApps),
        aadAuthenticatedAction(aadAuthenticated)
      ];

      if (searchPeriod) {
        actions.push(setSearchPeriodAction(searchPeriod));
      }

      if (query) {
        actions.push(setQueryAction(query));
      }

      if (authenticationType != null) {
        actions.push(setAuthenticationTypeAction(authenticationType));
      }

      if (aadAccount) {
        actions.push(setAADSubscriptionAction(aadAccount.subscriptionId));
        actions.push(setAADResourceAction(aadAccount.resourceId, aadAccount.appId));
        if (authenticationType === AuthenticationType.aad && !aadAccount.authenticated) {
          actions.push(aadSilentTokenRefreshAction());
        }
      }

      if (apiKeyAccount) {
        actions.push(setApiKeyCredentialsAction(
          apiKeyAccount.appId,
          apiKeyAccount.apiKey,
          apiKeyAccount.appName
        ));
      }

      actions.push(getLogsAction());

      return of(...actions);
    })
  );
}