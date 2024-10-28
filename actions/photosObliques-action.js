/* eslint-disable no-console */
import {UPDATE_MAP_LAYOUT} from "@mapstore/actions/maplayout";

export const actions = {
    LOCAL_ACTION: 'PHOTOSOBLIQUES:LOCAL_ACTION',
    INIT_CONFIGS: "PHOTOSOBLIQUES:INIT_CONFIGS",
    CHANGE_TAB: 'PHOTOSOBLIQUES:CHANGE_TAB',
    CLOSE_PHOTOSOBLIQUES: "PHOTOSOBLIQUES:CLOSE_PHOTOSOBLIQUES",
    ROSE_CLICKED: 'PHOTOSOBLIQUES:ROSE_CLICKED',
    ROSE_CLICKED_SETTER: "PHOTOSOBLIQUES:ROSE_CLICKED_SETTER",
    SEARCH_FILTERS: 'PHOTOSOBLIQUES:SEARCH_FILTERS',
    CANCEL_SEARCH_FILTERS: 'PHOTOSOBLIQUES:CANCEL_SEARCH_FILTERS',
    FILTER_SEARCH_VALUES: "PHOTOSOBLIQUES:FILTER_SEARCH_VALUES",
    SEARCH_VALUES_FILTERED: "PHOTOSOBLIQUES:SEARCH_VALUES_FILTERED",
    ADD_BASKET: "PHOTOSOBLIQUES:ADD_BASKET",
    UPDATE_ITEM_IN_BASKET: "PHOTOSOBLIQUES:UPDATE_ITEM_IN_BASKET",
    REMOVE_SELECTED_ITEMS_IN_BASKET: "PHOTOSOBLIQUES:REMOVE_SELECTED_ITEMS_IN_BASKET",
    CLICK_PICTURE: "PHOTOSOBLIQUES:CLICK_PICTURE",
    DOWNLOAD_BASKET: "PHOTOSOBLIQUES:DOWNLOAD_BASKET",
    COUNT_ITEMS_SELECTED_IN_BASKET: "PHOTOSOBLIQUES:COUNT_ITEMS_SELECTED_IN_BASKET",
    START_DATE_VALUE: "PHOTOSOBLIQUES:START_DATE_VALUE",
    END_DATE_VALUE: "PHOTOSOBLIQUES:END_DATE_VALUE",
    INIT_PROJECTIONS: "PHOTOSOBLIQUES:INIT_PROJECTIONS",
    INIT_DATE_SELECT: "PHOTOSOBLIQUES:INIT_DATE_SELECT",
    INIT_OVERLAY_LAYER: "PHOTOSOBLIQUES:INIT_OVERLAY_LAYER",
    SET_DATES: 'PHOTOSOBLIQUES:SET_DATES',
    SELECT_START_DATE_VALUE: 'PHOTOSOBLIQUES:SELECT_START_DATE_VALUE',
    SELECT_END_DATE_VALUE: 'PHOTOSOBLIQUES:SELECT_END_DATE_VALUE',
    SET_POLYGON: 'PHOTOSOBLIQUES:SET_POLYGON',
    GET_PHOTO_COUNT: 'PHOTOSOBLIQUES:GET_PHOTO_COUNT',
    PICTURE_HOVERED: 'PHOTOSOBLIQUES:PICTURE_HOVERED',
    ZOOM_ELEMENT: "PHOTOSOBLIQUES:ZOOM_ELEMENT",
    FILTER_BASKET_VALUES: "PHOTOSOBLIQUES:FILTER_BASKET_VALUES",
    ONSCROLL: "PHOTOSOBLIQUES:ONSCROLL",
    SET_DATE_LIST: "PHOTOSOBLIQUES:SET_DATE_LIST",
    MODAL_DISPLAY: "PHOTOSOBLIQUES:MODAL_DISPLAY",
    UPDATE_HOVERED_POLYGON_VISIBILITY_STATE: "PHOTOSOBLIQUES:UPDATE_HOVERED_POLYGON_VISIBILITY_STATE",
    SET_DOWNLOADING: "PHOTOSOBLIQUES:SET_DOWNLOADING",
    ACCUMULATE_SCROLL_EVENTS: "PHOTOSOBLIQUES:ACCUMULATE_SCROLL_EVENTS",
    SAVE_DOWNLOAD_FIELDS: "PHOTOSOBLIQUES:SAVE_DOWNLOAD_FIELDS",
    CLEAR_FILTERS: "PHOTOSOBLIQUES:CLEAR_FILTERS",
    SET_PLUGIN_CONFIGS: "PHOTOSOBLIQUES:SET_PLUGIN_CONFIGS",
    SET_PICTURES_IN_BASKET: "PHOTOSOBLIQUES:SET_PICTURES_IN_BASKET",
    SET_ENDDATE_VALUE: 'PHOTOSOBLIQUES:SET_ENDDATE_VALUE',
    SET_STARTDATE_VALUE: 'PHOTOSOBLIQUES:SET_STARTDATE_VALUE',
    OPEN_SEARCH_FILTERS: 'PHOOSOBLIQUES:OPEN_SEARCH_FILTERS',
    SET_PHOTO_COUNT: 'PHOTOSOBLIQUES:SET_PHOTO_COUNT',
    SET_PREV_PHOTO_COUNT: 'PHOTOSOBLIQUES:SET_PREV_PHOTO_COUNT'
};

