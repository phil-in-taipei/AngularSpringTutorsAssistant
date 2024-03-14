import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { Params, RouterStateSnapshot } from '@angular/router';
import {
  StoreRouterConnectingModule,
  routerReducer,
  RouterReducerState,
  RouterStateSerializer,
} from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export interface State {
  router: RouterReducerState<RouterStateUrl>;
}


export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    //console.log(`This is the overall route data: ${route}`);

    const { url, root: { queryParams } } = routerState;
    const { params } = route;
    //console.log(`The is the url: ${url}`);
    //console.log(`The is the params: ${params}`);
    //let paramKeys = Object.keys(params)
    //console.log('paramkeys =>', paramKeys);
    //console.log(`The is the queryParams: ${queryParams}`);
    //let queryParamsKeys = Object.keys(queryParams)
    //console.log('queryParamsKeys =>', queryParamsKeys);

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}
