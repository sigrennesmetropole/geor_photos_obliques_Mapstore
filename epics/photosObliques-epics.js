/* eslint-disable no-console */
import Rx from "rxjs";
import { show } from "@mapstore/actions/notifications";
import {
    actions,
    loadTypesPO,
    updateMapLayoutPO,
    initConfigsPO,
    searchValuesFilteredPO,
    updateItemInBasketPO,
    countItemsSelectedInBasketPO,
    initProjectionsPO,
    initDateSelectPO,
    initOverlayLayerPO,
    getEndDatesValuesPO,
    getStartDatesValuesPO,
    setPolygonPO,
    getPhotoCountActionPO,
    setPhotoCountActionPO,
    validateSearchFiltersPO,
    cancelSearchFiltersPO,
    setDateListPO,
    modalDisplayPO,
    updateHoveredPolygonVisibilityStatePO,
    setDownloadingPO,
    accumulateScrollEventsPO,
    windRoseClickPO,
    setWindRoseClickPO,
    setPluginConfigsPO,
    setPicturesInBasketPO,
    selectStartDateValuePO,
    setStartDateValuePO,
    selectEndDateValuePO,
    setEndDateValuePO,
    changeTabPO,
    setPrevPhotoCount,
    setPrevSearchFiltersValues,
    setLoadingPO
} from "../actions/photosObliques-action";
import {
    toggleControl,
    TOGGLE_CONTROL
} from "@mapstore/actions/controls";
import {
    PHOTOSOBLIQUES_PANEL_WIDTH,
    PO_RIGHT_SIDEBAR_MARGIN_LEFT,
    PO_PERIMETERS_LAYER_ID,
    PHOTOSOBLIQUES_PLUGIN_NAME
} from "../constants/photosObliques-constants";
import {
    updateDockPanelsList,
    UPDATE_MAP_LAYOUT,
    FORCE_UPDATE_MAP_LAYOUT
} from "@mapstore/actions/maplayout";
import {
    OPEN_FEATURE_GRID
} from "@mapstore/actions/featuregrid";
import { changeMapInfoState } from "@mapstore/actions/mapInfo";
import {
    isOpen,
    getSearchResult,
    getBasket,
    getPerimetersLayer,
    getEndDates,
    getStartDates,
    getPolygon,
    getSelectedRoseValue,
    getFilterSearchValues,
    getDisplayFilters,
    getDateList,
    getScrollIndicator,
    getFileName,
    getPrefix,
    getPluginConfig,
    getPhotoCountSelector,
    getPrevSearchFiltersValues,
    getPrevPhotoCount
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
var proj3857;
var proj3948;
var proj4326;
var searchPerimeter = {};
var hoveredItemPerimeter = {};
var prevWindRoseValue;

/**
 * openPanelPOEpic opens the panel of this plugin
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the projection, the dock panel, the filter values, and the map layout update actions)
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
            initDateSelectPO(),
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
 * @returns - observable with the list of actions to do after completing the function (the dock panel, layers visibility and the map layout update actions)
 */
export const closePanelPOEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL, OPEN_FEATURE_GRID, actions.CLOSE_PHOTOSOBLIQUES)
    .filter( 
    action => !!store.getState()
    && !isOpen(store.getState()) || action.type === actions.CLOSE_PHOTOSOBLIQUES )
    .switchMap((action) => {
        let observableAction = [
            updateDockPanelsList(PHOTOSOBLIQUES_PLUGIN_NAME, 'remove', 'right'),
            changeMapInfoState(true)        
        ];
        if (action.control === PHOTOSOBLIQUES_PLUGIN_NAME) {
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
            observableAction.push(updateMapLayoutPO(currentLayout));
        }        
        let vectorLayerToHide = getPerimetersLayer(store.getState());
        vectorLayerToHide.visibility = styles.hidden;
        observableAction.push(updateAdditionalLayer(PO_PERIMETERS_LAYER_ID, "PO", "overlay", vectorLayerToHide));
        if (action.type === actions.CLOSE_PHOTOSOBLIQUES) {
            observableAction = [toggleControl(PHOTOSOBLIQUES_PLUGIN_NAME, 'enabled')].concat(observableAction);
        }
        return Rx.Observable.from(observableAction);
});

