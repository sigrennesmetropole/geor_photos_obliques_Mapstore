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
        searchResult: PropTypes.array,
        itemId: PropTypes.string,
        itemCounterInBasket: PropTypes.number,
        toggleControl: PropTypes.func,
        rtgeChangeTab: PropTypes.func
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
     * renderFiltersSection home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
        renderFiltersSection() {
            return (
                <>
                    {
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
                        <select id="filterSearchedValues" className="startDate" onClick={() => this.props.filterSearchedValues(document.getElementById("filterSearchedValues").value)}>
                            <option value="0">Pertinence</option>
                            <option value="1">Année</option>
                            <option value="2">Date de prise de vue</option>
                            <option value="3">Propriétaire</option>
                            <option value="4">Prestataire</option>
                            <option value="5">Taille</option>
                        </select>
                    </span>
                </div>
                <div className="text-center RTGE_arrayContent">
                    {
                        this.props.searchResult.map((val, key) => {
                            return (
                                <div className="row PO_searchResults" key={key}>
                                    <div className="col-sm-4 PO_static">
                                        <img src={ val.url_vignette } className="PO_searchResultPictures" />
                                        <div className="PO_searchResultPictures_apercu" ><img src={val.url_apercu}/></div>
                                    </div>
                                    <div className="col-sm-6">
                                        <p><span  className="PO_bold"><Message msgId={'photosObliques.yearTaken'} />:</span> { val.annee }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.date'} className="PO_bold" />:</span> { val.date }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.provider'} className="PO_bold" />:</span> { val.presta }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.owner'} className="PO_bold" />:</span> { val.proprio }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.weight'} className="PO_bold" />:</span> { val.taille_fichier }</p>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className={val.pertinence >= 50 ? val.pertinence >= 75 ? "PO_resultPrecision PO_high_high": "PO_resultPrecision PO_high_low" : val.pertinence >= 25 ? "PO_resultPrecision PO_low_high": "PO_resultPrecision PO_low_low"}>{ val.pertinence }%</div>
                                        <button className="PO_addBasket" onClick={() => this.props.addBasket(val.id)}><Message msgId={'photosObliques.addBasket'} /></button>
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
                        <button onClick={() => this.props.cancelSearchFilters()}>
                            <Message msgId={'photosObliques.cancelSearch'}/>
                        </button>
                    }
                    <button onClick={() => this.props.validateSearchFilters(true)}>
                        <Message msgId={'photosObliques.ValidateSearch'}/>
                    </button>
                    <span>XXX Photos disponibles</span>
                </>
            )
        }else{
            return (
                <>
                    {
                        this.props.filtersTriggered === true &&
                        <button onClick={() => this.props.cancelSearchFilters()}>
                            <Message msgId={'photosObliques.cancelSearch'}/>
                        </button>
                    }
                    <button disabled>
                        <Message msgId={'photosObliques.ValidateSearch'}/>
                    </button>
                    <span>XXX Photos disponibles</span>
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
                <select id="startDate" className="startDate" onClick={(e) => this.props.getStartDateValue(e.target.value)}>
                    <option value="0">Année de début</option>
                    <option value="1998">1998</option>
                    <option value="2000">2000</option>
                    <option value="2010">2010</option>
                    <option value="2020">2020</option>
                </select>
                <select id="endDate" className="endDate" onClick={(e) => this.props.getEndDateValue(e.target.value)}>
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
            <div className="compass">
                <div className="compass-main">
                    <span className="north-label">N</span>
                    <span className="east-label">E</span>
                    <span className="west-label">W</span>
                    <span className="south-label">S</span>
                    <div className="compass-rose">
                        <div className="cardial-points">
                            <div className="north-pointer pointer"></div>
                            <div className="ne-pointer subpointer"></div>
                            <div className="east-pointer pointer"></div>
                            <div className="se-pointer subpointer"></div>
                            <div className="south-pointer pointer"></div>
                            <div className="sw-pointer subpointer"></div>
                            <div className="west-pointer pointer"></div>
                            <div className="nw-pointer subpointer"></div>            
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
                        <li id="part1" onClick={() => this.props.windRoseClick(1)}>
                            <div className="text">1</div>
                        </li>
                        <li id="part2" onClick={() => this.props.windRoseClick(2)}>
                            <div className="text">2</div>
                        </li>
                        <li id="part3" onClick={() => this.props.windRoseClick(3)}>
                            <div className="text">3</div>
                        </li>
                        <li id="part4" onClick={() => this.props.windRoseClick(4)}>
                            <div className="text">4</div>
                        </li>
                        <li id="part5" onClick={() => this.props.windRoseClick(5)}>
                            <div className="text">5</div>
                        </li>
                        <li id="part6" onClick={() => this.props.windRoseClick(6)}>
                            <div className="text">6</div>
                        </li>
                        <li id="part7" onClick={() => this.props.windRoseClick(7)}>
                            <div className="text">7</div>
                        </li>
                        <li id="part8" onClick={() => this.props.windRoseClick(8)}>
                            <div className="text">8</div>
                        </li>
                        <li id="part9" onClick={() => this.props.windRoseClick(9)}>
                            <div className="text">9</div>
                        </li>
                        <li id="part10" onClick={() => this.props.windRoseClick(10)}>
                            <div className="text">10</div>
                        </li>
                        <li id="part11" onClick={() => this.props.windRoseClick(11)}>
                            <div className="text">11</div>
                        </li>
                        <li id="part12" onClick={() => this.props.windRoseClick(12)}>
                            <div className="text">12</div>
                        </li>
                        <li id="part13" onClick={() => this.props.windRoseClick(13)}>
                            <div className="text">13</div>
                        </li>
                        <li id="part14" onClick={() => this.props.windRoseClick(14)}>
                            <div className="text">14</div>
                        </li>
                        <li id="part15" onClick={() => this.props.windRoseClick(15)}>
                            <div className="text">15</div>
                        </li>
                        <li id="part16" onClick={() => this.props.windRoseClick(16)}>
                            <div className="text">16</div>
                        </li>
                        <div className="testrotate">
                            <div className="losange"></div>
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
                    <div className="text-center RTGE_arrayContent">
                        <div>
                            {this.props.itemCounterInBasket} <Message msgId={'photosObliques.pictureSelected'} />
                        </div>
                        <div>
                            <button className="PO_addBasket" onClick={() => this.props.removeSelectedItemsInBasket()}><Message msgId={'photosObliques.removeBasket'} /></button>
                            <button className="PO_addBasket" onClick={() => this.props.downloadBasket()}><Message msgId={'photosObliques.downloadBasket'} /></button>
                        </div>
                        {
                            this.props.basket.map((val, key) => {
                                return (
                                    <div className={val.selected ? "row PO_searchResults PO_selected" : "row PO_searchResults"} key={key} onClick={(e) => this.props.POClickPicture(val.id, e.ctrlKey, e.shiftKey)}>
                                        <div className="col-sm-4">
                                            <img src={ val.url_vignette } className="PO_searchResultPictures" />
                                        </div>
                                        <div className="col-sm-6">
                                            <p><span  className="PO_bold"><Message msgId={'photosObliques.yearTaken'} />:</span> { val.annee }<br/>
                                            <span  className="PO_bold"><Message msgId={'photosObliques.date'} className="PO_bold" />:</span> { val.date }<br/>
                                            <span  className="PO_bold"><Message msgId={'photosObliques.provider'} className="PO_bold" />:</span> { val.presta }<br/>
                                            <span  className="PO_bold"><Message msgId={'photosObliques.owner'} className="PO_bold" />:</span> { val.proprio }<br/>
                                            <span  className="PO_bold"><Message msgId={'photosObliques.weight'} className="PO_bold" />:</span> { val.taille_fichier }</p>
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
