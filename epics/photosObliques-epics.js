/* eslint-disable no-console */
import Rx from "rxjs";
import {
    actions,
    UpdateMapLayoutPO,
    initConfigsPO,
    searchValuesFilteredPO,
    updateItemInBasketPO,
    countItemsSelectedInBasketPO,
    initProjectionsPO,
    initDateSelectPO,
    initOverlayLayerPO,
    getEndDateValuePO,
    getStartDateValuePO,
    setPolygonPO,
    getPhotoCountActionPO,
    setPhotoCountActionPO,
    validateSearchFiltersPO,
    setDateList,
    modalDisplayPO
} from "../actions/photosObliques-action";
import {
    TOGGLE_CONTROL
} from "@mapstore/actions/controls";
import {
    PHOTOSOBLIQUES_PANEL_WIDTH,
    RIGHT_SIDEBAR_MARGIN_LEFT,
    PO_PERIMETER_LAYER_ID
} from "../constants/photosObliques-constants";
import {
    updateDockPanelsList,
    UPDATE_MAP_LAYOUT
} from "@mapstore/actions/maplayout";

import {
    isOpen,
    getSearchResult,
    getBasket,
    getSelectedTilesLayer,
    getEndDate,
    getStartDate,
    getPolygon,
    getSelectedRoseValue,
    getFilterSearchValues,
    getDateList
} from "../selectors/photosObliques-selectors";

import {
    mapBboxSelector,
    mapSelector,
    resizeMap
} from "@mapstore/selectors/map";

import {
    zoomToExtent
} from "@mapstore/actions/map";

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
    WKT, GeoJSON
} from "ol/format";

import {
    Feature
} from "ol";

import {
    updateAdditionalLayer
} from "@mapstore/actions/additionallayers";

import Proj4js from 'proj4';

import {
    getYears, 
    getPhotos,
    getPhotoCount,
    downloadPicture
} from '../api/api';
import { ogcListField } from "@mapstore/utils/FilterUtils";
import { reprojectBbox } from "@mapstore/utils/CoordinatesUtils";

var currentLayout;
var lastSelectedTile;
var proj3857;
var proj3948;
var proj4326;

const styles = {
    "itemStyle": {
        fillColor: "#18BEF7",
        fillOpacity: 0.3,
        opacity: 1,
        color: "#18BEF7",
        weight: 4
    },
    "searchStyle": {
        fillColor: "#f5c42c",
        fillOpacity: 0.1,
        opacity: 1,
        color: "#f5c42c",
        weight: 2
    },
    "hidden": {
        fillColor: "#222111",
        opacity: 0,
        fillOpacity: 0,
        color: "#000000",
        weight: 0
    }
};
var searchPerimeter = {};
var hoveredItemPerimeter = {};

/**
 * openPanelPOEpic opens the panel of this sampleExtension plugin
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the projection, the dock panel, the grid, the drawing tools and the map layout update actions)
 */
export const openPanelPOEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
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
            UpdateMapLayoutPO(layout),
            updateDockPanelsList('photosObliques', 'add', 'right'),
            initConfigsPO(),
            initProjectionsPO(),
            initOverlayLayerPO()
        ];
        return Rx.Observable.from(observables);
    });

/**
 * closePanelPOEpic close the panel of this photosObliques plugin
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (the dock panel and the map layout update actions)
 */
export const closePanelPOEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL, actions.CLOSE_PHOTOSOBLIQUES)
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
            UpdateMapLayoutPO(currentLayout)
        ]);
    });

/**
 * onUpdatingLayoutWhenPanelOpenedPOEpic fix mapstore search bar issue on photosObliques panel opening
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable which update map layout
 */
export function onUpdatingLayoutWhenPanelOpenedPOEpic(action$, store) {
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
            return Rx.Observable.of(UpdateMapLayoutPO(layout));
        });
    }

/**
 * windRoseClickedPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const windRoseClickedPOEpic = (action$, store) => action$.ofType(actions.ROSE_CLICKED).switchMap(() => {
        /* eslint-disable */
        // console.log('CURRENT ROSE SECTION SELECTED: ' + store.getState().photosObliques.roseValue);
        /* eslint-enable */
        return Rx.Observable.from([getPhotoCountActionPO()]);
    })

