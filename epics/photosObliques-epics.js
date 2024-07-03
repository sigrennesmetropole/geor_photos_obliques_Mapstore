/* eslint-disable no-console */
import Rx from "rxjs";
import {
    actions,
    photosObliquesUpdateMapLayout,
    initConfigs,
    searchValuesFiltered,
    setItemInBasket,
    removeItemOfBasket,
    selectItemsInBasket,
    countItemsSelectedInBasket,
    initProjections,
    initDateSelect
} from "../actions/photosObliques-action";
import {
    TOGGLE_CONTROL
} from "@mapstore/actions/controls";
import {
    PHOTOSOBLIQUES_PANEL_WIDTH,
    RIGHT_SIDEBAR_MARGIN_LEFT
} from "../constants/photosObliques-constants";
import {
    updateDockPanelsList,
    UPDATE_MAP_LAYOUT
} from "@mapstore/actions/maplayout";

import {
    isOpen,
    getSearchResult,
    getBasket
} from "../selectors/photosObliques-selectors";

import {
    resizeMap
} from "@mapstore/actions/map";

import {
    mapBboxSelector
} from "@mapstore/selectors/map";

import {
    Polygon
} from "ol/geom";

import {
    Projection
} from "ol/proj";

import {
    register
} from "ol/proj/proj4.js";

import {
    WKT
} from "ol/format";

import Proj4js from 'proj4';

import {callServer, getYears} from '../api/api';

var currentLayout;
var lastSelectedTile;
var proj3857;
var proj3948;

/**
 * openphotosObliquesPanelEpic opens the panel of this sampleExtension plugin
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the projection, the dock panel, the grid, the drawing tools and the map layout update actions)
 */
export const openphotosObliquesPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
    .filter(action => action.control === 'photosObliques'
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
            right: PHOTOSOBLIQUES_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT,
            boundingMapRect: {
                ...layout.boundingMapRect,
                right: PHOTOSOBLIQUES_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT
            },
            boundingSidebarRect: layout.boundingSidebarRect
        };

        currentLayout = layout;

        let observables = [
            photosObliquesUpdateMapLayout(layout),
            updateDockPanelsList('photosObliques', 'add', 'right'),
            initConfigs(),
            initProjections()
        ];
        return Rx.Observable.from(observables);
    });

/**
 * closephotosObliquesPanelEpic close the panel of this photosObliques plugin
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (the dock panel and the map layout update actions)
 */
export const closephotosObliquesPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL, actions.CLOSE_PHOTOSOBLIQUES)
    .filter(action => action.control === 'photosObliques'
    && !!store.getState()
    && !isOpen(store.getState()) || action.type === actions.CLOSE_PHOTOSOBLIQUES )
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
            updateDockPanelsList('photosObliques', 'remove', 'right'),
            photosObliquesUpdateMapLayout(currentLayout)
        ]);
    });

/**
 * onUpdatingLayoutWhenPhotosObliquesPanelOpenedEpic fix mapstore search bar issue on rtge panel opening
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable which update map layout
 */
export function onUpdatingLayoutWhenPhotosObliquesPanelOpenedEpic(action$, store) {
    return action$.ofType(UPDATE_MAP_LAYOUT)
        .filter((action) => (action.source === "photosObliques" || action.source === undefined)
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
                right: PHOTOSOBLIQUES_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT,
                boundingMapRect: {
                    ...layout.boundingMapRect,
                    right: PHOTOSOBLIQUES_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT
                },
                boundingSidebarRect: layout.boundingSidebarRect};
            currentLayout = layout;
            return Rx.Observable.of(photosObliquesUpdateMapLayout(layout));
        });
    }

