import { get } from "lodash";

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
export const getSelectedRoseValue = (state) => get(state, 'sampleExtension.roseValue');

