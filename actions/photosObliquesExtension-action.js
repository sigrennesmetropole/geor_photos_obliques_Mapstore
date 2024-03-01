/* eslint-disable no-console */
import {UPDATE_MAP_LAYOUT} from "@mapstore/actions/maplayout";

export const actions = {
    LOCAL_ACTION: 'PHOTOSOBLIQUESEXTENSION:LOCAL_ACTION',
    INIT_CONFIGS: "PHOTOSOBLIQUESEXTENSION:INIT_CONFIGS",
    CLOSE_PHOTOSOBLIQUESEXTENSION: "PHOTOSOBLIQUESEXTENSION:CLOSE_PHOTOSOBLIQUESEXTENSION"
};

/**
 * photosObliquesExtensionUpdateMapLayout action to update map layout at plugin start
 * @memberof photosObliquesExtension.actions
 * @returns - action starts plugin page with source set
 */
export function photosObliquesExtensionUpdateMapLayout(layout) {
    return {
        type: UPDATE_MAP_LAYOUT,
        layout,
        source: 'photosObliquesExtension'
    };
}

/**
 * initConfigs action triggered to initialize or reinitialize plugin basic configs
 * @memberof photosObliquesExtension.actions
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
 * closephotosObliquesExtension action to close configs
 * @memberof photosObliquesExtension.actions
 * @returns - action close photosObliquesExtension plugin
 */
export function closephotosObliquesExtension() {
    return {
        type: actions.CLOSE_PHOTOSOBLIQUESEXTENSION
    };
}
