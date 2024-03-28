import React from 'react';
import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import { toggleControl } from '@mapstore/actions/controls';
import { photosObliques } from "../components/Component";
import pluginIcon from "../assets/images/photosObliquesLogo.svg";

import {
    initConfigs
} from "../actions/photosObliques-action";
import photosObliquesReducer from "../reducers/photosObliques-reducer";
import * as epics from "../epics/photosObliques-epics";
import { mapLayoutValuesSelector } from '@mapstore/selectors/maplayout';
import {
    isOpen
} from "../selectors/photosObliques-selectors";
import '../assets/style.css';

export default createPlugin(name, {
    component: connect(state => ({
        active: !!isOpen(state),
        value: state.photosObliques && state.photosObliques.value,
        dockStyle: mapLayoutValuesSelector(state, {right: true, height: true}, true),
        pluginIcon
    }), {
        toggleControl: toggleControl,
        initConfigs
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