/**
 * onUpdatingLayoutWhenPanelOpenedPOEpic fix mapstore search bar issue on photosObliques panel opening
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update map layout
 */
export function onUpdatingLayoutWhenPanelOpenedPOEpic(action$, store) {
    return action$.ofType(UPDATE_MAP_LAYOUT, FORCE_UPDATE_MAP_LAYOUT)
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
            return Rx.Observable.of(updateMapLayoutPO(layout));
        });
};

/**
 * windRoseClickedPOEpic used to update compass value
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which updates photoCount and Compass Position
 */
export const windRoseClickedPOEpic = (action$, store) => action$.ofType(actions.ROSE_CLICKED).switchMap((action) => {
        //l'action n'est lancée que si le panneau de recherche est affiché : permet le chargement de la précédente valeur d'angle lors dela réouverture du panneau.
        if (getDisplayFilters(store.getState())){
           var observableReturned = [];
           if (prevWindRoseValue === action.degree) {
                prevWindRoseValue = -1;
                observableReturned.push(setWindRoseClickPO(-1));
            } else {
                prevWindRoseValue = action.degree;
                observableReturned.push(setWindRoseClickPO(action.degree));
            }
            observableReturned.push(getPhotoCountActionPO())
            return Rx.Observable.from(observableReturned); 
        }
        else{
            return Rx.Observable.empty();
        }
        
});
    
/**
 * updateSearchResultsOnMapMoovePOEpic updates photoCount when map extent is changed
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which updates photoCount
 */
export const updateSearchResultsOnMapMovePOEpic = (action$, store) => action$.ofType(CHANGE_MAP_VIEW).switchMap(() => {
    if(!getDisplayFilters(store.getState()) && getSearchResult(store.getState()).length > 0){
        return Rx.Observable.empty();
    }
    else{
        return Rx.Observable.from([getPhotoCountActionPO()]);
    }
});

/**
 * initProjectionsPOEpic inits projections used for layers
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
    return Rx.Observable.empty();
});    

/**
 * filtersTriggeredPOEpic execute search and shoxs results
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable to show search's results or empty observable if error raised by the plugin's BE
 */
