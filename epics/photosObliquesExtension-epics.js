/* eslint-disable no-console */
import Rx from "rxjs";
import {
    actions,
    photosObliquesExtensionUpdateMapLayout,
    initConfigs
} from "../actions/photosObliquesExtension-action";
import {
    TOGGLE_CONTROL
} from "@mapstore/actions/controls";
import {
    PHOTOSOBLIQUESEXTENSION_PANEL_WIDTH,
    RIGHT_SIDEBAR_MARGIN_LEFT
} from "../constants/photosObliquesExtension-constants";
import {
    updateDockPanelsList,
    UPDATE_MAP_LAYOUT
} from "@mapstore/actions/maplayout";

import {
    isOpen
} from "../selectors/photosObliquesExtension-selectors";

var currentLayout;

/**
 * openphotosObliquesExtensionPanelEpic opens the panel of this photosObliquesExtension plugin
 * @memberof photosObliquesExtension.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the projection, the dock panel, the grid, the drawing tools and the map layout update actions)
 */
export const openphotosObliquesExtensionPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
    .filter(action => action.control === 'photosObliquesExtension'
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
            right: PHOTOSOBLIQUESEXTENSION_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT,
            boundingMapRect: {
                ...layout.boundingMapRect,
                right: PHOTOSOBLIQUESEXTENSION_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT
            },
            boundingSidebarRect: layout.boundingSidebarRect
        };

        currentLayout = layout;

        let observables = [
            photosObliquesExtensionUpdateMapLayout(layout),
            updateDockPanelsList('photosObliquesExtension', 'add', 'right'),
            initConfigs
        ];
        return Rx.Observable.from(observables);
    });

/**
 * closephotosObliquesExtensionPanelEpic close the panel of this photosObliquesExtension plugin
 * @memberof photosObliquesExtension.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (the dock panel and the map layout update actions)
 */
export const closephotosObliquesExtensionPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL, actions.CLOSE_PHOTOSOBLIQUESEXTENSION)
    .filter(action => action.control === 'photosObliquesExtension'
    && !!store.getState()
    && !isOpen(store.getState()) || action.type === actions.CLOSE_PHOTOSOBLIQUESEXTENSION )
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
            updateDockPanelsList('photosObliquesExtension', 'remove', 'right'),
            photosObliquesExtensionUpdateMapLayout(currentLayout)
        ]);
    });

/**
 * onUpdatingLayoutWhenRTGEPanelOpenedEpic fix mapstore search bar issue on rtge panel opening
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable which update map layout
 */
export function onUpdatingLayoutWhenPhotosObliquesExtensionPanelOpenedEpic(action$, store) {
    return action$.ofType(UPDATE_MAP_LAYOUT)
        .filter((action) => (action.source === "photosObliquesExtension" || action.source === undefined)
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
                right: PHOTOSOBLIQUESEXTENSION_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT,
                boundingMapRect: {
                    ...layout.boundingMapRect,
                    right: PHOTOSOBLIQUESEXTENSION_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT
                },
                boundingSidebarRect: layout.boundingSidebarRect};
            currentLayout = layout;
            return Rx.Observable.of(photosObliquesExtensionUpdateMapLayout(layout));
        });
}