export const tabTypes = {
    HOME: 'PHOTOSOBLIQUES:HOME',
    SELECT: 'PHOTOSOBLIQUES:SELECT'
};


/**
 * updateMapLayoutPO action to update map layout at plugin start
 * @memberof photosObliques.actions
 * @returns - action starts plugin page with source set
 */
export function updateMapLayoutPO(layout) {
    return {
        type: UPDATE_MAP_LAYOUT,
        layout,
        source: 'photosObliques'
    };
}

/**
 * initConfigsPO action triggered to initialize or reinitialize plugin basic configs
 * @memberof photosObliques.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function initConfigsPO(configs) {
    return {
        type: actions.INIT_CONFIGS,
        configs
    };
}

/**
 * closePO action to close configs
 * @memberof photosObliques.actions
 * @returns - action close photosObliques plugin
 */
export function closePO() {
    return {
        type: actions.CLOSE_PHOTOSOBLIQUES
    };
}

/**
 * changeTabPO start action to change tab
 * @memberof photosObliques.actions
 * @param tab - the tab string we should use
 * @returns - action change tab
 */
export function changeTabPO(tab) {
    return {
        type: actions.CHANGE_TAB,
        tab
    };
}

/**
 * windRoseClickPO start action to change tab
 * @memberof plugin.actions
 * @param section - the selected section
 * @returns - action change tab
 */
export function windRoseClickPO(degree) {
    return {
        type: actions.ROSE_CLICKED,
        degree
    };
}

/**
 * windRoseClickPO start action to change tab
 * @memberof plugin.actions
 * @param section - the selected section
 * @returns - action change tab
 */
export function setWindRoseClickPO(degree) {
    return {
        type: actions.ROSE_CLICKED_SETTER,
        degree
    };
}

/**
 * validateSearchFiltersPO start action to change tab
 * @memberof plugin.actions
 * @param section - the selected section
 * @returns - action change tab
 */
export function validateSearchFiltersPO(filters, loadMore, newSearch) {
    return {
        type: actions.SEARCH_FILTERS,
        filters,
        loadMore,
        newSearch
    };
}

/**
 * cancelSearchFiltersPO start action to change tab
 * @memberof plugin.actions
 * @param section - the selected section
 * @returns - action change tab
 */
export function cancelSearchFiltersPO() {
    return {
        type: actions.CANCEL_SEARCH_FILTERS
    };
}

/**
 * filterSearchedValuesPO start action to change tab
 * @memberof plugin.actions
 * @param section - the selected section
 * @returns - action change tab
 */
export function filterSearchedValuesPO(value) {
    return {
        type: actions.FILTER_SEARCH_VALUES,
        value
    };
}

/**
 * searchValuesFilteredPO start action to change tab
 * @memberof plugin.actions
 * @param searchResult - the selected searchResult
 * @returns - action change tab
 */
export function searchValuesFilteredPO(searchResult) {
    return {
        type: actions.SEARCH_VALUES_FILTERED,
        searchResult
    };
}

/**
 * addBasketPO start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function addBasketPO(item) {
    return {
        type: actions.ADD_BASKET,
        item
    };
}

/**
 * updateItemInBasketPO start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function updateItemInBasketPO(basket, removePopUp) {
    return {
        type: actions.UPDATE_ITEM_IN_BASKET,
        basket,
        removePopUp
    };
}

/**
 * removeSelectedItemsInBasketPO start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function removeSelectedItemsInBasketPO(forceDeletionOnEmptySelection) {
    return {
        type: actions.REMOVE_SELECTED_ITEMS_IN_BASKET,
        forceDeletionOnEmptySelection
    };
}

/**
 * clickPicturePO start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function clickPicturePO(itemId, ctrlKey, shiftKey) {
    return {
        type: actions.CLICK_PICTURE,
        itemId,
        ctrlKey,
        shiftKey
    };
}

/**
 * downloadBasketPO start action to change tab
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @returns - action change tab
 */
export function downloadBasketPO() {
    return {
        type: actions.DOWNLOAD_BASKET
    };
}

