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
    startDate: [],
    endDate: [],
    modalDisplay: false,
};

/**
 * sampleExtension reducer
 * @memberof sampleExtension.reducer
 * @param state - the plugins state
 * @param action - the current action triggered
 * @returns - returns the current actions to be made from the current action
 */
export default (state = initialState, action) => {
    console.log(action.type);
    // console.log(state);
    switch (action.type) {
    case actions.INIT_CONFIGS:
        return assign({}, state, { configs: action.configs });
    case actions.SET_PLUGIN_CONFIGS:
        return assign({}, state, { configs: action.configs });
    case actions.CHANGE_TAB:
        return assign({}, state, { activeTab: action.tab });
    case actions.ROSE_CLICKED:
        return assign({}, state, { roseValue: action.degree });
    case actions.SEARCH_FILTERS:
        return assign({}, state, { filtersTriggered: action.filters });
    case actions.SEARCH_VALUES_FILTERED:
        return assign({}, state, { searchResult: action.searchResult });
    case actions.ADD_BASKET:
        return assign({}, state, { itemId: action.itemId });
    case actions.UPDATE_ITEM_IN_BASKET:
        return assign({}, state, { basket: action.basket });
    case actions.COUNT_ITEMS_SELECTED_IN_BASKET:
         return assign({}, state, { itemCounterInBasket: action.count });
    case actions.SET_DATE_LIST:
        return assign({}, state, { dateList: action.dates });
    case actions.START_DATE_VALUE:
         return assign({}, state, { startDate: action.startDate });
    case actions.END_DATE_VALUE:
         return assign({}, state, { endDate: action.endDate });
    case actions.SET_POLYGON:
        return assign({}, state, { polygon: action.polygon });
    case actions.SET_PHOTO_COUNT:
        return assign({}, state, { photoCount: action.amount });
    case actions.FILTER_SEARCH_VALUES:
        return assign({}, state , { filterSearchValues: action.value });
    case actions.MODAL_DISPLAY:
        return assign({}, state , { modalDisplay: action.bool, modalType: action.modalType });
    case actions.UPDATE_HOVERED_POLYGON_VISIBILITY_STATE:
        return assign({}, state , { hoveredPolygonVisibilityState: action.visible });
    case actions.SET_DOWNLOADING:
        return assign({}, state , { downloading: action.bool });
    case actions.ACCUMULATE_SCROLL_EVENTS:
        return assign({}, state , { scrollIndicator: action.bool });
    case actions.SAVE_DOWNLOAD_FIELDS:
        return assign({}, state , { fileName: action.fileName, prefix: action.prefix });
    case actions.SET_PICTURES_IN_BASKET:
        return assign({}, state , { picturesInBasket: action.amount, basketSize: action.basketSize });
    case actions.SET_STARTDATE_VALUE:
        return assign({}, state , { startDateValue: action.startDateValue });
    case actions.SET_ENDDATE_VALUE:
        return assign({}, state , { endDateValue: action.endDateValue });
    case actions.CANCEL_SEARCH_FILTERS:
        return assign({}, state , { displayFilters: false });
    case actions.OPEN_SEARCH_FILTERS:
        return assign({}, state , { displayFilters: true });
    default:
        return state;
    }
};
