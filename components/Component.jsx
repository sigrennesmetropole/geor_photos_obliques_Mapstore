/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { PHOTOSOBLIQUESEXTENSION_PANEL_WIDTH } from "../constants/photosObliquesExtension-constants.js";
// import {  } from "../actions/photosObliquesExtension-action.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";

// import {
//     Form,
//     FormControl,
//     FormGroup,
//     Glyphicon,
//     InputGroup,
//     Checkbox
// } from 'react-bootstrap';
export class photosObliquesExtension extends React.Component {

    static propTypes= {
        active: PropTypes.bool,
        dockStyle: PropTypes.object,
        panelClassName: PropTypes.string,
        width: PropTypes.number,
        photosObliquesExtensionHomeText: PropTypes.string,
        toggleControl: PropTypes.func
    }

    static defaultProps= {
        active: false,
        dockStyle: {zIndex: 100},
        panelClassName: 'photosObliquesExtension-panel',
        width: PHOTOSOBLIQUESEXTENSION_PANEL_WIDTH,
        toggleControl: ()=>{}
    }

    constructor(props) {
        super(props);
        this.state = {
            photosObliquesExtensionHomeText: props.photosObliquesExtensionHomeText
        };
        props.initConfigs({
            ...props
        });
    }

    /**
     * onClose closes the plugins Panel
     * @memberof photosObliquesExtension.component
     * @returns - toggleControl action
     */
    onClose() {
        return this.props.toggleControl();
    }

    /**
     * renderHomeTab home tab content
     * @memberof photosObliquesExtension.component
     * @returns - dom of the home tab content
     */
    renderHomeTab() {
        return (
            <div id="PHOTOSOBLIQUESEXTENSION_EXTENSION PHOTOSOBLIQUESEXTENSION_scrollBar">
                <div className="PHOTOSOBLIQUESEXTENSION_paragraphs" dangerouslySetInnerHTML={{__html: this.props.photosObliquesExtensionHomeText}}>
                </div>
            </div>
        );
    }

    /**
     * render component
     * @memberof photosObliquesExtension.component
     * @returns - Mapstore ResponsivePanel with our data inside
     */
    render = () => {
        return (
            <ResponsivePanel
                containerStyle={this.props.dockStyle}
                style={this.props.dockStyle}
                containerId="ms-photosObliquesExtension-panel"
                containerClassName="photosObliquesExtension-dock-container"
                className={this.props.panelClassName}
                open={this.props.active}
                position="right"
                size={this.props.width}
                bsStyle="primary"
                title={<Message msgId="photosObliquesExtension.title"/>}
                glyph=""
                onClose={() => this.props.toggleControl('photosObliquesExtension', null)}>
                {this.renderHomeTab()}
            </ResponsivePanel>
        );
    }
}
