/* eslint-disable no-console */
import Rx from "rxjs";
import { show } from "@mapstore/actions/notifications";
import {
    actions,
    updateMapLayoutPO,
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
    setDateListPO,
    modalDisplayPO,
    cancelSearchFiltersPO,
    updateHoveredPolygonVisibilityStatePO,
    setDownloadingPO,
    accumulateScrollEventsPO,
    windRoseClickPO,
    setWindRoseClickPO,
    setPluginConfigsPO,
    setPicturesInBasketPO,
    setStartDateValuePO,
    setEndDateValuePO,
    changeTabPO,
    setPrevPhotoCount
} from "../actions/photosObliques-action";
import {
    TOGGLE_CONTROL
} from "@mapstore/actions/controls";
import {
    PHOTOSOBLIQUES_PANEL_WIDTH,
    PO_RIGHT_SIDEBAR_MARGIN_LEFT,
    PO_PERIMETER_LAYER_ID,
    PHOTOSOBLIQUES_PLUGIN_NAME
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
    getDateList,
    getScrollIndicator,
    getFileName,
    getPrefix,
    getPluginConfig,
    getFiltersTriggered,
    getPhotoCountSelector
} from "../selectors/photosObliques-selectors";

import {
    mapBboxSelector,
    mapSelector
} from "@mapstore/selectors/map";

