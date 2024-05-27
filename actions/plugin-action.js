/* eslint-disable no-console */
import {UPDATE_MAP_LAYOUT} from "@mapstore/actions/maplayout";

export const actions = {
    CHANGE_TAB: 'PLUGIN:CHANGE_TAB',
    ROSE_CLICKED: 'PLUGIN:ROSE_CLICKED'
};

export const tabTypes = {
    HOME: 'PLUGIN:HOME',
    SELECT: 'PLUGIN:SELECT'
};

/**
 * pluginChangeTab start action to change tab
 * @memberof plugin.actions
 * @param tab - the tab string we should use
 * @returns - action change tab
 */
export function pluginChangeTab(tab) {
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