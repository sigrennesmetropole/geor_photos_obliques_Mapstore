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
    START_DATES_VALUES: "PHOTOSOBLIQUES:START_DATES_VALUES",
    END_DATES_VALUES: "PHOTOSOBLIQUES:END_DATES_VALUES",
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
    SET_LOADING: "PHOTOSOBLIQUES:SET_LOADING",
    ACCUMULATE_SCROLL_EVENTS: "PHOTOSOBLIQUES:ACCUMULATE_SCROLL_EVENTS",
    SAVE_DOWNLOAD_FIELDS: "PHOTOSOBLIQUES:SAVE_DOWNLOAD_FIELDS",
    CLEAR_FILTERS: "PHOTOSOBLIQUES:CLEAR_FILTERS",
    SET_PLUGIN_CONFIGS: "PHOTOSOBLIQUES:SET_PLUGIN_CONFIGS",
    SET_PICTURES_IN_BASKET: "PHOTOSOBLIQUES:SET_PICTURES_IN_BASKET",
    SET_END_DATE_VALUE: 'PHOTOSOBLIQUES:SET_END_DATE_VALUE',
    SET_START_DATE_VALUE: 'PHOTOSOBLIQUES:SET_START_DATE_VALUE',
    OPEN_SEARCH_FILTERS: 'PHOOSOBLIQUES:OPEN_SEARCH_FILTERS',
    SET_PHOTO_COUNT: 'PHOTOSOBLIQUES:SET_PHOTO_COUNT',
    SET_PREV_PHOTO_COUNT: 'PHOTOSOBLIQUES:SET_PREV_PHOTO_COUNT',
    SET_PREV_SEARCH_FILTERS_VALUES: 'PHOTOSOBLIQUES:SET_PREV_SEARCH_FILTERS_VALUES'
};

export const tabTypesPO = {
    SEARCH: 'PHOTOSOBLIQUES:SEARCH',
    CART: 'PHOTOSOBLIQUES:CART'
};

export const loadTypesPO = {
    NEW: 'PHOTOSOBLIQUES:LOAD:NEW',
    MORE: 'PHOTOSOBLIQUES:LOAD:MORE',
    SORT: 'PHOTOSOBLIQUES:LOAD:SORT'
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
};

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
};

/**
 * closePO action to close configs
 * @memberof photosObliques.actions
 * @returns - action close photosObliques plugin
 */
export function closePO() {
    return {
        type: actions.CLOSE_PHOTOSOBLIQUES
    };
};

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
};

/**
 * windRoseClickPO start action for degree value change on compass
 * @memberof plugin.actions
 * @param degree - the selected degree value on compass
 * @returns - action rose clicked
 */
export function windRoseClickPO(degree) {
    return {
        type: actions.ROSE_CLICKED,
        degree
    };
};

/**
 * windRoseClickPO start action to change degree value on compass
 * @memberof plugin.actions
 * @param degree - the degree value to apply on compass
 * @returns - action rose clicked setter
 */
export function setWindRoseClickPO(degree) {
    return {
        type: actions.ROSE_CLICKED_SETTER,
        degree
    };
};

/**
 * validateSearchFiltersPO start action to validate selected search filters and send it to BE
 * @memberof plugin.actions
 * @param filters - the selected filters values
 * @param loadMore - if filters are triggered to load more results
 * @param newSearch - if filters are triggered for a new search
 * @returns - action search filters
 */
export function validateSearchFiltersPO(filters, loadType) {
    return {
        type: actions.SEARCH_FILTERS,
        filters,
        loadType
    };
};

/**
 * cancelSearchFiltersPO start action to cancel search panel
 * @memberof plugin.actions
 * @returns - action cancel search filters
 */
export function cancelSearchFiltersPO() {
    return {
        type: actions.CANCEL_SEARCH_FILTERS
    };
};

/**
 * filterSearchedValuesPO start action to filter searched values
 * @memberof plugin.actions
 * @param value - the selected value
 * @returns - action filter search values
 */
export function filterSearchedValuesPO(value) {
    return {
        type: actions.FILTER_SEARCH_VALUES,
        value
    };
};

/**
 * searchValuesFilteredPO start action to change search values filtered
 * @memberof plugin.actions
 * @param searchResult - the selected searchResult
 * @returns - action search values filtered
 */
export function searchValuesFilteredPO(searchResult) {
    return {
        type: actions.SEARCH_VALUES_FILTERED,
        searchResult
    };
};

/**
 * addBasketPO start action to add item on basket
 * @memberof plugin.actions
 * @param item - the selected item
 * @returns - action add basket
 */
export function addBasketPO(item) {
    return {
        type: actions.ADD_BASKET,
        item
    };
};

/**
 * updateItemInBasketPO start action to update list of items in basket
 * @memberof plugin.actions
 * @param basket - the basket
 * @param removePopUp - the popup to display
 * @returns - action update item in basket
 */
export function updateItemInBasketPO(basket, removePopUp) {
    return {
        type: actions.UPDATE_ITEM_IN_BASKET,
        basket,
        removePopUp
    };
};