import {
    zoomToExtent,
    CHANGE_MAP_VIEW
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

import { containsExtent } from "ol/extent";

import {
    updateAdditionalLayer
} from "@mapstore/actions/additionallayers";

import Proj4js from 'proj4';

import {
    getYears, 
    getPhotos,
    getPhotoCount,
    downloadPicture,
    getConfigs,
    setAPIURL
} from '../api/api';

//styles pour les geométries.
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

var currentLayout;
var lastSelectedTile;
var proj3857;
var proj3948;
var proj4326;
var searchPerimeter = {};
var hoveredItemPerimeter = {};
var prevWindRoseValue;

/**
 * openPanelPOEpic opens the panel of this sampleExtension plugin
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the projection, the dock panel, the grid, the drawing tools and the map layout update actions)
 */
export const openPanelPOEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
    .filter(action => action.control === PHOTOSOBLIQUES_PLUGIN_NAME
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
            right: PHOTOSOBLIQUES_PANEL_WIDTH + PO_RIGHT_SIDEBAR_MARGIN_LEFT,
            boundingMapRect: {
                ...layout.boundingMapRect,
                right: PHOTOSOBLIQUES_PANEL_WIDTH + PO_RIGHT_SIDEBAR_MARGIN_LEFT
            },
            boundingSidebarRect: layout.boundingSidebarRect
        };

        currentLayout = layout;

        let observables = [
            initConfigsPO(getPluginConfig(store.getState())),
            updateDockPanelsList(PHOTOSOBLIQUES_PLUGIN_NAME, 'add', 'right'),
            updateMapLayoutPO(layout),
            initProjectionsPO(),
            initOverlayLayerPO(),
            getPhotoCountActionPO()
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
    .filter(action => action.control === PHOTOSOBLIQUES_PLUGIN_NAME
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
        var vectorLayerToHide = getSelectedTilesLayer(store.getState());
        vectorLayerToHide.visibility = false;
        currentLayout = layout;
        return Rx.Observable.from([
            updateDockPanelsList(PHOTOSOBLIQUES_PLUGIN_NAME, 'remove', 'right'),
            updateMapLayoutPO(currentLayout),
            updateAdditionalLayer(
                PO_PERIMETER_LAYER_ID,
                "PO",
                "overlay",
                vectorLayerToHide
            )
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
        .filter((action) => (action.source === PHOTOSOBLIQUES_PLUGIN_NAME || action.source === undefined)
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
                right: PHOTOSOBLIQUES_PANEL_WIDTH + PO_RIGHT_SIDEBAR_MARGIN_LEFT,
                boundingMapRect: {
                    ...layout.boundingMapRect,
                    right: PHOTOSOBLIQUES_PANEL_WIDTH + PO_RIGHT_SIDEBAR_MARGIN_LEFT
                },
                boundingSidebarRect: layout.boundingSidebarRect
            };
            currentLayout = layout;
            if (getFiltersTriggered(store.getState()) === true) {
                return Rx.Observable.from([
                    updateMapLayoutPO(layout)
                ]);
            } else {
                return Rx.Observable.empty();
            }
        });
    }

/**
 * windRoseClickedPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const windRoseClickedPOEpic = (action$, store) => action$.ofType(actions.ROSE_CLICKED).switchMap((action) => {
        var observableReturned = [getPhotoCountActionPO()];
        if (prevWindRoseValue === action.degree) {
            observableReturned.push(setWindRoseClickPO(''));
        } else {
            prevWindRoseValue = action.degree;
            observableReturned.push(setWindRoseClickPO(action.degree));
        }
        return Rx.Observable.from(observableReturned);
    })

    
/**
 * updateSearchResultsOnMapMoovePOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const updateSearchResultsOnMapMovePOEpic = (action$, store) => action$.ofType(CHANGE_MAP_VIEW).switchMap(() => {
    return Rx.Observable.from([getPhotoCountActionPO()]);
})

/**
 * initProjectionsPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const initProjectionsPOEpic = (action$) => action$.ofType(actions.INIT_PROJECTIONS).switchMap(() => {
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
        // et le -relevance pour avoir en ordre décroissant
        relevance = '-relevance';
    }
    //mise en place des datas
    var datas = [endDate[0], startDate[startDate.length-1], roseValue, '', '', 0, 10, relevance];
    //emprise de la carte
    var wkt = getPerimeterPolygon(store);
    if (getPolygon(store.getState()) != undefined && !action.newSearch) {
        wkt = getPolygon(store.getState());
    }
    
    if (action.loadMore) {
        datas = [endDate[0], startDate[startDate.length-1], roseValue, '', '', getSearchResult(store.getState()).length, 10, relevance];
    }
        
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
        getPhotos(wkt, datas)
    ).switchMap((response) => {
        var observablesReturned = []
        response = response[0];
        if (response.status === 200) {
            if (response.data.length != 0) {
                console.log(getPhotoCountSelector(store.getState()));
                return Rx.Observable.forkJoin(
                    getPhotoCount(wkt, datas)
                ).switchMap((responsePhotoCount) => {
                    responsePhotoCount = responsePhotoCount[0];
                    if (responsePhotoCount.status === 200) {
                        observablesReturned = [
                            setPrevPhotoCount(getPhotoCountSelector(store.getState())),
                            updateAdditionalLayer(
                                PO_PERIMETER_LAYER_ID,
                                "PO",
                                "overlay",
                                {...vectorLayer.options, features}
                            ),
                            setPolygonPO(wkt),
                            setPhotoCountActionPO(responsePhotoCount.data.numberOfResult)
                        ];
                    
                        if (action.loadMore && getSearchResult(store.getState()).concat(response.data).length <= responsePhotoCount.data.numberOfResult) {
                            observablesReturned.push(searchValuesFilteredPO(getSearchResult(store.getState()).concat(response.data)))
                        }else{
                            observablesReturned.push(searchValuesFilteredPO(response.data))
                        }
                        observablesReturned.push(
                            accumulateScrollEventsPO(false),
                            cancelSearchFiltersPO()
                        )
                    } else {
                        if (isOpen(store.getState())) {
                            return dropPopUp(response.status, response.statusText);
                        } else {
                            return Rx.Observable.empty();
                        }
                    }
                    return Rx.Observable.from(observablesReturned);
                })
            } else {
                // en cas de 0 résultats retournés
                response.data = [{provider: 'none'}];
                observablesReturned = [
                    setPrevPhotoCount(getPhotoCountSelector(store.getState())),
                    updateAdditionalLayer(
                        PO_PERIMETER_LAYER_ID,
                        "PO",
                        "overlay",
                        {...vectorLayer.options, features}
                    ),
                    setPolygonPO(wkt),
                    searchValuesFilteredPO(response.data),
                    setPhotoCountActionPO(0),
                    accumulateScrollEventsPO(false),
                    cancelSearchFiltersPO()
                ]
                return Rx.Observable.from(observablesReturned);
            }
        } else {
            if (isOpen(store.getState())) {
                return dropPopUp(response.status, response.statusText);
            } else {
                return Rx.Observable.empty();
            }
        }
        // return Rx.Observable.from(observablesReturned);

    });
})

/**
 * filterSearchedValuesPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const filterSearchedValuesPOEpic = (action$) => action$.ofType(actions.FILTER_SEARCH_VALUES).switchMap((action) => {
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
    var config = getPluginConfig(store.getState());
    var basketSize = 0;
    var alreadyInBasket = false;
    var observable = [];
    if (basket.length >= 1) {
        alreadyInBasket = !!basket.find(item => item.id === action.item.id)
    }
    basket.forEach((item) => {
        basketSize += item.fileSize;
    });
    if (!alreadyInBasket) {
        if (basket.length +1 <= config.pictureamount && parseFloat((basketSize + action.item.fileSize) / 1000000).toFixed(1) || 0 <= config.maxmoamount) {
            basket.push(action.item);
            basketSize += action.item.fileSize;
            observable = [
                updateItemInBasketPO(basket),
                setPicturesInBasketPO(basket.length, basketSize)
            ];
        } else{
            if (basket.length +1 >= config.pictureamount) {
                return dropPopUp('basketTooMuchPictures', '', store.getState());
            }
            if (parseFloat((basketSize + action.item.fileSize) / 1000000).toFixed(1) >= config.maxmoamount) {
                return dropPopUp('basketTooHeavy');
            }
        }
    }

    /* eslint-enable */
    return Rx.Observable.from(observable);
})

