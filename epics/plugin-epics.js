/* eslint-disable no-console */
import Rx from "rxjs";

import {
    actions
} from "../actions/plugin-action.js";

export const windRoseClickedEpic = (action$, store) => action$.ofType(actions.ROSE_CLICKED).switchMap(() => {
    /* eslint-disable */
    console.log('CURRENT ROSE SECTION SELECTED: ' + store.getState().sampleExtension.roseValue);
    /* eslint-enable */
    return Rx.Observable.empty();
})