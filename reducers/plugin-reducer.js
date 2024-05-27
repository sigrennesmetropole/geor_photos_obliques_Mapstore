/* eslint-disable no-console */
<<<<<<< HEAD:reducers/photosObliques-reducer.js
import { actions, tabTypes } from "../actions/photosObliques-action";
=======
import { actions } from "../actions/plugin-action";
>>>>>>> 420437f9f008b4273af04f34e5b3d92ac148901a:reducers/plugin-reducer.js
import assign from 'object-assign';

const initialState = {
    value: 1
};

/**
 * sampleExtension reducer
 * @memberof plugin.reducer
 * @param state - the plugins state
 * @param action - the current action triggered
 * @returns - returns the current actions to be made from the current action
 */
export default (state = initialState, action) => {
    console.log(action.type);
    // console.log(state);
    switch (action.type) {
<<<<<<< HEAD:reducers/photosObliques-reducer.js
    case actions.INIT_CONFIGS:
        return assign({}, state, { configs: action.configs });
    case actions.CHANGE_TAB:
        return assign({}, state, { activeTab: action.tab });
    case actions.ROSE_CLICKED:
        return assign({}, state, { roseValue: action.section });
=======
        case actions.CHANGE_TAB:
            return assign({}, state, { activeTab: action.tab });
        case actions.ROSE_CLICKED:
            return assign({}, state, { roseValue: action.section });
>>>>>>> 420437f9f008b4273af04f34e5b3d92ac148901a:reducers/plugin-reducer.js
    default:
        return state;
    }

};