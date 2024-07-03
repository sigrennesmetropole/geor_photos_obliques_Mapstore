/* eslint-disable no-console */
import {UPDATE_MAP_LAYOUT} from "@mapstore/actions/maplayout";

export const actions = {
    LOCAL_ACTION: 'PHOTOSOBLIQUES:LOCAL_ACTION',
    INIT_CONFIGS: "PHOTOSOBLIQUES:INIT_CONFIGS",
    CHANGE_TAB: 'PHOTOSOBLIQUES:CHANGE_TAB',
    CLOSE_PHOTOSOBLIQUES: "PHOTOSOBLIQUES:CLOSE_PHOTOSOBLIQUES",
    ROSE_CLICKED: 'PHOTOSOBLIQUES:ROSE_CLICKED',
    SEARCH_FILTERS: 'PHOTOSOBLIQUES:SEARCH_FILTERS',
    CANCEL_SEARCH_FILTERS: 'PHOTOSOBLIQUES:CANCEL_SEARCH_FILTERS',
    FILTER_SEARCH_VALUES: "PHOTOSOBLIQUES:FILTER_SEARCH_VALUES",
    SEARCH_VALUES_FILTERED: "PHOTOSOBLIQUES:SEARCH_VALUES_FILTERED",
    ADD_BASKET: "PHOTOSOBLIQUES:ADD_BASKET",
    SET_ITEM_IN_BASKET: "PHOTOSOBLIQUES:SET_ITEM_IN_BASKET",
    REMOVE_SELECTED_ITEMS_IN_BASKET: "PHOTOSOBLIQUES:REMOVE_SELECTED_ITEMS_IN_BASKET",
    REMOVE_ITEM_IN_BASKET: "PHOTOSOBLIQUES:REMOVE_ITEM_IN_BASKET",
    CLICK_PICTURE: "PHOTOSOBLIQUES:CLICK_PICTURE",
    SELECT_ITEM_IN_BASKET: "PHOTOSOBLIQUES:SELECT_ITEM_IN_BASKET",
    DOWNLOAD_BASKET: "PHOTOSOBLIQUES:DOWNLOAD_BASKET",
    COUNT_ITEMS_SELECTED_IN_BASKET: "PHOTOSOBLIQUES:COUNT_ITEMS_SELECTED_IN_BASKET",
    START_DATE_VALUE: "PHOTOSOBLIQUES:START_DATE_VALUE",
    END_DATE_VALUE: "PHOTOSOBLIQUES:END_DATE_VALUE",
    INIT_PROJECTIONS: "PHOTOSOBLIQUES:INIT_PROJECTIONS",
    INIT_DATE_SELECT: "PHOTOSOBLIQUES:INIT_DATE_SELECT"
};

export const tabTypes = {
    HOME: 'PHOTOSOBLIQUES:HOME',
    SELECT: 'PHOTOSOBLIQUES:SELECT'
};


/**
 * photosObliquesUpdateMapLayout action to update map layout at plugin start
 * @memberof photosObliques.actions
 * @returns - action starts plugin page with source set
 */
export function photosObliquesUpdateMapLayout(layout) {
    return {
        type: UPDATE_MAP_LAYOUT,
        layout,
        source: 'photosObliques'
    };
}

/**
 * initConfigs action triggered to initialize or reinitialize plugin basic configs
 * @memberof photosObliques.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function initConfigs(configs) {
    return {
        type: actions.INIT_CONFIGS,
        configs
    };
}

/**
 * closephotosObliques action to close configs
 * @memberof photosObliques.actions
 * @returns - action close photosObliques plugin
 */
export function closephotosObliques() {
    return {
        type: actions.CLOSE_PHOTOSOBLIQUES
    };
}

/**
 * rtgeChangeTab start action to change tab
 * @memberof rtge.actions
 * @param tab - the tab string we should use
 * @returns - action change tab
 */
export function rtgeChangeTab(tab) {
    return {
        type: actions.CHANGE_TAB,
        tab
    };
}

/**
 * windRoseClick start action to change tab
 * @memberof plugin.actions
 * @param section - the selected section
 * @returns - action change tab
 */
export function windRoseClick(section) {
    return {
        type: actions.ROSE_CLICKED,
        section
    };
}

/**
 * validateSearchFilters start action to change tab
 * @memberof plugin.actions
 * @param section - the selected section
 * @returns - action change tab
 */
export function validateSearchFilters(filters) {
    return {
        type: actions.SEARCH_FILTERS,
        filters
    };
}

/**
 * cancelSearchFilters start action to change tab
 * @memberof plugin.actions
 * @param section - the selected section
 * @returns - action change tab
 */
export function cancelSearchFilters() {
    return {
        type: actions.CANCEL_SEARCH_FILTERS
    };
}

/**
 * filterSearchedValues start action to change tab
 * @memberof plugin.actions
 * @param section - the selected section
 * @returns - action change tab
 */
export function filterSearchedValues(value) {
    return {
        type: actions.FILTER_SEARCH_VALUES,
        value
    };
}

/**
 * searchValuesFiltered start action to change tab
 * @memberof plugin.actions
 * @param searchResult - the selected searchResult
 * @returns - action change tab
 */
export function searchValuesFiltered(searchResult) {
    return {
        type: actions.SEARCH_VALUES_FILTERED,
        searchResult
    };
}

/**
 * addBasket start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function addBasket(itemId) {
    return {
        type: actions.ADD_BASKET,
        itemId
    };
}

/**
 * setItemInBasket start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function setItemInBasket(item) {
    return {
        type: actions.SET_ITEM_IN_BASKET,
        item
    };
}

/**
 * removeItemOfBasket start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function removeItemOfBasket(item) {
    return {
        type: actions.REMOVE_ITEM_IN_BASKET,
        item
    };
}

/**
 * removeItemOfBasket start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function removeSelectedItemsInBasket() {
    return {
        type: actions.REMOVE_SELECTED_ITEMS_IN_BASKET
    };
}

/**
 * POClickTable start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function POClickPicture(itemId, ctrlKey, shiftKey) {
    return {
        type: actions.CLICK_PICTURE,
        itemId,
        ctrlKey,
        shiftKey
    };
}

/**
 * selectItemsInBasket start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function selectItemsInBasket(item) {
    return {
        type: actions.SELECT_ITEM_IN_BASKET,
        item
    };
}

/**
 * downloadBasket start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function downloadBasket() {
    return {
        type: actions.DOWNLOAD_BASKET
    };
}

/**
 * countItemsSelectedInBasket start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function countItemsSelectedInBasket(count) {
    return {
        type: actions.COUNT_ITEMS_SELECTED_IN_BASKET,
        count
    };
}

/**
 * getStartDateValue start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function getStartDateValue(startDate) {
    return {
        type: actions.START_DATE_VALUE,
        startDate
    };
}

/**
 * getEndDateValue start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function getEndDateValue(endDate) {
    return {
        type: actions.END_DATE_VALUE,
        endDate
    };
}

/**
 * initProjections start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function initProjections() {
    return {
        type: actions.INIT_PROJECTIONS
    };
}

/**
 * initDateSelect start action to change tab
 * @memberof plugin.actions
 * @returns -
 */
export function initDateSelect() {
    return {
        type: actions.INIT_DATE_SELECT
    };
}