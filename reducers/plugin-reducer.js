/* eslint-disable no-console */
import { actions } from "../actions/plugin-action";
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
        case actions.CHANGE_TAB:
            return assign({}, state, { activeTab: action.tab });
        case actions.ROSE_CLICKED:
            return assign({}, state, { roseValue: action.section });
    default:
        return state;
    }

};