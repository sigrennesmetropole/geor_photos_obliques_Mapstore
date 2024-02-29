/* eslint-disable no-console */
import {UPDATE_MAP_LAYOUT} from "@mapstore/actions/maplayout";

export const actions = {
    LOCAL_ACTION: 'SAMPLEEXTENSION:LOCAL_ACTION',
    INIT_CONFIGS: "SAMPLEEXTENSION:INIT_CONFIGS",
    CLOSE_SAMPLEEXTENSION: "SAMPLEEXTENSION:CLOSE_SAMPLEEXTENSION"
};

/**
 * sampleExtensionUpdateMapLayout action to update map layout at plugin start
 * @memberof sampleExtension.actions
 * @returns - action starts plugin page with source set
 */
export function sampleExtensionUpdateMapLayout(layout) {
    return {
        type: UPDATE_MAP_LAYOUT,
        layout,
        source: 'sampleExtension'
    };
}

/**
 * initConfigs action triggered to initialize or reinitialize plugin basic configs
 * @memberof sampleExtension.actions
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
 * closesampleExtension action to close configs
 * @memberof sampleExtension.actions
 * @returns - action close sampleExtension plugin
 */
export function closesampleExtension() {
    return {
        type: actions.CLOSE_SAMPLEEXTENSION
    };
}
