/* eslint-disable no-console */
import Rx from "rxjs";
import {
    actions,
    sampleExtensionUpdateMapLayout,
    initConfigs
} from "../actions/sampleExtension-action";
import {
    TOGGLE_CONTROL
} from "@mapstore/actions/controls";
import {
    SAMPLEEXTENSION_PANEL_WIDTH,
    RIGHT_SIDEBAR_MARGIN_LEFT
} from "../constants/sampleExtension-constants";
import {
    updateDockPanelsList,
    UPDATE_MAP_LAYOUT
} from "@mapstore/actions/maplayout";

import {
    isOpen
} from "../selectors/sampleExtension-selectors";

var currentLayout;

/**
 * opensampleExtensionPanelEpic opens the panel of this sampleExtension plugin
 * @memberof sampleExtension.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the projection, the dock panel, the grid, the drawing tools and the map layout update actions)
 */
export const opensampleExtensionPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
    .filter(action => action.control === 'sampleExtension'
    && !!store.getState()
    && !!isOpen(store.getState()))
    .switchMap(() => {
        let layout = store.getState().maplayout;
        layout = {
            transform: layout.layout.transform,
            height: layout.layout.height,
            rightPanel: true,
            leftPanel: false,
            ...layout.boundingMapRect,
            right: SAMPLEEXTENSION_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT,
            boundingMapRect: {
                ...layout.boundingMapRect,
                right: SAMPLEEXTENSION_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT
            },
            boundingSidebarRect: layout.boundingSidebarRect
        };

        currentLayout = layout;

        let observables = [
            sampleExtensionUpdateMapLayout(layout),
            updateDockPanelsList('sampleExtension', 'add', 'right'),
            initConfigs
        ];
        return Rx.Observable.from(observables);
    });

/**
 * closesampleExtensionPanelEpic close the panel of this sampleExtension plugin
 * @memberof sampleExtension.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (the dock panel and the map layout update actions)
 */
export const closesampleExtensionPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL, actions.CLOSE_SAMPLEEXTENSION)
    .filter(action => action.control === 'sampleExtension'
    && !!store.getState()
    && !isOpen(store.getState()) || action.type === actions.CLOSE_SAMPLEEXTENSION )
    .switchMap(() => {
        let layout = store.getState().maplayout;
        layout = {
            transform: layout.layout.transform,
            height: layout.layout.height,
            rightPanel: true,
            leftPanel: false,
            ...layout.boundingMapRect,
            right: layout.boundingSidebarRect.right,
            boundingMapRect: {
                ...layout.boundingMapRect,
                right: layout.boundingSidebarRect.right
            },
            boundingSidebarRect: layout.boundingSidebarRect
        };
        currentLayout = layout;
        return Rx.Observable.from([
            updateDockPanelsList('sampleExtension', 'remove', 'right'),
            sampleExtensionUpdateMapLayout(currentLayout)
        ]);
    });

/**
 * onUpdatingLayoutWhenRTGEPanelOpenedEpic fix mapstore search bar issue on rtge panel opening
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable which update map layout
 */
export function onUpdatingLayoutWhensampleExtensionPanelOpenedEpic(action$, store) {
    return action$.ofType(UPDATE_MAP_LAYOUT)
        .filter((action) => (action.source === "sampleExtension" || action.source === undefined)
        && store
        && store.getState()
        && !!isOpen(store.getState())
        && currentLayout?.right !== action?.layout?.right)
        .switchMap(() => {
            let layout = store.getState().maplayout;
            layout = {
                transform: layout.layout.transform,
                height: layout.layout.height,
                rightPanel: true,
                leftPanel: layout.layout.leftPanel,
                ...layout.boundingMapRect,
                right: SAMPLEEXTENSION_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT,
                boundingMapRect: {
                    ...layout.boundingMapRect,
                    right: SAMPLEEXTENSION_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT
                },
                boundingSidebarRect: layout.boundingSidebarRect};
            currentLayout = layout;
            return Rx.Observable.of(sampleExtensionUpdateMapLayout(layout));
        });
}
