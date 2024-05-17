import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import ExtensionComponent from "../components/Component";
import { toggleControl } from '@mapstore/actions/controls';
import Rx from "rxjs";

import { changeZoomLevel } from "@mapstore/actions/map";
import '../assets/style.css';

import { pluginChangeTab, tabTypes, windRoseClick } from "../actions/plugin-action.js";
import pluginReducer from "../reducers/plugin-reducer.js";
import * as epics from "../epics/plugin-epics.js";
import { getValue, getActiveTab, getSelectedRoseValue } from "../selectors/plugin-selectors";

export default createPlugin(name, {
    component: connect(state => ({
        activeTab: getActiveTab(state) || 'PLUGIN:HOME',
        tabTypes: tabTypes,
        roseValue: getSelectedRoseValue(state)
    }), {
        pluginChangeTab: pluginChangeTab,
        windRoseClick: windRoseClick
    })(ExtensionComponent),
    reducers: {
        sampleExtension: pluginReducer
    },
    epics: epics,
    containers: {
        Toolbar: {
            name: "sampleExtension",
            position: 10,
            text: "POUÊT",
            doNotHide: true,
            tooltip: "pouêt",
            action: toggleControl.bind(null, 'plugin', 'enabled'),
            priority: 1
        }
    }
});