export const filtersTriggeredPOEpic = (action$, store) => action$.ofType(actions.SEARCH_FILTERS).switchMap((action) => {

    /* eslint-disable */
    //valeur d'ordre de tri
    var sortValue = getFilterSearchValues(store.getState());
    if (!sortValue) {
        // et le -relevance pour avoir en ordre décroissant
        sortValue = '-relevance';
    }

    if(action.loadType == loadTypesPO.NEW) {
        //valeur rose des vents
        var roseValue = getSelectedRoseValue(store.getState());
        //valeur année de début
        var startDates = getStartDates(store.getState());
        //valeur année de fin
        var endDates = getEndDates(store.getState());
        //mise en place des datas
        var datas = [endDates[0], startDates[startDates.length-1], roseValue, '', '', 0, 10, sortValue];
        //emprise de la carte
        var wkt = getPerimeterPolygon(store);
        //sauvegarde des paramètres de recherche
        var searchFiltersValues = {
            prevStartDate: endDates[0],
            prevEndDate: startDates[startDates.length-1],
            prevRoseValue: roseValue
        };
    }
    else {//cas du loadMore ou du changement de l'ordre de tri (!MORE et !SORT)
        var offsetValue = 0;
        if(action.loadType == loadTypesPO.MORE){//charger plus de résultats : on récupère le nombre de résultats déjà chargés
            offsetValue = getSearchResult(store.getState()).length;
        }
        //mise en place des datas
        var searchFiltersValues = getPrevSearchFiltersValues(store.getState());
        datas = [searchFiltersValues.prevStartDate, searchFiltersValues.prevEndDate, searchFiltersValues.prevRoseValue, '', '', offsetValue, 10, sortValue];
        //emprise de la carte
        var wkt = getPolygon(store.getState());
    }
        
    //on récupère les layers
    const vectorLayer = getPerimetersLayer(store.getState());
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
                return Rx.Observable.forkJoin(
                    getPhotoCount(wkt, datas)
                ).switchMap((responsePhotoCount) => {
                    responsePhotoCount = responsePhotoCount[0];
                    if (responsePhotoCount.status === 200) {
                        if (action.loadType == loadTypesPO.MORE) {
                            observablesReturned.push(searchValuesFilteredPO(getSearchResult(store.getState()).concat(response.data)))
                        }else{ //cas de nouvelle recherche ou modification de l'ordre de tri
                            if (action.loadType == loadTypesPO.NEW){
                                observablesReturned = [
                                    setPrevSearchFiltersValues(searchFiltersValues),
                                    setPrevPhotoCount(getPhotoCountSelector(store.getState())),
                                    updateAdditionalLayer(
                                        PO_PERIMETERS_LAYER_ID,
                                        "PO",
                                        "overlay",
                                        {...vectorLayer.options, features}
                                    ),
                                    setPolygonPO(wkt),
                                    setPhotoCountActionPO(responsePhotoCount.data.numberOfResult)
                                ];
                            }
                            observablesReturned.push(
                                searchValuesFilteredPO(response.data),
                                cancelSearchFiltersPO()
                            )
                        }
                        observablesReturned.push(
                            accumulateScrollEventsPO(false),
                            setLoadingPO(false)
                        )
                    } else {
                        if (isOpen(store.getState())) {
                            return dropPopUpPOEpic(response.status, response.statusText);
                        } else {
                            return Rx.Observable.empty();
                        }
                    }
                    return Rx.Observable.from(observablesReturned);
                })
            } else {
                // en cas de 0 résultats retournés
                response.data = [{provider: null}];
                observablesReturned = [
                    setPrevSearchFiltersValues(searchFiltersValues),
                    setPrevPhotoCount(getPhotoCountSelector(store.getState())),
                    updateAdditionalLayer(
                        PO_PERIMETERS_LAYER_ID,
                        "PO",
                        "overlay",
                        {...vectorLayer.options, features}
                    ),
                    setPolygonPO(wkt),
                    searchValuesFilteredPO(response.data),
                    setPhotoCountActionPO(0),
                    accumulateScrollEventsPO(false),
                    setLoadingPO(false)
                ]
                return Rx.Observable.from(observablesReturned);
            }
        } else {
            if (isOpen(store.getState())) {
                return dropPopUpPOEpic(response.status, response.statusText);
            } else {
                return Rx.Observable.empty();
            }
        }
    });
});

/**
 * filterSearchedValuesPOEpic validates values selected
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable to validates Search's Filters
 */
export const filterSearchedValuesPOEpic = (action$) => action$.ofType(actions.FILTER_SEARCH_VALUES).switchMap(() => {
    return Rx.Observable.from([validateSearchFiltersPO(true, loadTypesPO.SORT)]);
});

/**
 * closeSearchPanelPOEpic hide search panel and updates modified search values with previous search parameters
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which changes search filters values
 */
export const closeSearchPanelPOEpic = (action$, store) => action$.ofType(actions.CANCEL_SEARCH_FILTERS).switchMap(() => {
    //rétablir les paramètres de recherche sur les inputs
    var prevSearchFilters = getPrevSearchFiltersValues(store.getState());
    if (prevSearchFilters){
        return Rx.Observable.from(
            [
                windRoseClickPO(prevSearchFilters.prevRoseValue),
                selectStartDateValuePO(prevSearchFilters.prevStartDate),
                selectEndDateValuePO(prevSearchFilters.prevEndDate)
            ]
        );
    }
    else{
        return Rx.Observable.empty();  
    }
});

