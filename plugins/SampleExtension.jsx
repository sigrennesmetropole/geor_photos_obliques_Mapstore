import React from 'react';
import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import { toggleControl } from '@mapstore/actions/controls';
import { sampleExtension } from "../components/Component";
import pluginIcon from "../assets/images/sampleExtensionLogo.svg";

import {
    initConfigs
} from "../actions/sampleExtension-action";
import sampleExtensionReducer from "../reducers/sampleExtension-reducer";
import * as epics from "../epics/sampleExtension-epics";
import { mapLayoutValuesSelector } from '@mapstore/selectors/maplayout';
import {
    isOpen
} from "../selectors/sampleExtension-selectors";
import '../assets/style.css';

export default createPlugin(name, {
    component: connect(state => ({
        active: !!isOpen(state),
        value: state.sampleExtension && state.sampleExtension.value,
        dockStyle: mapLayoutValuesSelector(state, {right: true, height: true}, true),
        pluginIcon
    }), {
        toggleControl: toggleControl,
        initConfigs
    })(sampleExtension),
    reducers: {
        sampleExtension: sampleExtensionReducer
    },
    epics: epics,
    containers: {
        SidebarMenu: {
            name: "sampleExtension",
            position: 10,
            icon: <img src={pluginIcon} className="iconSize" />,
            doNotHide: true,
            tooltip: "sampleExtension.title",
            toggle: true,
            action: toggleControl.bind(null, 'sampleExtension', 'enabled'),
            priority: 1
        }
    }
});