/**
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const throwAddInBasketPopUp = (action$) => action$.ofType(actions.UPDATE_ITEM_IN_BASKET).switchMap((action) => {
    if (action.removePopUp === true) {
        return Rx.Observable.empty();
    } else {
        return dropPopUp('addBasket');
    }
});

/**
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const removeItemsFromBasketPOEpic = (action$, store) => action$.ofType(actions.REMOVE_SELECTED_ITEMS_IN_BASKET).switchMap((action) => {
    /* eslint-disable */
    var item = getBasket(store.getState());
    var result = item.filter(elt => !elt.selected);
    var resultSelected = item.filter(elt => elt.selected);
    var observables = [];
    //si on annule la suppression
    if (resultSelected.length === 0 && !action.forceDeletionOnEmptySelection) {
        observables = [modalDisplayPO(true, 'deletionModal')];
    }
    //si on supprime les éléments sélectionnés
    if (item.length === result.length && action.forceDeletionOnEmptySelection || item.length !== result.length) {    
        //si on supprime tout, result = []
        result = item.length === result.length && action.forceDeletionOnEmptySelection ? [] : result;
        observables = [updateItemInBasketPO(result), countItemsSelectedInBasketPO(0), modalDisplayPO(false, '')];
    }

    if (result.length === 0) {
        observables.push(changeTabPO("PHOTOSOBLIQUES:HOME"));
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
    return Rx.Observable.from([updateItemInBasketPO(features, true), countItemsSelectedInBasketPO(count)]);
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

/**
 * downloadBasketPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const downloadBasketPOEpic = (action$, store) => action$.ofType(actions.DOWNLOAD_BASKET).switchMap((action) => {
    var basket = getBasket(store.getState());
    var photoIds = [];
    var photoIdsNoSelection = [];
    basket.forEach(element => {
        if (element.selected) {
            photoIds.push(element.id);
        }else{
            photoIdsNoSelection.push(element.id);
        }
    });
    if (photoIds.length < 1) {
        photoIds = photoIdsNoSelection;
    }
    var zipName = getFileName(store.getState());
    var prefix = getPrefix(store.getState());
    var datas = [photoIds, zipName, prefix];
    return Rx.Observable.forkJoin(
        downloadPicture(datas)
    ).switchMap((response) => {
        response = response[0];
        if (response.status === 200) {
            var url = window.URL.createObjectURL(response.data);
            var a = document.createElement('a');
            a.href = url;
            if (zipName === '') {
                zipName = response.headers["content-disposition"].split("filename=")[1];
            }
            a.download = zipName;
            a.click();
            window.URL.revokeObjectURL(url);
            return Rx.Observable.from([modalDisplayPO(false, ''), setDownloadingPO(false)]);
        } else {
            if (isOpen(store.getState())) {
                return dropPopUp(response.status, response.statusText);
            } else {
                return Rx.Observable.empty();
            }
        }
    });
});

/**
 * initDateSelectsPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const dropPopUpOnDownloadSuccessPOEpic = (action$, store) => action$.ofType(actions.SET_DOWNLOADING).switchMap((action) => {
    if (action.bool === false) {
        return dropPopUp(200);
    }else {
        return Rx.Observable.empty();
    }
});

/**
 * initDateSelectsPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const initDateSelectsPOEpic = (action$, store) => action$.ofType(actions.INIT_DATE_SELECT).switchMap((action) => {
    return Rx.Observable.forkJoin(
        getYears(getPerimeterPolygon(store))
    ).switchMap((response) => {
        response = response[0];
        if (response.status === 200) {
            return Rx.Observable.from([setDateListPO(response.data)]);
        } else {
            if (isOpen(store.getState())) {
                return dropPopUp(response.status, response.statusText);
            } else {
                return Rx.Observable.empty();
            }
        }
    });
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
    if (action.startDate != 'start') {
        dateList.forEach((item) => {
            if (item >= action.startDate) {
                newEndDate.push(item);
            }
        });
    } else {
        newEndDate = dateList;
    }
    return Rx.Observable.from([getEndDateValuePO(newEndDate), getPhotoCountActionPO(), setStartDateValuePO(action.startDate)]);
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
    if (action.endDate != 'end') {
        dateList.forEach((item) => {
            if (item <= action.endDate) {
                newStartDate.push(item);
            }
        });
    } else {
        newStartDate = dateList;
    }
    return Rx.Observable.from([getStartDateValuePO(newStartDate), getPhotoCountActionPO(), setEndDateValuePO(action.endDate)]);
});

/**
 * getPhotoCountPOEpic on table click, selects the row selected and highlight it on the map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const getPhotoCountPOEpic = (action$, store) => action$.ofType(actions.GET_PHOTO_COUNT).switchMap((action) => {
    if (isOpen(store.getState())) {
        var polygon = getPerimeterPolygon(store);
        var endDate = getEndDate(store.getState());
        var startDate = getStartDate(store.getState());
        var roseValue = getSelectedRoseValue(store.getState());
        var datas = [endDate[0], startDate[startDate.length-1], roseValue];
        return Rx.Observable.forkJoin(
            getPhotoCount(polygon, datas)
        ).switchMap((response) => {
            response = response[0];
            if (response.status === 200) {
                return Rx.Observable.from([setPhotoCountActionPO(response.data.numberOfResult)]);
            } else {
                if (isOpen(store.getState())) {
                    return dropPopUp(response.status, response.statusText);
                } else {
                    return Rx.Observable.empty();
                }
            }
        });
        return Rx.Observable.from([]);
    } else{
        return Rx.Observable.empty();
    }
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

function getPerimeterPolygonGeom(store){
    //emprise de la carte
    var empriseRecherche = mapBboxSelector(store.getState());
    var map = mapSelector(store.getState());
    var x = (map.size.width - (PO_RIGHT_SIDEBAR_MARGIN_LEFT + PHOTOSOBLIQUES_PANEL_WIDTH)) * map.resolution + empriseRecherche.bounds.minx;
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
    return empriseRechercheGeom;
}

function getPerimeterPolygon(store){
    // on récupère la géometrie du périmètre
    var empriseRechercheGeom = getPerimeterPolygonGeom(store);
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
    var hoveredItemPerimeterTotallyVisible = false;
    if (action.item) {
        const itemPolygon = new WKT().readGeometry(action.item.shape);
        itemPolygon.transform(proj3948, proj4326);
        hoveredItemPerimeter = {...hoveredItemPerimeter, geometry: {type: "Polygon", coordinates: itemPolygon.getCoordinates()}};
        var currentViewGeom = getPerimeterPolygonGeom(store);
        currentViewGeom.transform(proj3948, proj4326);
        hoveredItemPerimeterTotallyVisible = containsExtent(currentViewGeom.getExtent(), itemPolygon.getExtent());
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
        ),
        updateHoveredPolygonVisibilityStatePO(hoveredItemPerimeterTotallyVisible)
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
            return dropPopUp('errorFilters');
            break;
    }
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
    if (!getScrollIndicator(store.getState())) {
        if (document.getElementById('PHOTOSOBLIQUES_scrollBar').scrollTop >= (document.getElementById('PHOTOSOBLIQUES_scrollBar').clientHeight * (-0.8))) {
           return Rx.Observable.from([validateSearchFiltersPO(true,true), accumulateScrollEventsPO(true)]);
        }
    } else{
        return Rx.Observable.empty();
    }
    return Rx.Observable.from([accumulateScrollEventsPO(false)]);
})

/**
 * clearFiltersEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const clearFiltersEpic = (action$, store) => action$.ofType(actions.CLEAR_FILTERS).switchMap((action) => {
    var dateList = getDateList(store.getState());
    return Rx.Observable.from(
        [
            getStartDateValuePO(getDateList(store.getState())),
            getEndDateValuePO(getDateList(store.getState())),
            windRoseClickPO(''),
            setStartDateValuePO(),
            setEndDateValuePO()
        ]
    );
})

/**
 * initConfigsPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const initConfigsPOEpic = (action$, store) => action$.ofType(actions.INIT_CONFIGS).switchMap((action) => {
    if (isOpen(store.getState())) {
        setAPIURL(action.configs.pobackendurlaccess);
        return Rx.Observable.forkJoin(
            getConfigs()
        ).switchMap((response) => {
            response = response[0];
            if (response.status === 200) {
                response = response.data;
                response.photosobliqueshometext = action.configs.photosobliqueshometext;
                response.pictureamount = action.configs.pictureamount;
                response.maxmoamount = action.configs.maxmoamount;
                response.downloadinformationmessage = action.configs.downloadinformationmessage;
                response.pobackendurlaccess = action.configs.pobackendurlaccess;
                response.helplink = action.configs.helplink;
                return Rx.Observable.from([
                    setPluginConfigsPO(response)
                ]);
            } else {
                if (isOpen(store.getState())) {
                    return dropPopUp(response.status, response.statusText);
                } else {
                    return Rx.Observable.empty();
                }
            }
        })
    } else {
        return Rx.Observable.empty();
    }
})

/**
 * dropPopUp drop popup according to level
 * @memberof photosObliques.epics
 * @param level - popup level e.g: success | error
 * @returns - observable containing popup or empty observable
 */
const dropPopUp = (code, message, state) => {
    switch (code) {
    case 200:
        return Rx.Observable.from([
            show({ title: "photosObliques.dropPopUp200.title", message: "photosObliques.dropPopUp200.message" }, "success")]);
    case 400:
        return Rx.Observable.from([
            show({ title: "photosObliques.dropPopUp400.title", message: message }, "error")]);
    case 500:
        return Rx.Observable.from([
            show({ title: "photosObliques.dropPopUp500.title", message: message }, "error")]);
    case 'basketTooMuchPictures':
        return Rx.Observable.from([
            modalDisplayPO(false, ''),
            show({ title: "photosObliques.dropPopUpTooManyPictures.title", message: "photosObliques.dropPopUpTooManyPictures.message" }, "error")]);
    case 'basketTooHeavy':
        return Rx.Observable.from([
            modalDisplayPO(false, ''),
            show({ title: "photosObliques.dropPopUpTooHeavy.title", message: "photosObliques.dropPopUpTooHeavy.message" }, "error")]);
    case 'addBasket':
        return Rx.Observable.from([
            modalDisplayPO(false, ''),
            show({ title: "photosObliques.dropPopUpAddBasket.title", message: "photosObliques.dropPopUpAddBasket.message" }, "success")]);
    case 'Erreur Filtres':
        return Rx.Observable.from([show({ title: code, message: message }, "error")]);
    default:
        return Rx.Observable.from([
            show({ title: "photosObliques.dropPopUpCustom.title", message: "photosObliques.dropPopUpCustom.message" }, "error")]);
        break;
    }
    return Rx.Observable.empty();
};