/**
 * openSearchPanelPOEpic reopen search panel
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable which updates photo Count
 */
export const openSearchPanelPOEpic = (action$) => action$.ofType(actions.OPEN_SEARCH_FILTERS).switchMap(() => {
    return Rx.Observable.of(getPhotoCountActionPO());
});

/**
 * addBasketPOEpic adds picture to basket
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which updates list of items in Basket
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
        if (basket.length +1 > config.pomaxcartnumberofpics) {
            return dropPopUpPOEpic('basketTooMuchPictures', '', store.getState());
        }
        if (parseFloat((basketSize + action.item.fileSize) / 1000000).toFixed(1) >= config.pomaxcartsize) {
            return dropPopUpPOEpic('basketTooHeavy');
        }
        else{
            basket.push(action.item);
            basketSize += action.item.fileSize;
            observable = [
                updateItemInBasketPO(basket),
                setPicturesInBasketPO(basket.length, basketSize)
            ];
        }
    }
    else{
        return dropPopUpPOEpic('alreadyInBasket');
    }

    /* eslint-enable */
    return Rx.Observable.from(observable);
});

/** throwAddInBasketPopUp shows popup while adding pictures in basket
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable or PopUp indicates items had been added to basket
 */
export const throwAddInBasketPopUp = (action$) => action$.ofType(actions.UPDATE_ITEM_IN_BASKET).switchMap((action) => {
    if (action.removePopUp === true) {
        return Rx.Observable.empty();
    } else {
        return dropPopUpPOEpic('addBasket');
    }
});

/** removeItemsFromBasketPOEpic removes items from basket
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which updates list of items in basket
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
        observables.push(changeTabPO("PHOTOSOBLIQUES:SEARCH"));
    }
    /* eslint-enable */
    return Rx.Observable.from(observables);
});

/**
 * clickPicturePOEpic handle items selection in basket
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update selected items on Basket
 */
export const clickPicturePOEpic = (action$, store) => action$.ofType(actions.CLICK_PICTURE).switchMap((action) => {
    const currentItems = getBasket(store.getState());
    const features = pictureSelectionPO(currentItems, action.ctrlKey, action.itemId);
    var count = 0;
    features.forEach((item) => {
        if (item.selected) {
            count++;
        }
    })
    return Rx.Observable.from([updateItemInBasketPO(features, true), countItemsSelectedInBasketPO(count)]);
});

/**
 * pictureSelectionPO handle list of selected items in basket
 * @memberof photosObliques.epics
 * @param currentItems - current features
 * @param control - is the user pressing control key
 * @param control - is the user pressing shift key 
 * @param intersectedItem - all features clicked
 * @returns - return pictures selected
 */
function pictureSelectionPO(currentItems, control, intersectedItem) {
    var currentSelected = 0;
    var selectedRow = [];
    var currentFeatureList = currentItems.map((item) => {
        if (intersectedItem === item.id) {
            item.selected = !item.selected;
            if (!control) {
                selectedRow = [];
            }
            if (item.selected) {
                selectedRow.push(intersectedItem);
            }
        } else if (!control) {
            item.selected = false;
        }
        currentSelected++;
        return {
            ...item
        };
    });
    return currentFeatureList;
};

/**
 * downloadBasketPOEpic send download order to BE
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which throw download action to BE
 */
export const downloadBasketPOEpic = (action$, store) => action$.ofType(actions.DOWNLOAD_BASKET).switchMap(() => {
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
                return dropPopUpPOEpic(response.status, response.statusText);
            } else {
                return Rx.Observable.empty();
            }
        }
    });
});

/**
 * dropPopUpOnDownloadSuccessPOEpic shows popup when doanwloading results
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - popup which indicates download status or empty observable
 */
