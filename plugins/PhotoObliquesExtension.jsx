import React from 'react';
import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import { toggleControl } from '@mapstore/actions/controls';
import { photosObliquesExtension } from "../components/Component";
import pluginIcon from "../assets/images/photosObliquesExtensionLogo.svg";

import {
    initConfigs
} from "../actions/photosObliquesExtension-action";
import photosObliquesExtensionReducer from "../reducers/photosObliquesExtension-reducer";
import * as epics from "../epics/photosObliquesExtension-epics";
import { mapLayoutValuesSelector } from '@mapstore/selectors/maplayout';
import {
    isOpen
} from "../selectors/photosObliquesExtension-selectors";
import '../assets/style.css';

export default createPlugin(name, {
    component: connect(state => ({
        active: !!isOpen(state),
        value: state.photosObliquesExtension && state.photosObliquesExtension.value,
        dockStyle: mapLayoutValuesSelector(state, {right: true, height: true}, true),
        pluginIcon
    }), {
        toggleControl: toggleControl,
        initConfigs
    })(photosObliquesExtension),
    reducers: {
        photosObliquesExtension: photosObliquesExtensionReducer
    },
    epics: epics,
    containers: {
        SidebarMenu: {
            name: "photosObliquesExtension",
            position: 10,
            icon: <img src={pluginIcon} className="iconSize" />,
            doNotHide: true,
            tooltip: "photosObliquesExtension.title",
            toggle: true,
            action: toggleControl.bind(null, 'photosObliquesExtension', 'enabled'),
            priority: 1
        }
    }
});
