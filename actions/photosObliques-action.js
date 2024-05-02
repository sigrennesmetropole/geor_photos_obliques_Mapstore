/* eslint-disable no-console */
import {UPDATE_MAP_LAYOUT} from "@mapstore/actions/maplayout";

export const actions = {
    LOCAL_ACTION: 'PHOTOSOBLIQUES:LOCAL_ACTION',
    INIT_CONFIGS: "PHOTOSOBLIQUES:INIT_CONFIGS",
    CHANGE_TAB: 'PHOTOSOBLIQUES:CHANGE_TAB',
    CLOSE_PHOTOSOBLIQUES: "PHOTOSOBLIQUES:CLOSE_PHOTOSOBLIQUES"
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