export const dropPopUpOnDownloadSuccessPOEpic = (action$) => action$.ofType(actions.SET_DOWNLOADING).switchMap((action) => {
    if (action.bool === false) {
        return dropPopUpPOEpic(200);
    }else {
        return Rx.Observable.empty();
    }
});

/**
 * initDateSelectsPOEpic intializes list of avalaible dates
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which updates date list after date selection
 */
export const initDateSelectsPOEpic = (action$, store) => action$.ofType(actions.INIT_DATE_SELECT).switchMap(() => {
    return Rx.Observable.forkJoin(
        getYears(getPerimeterPolygon(store))
    ).switchMap((response) => {
        response = response[0];
        if (response.status === 200) {
            return Rx.Observable.from([setDateListPO(response.data)]);
        } else {
            if (isOpen(store.getState())) {
                return dropPopUpPOEpic(response.status, response.statusText);
            } else {
                return Rx.Observable.empty();
            }
        }
    });
});

/**
 * initDateSelectsPOEpic initializes lists of dates
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable which updates date list
 */
export const initDateListPOEpic = (action$) => action$.ofType(actions.SET_DATE_LIST).switchMap((action) => {
    return Rx.Observable.from([getStartDatesValuesPO(action.dates), getEndDatesValuesPO(action.dates)]);
});

/**
 * selectStartDatePOEpic handle list of date ofter selection of value
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - which updates end dates list after a start date selection
 */
export const selectStartDatePOEpic = (action$, store) => action$.ofType(actions.SELECT_START_DATE_VALUE).switchMap((action) => {
    var dateList = getDateList(store.getState());
    var newEndDates = [];
    if (action.startDate != 0) {
        dateList.forEach((item) => {
            if (item >= action.startDate) {
                newEndDates.push(item);
            }
        });
    } else {
        newEndDates = dateList;
    }
    return Rx.Observable.from([getEndDatesValuesPO(newEndDates), getPhotoCountActionPO(), setStartDateValuePO(action.startDate)]);
});

/**
 * selectEndDatePOEpic handle list of date ofter selection of value
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - which updates start dates list after a end date selection
 */
export const selectEndDatePOEpic = (action$, store) => action$.ofType(actions.SELECT_END_DATE_VALUE).switchMap((action) => {
    var dateList = getDateList(store.getState());
    var newStartDates = [];
    if (action.endDate != 0) {
        dateList.forEach((item) => {
            if (item <= action.endDate) {
                newStartDates.push(item);
            }
        });
    } else {
        newStartDates = dateList;
    }
    return Rx.Observable.from([getStartDatesValuesPO(newStartDates), getPhotoCountActionPO(), setEndDateValuePO(action.endDate)]);
});

/**
 * getPhotoCountPOEpic updates number of estimated results
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update photo count
 */
export const getPhotoCountPOEpic = (action$, store) => action$.ofType(actions.GET_PHOTO_COUNT).switchMap(() => {
    if (isOpen(store.getState())) {
        var polygon = getPerimeterPolygon(store);
        var endDates = getEndDates(store.getState());
        var startDates = getStartDates(store.getState());
        var roseValue = getSelectedRoseValue(store.getState());
        var datas = [endDates[0], startDates[startDates.length-1], roseValue];
        return Rx.Observable.forkJoin(
            getPhotoCount(polygon, datas)
        ).switchMap((response) => {
            response = response[0];
            if (response.status === 200) {
                return Rx.Observable.from([setPhotoCountActionPO(response.data.numberOfResult)]);
            } else {
                return dropPopUpPOEpic(response.status, response.statusText);
            }
        });
    } else{
        return Rx.Observable.empty();
    }
});

/**
 * addOverlayLayerPOEpic - add layer to map
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable which update layers
 */
