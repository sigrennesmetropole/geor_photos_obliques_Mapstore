/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { PHOTOSOBLIQUES_PANEL_WIDTH } from "../constants/photosObliques-constants.js";
import { tabTypes } from "../actions/photosObliques-action.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";

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
        width: PropTypes.number,
        panelClassName: PropTypes.string,
        photosObliquesHomeText: PropTypes.string,
        activeTab: PropTypes.string,
        dockStyle: PropTypes.object,
        toggleControl: PropTypes.func,
        rtgeChangeTab: PropTypes.func
    }

    static defaultProps= {
        active: false,
        dockStyle: {zIndex: 100},
        panelClassName: 'photosObliques-panel',
        width: PHOTOSOBLIQUES_PANEL_WIDTH,
        activeTab: tabTypes.HOME,
        toggleControl: ()=>{},
        rtgeChangeTab: ()=>{}
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
    // renderHomeTab() {
    //     return (
    //         <div id="PHOTOSOBLIQUES_EXTENSION PHOTOSOBLIQUES_scrollBar">
    //             <div className="PHOTOSOBLIQUES_paragraphs" dangerouslySetInnerHTML={{__html: this.props.photosObliquesHomeText}}>
    //             </div>
    //         </div>
    //     );
    // }

        /**
     * renderHomeTab home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
        // renderSelectionTab() {
        //     return (
        //         <div id="PHOTOSOBLIQUES_EXTENSION PHOTOSOBLIQUES_scrollBar">
        //             <div className="PHOTOSOBLIQUES_paragraphs" dangerouslySetInnerHTML={{__html: '<p>toto pouêt</p>'}}>
        //             </div>
        //         </div>
        //     );
        // }

        /**
     * renderTabMenu renders the selection tabs to get all plkugins sub parts
     * @memberof rtge.component
     * @returns - navbar like for the plugin
     */
        renderTabMenu() {
            return (
                <div className="row PHOTOSOBLIQUES_rowTabs">
                    <div className="col-sm-6 text-center">
                        <button className={this.props.activeTab === "PHOTOSOBLIQUES:HOME"
                            ? "PHOTOSOBLIQUES_homeButton PHOTOSOBLIQUES_active"
                            : "PHOTOSOBLIQUES_homeButton"} onClick={() => this.props.rtgeChangeTab(tabTypes.HOME)}>
                            <Message msgId={'photosObliques.welcome'}/>
                        </button>
                    </div>
                    <div className="col-sm-6 text-center">
                        <button className={this.props.activeTab === "PHOTOSOBLIQUES:SELECT"
                            ? "PHOTOSOBLIQUES_selectButton PHOTOSOBLIQUES_active"
                            : "PHOTOSOBLIQUES_selectButton"} onClick={() => this.props.rtgeChangeTab(tabTypes.SELECT)}>
                            <Message msgId={'photosObliques.selection'}/>
                        </button>
                    </div>
                </div>
            );
        }

        /**
     * renderContent organise which tab is active
     * @memberof rtge.component
     * @returns - tab dom content
     */
    // renderContent = () => {
    //     var content;
    //     console.log(this.props.activeTab);
    //     switch (this.props.activeTab) {
    //     case tabTypes.HOME:
    //         content = this.renderHomeTab();
    //         break;
    //     case tabTypes.SELECT:
    //         content = this.renderSelectionTab();
    //         break;
    //     default:
    //         break;
    //     }
    //     return content;
    // }

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
                {/* {this.renderContent()} */}
            </ResponsivePanel>
        );
    }
}
