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
        changeTabPO: PropTypes.func,
        pictureHoveredPO: PropTypes.func
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
        startDate: [],
        toggleControl: ()=>{},
        changeTabPO: ()=>{},
        pictureHoveredPO: ()=>{}
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
                    <div className="row filterResults">
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
     * this.props.onScrollPO()
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
                        <select id="filterSearchedValues" className="startDate" onChange={() => this.props.filterSearchedValuesPO(document.getElementById("filterSearchedValues").value)}>
                            <option value="-relevance">Pertinence</option>
                            <option value="-year">Année</option>
                            <option value="-date">Date de prise de vue</option>
                            <option value="-owner">Propriétaire</option>
                            <option value="-provider">Prestataire</option>
                            <option value="-fileSize">Taille</option>
                        </select>
                    </span>
                </div>
                <div className="PHOTOSOBLIQUES_scrollBar" onScroll={console.log('scrolling')}>
                    {
                        this.props.searchResult.map((val, key) => {
                            return (
                                <div className="row PO_searchResults" key={key} onMouseEnter={() => this.props.pictureHoveredPO(val)} onMouseLeave={() => this.props.pictureHoveredPO()}>
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
                                    <div className="col-sm-2 text-center">
                                        <div className={parseFloat(val.relevance).toFixed(0) >= 50 ? parseFloat(val.relevance).toFixed(0) >= 75 ? "PO_resultPrecision PO_high_high": "PO_resultPrecision PO_high_low" : parseFloat(val.relevance).toFixed(0) >= 25 ? "PO_resultPrecision PO_low_high": "PO_resultPrecision PO_low_low"}>{ parseFloat(val.relevance).toFixed(0) }%</div>
                                        <button className="PO_addBasket" onClick={() => this.props.addBasketPO(val)}><Message msgId={'photosObliques.addBasket'} /></button>
                                        <button className="PO_search" onClick={() => this.props.zoomElementPO(val)}><Glyphicon glyph="search" /></button>
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
                        <button className="PO_addBasket" onClick={() => this.props.cancelSearchFiltersPO()}>
                            <Message msgId={'photosObliques.cancelSearch'}/>
                        </button>
                    }
                    <button className="PO_addBasket" onClick={() => this.props.validateSearchFiltersPO(true, false)}>
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
                <Message msgId={'photosObliques.windRoseLabel'} />
                <div className="compass">
                    <div className="compass-main">
                        <span className="north-label" style={this.props.roseValue === 0 ? {"font-weight": "bold"} : {"font-weight": "normal"}}>N</span>
                        <span class="dot part2" style={this.props.roseValue === 22.5 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span class="dot part3" style={this.props.roseValue === 45 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span class="dot part4" style={this.props.roseValue === 67.5 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span className="east-label" style={this.props.roseValue === 90 ? {"font-weight": "bold"} : {"font-weight": "normal"}}>E</span>
                        <span class="dot part6" style={this.props.roseValue === 112.5 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span class="dot part7" style={this.props.roseValue === 135 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span class="dot part8" style={this.props.roseValue === 157.5 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span className="south-label" style={this.props.roseValue === 180 ? {"font-weight": "bold"} : {"font-weight": "normal"}}>S</span>
                        <span class="dot part10" style={this.props.roseValue === 202.5 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span class="dot part11" style={this.props.roseValue === 225 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span class="dot part12" style={this.props.roseValue === 247.5 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span className="west-label" style={this.props.roseValue === 270 ? {"font-weight": "bold"} : {"font-weight": "normal"}}>W</span>
                        <span class="dot part14" style={this.props.roseValue === 292.5 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span class="dot part15" style={this.props.roseValue === 315 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
                        <span class="dot part16" style={this.props.roseValue === 337.5 ? {"background-color": "#aaa"} : {"background-color": "#ddd"}}></span>
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
                            <div className="testrotate2" style={this.props.roseValue >= 0 ? {transform: "rotate(" + (this.props.roseValue - 80) + "deg)"} : {display: "none"} }>
                                <div className={this.props.roseValue >= 0 ? "losangeSelected" : "hideLosangeSelected"}></div>
                            </div>
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
                    <div>
                        <div className="basket_counter_position">
                            {this.props.itemCounterInBasket} / {this.props.basket.length} <Message msgId={'photosObliques.pictureSelected'} />
                            <span className="basket_sort_position">
                                <span className="PO_bold">Trier par: </span>
                                <select id="filterBasketValues" className="startDate" onChange={() => this.props.filterBasketValuesPO(document.getElementById("filterBasketValues").value)}>
                                    <option value="-relevance">Pertinence</option>
                                    <option value="-year">Année</option>
                                    <option value="-date">Date de prise de vue</option>
                                    <option value="-owner">Propriétaire</option>
                                    <option value="-provider">Prestataire</option>
                                    <option value="-fileSize">Taille</option>
                                </select>
                            </span>
                        </div>
                        <div className="basket_buttons_position">
                            <button className="PO_removeBasket" onClick={() => this.props.removeSelectedItemsInBasketPO(false)}><Glyphicon glyph="trash"/></button>
                            <button className="PO_downloadBasket" onClick={() => this.props.downloadBasketPO()}><Glyphicon glyph="download"/></button>
                        </div>
                        {
                            this.props.basket.map((val, key) => {
                                return (
                                    <div className={val.selected ? "row PO_searchResults PO_selected" : "row PO_searchResults"} key={key} onClick={(e) => this.props.clickPicturePO(val.id, e.ctrlKey, e.shiftKey)} onMouseEnter={() => this.props.pictureHoveredPO(val)} onMouseLeave={() => this.props.pictureHoveredPO()}>
                                        <div className="col-sm-4 PO_static">
                                            <img src={ val.urlOverview } className="PO_searchResultPicturesBasket" />
                                            <div className="PO_searchResultPictures_apercu" ><img src={val.urlOverview}/></div>
                                        </div>
                                        <div className="col-sm-6 text-align-left">
                                            <div><span  className="PO_bold">{ val.date }</span></div><br/>
                                            <div><i>{ val.owner }, { val.provider }</i></div><br />
                                            <hr />
                                            <div><span  className="PO_bold">{ parseFloat(val.fileSize / 1000000).toFixed(1) + "Mo" }</span> - { val.id }</div>
                                        </div>
                                        <div className="col-sm-2 text-center">
                                            <div className={parseFloat(val.relevance).toFixed(0) >= 50 ? parseFloat(val.relevance).toFixed(0) >= 75 ? "PO_resultPrecision PO_high_high": "PO_resultPrecision PO_high_low" : parseFloat(val.relevance).toFixed(0) >= 25 ? "PO_resultPrecision PO_low_high": "PO_resultPrecision PO_low_low"}>{ parseFloat(val.relevance).toFixed(0) }%</div>
                                            <button className="PO_search" onClick={() => this.props.zoomElementPO(val)}><Glyphicon glyph="search" /></button>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        {this.renderPopUp()}
                    </div>
                </div>
            );
        }

    /**
     * renderTabMenu renders the selection tabs to get all plkugins sub parts
     * @memberof photosObliques.component
     * @returns - navbar like for the plugin
     */
    renderPopUp(){
        if (this.props.modalDisplay) {
            return (
                <div id="modal">
                    <div class="mask"></div>
                    <div class="container auto">
                        <div class="message">toto</div>
                        <div onClick={() => this.props.modalDisplayPO(false)} class="close">x</div>
                        <div onClick={() => this.props.removeSelectedItemsInBasketPO(true)} class="col-sl-6">OK</div>
                        <div onClick={() => this.props.modalDisplayPO(false)} class="col-sm-6">Annuler</div>
                    </div>
                </div>
            )
        }
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