/**
 * initProjectionsPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const initProjectionsPOEpic = (actions$) => actions$.ofType(actions.INIT_PROJECTIONS).switchMap(() => {
    if (!Proj4js.defs("EPSG:3857")) {
        Proj4js.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs");
    }
    if (!Proj4js.defs("EPSG:3948")) {
        Proj4js.defs("EPSG:3948", "+proj=lcc +lat_0=48 +lon_0=3 +lat_1=47.25 +lat_2=48.75 +x_0=1700000 +y_0=7200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
    }
    if (!Proj4js.defs("EPSG:4326")) {
        Proj4js.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs +type=crs");
    }
    register(Proj4js);    
    proj3857 = new Projection({code: 'EPSG:3857'});
    proj3948 = new Projection({code: 'EPSG:3948'});
    proj4326 = new Projection({code: 'EPSG:4326'});
    return Rx.Observable.from([initDateSelectPO()]);
});    

/**
 * filtersTriggeredPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const filtersTriggeredPOEpic = (action$, store) => action$.ofType(actions.SEARCH_FILTERS).switchMap((action) => {
    /* eslint-disable */
    //valeur rose des vents
    var roseValue = getSelectedRoseValue(store.getState());
    //valeur année de début
    var startDate = getStartDate(store.getState());
    //valeur année de fin
    var endDate = getEndDate(store.getState());
    //valeur d'ordre de tri
    var relevance = getFilterSearchValues(store.getState());
    if (!relevance) {
        relevance = '-relevance';
    }
    // console.log(startDate);
    // console.log(endDate);
    //mise en place des datas
    var datas = [endDate[0], startDate[startDate.length-1], roseValue, '', '', 0, 10, relevance];
    //emprise de la carte
    var wkt = getPerimeterPolygon(store);

    if (action.loadMore) {
        var datas = [endDate[0], startDate[startDate.length-1], roseValue, '', '', getSearchResult(store.getState()).length, getSearchResult(store.getState()).length +10, relevance];
    }

    console.log(datas);
    
    //on récupère les layers
    const vectorLayer = getSelectedTilesLayer(store.getState());
    //on crée un clone de l'emprise générée
    var empriseRechercheGeom = new WKT().readGeometry(wkt);
    //on reprojette le clone de l'emprise
    empriseRechercheGeom.transform(proj3948, proj4326);
    searchPerimeter.style = styles.searchStyle;
    //on récupères les coordonnées du clone reprojeté
    searchPerimeter = {...searchPerimeter, geometry: {type: "Polygon", coordinates: empriseRechercheGeom.getCoordinates()}};
    var features = [searchPerimeter, hoveredItemPerimeter];
    return Rx.Observable.forkJoin(
        // getPhotoCount(getPolygon(store.getState()), datas);
        getPhotos(wkt, datas)
    ).switchMap((response) => {
        return Rx.Observable.from(
            [
                updateAdditionalLayer(
                    PO_PERIMETER_LAYER_ID,
                    "PO",
                    "overlay",
                    {...vectorLayer.options, features}
                ),
                searchValuesFilteredPO(response[0]),
                // getEndDateValuePO(newEndDate)
            // setPolygonPO(wkt),
            ]
        );
    });
})

/**
 * cancelSearchFiltersPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const cancelSearchFiltersPOEpic = (action$, store) => action$.ofType(actions.CANCEL_SEARCH_FILTERS).switchMap(() => {
    /* eslint-disable */
    document.getElementById("toggle").checked = !document.getElementById("toggle").checked;
    /* eslint-enable */
    return Rx.Observable.empty();
})