/**
 * windRoseClickedEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const windRoseClickedEpic = (action$, store) => action$.ofType(actions.ROSE_CLICKED).switchMap(() => {
        /* eslint-disable */
        console.log('CURRENT ROSE SECTION SELECTED: ' + store.getState().photosObliques.roseValue);
        /* eslint-enable */
        return Rx.Observable.empty();
    })

    export const initProjectionsEpic = (actions$) => actions$.ofType(actions.INIT_PROJECTIONS).switchMap(() => {
        if (!Proj4js.defs("EPSG:3948")) {
            Proj4js.defs("EPSG:3948", "+proj=lcc +lat_0=48 +lon_0=3 +lat_1=47.25 +lat_2=48.75 +x_0=1700000 +y_0=7200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
        }
        if (!Proj4js.defs("EPSG:4326")) {
            Proj4js.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs +type=crs");
        }
        register(Proj4js);
        
        proj3857 = new Projection({code: 'EPSG:3857'});
        proj3948 = new Projection({code: 'EPSG:3948'});
        return Rx.Observable.from([initDateSelect()]);
    });    

/**
 * filtersTriggeredEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const filtersTriggeredEpic = (action$, store) => action$.ofType(actions.SEARCH_FILTERS).switchMap(() => {
    /* eslint-disable */
    //valeur rose des vents
    var roseValue = store.getState().photosObliques.roseValue;
    //valeur année de début
    var startDate = store.getState().photosObliques.startDate;
    //valeur année de fin
    var endDate = store.getState().photosObliques.endDate;
    //emprise de la carte
    var empriseRecherche = mapBboxSelector(store.getState());
    var empriseRechercheGeom = new Polygon([
        [[
            empriseRecherche.bounds.minx, 
            empriseRecherche.bounds.miny
        ], 
        [
            empriseRecherche.bounds.minx, 
            empriseRecherche.bounds.maxy
        ], 
        [
            empriseRecherche.bounds.maxx, 
            empriseRecherche.bounds.maxy
        ], 
        [
            empriseRecherche.bounds.maxx, 
            empriseRecherche.bounds.miny
        ], 
        [
            empriseRecherche.bounds.minx, 
            empriseRecherche.bounds.miny
        ]]
    ])
    empriseRechercheGeom.transform(proj3857, proj3948);
    const wkt = new WKT().writeGeometry(empriseRechercheGeom);
    var values = [roseValue,startDate,endDate,wkt];
    var url = "/photosobliques/photos?";
    //add geometry
    url = url + "geometry=" + encodeURIComponent(wkt);
    //add start Date
    url = url + "&startDate=" + startDate;
    // add endDate
    url = url + "&endDate=" + endDate;
    // add degree
    roseValue = roseValue * 22.5 - 22.5;
    url = url + "&angleDegree=" + roseValue;
    // url = encodeURIComponent(url);
    console.log(url);
    //Ceci va fonctionner
    return Rx.Observable.defer(()=>callServer(url).then(response=>searchValuesFiltered(response.data)));
    // Ceci ne va pas fonctionner parcequ'un traitement est mis dans le résultat de dufer ce qui n'est pas apprécié
    // return Rx.Observable.defer(()=>callServer(url).then((response)=>{
    //     var responseArray = response.data;
    //     responseArray.map((item) => {
    //         item.relevanceInPercent = parseFloat(item.relevance * 100).toFixed(1);
    //         item.fileSize = parseFloat(item.fileSize / 1000000).toFixed(1) + "Mo";
    //     })
    //     searchValuesFiltered(responseArray)
    // }));
    // /* eslint-enable */
})

/**
 * filtersTriggeredEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const cancelSearchFiltersEpic = (action$, store) => action$.ofType(actions.CANCEL_SEARCH_FILTERS).switchMap(() => {
    /* eslint-disable */
    // console.log('FILTERS SELECTED: ' + document.getElementById("toggle").checked);
    document.getElementById("toggle").checked = !document.getElementById("toggle").checked;
    /* eslint-enable */
    return Rx.Observable.empty();
})

/**
 * filtersTriggeredEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const filterSearchedValuesEpic = (action$, store) => action$.ofType(actions.FILTER_SEARCH_VALUES).switchMap((action) => {
    /* eslint-disable */
    var filterValue = getSearchResult(store.getState());
    // console.log(filterValue);
    // console.log(action);
    switch (parseInt(action.value)) {
        case 0:
            filterValue = filterValue.sort((a,b) => (a.relevance < b.relevance) ? 1 : ((b.relevance < a.relevance) ? -1 : 0))
            break;
        case 1:
            filterValue = filterValue.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))
            break;
        case 2:
            filterValue = filterValue.sort((a,b) => (a.year < b.year) ? 1 : ((b.year < a.year) ? -1 : 0))
            break;
        case 3:
            filterValue = filterValue.sort((a,b) => (a.owner < b.owner) ? 1 : ((b.owner < a.owner) ? -1 : 0))
            break;
        case 4:
            filterValue = filterValue.sort((a,b) => (a.provider < b.provider) ? 1 : ((b.provider < a.provider) ? -1 : 0))
            break;
        case 5:
            filterValue = filterValue.sort((a,b) => (a.fileSize < b.fileSize) ? 1 : ((b.fileSize < a.fileSize) ? -1 : 0))
            break;
        default:
            console.log('la sélection à été mal effectuée et le tri est impossible...');
            break;
    }
    return Rx.Observable.from([searchValuesFiltered(filterValue.slice())]);
})

