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
    countItemsSelectedInBasket
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


var currentLayout;
var lastSelectedTile;

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
            initConfigs
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
    var values = [roseValue,startDate,endDate];
    console.log(values);
    // callServer('https://photosObliques-back.RM', values, (response) => {
    //     console.log(response);
        var response = [
            {
                id: 1,
                fichier: "image_photooblique.png",
                annee: '2022', 
                date: '18/06/2022',
                heure: "12:12:00",
                angle_deg: 33,
                angle_grd: 33,
                presta: 'Photo Bretagne Edition',
                proprio: 'Ville de Rennes',
                mention: "mention relative à l'image",
                shape: "?",
                taille_fichier: '3Mo',
                pertinence: '88',
                url_vignette: 'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg',
                url_apercu: 'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg',
                selected: false
            }, {
                id: 2,
                fichier: "image_photooblique.png",
                annee: '2018', 
                date: '18/06/2018',
                heure: "12:12:00",
                angle_deg: 33,
                angle_grd: 33,
                presta: 'I&V Edition',
                proprio: 'Ville de Rennes',
                mention: "mention relative à l'image",
                shape: "?",
                taille_fichier: '12Mo',
                pertinence: '66',
                url_vignette: 'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg',
                url_apercu: 'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg',
                selected: false
            },
            {
                id: 3,
                fichier: "image_photooblique.png",
                annee: '2003', 
                date: '18/06/2003',
                heure: "12:12:00",
                angle_deg: 33,
                angle_grd: 33,
                presta: 'Photo Bretagne Edition',
                proprio: 'Ville de Rennes',
                mention: "mention relative à l'image",
                shape: "?",
                taille_fichier: '44Mo',
                pertinence: '33',
                url_vignette: 'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg',
                url_apercu: 'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg',
                selected: false
            },
            {
                id: 4,
                fichier: "image_photooblique.png",
                annee: '1999', 
                date: '18/06/1999',
                heure: "12:12:00",
                angle_deg: 33,
                angle_grd: 33,
                presta: 'I&V Edition',
                proprio: 'Ville de Rennes',
                mention: "mention relative à l'image",
                shape: "?",
                taille_fichier: '66Mo',
                pertinence: '11',
                url_vignette: 'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg',
                url_apercu: 'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg',
                selected: false
            }
        ];
        // console.log(response);
        return Rx.Observable.from([searchValuesFiltered(response)]);
    // })
    // /* eslint-enable */
    // return Rx.Observable.empty();
})

function callServer(url, values, callback){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    console.log(values);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            callback(this.responseText);
        }else{
            console.log('error but i knew it !');
        }
    }
    // Sending our request 
    xhr.send();
}

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
            filterValue = filterValue.sort((a,b) => (a.pertinence > b.pertinence) ? 1 : ((b.pertinence > a.pertinence) ? -1 : 0))
            break;
        case 1:
            filterValue = filterValue.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
            break;
        case 2:
            filterValue = filterValue.sort((a,b) => (a.annee > b.annee) ? 1 : ((b.annee > a.annee) ? -1 : 0))
            break;
        case 3:
            filterValue = filterValue.sort((a,b) => (a.proprio > b.proprio) ? 1 : ((b.proprio > a.proprio) ? -1 : 0))
            break;
        case 4:
            filterValue = filterValue.sort((a,b) => (a.presta > b.presta) ? 1 : ((b.presta > a.presta) ? -1 : 0))
            break;
        case 5:
            filterValue = filterValue.sort((a,b) => (a.taille_fichier > b.taille_fichier) ? 1 : ((b.taille_fichier > a.taille_fichier) ? -1 : 0))
            break;
        default:
            console.log('la sélection à été mal effectuée et le tri est impossible...');
            break;
    }
    console.log(filterValue);
    return Rx.Observable.from([searchValuesFiltered(filterValue)]);
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
    var count = 0;
    item.forEach(element => {
        if (element.selected) {
            item.splice(count,1);
        }
        count++
    });
    console.log(item);
    /* eslint-enable */
    return Rx.Observable.from([removeItemOfBasket(item)]);
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