/**
 * filterSearchedValuesPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const filterSearchedValuesPOEpic = (action$, store) => action$.ofType(actions.FILTER_SEARCH_VALUES).switchMap((action) => {
    return Rx.Observable.from([validateSearchFiltersPO(true, false)]);
})

/**
 * addBasketPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const addBasketPOEpic = (action$, store) => action$.ofType(actions.ADD_BASKET).switchMap((action) => {
    /* eslint-disable */
    var basket = getBasket(store.getState());
    var alreadyInBasket = false;
    if (basket.length >= 1) {
        basket.map((item) => {
            if (item.id === action.item.id) {
                alreadyInBasket = true;
            }
        });
    }
    if (!alreadyInBasket) {
        basket.push(action.item);
    }
    /* eslint-enable */
    return Rx.Observable.from([updateItemInBasketPO(basket)]);
})

/**
 * removeBasketPOEpic => called via this.props.removeSelectedItemsInBasketPO() in jsx
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const removeBasketPOEpic = (action$, store) => action$.ofType(actions.REMOVE_SELECTED_ITEMS_IN_BASKET).switchMap((action) => {
    /* eslint-disable */
    var item = getBasket(store.getState());
    var result = item.filter(elt => !elt.selected);
    var resultSelected = item.filter(elt => elt.selected);
    var observables = [];
    console.log(item.length);
    console.log(result.length);
    if (item.length === result.length) {
        result = [];
        observables = [updateItemInBasketPO(result), countItemsSelectedInBasketPO(0), modalDisplayPO(false)];
    }
    if (resultSelected.length === 0 && !action.forceDeletionOnEmptySelection) {
        observables = [modalDisplayPO(true)];
    }
    /* eslint-enable */
    return Rx.Observable.from(observables);
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
    return Rx.Observable.from([updateItemInBasketPO(features), countItemsSelectedInBasketPO(count)]);
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

