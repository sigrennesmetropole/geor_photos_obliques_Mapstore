/* eslint-disable no-console */
import { actions } from "../actions/photosObliques-action";
import assign from 'object-assign';

const initialState = {
    value: 1,
    activeTab: tabTypes.HOME
};

/**
 * sampleExtension reducer
 * @memberof sampleExtension.reducer
 * @param state - the plugins state
 * @param action - the current action triggered
 * @returns - returns the current actions to be made from the current action
 */
export default (state = initialState, action) => {
    // console.log(action.type);
    console.log(state);
    switch (action.type) {
    case actions.INIT_CONFIGS:
        return assign({}, state, { configs: action.configs });
    case actions.CHANGE_TAB:
        return assign({}, state, { activeTab: action.tab });
    default:
        return state;
    }

};