/**
 * removeSelectedItemsInBasketPO start action to remove selected item(s) of basket
 * @memberof plugin.actions
 * @param forceDeletionOnEmptySelection - the items to remove
 * @returns - action remove selected items in basket
 */
export function removeSelectedItemsInBasketPO(forceDeletionOnEmptySelection) {
    return {
        type: actions.REMOVE_SELECTED_ITEMS_IN_BASKET,
        forceDeletionOnEmptySelection
    };
};

/**
 * clickPicturePO start action to select picture in basket
 * @memberof plugin.actions
 * @param itemId - the selected itemId
 * @param ctrlKey - the ctrl Key status
 * @param shiftKey - the shift key status
 * @returns - action click picture
 */
export function clickPicturePO(itemId, ctrlKey, shiftKey) {
    return {
        type: actions.CLICK_PICTURE,
        itemId,
        ctrlKey,
        shiftKey
    };
};

/**
 * downloadBasketPO start action to download
 * @memberof plugin.actions
 * @returns - action download basket
 */
export function downloadBasketPO() {
    return {
        type: actions.DOWNLOAD_BASKET
    };
};

/**
 * countItemsSelectedInBasketPO start action to count selected items in basket
 * @memberof plugin.actions
 * @param count - number of items
 * @returns - action count items selected in basket
 */
export function countItemsSelectedInBasketPO(count) {
    return {
        type: actions.COUNT_ITEMS_SELECTED_IN_BASKET,
        count
    };
};

/**
 * getStartDatesValuesPO start action to change start date value
 * @memberof plugin.actions
 * @param dates - selected start date
 * @returns - action start date value
 */
export function getStartDatesValuesPO(dates) {
    return {
        type: actions.START_DATES_VALUES,
        dates
    };
};

/**
 * getEndDatesValuesPO start action to change end date value
 * @memberof plugin.actions
 * @param dates - selected end date
 * @returns - action end date value
 */
export function getEndDatesValuesPO(dates) {
    return {
        type: actions.END_DATES_VALUES,
        dates
    };
};

/**
 * selectStartDateValuePO start action to select start date value
 * @memberof plugin.actions
 * @param startDate - selected start date
 * @returns - action select start date value
 */
export function selectStartDateValuePO(startDate) {
    return {
        type: actions.SELECT_START_DATE_VALUE,
        startDate
    };
};

/**
 * selectEndDateValuePO start action to select end date value
 * @memberof plugin.actions
 * @param endDate - selected end date
 * @returns - action select end date value
 */
export function selectEndDateValuePO(endDate) {
    return {
        type: actions.SELECT_END_DATE_VALUE,
        endDate
    };
};

/**
 * initProjectionsPO start action to initialize available projections
 * @memberof plugin.actions
 * @returns - action init projections
 */
export function initProjectionsPO() {
    return {
        type: actions.INIT_PROJECTIONS
    };
};

/**
 * initDateSelectPO start action to initialize date selection
 * @memberof plugin.actions
 * @returns - action init date select
 */
export function initDateSelectPO() {
    return {
        type: actions.INIT_DATE_SELECT
    };
};

/**
 * initOverlayLayerPO start action to initialize overlay layer
 * @memberof plugin.actions
 * @returns - action init overlay layer
 */
export function initOverlayLayerPO() {
    return {
        type: actions.INIT_OVERLAY_LAYER
    };
};

/**
 * setPolygonPO start action to set polygon on layer
 * @memberof plugin.actions
 * @param polygon - polygon to set
 * @returns - action set polygon
 */
export function setPolygonPO(polygon) {
    return {
        type: actions.SET_POLYGON,
        polygon
    };
};

/**
 * getPhotoCountActionPO start action to change number of estimated results
 * @memberof plugin.actions
 * @returns - action get photo count
 */
export function getPhotoCountActionPO() {
    return {
        type: actions.GET_PHOTO_COUNT
    };
};

/**
 * setPhotoCountActionPO start action to change value of diplayed number of results
 * @memberof plugin.actions
 * @param amount - number to display
 * @returns - action set photo count
 */
export function setPhotoCountActionPO(amount) {
    return {
        type: actions.SET_PHOTO_COUNT,
        amount
    };
};

/**
 * pictureHoveredPO start action to change hovered picture
 * @memberof plugin.actions
 * @param item - selected picture
 * @returns - action picture hovered
 */
export function pictureHoveredPO(item) {
    return {
        type: actions.PICTURE_HOVERED,
        item
    };
};

/**
 * zoomElementPO start action to change map extent to match picture's extent
 * @memberof plugin.actions
 * @param item - selected pictures
 * @returns - action zoom element
 */
export function zoomElementPO(item) {
    return {
        type: actions.ZOOM_ELEMENT,
        item
    };
};

/**
 * filterBasketValuesPO start action to change basket sorting value
 * @memberof plugin.actions
 * @param filterValue - selected filter value
 * @returns - action filter basket values
 */
export function filterBasketValuesPO(filterValue) {
    return {
        type: actions.FILTER_BASKET_VALUES,
        filterValue
    };
};