export const addOverlayLayerPOEpic = (action$) =>
    action$.ofType(actions.INIT_OVERLAY_LAYER)
        .switchMap(() => {
            if (!searchPerimeter.id) {
                searchPerimeter = {
                    id: 'search',
                    geometry: {type:"Polygon", coordinates:[[]]},
                    name:'searchPerimeter',
                    properties: {},
                    type: "Feature",
                    style: styles.hidden
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
                id: PO_PERIMETERS_LAYER_ID,
                features: [hoveredItemPerimeter,searchPerimeter],
                name: "POPerimeterLayer",
                visibility: true,
                type: "vector"
            };
            return Rx.Observable.from([
                updateAdditionalLayer(
                    PO_PERIMETERS_LAYER_ID,
                    "PO",
                    'overlay',
                    vectorLayerOption
                )
            ]);
    });

/**getPerimeterPolygonGeom - permet de récupérer la vue actuelle de la carte comme périmètre de recherche et la récupérer comme géométrie
 * @memberof photosObliques.epics
 * @param store - list the content of variables inputted with the actions
 * @returns - map extent for map
 */
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
};

/**getPerimeterPolygon : permet de transformer le périmètre en un wkt
 * @memberof photosObliques.epics
 * @param store - list the content of variables inputted with the actions
 * @returns - wkt of geometry
 */
function getPerimeterPolygon(store){
    // on récupère la géometrie du périmètre
    var empriseRechercheGeom = getPerimeterPolygonGeom(store);
    //on génère le wkt
    return new WKT().writeGeometry(empriseRechercheGeom);
};

/**
 * pictureHoveredPOEpic update layer if picture hovered
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const pictureHoveredPOEpic = (action$, store) => action$.ofType(actions.PICTURE_HOVERED).switchMap((action) => {
    //on récupère le layer
    const perimetersLayer = getPerimetersLayer(store.getState());
    var hoveredItemPerimeterTotallyVisible = false;
    if (action.item) { //si un item est hovered
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
            PO_PERIMETERS_LAYER_ID,
            "PO",
            "overlay",
            {...perimetersLayer.options, features}
        ),
        updateHoveredPolygonVisibilityStatePO(hoveredItemPerimeterTotallyVisible)
    ]);
});

/**
 * zoomElementPOEpic zoom to picture extent
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable to zoom on picture Extent
 */
export const zoomElementPOEpic = (action$) => action$.ofType(actions.ZOOM_ELEMENT).switchMap(() => {
    /* eslint-disable */
    const format = new GeoJSON();
    const feature = format.readFeature(hoveredItemPerimeter);
    const polygon = feature.getGeometry();

    return Rx.Observable.from([zoomToExtent(polygon.getExtent(), "EPSG:4326", 20, {nearest: true})]);
    /* eslint-enable */
});

/**
 * filterBasketValuesPOEpic sort items in basket
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which updates list of items in basket
 */
export const filterBasketValuesPOEpic = (action$, store) => action$.ofType(actions.FILTER_BASKET_VALUES).switchMap((action) => {
    /* eslint-disable */
    var filteredValues = getBasket(store.getState());
    switch (action.filterValue) {
        case "-relevance":
            filteredValues = filteredValues.sort((a,b) => (a.relevance < b.relevance) ? 1 : ((b.relevance < a.relevance) ? -1 : 0))
            break;
        case "-date":
            filteredValues = filteredValues.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))
            break;
        case "-year":
            filteredValues = filteredValues.sort((a,b) => (a.year < b.year) ? 1 : ((b.year < a.year) ? -1 : 0))
            break;
        case "-owner":
            filteredValues = filteredValues.sort((a,b) => (a.owner < b.owner) ? 1 : ((b.owner < a.owner) ? -1 : 0))
            break;
        case "-provider":
            filteredValues = filteredValues.sort((a,b) => (a.provider < b.provider) ? 1 : ((b.provider < a.provider) ? -1 : 0))
            break;
        case "-fileSize":
            filteredValues = filteredValues.sort((a,b) => (a.fileSize < b.fileSize) ? 1 : ((b.fileSize < a.fileSize) ? -1 : 0))
            break;
        default:
            return dropPopUpPOEpic('errorFilters');
    }
    return Rx.Observable.from([updateItemInBasketPO(filteredValues.slice(),true)]);
    /* eslint-enable */
});

