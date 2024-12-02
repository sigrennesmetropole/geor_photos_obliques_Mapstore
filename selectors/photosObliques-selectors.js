import { get, head } from "lodash";
import { additionalLayersSelector } from '@mapstore/selectors/layers';
import {
    PO_PERIMETER_LAYER_ID
} from "../constants/photosObliques-constants";

/**
 * isOpen checks if plugin tab is open or not
 * @memberof photosObliques.selectors
 * @param state - application state
 * @returns - returns the plugins panel state
 */
export const isOpen = (state) => get(state, 'controls.photosObliques.enabled');

/**
 * getActiveTab checks which tab is open
 * @memberof photosObliques.selectors
 * @param state - application state
 * @returns - returns the tabs state
 */
export const  getActiveTab = (state) => get(state, 'photosObliques.activeTab');

/**
 * getSelectedRoseValue checks which value is selected on compass
 * @memberof photosObliques.selectors
 * @param state - application state
 * @returns - returns the Selected Compass Value state
 */
export const getSelectedRoseValue = (state) => get(state, 'photosObliques.roseValue');

/**
* getFiltersTriggered checks which filters values are triggered
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the filters values triggered
*/
export const getFiltersTriggered = (state) => get(state, 'photosObliques.filtersTriggered');

/**
* getSearchResult checks results of search
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the search results state
*/
export const getSearchResult = (state) => get(state, 'photosObliques.searchResult');

/**
* getItemId checks id of item in basket
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns id of basket's item state
*/
export const getItemId = (state) => get(state, 'photosObliques.getItemId');

/**
* getBasket checks basket
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the basket state
*/
export const getBasket = (state) => get(state, 'photosObliques.basket');

/**
* getItemCounterInBasket checks number of item in basket
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the counter in basket state
*/
export const getItemCounterInBasket = (state) => get(state, 'photosObliques.itemCounterInBasket');

/**
* getStartDate checks list of available start dates
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the list of start dates state
*/
export const getStartDate = (state) => get(state, 'photosObliques.startDate');


/**
* getEndDate checks list of available end dates
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the list of end dates state
*/
export const getEndDate = (state) => get(state, 'photosObliques.endDate');

/**
* getSelectedTilesLayer checks plugin's additional layer
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the addtional layer state
*/
export const getSelectedTilesLayer = (state) => {
    const additionallayers = additionalLayersSelector(state) || [];
    return head(additionallayers.filter(({ id }) => id === PO_PERIMETER_LAYER_ID));
}

/**
* getPolygon checks polygon of a picture
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the polygon state
*/
export const getPolygon = (state) => get(state, 'photosObliques.polygon');

/**
* getPhotoCountSelector checks number of pictures
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the PhotoCount state
*/
export const getPhotoCountSelector = (state) => get(state, 'photosObliques.photoCount');

/**
* getFilterSearchValues checks filter search values
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns filter search values state
*/
export const getFilterSearchValues = (state) => get(state, 'photosObliques.filterSearchValues');

/**
* getDateList checks list of avalaible dates
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the list of date state
*/
export const getDateList = (state) => get(state, 'photosObliques.dateList');

/**
* getModalDisplay checks which modal to display
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the modal state
*/
export const getModalDisplay = (state) => get(state, 'photosObliques.modalDisplay');

/**
* getModalType checks which type of Modal
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the modal type state
*/
export const getModalType = (state) => get(state, 'photosObliques.modalType');

/**
* getHoveredPolygonVisibilityState checks visibility of the hovered picture's polygon
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns hovered polygon visibility state
*/
export const getHoveredPolygonVisibilityState = (state) => get(state, 'photosObliques.hoveredPolygonVisibilityState');

/**
* getDownloading checks downloading state
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the downloading state
*/
export const getDownloading = (state) => get(state, 'photosObliques.downloading');

/**
* getLoading checks loading state
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the loading state
*/
export const getLoading = (state) => get(state, 'photosObliques.loading');

/**
* getScrollIndicator checks the scroll indicator
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns scroll indicator state
*/
export const getScrollIndicator = (state) => get(state, 'photosObliques.scrollIndicator');

/**
* getPrefix checks which prefix has been chosen for the files to download
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the prefix state
*/
export const getPrefix = (state) => get(state, 'photosObliques.prefix');

/**
* getFileName checks which name has been chosen for the files to download
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the file name state
*/
export const getFileName = (state) => get(state, 'photosObliques.fileName');

/**
* getPluginConfig checks plugin's config parameters
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the plugin config state
*/
export const getPluginConfig = (state) => get(state, 'photosObliques.configs');

/**
* getPicturesInBasket checks number of pictures in basket
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the number of picture in basket state
*/
export const getPicturesInBasket = (state) => get(state, 'photosObliques.picturesInBasket');

/**
* getBasketSize checks size of basket
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the basket size state
*/
export const getBasketSize = (state) => get(state, 'photosObliques.basketSize');

/**
* getStartDateValue checks which start date is selected
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the start date value state
*/
export const getStartDateValue = (state) => get(state, 'photosObliques.startDateValue');

/**
* getEndDateValue checks which end date is selected
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the end date value state
*/
export const getEndDateValue = (state) => get(state, 'photosObliques.endDateValue');

/**
* getDisplayFilters checks if search panel is displayed
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the display Filters state
*/
export const getDisplayFilters = (state) => get(state, 'photosObliques.displayFilters');

/**
* getPrevPhotoCount checks number of pictures in current results
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the photo count of previous search state
*/
export const getPrevPhotoCount = (state) => get(state, 'photosObliques.prevPhotoCount');

/**
* getPrevSearchFilterValues checks search filters of current results
* @memberof photosObliques.selectors
* @param state - application state
* @returns - returns the filters of previous search state
*/
export const getPrevSearchFiltersValues = (state) => get(state, 'photosObliques.prevSearchFiltersValues');