/**
 * countItemsSelectedInBasketPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function countItemsSelectedInBasketPO(count) {
    return {
        type: actions.COUNT_ITEMS_SELECTED_IN_BASKET,
        count
    };
}

/**
 * getStartDateValuePO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function getStartDateValuePO(startDate) {
    return {
        type: actions.START_DATE_VALUE,
        startDate
    };
}

/**
 * getEndDateValuePO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function getEndDateValuePO(endDate) {
    return {
        type: actions.END_DATE_VALUE,
        endDate
    };
}

/**
 * selectStartDateValuePO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function selectStartDateValuePO(startDate) {
    return {
        type: actions.SELECT_START_DATE_VALUE,
        startDate
    };
}

/**
 * selectEndDateValuePO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function selectEndDateValuePO(endDate) {
    return {
        type: actions.SELECT_END_DATE_VALUE,
        endDate
    };
}

/**
 * initProjectionsPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function initProjectionsPO() {
    return {
        type: actions.INIT_PROJECTIONS
    };
}

/**
 * initDateSelectPO start action to change tab
 * @memberof plugin.actions
 * @returns -
 */
export function initDateSelectPO() {
    return {
        type: actions.INIT_DATE_SELECT
    };
}

/**
 * initOverlayLayerPO start action to change tab
 * @memberof plugin.actions
 * @returns -
 */
export function initOverlayLayerPO() {
    return {
        type: actions.INIT_OVERLAY_LAYER
    };
}

/**
 * setPolygonPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function setPolygonPO(polygon) {
    return {
        type: actions.SET_POLYGON,
        polygon
    };
}

/**
 * getPhotoCountActionPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function getPhotoCountActionPO() {
    return {
        type: actions.GET_PHOTO_COUNT
    };
}

/**
 * setPhotoCountActionPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function setPhotoCountActionPO(amount) {
    return {
        type: actions.SET_PHOTO_COUNT,
        amount
    };
}

/**
 * pictureHoveredPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function pictureHoveredPO(item) {
    return {
        type: actions.PICTURE_HOVERED,
        item
    };
}

/**
 * zoomElementPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function zoomElementPO(item) {
    return {
        type: actions.ZOOM_ELEMENT,
        item
    };
}

/**
 * filterBasketValuesPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function filterBasketValuesPO(filterValue) {
    return {
        type: actions.FILTER_BASKET_VALUES,
        filterValue
    };
}

/**
 * onScrollPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function onScrollPO() {
    return {
        type: actions.ONSCROLL
    };
}

/**
 * setDateListPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function setDateListPO(dates) {
    return {
        type: actions.SET_DATE_LIST,
        dates
    };
}

/**
 * modalDisplayPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function modalDisplayPO(bool, modalType) {
    return {
        type: actions.MODAL_DISPLAY,
        bool,
        modalType
    };
}

/**
 * updateHoveredPolygonVisibilityStatePO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function updateHoveredPolygonVisibilityStatePO(visible) {
    return {
        type: actions.UPDATE_HOVERED_POLYGON_VISIBILITY_STATE,
        visible
    };
}

/**
 * setDownloading start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function setDownloadingPO(bool) {
    return {
        type: actions.SET_DOWNLOADING,
        bool
    };
}

/**
 * accumulateScrollEventsPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function accumulateScrollEventsPO(bool) {
    return {
        type: actions.ACCUMULATE_SCROLL_EVENTS,
        bool
    };
}

/**
 * saveDownloadFieldsPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function saveDownloadFieldsPO(fileName, prefix) {
    return {
        type: actions.SAVE_DOWNLOAD_FIELDS,
        fileName,
        prefix
    };
}

/**
 * clearFiltersPO start action to change tab
 * @memberof plugin.actions
 * @returns - action change tab
 */
export function clearFiltersPO() {
    return {
        type: actions.CLEAR_FILTERS
    };
}

/**
 * setPluginConfigsPO action triggered to initialize or reinitialize plugin basic configs
 * @memberof photosObliques.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function setPluginConfigsPO(configs) {
    return {
        type: actions.SET_PLUGIN_CONFIGS,
        configs
    };
}

/**
 * setPicturesInBasketPO action triggered to initialize or reinitialize plugin basic configs
 * @memberof photosObliques.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function setPicturesInBasketPO(amount, basketSize) {
    return {
        type: actions.SET_PICTURES_IN_BASKET,
        amount,
        basketSize
    };
}

/**
 * setStartDateValuePO action triggered to initialize or reinitialize plugin basic configs
 * @memberof photosObliques.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function setStartDateValuePO(startDateValue) {
    return {
        type: actions.SET_STARTDATE_VALUE,
        startDateValue
    };
}

/**
 * setEndDateValuePO action triggered to initialize or reinitialize plugin basic configs
 * @memberof photosObliques.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function setEndDateValuePO(endDateValue) {
    return {
        type: actions.SET_ENDDATE_VALUE,
        endDateValue
    };
}

/**
 * openSearchFiltersPO action triggered to initialize or reinitialize plugin basic configs
 * @memberof photosObliques.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function openSearchFiltersPO() {
    return {
        type: actions.OPEN_SEARCH_FILTERS
    };
}

/**
 * setPrevPhotoCount action triggered to initialize or reinitialize plugin basic configs
 * @memberof photosObliques.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function setPrevPhotoCount(prevPhotoCount) {
    return {
        type: actions.SET_PREV_PHOTO_COUNT,
        prevPhotoCount
    };
}