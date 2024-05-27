import { get } from "lodash";

/**
 * getActiveTab checks which tab is open
 * @memberof plugin.selectors
 * @param state - application state
 * @returns - returns the tabs state
 */
export const getActiveTab = (state) => get(state, 'sampleExtension.activeTab');

/**
 * getSelectedRoseValue checks which tab is open
 * @memberof plugin.selectors
 * @param state - application state
 * @returns - returns the tabs state
 */
export const getSelectedRoseValue = (state) => get(state, 'sampleExtension.roseValue');