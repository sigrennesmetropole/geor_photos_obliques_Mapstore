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
    renderHomeTab() {
        return (
            <>
                <div className="col-sm-6">
                    { this.searchFilters() }
                </div>
                <div className="col-sm-6">
                    { this.renderCompass() }
                </div>
                <div className="row validateForm">
                    { this.validateSection() }
                </div>
            </>
        );
    }

    /**
     * validateSection home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    validateSection(){
        return (
            <>
                <button onClick={() => this.props.validateSearchFilters()}>
                    <Message msgId={'PLUGIN.ValidateSearch'}/>
                </button>
                <span>XXX Photos disponibles</span>
            </>
        )
    }

    /**
     * searchFilters home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    searchFilters() {
        return (
            <>
                <h3 className="filterTitle">Filtres de recherche</h3>
                <p>Années</p>
                <select id="startDate" className="startDate">
                    <option value="0">Année de début</option>
                    <option value="1998">1998</option>
                    <option value="2000">2000</option>
                    <option value="2010">2010</option>
                    <option value="2020">2020</option>
                </select>
                <select id="endDate" className="endDate">
                    <option value="0">Année de fin</option>
                    <option value="1998">1998</option>
                    <option value="2000">2000</option>
                    <option value="2010">2010</option>
                    <option value="2020">2020</option>
                </select>
            </>
        )
    }

    /**
     * renderCompass home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    renderCompass() {
        return (
            <div class="compass">
                <div class="compass-main">
                    <span class="north-label">N</span>
                    <span class="east-label">E</span>
                    <span class="west-label">W</span>
                    <span class="south-label">S</span>
                    <div class="compass-rose">
                        <div class="cardial-points">
                            <div class="north-pointer pointer"></div>
                            <div class="ne-pointer subpointer"></div>
                            <div class="east-pointer pointer"></div>
                            <div class="se-pointer subpointer"></div>
                            <div class="south-pointer pointer"></div>
                            <div class="sw-pointer subpointer"></div>
                            <div class="west-pointer pointer"></div>
                            <div class="nw-pointer subpointer"></div>            
                        </div>
                        <div class="ordinal-points">
                            <div class="northeast-pointer"></div>
                            <div class="northwest-pointer"></div>
                            <div class="southeast-pointer"></div>
                            <div class="south-west-pointer"></div>
                        </div>
                    </div>
                    <div class="bt-center"></div>
                    <ul class="circle">
                        <li id="part1" onClick={() => this.props.windRoseClick(1)}>
                            <div class="text">1</div>
                        </li>
                        <li id="part2" onClick={() => this.props.windRoseClick(2)}>
                            <div class="text">2</div>
                        </li>
                        <li id="part3" onClick={() => this.props.windRoseClick(3)}>
                            <div class="text">3</div>
                        </li>
                        <li id="part4" onClick={() => this.props.windRoseClick(4)}>
                            <div class="text">4</div>
                        </li>
                        <li id="part5" onClick={() => this.props.windRoseClick(5)}>
                            <div class="text">5</div>
                        </li>
                        <li id="part6" onClick={() => this.props.windRoseClick(6)}>
                            <div class="text">6</div>
                        </li>
                        <li id="part7" onClick={() => this.props.windRoseClick(7)}>
                            <div class="text">7</div>
                        </li>
                        <li id="part8" onClick={() => this.props.windRoseClick(8)}>
                            <div class="text">8</div>
                        </li>
                        <li id="part9" onClick={() => this.props.windRoseClick(9)}>
                            <div class="text">9</div>
                        </li>
                        <li id="part10" onClick={() => this.props.windRoseClick(10)}>
                            <div class="text">10</div>
                        </li>
                        <li id="part11" onClick={() => this.props.windRoseClick(11)}>
                            <div class="text">11</div>
                        </li>
                        <li id="part12" onClick={() => this.props.windRoseClick(12)}>
                            <div class="text">12</div>
                        </li>
                        <li id="part13" onClick={() => this.props.windRoseClick(13)}>
                            <div class="text">13</div>
                        </li>
                        <li id="part14" onClick={() => this.props.windRoseClick(14)}>
                            <div class="text">14</div>
                        </li>
                        <li id="part15" onClick={() => this.props.windRoseClick(15)}>
                            <div class="text">15</div>
                        </li>
                        <li id="part16" onClick={() => this.props.windRoseClick(16)}>
                            <div class="text">16</div>
                        </li>
                        <div class="testrotate">
                            <div class="losange"></div>
                        </div>
                    </ul>
                </div>
            </div>
        )
    }

    /**
     * renderSelectionTab home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
        renderSelectionTab() {
            return (
                <div id="PHOTOSOBLIQUES_EXTENSION PHOTOSOBLIQUES_scrollBar">
                    <div className="PHOTOSOBLIQUES_paragraphs" dangerouslySetInnerHTML={{__html: '<p>toto pouêt</p>'}}>
                    </div>
                </div>
            );
        }

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
    renderContent = () => {
        var content;
        console.log(this.props.activeTab);
        switch (this.props.activeTab) {
        case tabTypes.HOME:
            content = this.renderHomeTab();
            break;
        case tabTypes.SELECT:
            content = this.renderSelectionTab();
            break;
        default:
            break;
        }
        return content;
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
                {this.renderContent()}
            </ResponsivePanel>
        );
    }
}