/**
 * onScrollPOEpic loads more results while scrolling on list results
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which loads more results if scroll position near bottom or empty observable
 */
export const onScrollPOEpic = (action$, store) => action$.ofType(actions.ONSCROLL).switchMap(() => {    
    if (!getScrollIndicator(store.getState())) {
        /* Lors du scroll on vérifie la valeur en pixel de la position du la scrollbar atteinte par l'utilisateur (scrollTop + clientHeight). 
        Si on approche de la fin de la scrollbar (si la valeur de la position est supérieure ou égale à la hauteur totale de la scrollbar moins 110px, on charge la suite des résultats*/
        if ( (document.getElementById('PHOTOSOBLIQUES_scrollBar').scrollTop + document.getElementById('PHOTOSOBLIQUES_scrollBar').clientHeight) >= (document.getElementById('PHOTOSOBLIQUES_scrollBar').scrollHeight-110) ) {
            /* chargement des résultats seulement si le maximum n'a pas été chargé */
            if (getSearchResult(store.getState()).length < getPrevPhotoCount(store.getState())){
                return Rx.Observable.from([validateSearchFiltersPO(true, loadTypesPO.MORE), accumulateScrollEventsPO(true), setLoadingPO(true)]);
            } else{
                return Rx.Observable.empty();
            }
        }
    } else{
        return Rx.Observable.empty();
    }
    return Rx.Observable.from([accumulateScrollEventsPO(false)]);
});

/**
 * clearFiltersEpic - used to unselect filter values
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which updates filters values
 */
export const clearFiltersEpic = (action$, store) => action$.ofType(actions.CLEAR_FILTERS).switchMap(() => {
    var dateList = getDateList(store.getState());
    return Rx.Observable.from(
        [
            getStartDatesValuesPO(dateList.slice()),
            getEndDatesValuesPO(dateList.slice()),
            windRoseClickPO(-1),
            setStartDateValuePO(0),
            setEndDateValuePO(0)
        ]
    );
});

/**
 * initConfigsPOEpic 
 * @memberof photosObliques.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which applies plugin's config parameters
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
                response.pohometext = action.configs.pohometext;
                response.pomaxcartnumberofpics = action.configs.pomaxcartnumberofpics;
                response.pomaxcartsize = action.configs.pomaxcartsize;
                response.podownloadinfomessage = action.configs.podownloadinfomessage;
                response.pobackendurlaccess = action.configs.pobackendurlaccess;
                response.pohelpurlaccess = action.configs.pohelpurlaccess;
                return Rx.Observable.from([
                    setPluginConfigsPO(response)
                ]);
            } else {
                if (isOpen(store.getState())) {
                    return dropPopUpPOEpic(response.status, response.statusText);
                } else {
                    return Rx.Observable.empty();
                }
            }
        })
    } else {
        return Rx.Observable.empty();
    }
});

/**
 * dropPopUpPOEpic drop popup according to Backend's response
 * @memberof photosObliques.epics
 * @param code - code raise by plugin's BE
 * @param message - message sent by plugin's BE
 * @returns - observable containing popup or empty observable
 */
const dropPopUpPOEpic = (code, message) => {
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
    case 'alreadyInBasket':
        return Rx.Observable.from([
            modalDisplayPO(false, ''),
            show({ title: "photosObliques.alreadyInBasket.title", message: "photosObliques.alreadyInBasket.message" }, "warning")]);
    case 'Erreur Filtres':
        return Rx.Observable.from([show({ title: code, message: message }, "error")]);
    default:
        return Rx.Observable.from([
            show({ title: "photosObliques.dropPopUpCustom.title", message: "photosObliques.dropPopUpCustom.message" }, "error")]);
    }
};