/**
 * onScrollPO start action when user is scrolling
 * @memberof plugin.actions
 * @returns - action onscroll
 */
export function onScrollPO() {
    return {
        type: actions.ONSCROLL
    };
};

/**
 * setDateListPO start action to change list of avalaible dates
 * @memberof plugin.actions
 * @param dates - list of available dates
 * @returns - action set date list
 */
export function setDateListPO(dates) {
    return {
        type: actions.SET_DATE_LIST,
        dates
    };
};

/**
 * modalDisplayPO start action to change modal to display
 * @memberof plugin.actions
 * @param bool - modal bool
 * @param modalType - modal type
 * @returns - action modal display
 */
export function modalDisplayPO(bool, modalType) {
    return {
        type: actions.MODAL_DISPLAY,
        bool,
        modalType
    };
};

/**
 * updateHoveredPolygonVisibilityStatePO start action to change hovered polygon visibility
 * @memberof plugin.actions
 * @param visible - visibility value of hovered polygon
 * @returns - action update hovered polygon visibility state
 */
export function updateHoveredPolygonVisibilityStatePO(visible) {
    return {
        type: actions.UPDATE_HOVERED_POLYGON_VISIBILITY_STATE,
        visible
    };
};

/**
 * setDownloading start action to change downloading status
 * @memberof plugin.actions
 * @param bool - bool of downloading status
 * @returns - action set downloading
 */
export function setDownloadingPO(bool) {
    return {
        type: actions.SET_DOWNLOADING,
        bool
    };
};

/**
 * setLoading start action to change Loading results status
 * @memberof plugin.actions
 * @param bool - bool of loading results status
 * @returns - action set loading
 */
export function setLoadingPO(bool) {
    return {
        type: actions.SET_LOADING,
        bool
    };
};

/**
 * accumulateScrollEventsPO start action to accumulate search results when user is scrolling
 * @memberof plugin.actions
 * @param bool - bool
 * @returns - action accumulate scroll events
 */
export function accumulateScrollEventsPO(bool) {
    return {
        type: actions.ACCUMULATE_SCROLL_EVENTS,
        bool
    };
};

/**
 * saveDownloadFieldsPO start action to change fileName and prefix of files to download
 * @memberof plugin.actions
 * @param fileName - selected end date
 * @param prefix - selected end date
 * @returns - action save download fields
 */
export function saveDownloadFieldsPO(fileName, prefix) {
    return {
        type: actions.SAVE_DOWNLOAD_FIELDS,
        fileName,
        prefix
    };
};

/**
 * clearFiltersPO start action to clear search filters values
 * @memberof plugin.actions
 * @returns - action clear filters
 */
export function clearFiltersPO() {
    return {
        type: actions.CLEAR_FILTERS
    };
};

/**
 * setPluginConfigsPO action triggered to change plugin basic configs
 * @memberof photosObliques.actions
 * @param configs - configs object
 * @returns - action set plugin configs
 */
export function setPluginConfigsPO(configs) {
    return {
        type: actions.SET_PLUGIN_CONFIGS,
        configs
    };
};

/**
 * setPicturesInBasketPO action to set pictures in basket and checks limitations
 * @memberof photosObliques.actions
 * @param amount - number of pictures in basket
 * @param basketSize - size of basket
 * @returns - action set pictures in basket
 */
export function setPicturesInBasketPO(amount, basketSize) {
    return {
        type: actions.SET_PICTURES_IN_BASKET,
        amount,
        basketSize
    };
};

/**
 * setStartDateValuePO action to change start date value
 * @memberof photosObliques.actions
 * @param startDateValue - start date value to apply
 * @returns - action set startdate value
 */
export function setStartDateValuePO(startDateValue) {
    return {
        type: actions.SET_START_DATE_VALUE,
        startDateValue
    };
};

/**
 * setEndDateValuePO action to change end date value
 * @memberof photosObliques.actions
 * @param enDateValue - end date value to apply
 * @returns - action set enddate value
 */
export function setEndDateValuePO(endDateValue) {
    return {
        type: actions.SET_END_DATE_VALUE,
        endDateValue
    };
};

/**
 * openSearchFiltersPO action triggered to open search panel
 * @memberof photosObliques.actions
 * @returns - action open search filters
 */
export function openSearchFiltersPO() {
    return {
        type: actions.OPEN_SEARCH_FILTERS
    };
};

/**
 * setPrevPhotoCount action to change the number of current results
 * @memberof photosObliques.actions
 * @param prevPhotoCount - number of pictures for the current results
 * @returns - action set prev photo count
 */
export function setPrevPhotoCount(prevPhotoCount) {
    return {
        type: actions.SET_PREV_PHOTO_COUNT,
        prevPhotoCount
    };
};

/**
 * setPrevFiltersValues action to change the search filters of current results
 * @memberof photosObliques.actions
 * @param prevSearchFiltersValues - selected search filters for the current results
 * @returns - action set prev search filters values
 */
export function setPrevSearchFiltersValues(prevSearchFiltersValues) {
    return {
        type: actions.SET_PREV_SEARCH_FILTERS_VALUES,
        prevSearchFiltersValues
    };
};