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
    setDateListPO,
    selectStartDateValuePO,
    selectEndDateValuePO,
    pictureHoveredPO,
    filterBasketValuesPO,
    zoomElementPO,
    onScrollPO,
    modalDisplayPO,
    updateHoveredPolygonVisibilityStatePO,
    setDownloadingPO,
    saveDownloadFieldsPO,
    clearFiltersPO,
    searchValuesFilteredPO,
    openSearchFiltersPO
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
    getItemCounterInBasket,
    getDateList,
    getStartDates,
    getEndDates,
    getPolygon,
    getPhotoCountSelector,
    getFilterSearchValues,
    getModalDisplay,
    getModalType,
    getHoveredPolygonVisibilityState,
    getDownloading,
    getLoading,
    getScrollIndicator,
    getPrefix,
    getFileName,
    getPluginConfig,
    getPicturesInBasket,
    getBasketSize,
    getEndDateValue,
    getStartDateValue,
    getDisplayFilters,
    getPrevPhotoCount,
    getPrevSearchFiltersValues
} from "../selectors/photosObliques-selectors";
import '../assets/style.css';

export default createPlugin(name, {
    component: connect(state => ({
        active: !!isOpen(state),
        activeTab: getActiveTab(state),
        dockStyle: mapLayoutValuesSelector(state, {right: true, height: true}, true),
        pluginIcon,
        roseValue: getSelectedRoseValue(state),
        filtersTriggered: getFiltersTriggered(state) || false,
        searchResult: getSearchResult(state),
        itemId: getItemId(state),
        basket: getBasket(state) || [],
        itemCounterInBasket: getItemCounterInBasket(state) || 0,
        dateList: getDateList(state) || [],
        startDates: getStartDates(state) || [],
        endDates: getEndDates(state) || [],
        polygon: getPolygon(state) || '',
        photoCount: getPhotoCountSelector(state) || 0,
        filterSearchValues: getFilterSearchValues(state) || '-relevance',
        modalDisplay: getModalDisplay(state) || false,
        modalType: getModalType(state) || '',
        hoveredPolygonVisibilityState: getHoveredPolygonVisibilityState(state) || false,
        downloading: getDownloading(state) || false,
        loading: getLoading(state) || false,
        scrollIndicator: getScrollIndicator(state) || false,
        fileName: getFileName(state) || '',
        prefix: getPrefix(state) || '',
        configs: getPluginConfig(state) || '',
        picturesInBasket: getPicturesInBasket(state) || '',
        basketSize: getBasketSize(state) || 0,
        startDateValue: getStartDateValue(state) || 0,
        endDateValue: getEndDateValue(state) || 0,
        displayFilters: getDisplayFilters(state) || false,
        prevPhotoCount: getPrevPhotoCount(state),
        prevSearchFiltersValues: getPrevSearchFiltersValues(state)
    }), {
        toggleControl,
        changeTabPO,
        initConfigsPO,
        windRoseClickPO,
        validateSearchFiltersPO,
        cancelSearchFiltersPO,
        filterSearchedValuesPO,
        addBasketPO,
        updateItemInBasketPO,
        removeSelectedItemsInBasketPO,
        clickPicturePO,
        downloadBasketPO,
        setDateListPO,
        selectStartDateValuePO,
        selectEndDateValuePO,
        pictureHoveredPO,
        filterBasketValuesPO,
        zoomElementPO,
        onScrollPO,
        modalDisplayPO,
        updateHoveredPolygonVisibilityStatePO,
        setDownloadingPO,
        saveDownloadFieldsPO,
        clearFiltersPO,
        searchValuesFilteredPO,
        openSearchFiltersPO
    })(photosObliques),
    reducers: {
        photosObliques: photosObliquesReducer
    },
    epics: epics,
    containers: {
        SidebarMenu: {
            name: "photosObliques",
            position: 10,
            icon: <img src={pluginIcon} className="PO_iconSize" />,
            doNotHide: true,
            tooltip: "photosObliques.title",
            toggle: true,
            action: toggleControl.bind(null, 'photosObliques', 'enabled'),
            priority: 1
        }
    }
});
