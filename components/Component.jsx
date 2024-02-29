/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { SAMPLEEXTENSION_PANEL_WIDTH } from "../constants/sampleExtension-constants.js";
// import {  } from "../actions/sampleExtension-action.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";

// import {
//     Form,
//     FormControl,
//     FormGroup,
//     Glyphicon,
//     InputGroup,
//     Checkbox
// } from 'react-bootstrap';
export class sampleExtension extends React.Component {

    static propTypes= {
        active: PropTypes.bool,
        dockStyle: PropTypes.object,
        panelClassName: PropTypes.string,
        width: PropTypes.number,
        sampleExtensionHomeText: PropTypes.string,
        toggleControl: PropTypes.func
    }

    static defaultProps= {
        active: false,
        dockStyle: {zIndex: 100},
        panelClassName: 'sampleExtension-panel',
        width: SAMPLEEXTENSION_PANEL_WIDTH,
        toggleControl: ()=>{}
    }

    constructor(props) {
        super(props);
        this.state = {
            sampleExtensionHomeText: props.sampleExtensionHomeText
        };
        props.initConfigs({
            ...props
        });
    }

    /**
     * onClose closes the plugins Panel
     * @memberof sampleExtension.component
     * @returns - toggleControl action
     */
    onClose() {
        return this.props.toggleControl();
    }

    /**
     * renderHomeTab home tab content
     * @memberof sampleExtension.component
     * @returns - dom of the home tab content
     */
    renderHomeTab() {
        return (
            <div id="SAMPLEEXTENSION_EXTENSION SAMPLEEXTENSION_scrollBar">
                <div className="SAMPLEEXTENSION_paragraphs" dangerouslySetInnerHTML={{__html: this.props.sampleExtensionHomeText}}>
                </div>
            </div>
        );
    }

    /**
     * render component
     * @memberof sampleExtension.component
     * @returns - Mapstore ResponsivePanel with our data inside
     */
    render = () => {
        return (
            <ResponsivePanel
                containerStyle={this.props.dockStyle}
                style={this.props.dockStyle}
                containerId="ms-sampleExtension-panel"
                containerClassName="sampleExtension-dock-container"
                className={this.props.panelClassName}
                open={this.props.active}
                position="right"
                size={this.props.width}
                bsStyle="primary"
                title={<Message msgId="sampleExtension.title"/>}
                glyph=""
                onClose={() => this.props.toggleControl('sampleExtension', null)}>
                {this.renderHomeTab()}
            </ResponsivePanel>
        );
    }
}