function str2bytes (str) {
    var bytes = new Uint8Array(str.length);
    for (var i=0; i<str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}

/**WIP
 * downloadBasketPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const downloadBasketPOEpic = (action$, store) => action$.ofType(actions.DOWNLOAD_BASKET).switchMap((action) => {
    // //try 2
    // let csv = "";
    // for(let row = 0; row < getBasket(store.getState()).length; row++){
    //     let keysAmount = Object.keys(getBasket(store.getState())[row]).length
    //     let keysCounter = 0
    //     //generate headings
    //     if(row === 0){
    //         for(let key in getBasket(store.getState())[row]){
    //             csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
    //             keysCounter++
    //         }
    //         keysCounter = 0;
    //     }
    //     //generate body
    //     for(let key in getBasket(store.getState())[row]){
    //         csv += getBasket(store.getState())[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
    //         keysCounter++
    //     }
    //     keysCounter = 0;
    // }
    // let link = document.createElement('a')
    // link.id = 'download-csv'
    // link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    // link.setAttribute('download', 'basket.csv');
    // link.click();
    var basket = getBasket(store.getState());
    var photoIds = [];
    basket.forEach(element => {
        photoIds.push(element.id);
    });
    console.log(photoIds);
    var zipName = 'data';
    var prefix = '';
    var datas = [photoIds, zipName, prefix]
    return Rx.Observable.forkJoin(
        downloadPicture(datas)
    ).switchMap((response) => {
        console.log(response);
        console.log(response[0]);
        var url = window.URL.createObjectURL(response[0]);
        var a = document.createElement('a');
        a.href = url;
        a.download = zipName + '.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        return Rx.Observable.empty();
    });
});

/**
 * initDateSelectsPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const initDateSelectsPOEpic = (action$, store) => action$.ofType(actions.INIT_DATE_SELECT).switchMap((action) => {
    var polygon = "POLYGON((1339160.5891883592 7214802.240614536,1340297.8535671984 7232887.074032368,1365875.1941123577 7231336.039120723,1364818.7971917638 7213246.301821241,1339160.5891883592 7214802.240614536))";
    var formattedResponse;
    return Rx.Observable.forkJoin(
            // getYears(getPolygon(store.getState()))
            getYears(polygon)
        ).switchMap((response) => {
            return Rx.Observable.from([setDateList(response[0])]);
        });
    // return Rx.Observable.empty();
});

/**
 * initDateSelectsPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const initDateListPOEpic = (action$, store) => action$.ofType(actions.SET_DATE_LIST).switchMap((action) => {
    return Rx.Observable.from([getStartDateValuePO(action.dates), getEndDateValuePO(action.dates)]);
    // return Rx.Observable.empty();
});

/**
 * selectStartDatePOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const selectStartDatePOEpic = (action$, store) => action$.ofType(actions.SELECT_START_DATE_VALUE).switchMap((action) => {
    var dateList = getDateList(store.getState());
    var newEndDate = [];
    dateList.map((item) => {
        if (item >= action.startDate) {
            newEndDate.push(item);
        }
    });
    return Rx.Observable.from([getEndDateValuePO(newEndDate), getPhotoCountActionPO()]);
});

/**
 * selectEndDatePOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const selectEndDatePOEpic = (action$, store) => action$.ofType(actions.SELECT_END_DATE_VALUE).switchMap((action) => {
    var dateList = getDateList(store.getState());
    var newStartDate = [];
    dateList.map((item) => {
        if (item <= action.endDate) {
            newStartDate.push(item);
        }
    });
    return Rx.Observable.from([getStartDateValuePO(newStartDate), getPhotoCountActionPO()]);
});

/**
 * getPhotoCountPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const getPhotoCountPOEpic = (action$, store) => action$.ofType(actions.GET_PHOTO_COUNT).switchMap((action) => {
    var polygon = getPerimeterPolygon(store);
    var endDate = getEndDate(store.getState());
    var startDate = getStartDate(store.getState());
    var roseValue = getSelectedRoseValue(store.getState());
    var datas = [endDate[0], startDate[startDate.length-1], roseValue];
    return Rx.Observable.forkJoin(
        // getPhotoCount(getPolygon(store.getState()), datas);
        getPhotoCount(polygon, datas)
    ).switchMap((response) => {
        return Rx.Observable.from([setPhotoCountActionPO(response[0].numberOfResult)]);
    });
    return Rx.Observable.from([]);
});

/**
 * addOverlayLayerPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const addOverlayLayerPOEpic = (action$, store) =>
    action$.ofType(actions.INIT_OVERLAY_LAYER)
        .switchMap(() => {
            if (!searchPerimeter.id) {
                searchPerimeter = {
                    id: 'search',
                    geometry: {type:"Polygon", coordinates:[[]]},
                    name:'searchPerimeter',
                    properties: {},
                    type: "Feature",
                    style: "hidden"
                };
                
            }
            if (!hoveredItemPerimeter.id) {
                hoveredItemPerimeter  = {
                    id: 'item',
                    geometry: {type:"Polygon", coordinates:[[]]},
                    name:'hoveredPerimeter',
                    properties: {},
                    type: "Feature",
                    style: styles.itemStyle
                };
                
            }
            let vectorLayerOption = {
                id: PO_PERIMETER_LAYER_ID,
                features: [hoveredItemPerimeter,searchPerimeter],
                name: "POPerimeterLayer",
                visibility: true,
                type: "vector"
            };
            return Rx.Observable.from([
                updateAdditionalLayer(
                    PO_PERIMETER_LAYER_ID,
                    "PO",
                    'overlay',
                    vectorLayerOption
                )
            ]);
        })

function getGeoJsonFeature(feature, style) {
    var writer = new GeoJSON();
    var geoJsonFeature = writer.writeFeatureObject(feature);
    // var geoJsonFeature = JSON.parse(geojsonStr);
    geoJsonFeature.style = style;
    geoJsonFeature.id = "toto" + Math.random();
    return geoJsonFeature;
}

function getPerimeterPolygon(store){
    //emprise de la carte
    var empriseRecherche = mapBboxSelector(store.getState());
    var map = mapSelector(store.getState());
    var x = (map.size.width - (RIGHT_SIDEBAR_MARGIN_LEFT + PHOTOSOBLIQUES_PANEL_WIDTH)) * map.resolution + empriseRecherche.bounds.minx;
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
            x, 
            empriseRecherche.bounds.maxy
        ], 
        [
            x, 
            empriseRecherche.bounds.miny
        ], 
        [
            empriseRecherche.bounds.minx, 
            empriseRecherche.bounds.miny
        ]]
    ]);
    //on reprojète l'emprise de départ en 3948
    empriseRechercheGeom.transform(proj3857, proj3948);
    //on génère le wkt
    return new WKT().writeGeometry(empriseRechercheGeom);
}

/**
 * pictureHoveredPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const pictureHoveredPOEpic = (action$, store) => action$.ofType(actions.PICTURE_HOVERED).switchMap((action) => {
    //on récupère les layers
    const vectorLayer = getSelectedTilesLayer(store.getState());
    if (action.item) {
        const itemPolygon = new WKT().readGeometry(action.item.shape);
        itemPolygon.transform(proj3948, proj4326);
        hoveredItemPerimeter = {...hoveredItemPerimeter, geometry: {type: "Polygon", coordinates: itemPolygon.getCoordinates()}};
    } else {
        hoveredItemPerimeter = {...hoveredItemPerimeter, geometry: {type: "Polygon", coordinates: [[]]}};
    }
    var features = [searchPerimeter, hoveredItemPerimeter];
    return Rx.Observable.from([
        updateAdditionalLayer(
            PO_PERIMETER_LAYER_ID,
            "PO",
            "overlay",
            {...vectorLayer.options, features}
        )
    ]);
});

/**
 * zoomElementPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const zoomElementPOEpic = (action$, store) => action$.ofType(actions.ZOOM_ELEMENT).switchMap((action) => {
    /* eslint-disable */
    const format = new GeoJSON();
    const feature = format.readFeature(hoveredItemPerimeter);
    const polygon = feature.getGeometry();
    // polygon.transform(proj4326, proj3857);

    return Rx.Observable.from([zoomToExtent(polygon.getExtent(), "EPSG:4326", 20, {nearest: true})]);
    /* eslint-enable */
})

