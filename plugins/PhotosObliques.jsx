import React from 'react';
import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import { toggleControl } from '@mapstore/actions/controls';
import { photosObliques } from "../components/Component";
import pluginIcon from "../assets/images/photosObliquesLogo.svg";

import {
    initConfigsPO,
    changeTabPO,
    windRoseClickPO,
    validateSearchFiltersPO,
    cancelSearchFiltersPO,
    filterSearchedValuesPO,
    addBasketPO,
    updateItemInBasketPO,
    removeSelectedItemsInBasketPO,
    clickPicturePO,
    downloadBasketPO,
    setDateList,
    selectStartDateValuePO,
    selectEndDateValuePO,
    pictureHoveredPO,
    filterBasketValuesPO,
    zoomElementPO,
    onScrollPO,
    modalDisplayPO
} from "../actions/photosObliques-action";
import photosObliquesReducer from "../reducers/photosObliques-reducer";
import * as epics from "../epics/photosObliques-epics";
import { mapLayoutValuesSelector } from '@mapstore/selectors/maplayout';
import {
    isOpen,
    getActiveTab,
    getSelectedRoseValue,
    getFiltersTriggered,
    getSearchResult,
    getItemId,
    getBasket,
    getItemToRemove,
    getItemCounterInBasket,
    getDateList,
    getStartDate,
    getEndDate,
    getPolygon,
    getPhotoCountSelector,
    getFilterSearchValues,
    getModalDisplay
} from "../selectors/photosObliques-selectors";
import '../assets/style.css';
import { getPhotoCount } from '../api/api';

export default createPlugin(name, {
    component: connect(state => ({
        active: !!isOpen(state),
        // value: state.photosObliques && state.photosObliques.value,
        activeTab: getActiveTab(state),
        dockStyle: mapLayoutValuesSelector(state, {right: true, height: true}, true),
        pluginIcon,
        roseValue: getSelectedRoseValue(state),
        filtersTriggered: getFiltersTriggered(state) || false,
        searchResult: getSearchResult(state),
        itemId: getItemId(state),
        basket: getBasket(state) || [],
        itemToRemove: getItemToRemove(state),
        itemCounterInBasket: getItemCounterInBasket(state) || 0,
        dateList: getDateList(state) || [],
        startDate: getStartDate(state) || [],
        endDate: getEndDate(state) || [],
        polygon: getPolygon(state) || '',
        photoCount: getPhotoCountSelector(state) || 0,
        filterSearchValues: getFilterSearchValues(state) || '-relevance',
        modalDisplay: getModalDisplay(state) || false
    }), {
        toggleControl: toggleControl,
        changeTabPO: changeTabPO,
        initConfigsPO,
        windRoseClickPO: windRoseClickPO,
        validateSearchFiltersPO: validateSearchFiltersPO,
        cancelSearchFiltersPO: cancelSearchFiltersPO,
        filterSearchedValuesPO: filterSearchedValuesPO,
        addBasketPO: addBasketPO,
        updateItemInBasketPO: updateItemInBasketPO,
        removeSelectedItemsInBasketPO: removeSelectedItemsInBasketPO,
        clickPicturePO: clickPicturePO,
        downloadBasketPO: downloadBasketPO,
        setDateList: setDateList,
        selectStartDateValuePO: selectStartDateValuePO,
        selectEndDateValuePO: selectEndDateValuePO,
        pictureHoveredPO: pictureHoveredPO,
        filterBasketValuesPO: filterBasketValuesPO,
        zoomElementPO: zoomElementPO,
        onScrollPO: onScrollPO,
        modalDisplayPO: modalDisplayPO
    })(photosObliques),
    reducers: {
        photosObliques: photosObliquesReducer
    },
    epics: epics,
    containers: {
        SidebarMenu: {
            name: "photosObliques",
            position: 10,
            icon: <img src={pluginIcon} className="iconSize" />,
            doNotHide: true,
            tooltip: "photosObliques.title",
            toggle: true,
            action: toggleControl.bind(null, 'photosObliques', 'enabled'),
            priority: 1
        }
    }
});
