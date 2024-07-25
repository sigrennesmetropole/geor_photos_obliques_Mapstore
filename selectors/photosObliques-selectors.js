import { get, head } from "lodash";

// a supprimer quand plus nécessaire
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
 * getSelectedRoseValue checks which tab is open
 * @memberof plugin.selectors
 * @param state - application state
 * @returns - returns the tabs state
 */
export const getSelectedRoseValue = (state) => get(state, 'photosObliques.roseValue');

/**
* getFiltersTriggered checks which tab is open
* @memberof plugin.selectors
* @param state - application state
* @returns - returns the tabs state
*/
export const getFiltersTriggered = (state) => get(state, 'photosObliques.filtersTriggered');

/**
* getSearchResult checks which tab is open
* @memberof plugin.selectors
* @param state - application state
* @returns - returns the tabs state
*/
export const getSearchResult = (state) => get(state, 'photosObliques.searchResult');

/**
* getItemId checks which tab is open
* @memberof plugin.selectors
* @param state - application state
* @returns - returns the tabs state
*/
export const getItemId = (state) => get(state, 'photosObliques.getItemId');

/**
* getBasket checks which tab is open
* @memberof plugin.selectors
* @param state - application state
* @returns - returns the tabs state
*/
export const getBasket = (state) => get(state, 'photosObliques.basket');

/**
* getItemToRemove checks which tab is open
* @memberof plugin.selectors
* @param state - application state
* @returns - returns the tabs state
*/
export const getItemToRemove = (state) => get(state, 'photosObliques.itemToRemove');

/**
* getItemCounterInBasket checks which tab is open
* @memberof plugin.selectors
* @param state - application state
* @returns - returns the tabs state
*/
export const getItemCounterInBasket = (state) => get(state, 'photosObliques.itemCounterInBasket');

/**
* getStartDate checks which tab is open
* @memberof plugin.selectors
* @param state - application state
* @returns - returns the tabs state
*/
export const getStartDate = (state) => get(state, 'photosObliques.startDate');


/**
* getEndDate checks which tab is open
* @memberof plugin.selectors
* @param state - application state
* @returns - returns the tabs state
*/
export const getEndDate = (state) => get(state, 'photosObliques.endDate');

export const getSelectedTilesLayer = (state) => {
    const additionallayers = additionalLayersSelector(state) || [];
    return head(additionallayers.filter(({ id }) => id === PO_PERIMETER_LAYER_ID));
}

/**
* getPolygon checks which tab is open
* @memberof plugin.selectors
* @param state - application state
* @returns - returns the tabs state
*/
export const getPolygon = (state) => get(state, 'photosObliques.polygon');

/**
* getPhotoCountSelector checks which tab is open
* @memberof plugin.selectors
* @param state - application state
* @returns - returns the tabs state
*/
export const getPhotoCountSelector = (state) => get(state, 'photosObliques.photoCount');