/**
 * filterBasketValuesPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const filterBasketValuesPOEpic = (action$, store) => action$.ofType(actions.FILTER_BASKET_VALUES).switchMap((action) => {
    /* eslint-disable */
    var filterValue = getBasket(store.getState());
    console.log(filterValue);
    console.log(action.filterValue);
    switch (action.filterValue) {
        case "-relevance":
            filterValue = filterValue.sort((a,b) => (a.relevance < b.relevance) ? 1 : ((b.relevance < a.relevance) ? -1 : 0))
            break;
        case "-date":
            filterValue = filterValue.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))
            break;
        case "-year":
            filterValue = filterValue.sort((a,b) => (a.year < b.year) ? 1 : ((b.year < a.year) ? -1 : 0))
            break;
        case "-owner":
            filterValue = filterValue.sort((a,b) => (a.owner < b.owner) ? 1 : ((b.owner < a.owner) ? -1 : 0))
            break;
        case "-provider":
            filterValue = filterValue.sort((a,b) => (a.provider < b.provider) ? 1 : ((b.provider < a.provider) ? -1 : 0))
            break;
        case "-fileSize":
            filterValue = filterValue.sort((a,b) => (a.fileSize < b.fileSize) ? 1 : ((b.fileSize < a.fileSize) ? -1 : 0))
            break;
        default:
            console.log('la sélection à été mal effectuée et le tri est impossible...');
            break;
    }
    console.log(filterValue);
    return Rx.Observable.from([updateItemInBasketPO(filterValue.slice())]);
    /* eslint-enable */
})

/**
 * onScrollPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const onScrollPOEpic = (action$, store) => action$.ofType(actions.ONSCROLL).switchMap((action) => {
    console.log(document.getElementById('PHOTOSOBLIQUES_scrollBar').innerHeight);
    console.log(document.getElementById('PHOTOSOBLIQUES_scrollBar').scrollY);
    console.log(document.getElementById('PHOTOSOBLIQUES_scrollBar').offsetHeight);
    if ((document.getElementById('PHOTOSOBLIQUES_scrollBar').innerHeight + Math.round(document.getElementById('PHOTOSOBLIQUES_scrollBar').scrollY)) >= (document.getElementById('PHOTOSOBLIQUES_scrollBar').offsetHeight)) {
       console.log('toto');
    }
    return Rx.Observable.from([]);
})