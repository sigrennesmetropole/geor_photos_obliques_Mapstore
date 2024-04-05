/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { PHOTOSOBLIQUES_PANEL_WIDTH } from "../constants/photosObliques-constants.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import { tabTypes } from "../actions/photosObliques-action";

// import {
//     Form,
//     FormControl,
//     FormGroup,
//     Glyphicon,
//     InputGroup,
//     Checkbox
// } from 'react-bootstrap';
export class photosObliques extends React.Component {

    static propTypes= {
        active: PropTypes.bool,
        dockStyle: PropTypes.object,
        panelClassName: PropTypes.string,
        width: PropTypes.number,
        photosObliquesHomeText: PropTypes.string,
        activeTab: PropTypes.string,
        toggleControl: PropTypes.func,
        photosObliquesChangeTab: PropTypes.func
    }

    static defaultProps= {
        active: false,
        dockStyle: {zIndex: 100},
        panelClassName: 'photosObliques-panel',
        width: PHOTOSOBLIQUES_PANEL_WIDTH,
        activeTab: tabTypes.HOME,
        toggleControl: ()=>{},
        photosObliquesChangeTab: ()=>{}
    }

    constructor(props) {
        super(props);
        this.state = {
            photosObliquesHomeText: props.photosObliquesHomeText
        };
        props.initConfigs({
            ...props
        });
    }

    /**
     * onClose closes the plugins Panel
     * @memberof photosObliques.component
     * @returns - toggleControl action
     */
    onClose() {
        return this.props.toggleControl();
    }

    /**
     * renderHomeTab home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    renderHomeTab() {
        return (
            <div id="PHOTOSOBLIQUES_EXTENSION PHOTOSOBLIQUES_scrollBar">
                <div className="PHOTOSOBLIQUES_paragraphs" dangerouslySetInnerHTML={{__html: this.props.photosObliquesHomeText}}>
                </div>
            </div>
        );
    }

    /**
     * render component
     * @memberof photosObliques.component
     * @returns - Mapstore ResponsivePanel with our data inside
     */
    render = () => {
        return (
            <ResponsivePanel
                containerStyle={this.props.dockStyle}
                style={this.props.dockStyle}
                containerId="ms-photosObliques-panel"
                containerClassName="photosObliques-dock-container"
                className={this.props.panelClassName}
                open={this.props.active}
                position="right"
                size={this.props.width}
                bsStyle="primary"
                title={<Message msgId="photosObliques.title"/>}
                glyph=""
                onClose={() => this.props.toggleControl('photosObliques', null)}>
                {this.renderTabMenu()}
                {this.renderHomeTab()}
            </ResponsivePanel>
        );
    }

    /**
     * renderTabMenu renders the selection tabs to get all plkugins sub parts
     * @memberof photosObliques.component
     * @returns - navbar like for the plugin
     */
    renderTabMenu() {
        return (
            <div className="row PHOTOSOBLIQUES_rowTabs">
                <div className="col-sm-6 text-center">
                    <button className={this.props.activeTab === "PHOTOSOBLIQUES:HOME"
                        ? "PHOTOSOBLIQUES_homeButton PHOTOSOBLIQUES_active"
                        : "PHOTOSOBLIQUES_homeButton"} onClick={() => this.props.photosObliquesChangeTab(tabTypes.HOME)}>
                        <Message msgId={'photosObliques.searchTab'}/>
                    </button>
                </div>
                <div className="col-sm-6 text-center">
                    {/* {this.props.selectedTiles.length === 0 &&
                    <>
                        <button className="PHOTOSOBLIQUES_sendButton PHOTOSOBLIQUES_gray PHOTOSOBLIQUES_tooltipMain">
                            <Message msgId={'PHOTOSOBLIQUES.send'}/>
                            <span className="PHOTOSOBLIQUES_tooltipContent"><Message msgId={'PHOTOSOBLIQUES.sendBtnDisabled'}/></span>
                        </button>
                    </>
                    }
                    {this.props.selectedTiles.length > 0 && */}
                        <button className={this.props.activeTab === "PHOTOSOBLIQUES:SEND"
                            ? "PHOTOSOBLIQUES_sendButton PHOTOSOBLIQUES_active"
                            : "PHOTOSOBLIQUES_sendButton" } onClick={() => this.props.photosObliquesChangeTab(tabTypes.SEND)}>
                            <Message msgId={'photosObliques.basketTab'}/>
                        </button>
                    {/* } */}
                </div>
            </div>
        );
    }
    
}