/**
 * windRoseClickedEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const addBasketEpic = (action$, store) => action$.ofType(actions.ADD_BASKET).switchMap((action) => {
    /* eslint-disable */
    var item = store.getState().photosObliques.basket;
    store.getState().photosObliques.searchResult.forEach(element => {
        if (parseInt(element.id) === parseInt(action.itemId)) {
            item.push(element);
        }
    });
    /* eslint-enable */
    return Rx.Observable.from([setItemInBasket(item)]);
})

/**
 * windRoseClickedEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const removeBasketEpic = (action$, store) => action$.ofType(actions.REMOVE_SELECTED_ITEMS_IN_BASKET).switchMap((action) => {
    /* eslint-disable */
    var item = getBasket(store.getState());
    var result = item.filter(elt => !elt.selected)
    // item.forEach(element => {
    //     if (element.selected) {
    //         item.splice(count,1);
    //     }
    // });
    console.log(result);
    /* eslint-enable */
    return Rx.Observable.from([removeItemOfBasket(result), countItemsSelectedInBasket(0)]);
})

/**
 * clickPicturePOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const clickPicturePOEpic = (action$, store) => action$.ofType(actions.CLICK_PICTURE).switchMap((action) => {
    const currentItems = getBasket(store.getState());
    const features = pictureSelectionPO(currentItems, action.ctrlKey, action.shiftKey, action.itemId);
    var count = 0;
    features.map((item) => {
        if (item.selected) {
            count++;
        }
    })
    return Rx.Observable.from([selectItemsInBasket(features), countItemsSelectedInBasket(count)]);
});


/**
 * pictureSelectionPO tells us if the selected feature is already selected and gives styles according this state
 * @memberof photosObliques.epics
 * @param currentItems - current features
 * @param control - is the user pressing control key
 * @param intersectedItems - all features clicked
 * @returns - return one or more feature with their style updated... or not
 */
function pictureSelectionPO(currentItems, control, shift, intersectedItems) {
    var currentSelectedTile = 0;
    var selectedRow = [];
    var currentFeatureList = currentItems.map((item) => {
        if (intersectedItems === item.id) {
            item.selected = !item.selected;
            if (!shift) {
                if (!control) {
                    selectedRow = [];
                }
                if (item.selected) {
                    selectedRow.push(intersectedItems);
                }
            } else {
                if (lastSelectedTile > currentSelectedTile) {
                    let temp = lastSelectedTile;
                    lastSelectedTile = currentSelectedTile;
                    currentSelectedTile = temp;
                }
                currentItems.slice(lastSelectedTile, currentSelectedTile).forEach(minimalizedCurrentFeature => {
                    selectedRow.push(minimalizedCurrentFeature);
                });
                selectedRow.forEach(row => {
                    row.selected = true;
                });
            }
            lastSelectedTile = currentSelectedTile;
        } else if (!control && !shift) {
            item.selected = false;
        }
        currentSelectedTile++;
        return {
            ...item
        };
    });

    return currentFeatureList;

}

/**WIP
 * downloadBasketPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const downloadBasketPOEpic = (action$, store) => action$.ofType(actions.DOWNLOAD_BASKET).switchMap((action) => {
    //try 2
    let csv = "";
    // console.log(getBasket(store.getState()));
    for(let row = 0; row < getBasket(store.getState()).length; row++){
        let keysAmount = Object.keys(getBasket(store.getState())[row]).length
        let keysCounter = 0
        //generate headings
        if(row === 0){
            for(let key in getBasket(store.getState())[row]){
                csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
                keysCounter++
            }
            keysCounter = 0;
        }
        //generate body
        for(let key in getBasket(store.getState())[row]){
            csv += getBasket(store.getState())[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
            keysCounter++
        }
        keysCounter = 0;
    }
    let link = document.createElement('a')
    link.id = 'download-csv'
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    link.setAttribute('download', 'basket.csv');
    link.click();
    return Rx.Observable.empty();
});

/**
 * clickPicturePOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const initDateSelects = (action$, store) => action$.ofType(actions.INIT_DATE_SELECT).switchMap((action) => {
    var polygon = "POLYGON((1339160.5891883592 7214802.240614536,1340297.8535671984 7232887.074032368,1365875.1941123577 7231336.039120723,1364818.7971917638 7213246.301821241,1339160.5891883592 7214802.240614536))";
    getYears(polygon, function (response) {
        console.log(response);
    return Rx.Observable.from([]);
    });
    return Rx.Observable.empty();
});