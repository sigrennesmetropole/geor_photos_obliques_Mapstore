import React from 'react';
import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import { toggleControl } from '@mapstore/actions/controls';
import { photosObliques } from "../components/Component";
import pluginIcon from "../assets/images/photosObliquesLogo.svg";

import {
    initConfigs,
    rtgeChangeTab,
    windRoseClick,
    validateSearchFilters
} from "../actions/photosObliques-action";
import photosObliquesReducer from "../reducers/photosObliques-reducer";
import * as epics from "../epics/photosObliques-epics";
import { mapLayoutValuesSelector } from '@mapstore/selectors/maplayout';
import {
    isOpen,
    getActiveTab,
    getSelectedRoseValue,
    getFiltersTriggered,
    getSearchResult
} from "../selectors/photosObliques-selectors";
import '../assets/style.css';

export default createPlugin(name, {
    component: connect(state => ({
        active: !!isOpen(state),
        value: state.photosObliques && state.photosObliques.value,
        activeTab: getActiveTab(state),
        dockStyle: mapLayoutValuesSelector(state, {right: true, height: true}, true),
        pluginIcon,
        roseValue: getSelectedRoseValue(state),
        filtersTriggered: getFiltersTriggered(state) || false,
        searchResult: getSearchResult(state) || [
            {
                picture: 'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg',
                yearTaken: '2022',
                date: '18/06/2022',
                taker: 'Photo Bretagne Edition',
                owner: 'Ville de Rennes',
                weigth: '3Mo',
                searchPrecision: '75%'
            }, {
                picture: 'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg',
                yearTaken: '2021',
                date: '2021',
                taker: 'Photo I&V Edition',
                owner: 'Rennes Metropole',
                weigth: '3.5Mo',
                searchPrecision: '77%'
            }
        ]
    }), {
        toggleControl: toggleControl,
        rtgeChangeTab: rtgeChangeTab,
        initConfigs,
        windRoseClick: windRoseClick,
        validateSearchFilters: validateSearchFilters
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
