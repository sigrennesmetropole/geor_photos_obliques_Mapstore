/* eslint-disable no-console */
import { actions, tabTypes } from "../actions/photosObliques-action";
import assign from 'object-assign';

const initialState = {
    // value: 1,
    activeTab: tabTypes.HOME,
    roseValue: "",
    filtersTriggered: "",
    searchResult: [],
    itemId: "",
    basket: [],
    itemToRemove: "",
    itemCounterInBasket: 0,
    startDate: "0",
    endDate: "0"
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
    // console.log(state);
    switch (action.type) {
    case actions.INIT_CONFIGS:
        return assign({}, state, { configs: action.configs });
    case actions.CHANGE_TAB:
        return assign({}, state, { activeTab: action.tab });
    case actions.ROSE_CLICKED:
        return assign({}, state, { roseValue: action.section });
    case actions.SEARCH_FILTERS:
        return assign({}, state, { filtersTriggered: action.filters });
    case actions.SEARCH_VALUES_FILTERED:
        return assign({}, state, { searchResult: action.searchResult });
    case actions.ADD_BASKET:
        return assign({}, state, { itemId: action.itemId });
    case actions.SET_ITEM_IN_BASKET:
        return assign({}, state, { basket: action.item });
    case actions.REMOVE_ITEM_IN_BASKET:
         return assign({}, state, { basket: action.item });
    case actions.SELECT_ITEM_IN_BASKET:
         return assign({}, state, { basket: action.item });
    case actions.COUNT_ITEMS_SELECTED_IN_BASKET:
         return assign({}, state, { itemCounterInBasket: action.count });
    case actions.START_DATE_VALUE:
         return assign({}, state, { startDate: action.startDate });
    case actions.END_DATE_VALUE:
         return assign({}, state, { endDate: action.endDate });
    default:
        return state;
    }
};
