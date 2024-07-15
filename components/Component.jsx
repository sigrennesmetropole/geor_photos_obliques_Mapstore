/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { PHOTOSOBLIQUES_PANEL_WIDTH } from "../constants/photosObliques-constants.js";
import { tabTypes } from "../actions/photosObliques-action.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import { Glyphicon } from 'react-bootstrap';

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
        searchResult: PropTypes.array,
        itemId: PropTypes.string,
        itemCounterInBasket: PropTypes.number,
        basket: PropTypes.array,
        toggleControl: PropTypes.func,
        changeTabPO: PropTypes.func
    }

    static defaultProps= {
        active: false,
        dockStyle: {zIndex: 100},
        panelClassName: 'photosObliques-panel',
        width: PHOTOSOBLIQUES_PANEL_WIDTH,
        activeTab: tabTypes.HOME,
        searchResult: [],
        itemCounterInBasket: 0,
        itemId: "",
        basket: [],
        toggleControl: ()=>{},
        changeTabPO: ()=>{}
    }

    constructor(props) {
        super(props);
        this.state = {
            photosObliquesHomeText: props.photosObliquesHomeText
        };
        props.initConfigsPO({
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
     * renderFiltersSection home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
        renderFiltersSection() {
            return (
                <>
                    {
                        <>
                            <div className="row filterSelectionMainDiv">
                                <div className="col-sm-6">
                                    { this.searchFilters() }
                                </div>
                                <div className="col-sm-6">
                                    { this.renderCompass() }
                                </div>
                            </div>
                            <div className="row validateForm">
                                { this.validateSection() }
                            </div>
                        </>
                    }
                </>
            );
        }

    /**
     * renderHomeTab home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    renderHomeTab() {
        return (
            <>
                { this.props.filtersTriggered === false ? this.renderFiltersSection() : '' }
                { 
                    this.props.filtersTriggered === true &&
                    <div className="row validateForm">
                        { this.filterResults() }
                    </div>
                }
            </>
        );
    }

    /**
     * filterResults home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    filterResults(){
        return (
            <>
                <input type="checkbox" id="toggle" className="unfolder"/>
                <label htmlFor="toggle" className="toggle-label">
                <Message msgId={'photosObliques.updateSearch'} />
                </label>
                <div className="fold">
                    { this.renderFiltersSection() }
                </div>
                <div className="PO_resultOrganizationFilters">
                    <span className="PO_resultAmount">{this.props.searchResult.length} <Message msgId={'photosObliques.picturesFound'} /></span>
                    <span>
                        <span className="PO_bold">Trier par: </span>
                        <select id="filterSearchedValues" className="startDate" onClick={() => this.props.filterSearchedValuesPO(document.getElementById("filterSearchedValues").value)}>
                            <option value="0">Pertinence</option>
                            <option value="1">Année</option>
                            <option value="2">Date de prise de vue</option>
                            <option value="3">Propriétaire</option>
                            <option value="4">Prestataire</option>
                            <option value="5">Taille</option>
                        </select>
                    </span>
                </div>
                <div className="text-center PO_arrayContent">
                    {
                        this.props.searchResult.map((val, key) => {
                            return (
                                <div className="row PO_searchResults" key={key}>
                                    <div className="col-sm-4 PO_static">
                                        <img src={ val.urlThumbnail } className="PO_searchResultPictures" />
                                        <div className="PO_searchResultPictures_apercu" ><img src={val.urlOverview}/></div>
                                    </div>
                                    <div className="col-sm-6">
                                        <p><span  className="PO_bold"><Message msgId={'photosObliques.yearTaken'} />:</span> { val.year }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.date'} className="PO_bold" />:</span> { val.date }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.provider'} className="PO_bold" />:</span> { val.provider }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.owner'} className="PO_bold" />:</span> { val.owner }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.weight'} className="PO_bold" />:</span> { parseFloat(val.fileSize / 1000000).toFixed(1) + "Mo" }</p>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className={parseFloat(val.relevance * 100).toFixed(0) >= 50 ? parseFloat(val.relevance * 100).toFixed(0) >= 75 ? "PO_resultPrecision PO_high_high": "PO_resultPrecision PO_high_low" : parseFloat(val.relevance * 100).toFixed(0) >= 25 ? "PO_resultPrecision PO_low_high": "PO_resultPrecision PO_low_low"}>{ parseFloat(val.relevance * 100).toFixed(0) }%</div>
                                        <button className="PO_addBasket" onClick={() => this.props.addBasketPO(val)}><Message msgId={'photosObliques.addBasket'} /></button>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </>
        )
    }

    /**
     * validateSection home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    validateSection(){
        if (this.props.roseValue != "" && this.props.startDate != "0" && this.props.endDate != "0") {
            return (
                <>
                    {
                        this.props.filtersTriggered === true &&
                        <button onClick={() => this.props.cancelSearchFiltersPO()}>
                            <Message msgId={'photosObliques.cancelSearch'}/>
                        </button>
                    }
                    <button onClick={() => this.props.validateSearchFiltersPO(true)}>
                        <Message msgId={'photosObliques.ValidateSearch'}/>
                    </button>
                    <span>{ this.props.photoCount } <Message msgId={'photosObliques.picturesAvailable'}/></span>
                </>
            )
        }else{
            return (
                <>
                    {
                        this.props.filtersTriggered === true &&
                        <button onClick={() => this.props.cancelSearchFiltersPO()}>
                            <Message msgId={'photosObliques.cancelSearch'}/>
                        </button>
                    }
                    <button disabled>
                        <Message msgId={'photosObliques.ValidateSearch'}/>
                    </button>
                    <span>{ this.props.photoCount } <Message msgId={'photosObliques.picturesAvailable'}/></span>
                </>
            )
        }
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
                <select id="startDate" className="rw-input" onChange={(e) => this.props.selectStartDateValuePO(e.target.value)} >
                    {
                        this.props.startDate.map((val) => {
                            return (<option value={ val }>{ val }</option>);
                        })
                    }
                </select>
                <select id="endDate" className="rw-input" onChange={(e) => this.props.selectEndDateValuePO(e.target.value)} >
                    {
                        this.props.endDate.map((val) => {
                            return (<option value={ val }>{ val }</option>);
                        })
                    }
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
            <div className="compassMainStyle">
                <b>
                    <Message msgId={'photosObliques.windRoseLabel'} />
                </b>
                <div className="compass">
                    <div className="compass-main">
                        <span className="north-label">N</span>
                        <span className="east-label">E</span>
                        <span className="west-label">W</span>
                        <span className="south-label">S</span>
                        <div className="compass-rose">
                            <div className="cardial-points">
                                <div className="north-pointer pointer"></div>
                                <div className="east-pointer pointer"></div>
                                <div className="south-pointer pointer"></div>
                                <div className="west-pointer pointer"></div>          
                            </div>
                            <div className="ordinal-points">
                                <div className="northeast-pointer"></div>
                                <div className="northwest-pointer"></div>
                                <div className="southeast-pointer"></div>
                                <div className="south-west-pointer"></div>
                            </div>
                        </div>
                        <div className="bt-center"></div>
                        <ul className="circle">
                            <li id="part1" onClick={() => this.props.windRoseClickPO(0)}>
                                <div className="text">1</div>
                            </li>
                            <li id="part2" onClick={() => this.props.windRoseClickPO(22.5)}>
                                <div className="text">2</div>
                            </li>
                            <li id="part3" onClick={() => this.props.windRoseClickPO(45)}>
                                <div className="text">3</div>
                            </li>
                            <li id="part4" onClick={() => this.props.windRoseClickPO(67.5)}>
                                <div className="text">4</div>
                            </li>
                            <li id="part5" onClick={() => this.props.windRoseClickPO(90)}>
                                <div className="text">5</div>
                            </li>
                            <li id="part6" onClick={() => this.props.windRoseClickPO(112.5)}>
                                <div className="text">6</div>
                            </li>
                            <li id="part7" onClick={() => this.props.windRoseClickPO(135)}>
                                <div className="text">7</div>
                            </li>
                            <li id="part8" onClick={() => this.props.windRoseClickPO(157.5)}>
                                <div className="text">8</div>
                            </li>
                            <li id="part9" onClick={() => this.props.windRoseClickPO(180)}>
                                <div className="text">9</div>
                            </li>
                            <li id="part10" onClick={() => this.props.windRoseClickPO(202.5)}>
                                <div className="text">10</div>
                            </li>
                            <li id="part11" onClick={() => this.props.windRoseClickPO(225)}>
                                <div className="text">11</div>
                            </li>
                            <li id="part12" onClick={() => this.props.windRoseClickPO(247.5)}>
                                <div className="text">12</div>
                            </li>
                            <li id="part13" onClick={() => this.props.windRoseClickPO(270)}>
                                <div className="text">13</div>
                            </li>
                            <li id="part14" onClick={() => this.props.windRoseClickPO(292.5)}>
                                <div className="text">14</div>
                            </li>
                            <li id="part15" onClick={() => this.props.windRoseClickPO(315)}>
                                <div className="text">15</div>
                            </li>
                            <li id="part16" onClick={() => this.props.windRoseClickPO(337.5)}>
                                <div className="text">16</div>
                            </li>
                            <div className="testrotate">
                                <div className="losange"></div>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    /**
     * TODO: changer les classes PO_addbasket
     * renderSelectionTab home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
        renderSelectionTab() {
            return (
                <div id="PHOTOSOBLIQUES_EXTENSION PHOTOSOBLIQUES_scrollBar">
                    <div className="text-center PO_arrayContent">
                        <div className="basket_counter_position">
                            {this.props.itemCounterInBasket} / {this.props.basket.length} <Message msgId={'photosObliques.pictureSelected'} />
                        </div>
                        <div className="basket_buttons_position">
                            <button className="PO_addBasket" onClick={() => this.props.removeSelectedItemsInBasketPO()}><Glyphicon glyph="trash"/></button>
                            <button className="PO_addBasket" onClick={() => this.props.downloadBasketPO()}><Glyphicon glyph="download"/></button>
                        </div>
                        {
                            this.props.basket.map((val, key) => {
                                return (
                                    <div className={val.selected ? "row PO_searchResults PO_selected" : "row PO_searchResults"} key={key} onClick={(e) => this.props.clickPicturePO(val.id, e.ctrlKey, e.shiftKey)}>
                                        <div className="col-sm-4">
                                            <img src={ val.url_vignette } className="PO_searchResultPictures" />
                                        </div>
                                        <div className="col-sm-6 text-align-left">
                                        <span  className="PO_bold">{ val.date }</span><br/>
                                            { val.proprio }, { val.presta }<br />
                                            <hr />
                                            <span  className="PO_bold">{ val.taille_fichier }</span> - { val.id }
                                        </div>
                                        <div className="col-sm-2">
                                            <div className={val.pertinence >= 50 ? val.pertinence >= 75 ? "PO_resultPrecision PO_high_high": "PO_resultPrecision PO_high_low" : val.pertinence >= 25 ? "PO_resultPrecision PO_low_high": "PO_resultPrecision PO_low_low"}>{ val.pertinence }%</div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
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
                            : "PHOTOSOBLIQUES_homeButton"} onClick={() => this.props.changeTabPO(tabTypes.HOME)}>
                            <Message msgId={'photosObliques.welcome'}/>
                        </button>
                    </div>
                    <div className="col-sm-6 text-center">
                        <button className={this.props.activeTab === "PHOTOSOBLIQUES:SELECT"
                            ? "PHOTOSOBLIQUES_selectButton PHOTOSOBLIQUES_active"
                            : "PHOTOSOBLIQUES_selectButton"} onClick={() => this.props.changeTabPO(tabTypes.SELECT)}>
                            <Message msgId={'photosObliques.selection'}/>
                        </button>
                    </div>
                </div>
            );
        }

        /**
     * renderContent organise which tab is active
     * @memberof photosObliques.component
     * @returns - tab dom content
     */
    renderContent = () => {
        var content;
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
