import { get } from "lodash";

/**
 * isOpen checks if plugin tab is open or not
 * @memberof photosObliques.selectors
 * @param state - application state
 * @returns - returns the plugins panel state
 */
export const isOpen = (state) => get(state, 'controls.photosObliques.enabled');
