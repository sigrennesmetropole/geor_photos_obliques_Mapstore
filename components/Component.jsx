/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { PHOTOSOBLIQUES_PANEL_WIDTH } from "../constants/photosObliques-constants.js";
import { tabTypes } from "../actions/photosObliques-action.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import { Glyphicon } from 'react-bootstrap';
import LoadingSpinner from '@mapstore/components/misc/LoadingSpinner';

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
        hoveredPolygonVisibilityState: PropTypes.bool,
        width: PropTypes.number,
        panelClassName: PropTypes.string,
        photosObliquesHomeText: PropTypes.string,
        pictureAmount: PropTypes.number,
        activeTab: PropTypes.string,
        dockStyle: PropTypes.object,
        searchResult: PropTypes.array,
        itemId: PropTypes.string,
        itemCounterInBasket: PropTypes.number,
        basket: PropTypes.array,
        roseValue: PropTypes.string,
        startDateValue: PropTypes.number,
        endDateValue: PropTypes.number,
        toggleControl: PropTypes.func,
        changeTabPO: PropTypes.func,
        pictureHoveredPO: PropTypes.func
    }

    static defaultProps= {
        active: false,
        hoveredPolygonVisibilityState: false,
        dockStyle: {zIndex: 100},
        panelClassName: 'photosObliques-panel',
        width: PHOTOSOBLIQUES_PANEL_WIDTH,
        activeTab: tabTypes.HOME,
        searchResult: [],
        itemCounterInBasket: 0,
        itemId: "",
        basket: [],
        startDate: [],
        roseValue: '',
        startDateValue: 0,
        endDateValue: 0,
        toggleControl: ()=>{},
        changeTabPO: ()=>{},
        pictureHoveredPO: ()=>{}
    }

    constructor(props) {
        super(props);
        this.state = {
            photosObliquesHomeText: props.photosObliquesHomeText,
            pictureAmount: props.pictureAmount,
            maxMoAmount: props.maxMoAmount,
            downloadInformationMessage: props.downloadInformationMessage,
            backendURLAccess: props.backendURLAccess
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
                    {/* { console.log(this.props.searchResult)} */}
                    <span className="PO_resultAmount">{this.props.searchResult.length} / {this.props.photoCount} <Message msgId={'photosObliques.picturesFound'} /></span>
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
                <div className="PHOTOSOBLIQUES_scrollBar" id="PHOTOSOBLIQUES_scrollBar" onScroll={() => this.props.onScrollPO()}>
                    {
                        this.props.searchResult.map((val, key) => {
                            return (
                                <div className="row PO_searchResults" key={key} onMouseEnter={() => this.props.pictureHoveredPO(val)} onMouseLeave={() => this.props.pictureHoveredPO()}>
                                    <div className="col-sm-4 PO_static">
                                        <img src={ val.urlOverview } className="PO_searchResultPictures" />
                                        <div className="PO_searchResultPictures_apercu" ><img src={val.urlOverview}/></div>
                                    </div>
                                    <div className="col-sm-5">
                                        <p><span  className="PO_bold"><Message msgId={'photosObliques.yearTaken'} />:</span> { val.year }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.date'} className="PO_bold" />:</span> { val.date }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.provider'} className="PO_bold" />:</span> { val.provider }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.owner'} className="PO_bold" />:</span> { val.owner }<br/>
                                        <span  className="PO_bold"><Message msgId={'photosObliques.weight'} className="PO_bold" />:</span> { parseFloat(val.fileSize / 1000000).toFixed(1) + "Mo" }</p>
                                    </div>
                                    <div className="col-sm-3 tooltipZoom">
                                        <div className="row">
                                            <div className={parseFloat(val.relevance).toFixed(0) >= 50 ? parseFloat(val.relevance).toFixed(0) >= 75 ? "PO_resultPrecision PO_high_high col-sm-6": "PO_resultPrecision PO_high_low col-sm-6" : parseFloat(val.relevance).toFixed(0) >= 25 ? "PO_resultPrecision PO_low_high col-sm-6": "PO_resultPrecision PO_low_low col-sm-6"}>{ parseFloat(val.relevance).toFixed(0) }%</div>
                                            <div className="zoomToGlyph col-sm-5" onClick={() => this.props.zoomElementPO(val)}>
                                                <Glyphicon glyph="zoom-to" />
                                            </div>
                                        </div>
                                        <span className={this.props.hoveredPolygonVisibilityState ? "tooltiptext tooltipHidden" : "tooltiptext"}><Message msgId={'photosObliques.zoomTooltip'} /></span>
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
        // if (this.props.roseValue != "" && this.props.startDate != "0" && this.props.endDate != "0") {
        if (this.props.startDate != "0" && this.props.endDate != "0") {
            return (
                <>
                    {
                        this.props.filtersTriggered === true &&
                        <button className="PO_addBasket" onClick={() => this.props.cancelSearchFiltersPO()}>
                            <Message msgId={'photosObliques.cancelSearch'}/>
                        </button>
                    }
                    <button className="PO_addBasket" onClick={() => this.props.validateSearchFiltersPO(true, false, true)}>
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
                <h3 className="filterTitle"><Message msgId={'photosObliques.filterTitle'} /></h3>
                <p><Message msgId={'photosObliques.filterYears'} /></p>
                <select id="startDate" className="rw-input" onChange={(e) => this.props.selectStartDateValuePO(e.target.value)} >
                    <option value="start" key="start">Année de début</option>
                    {console.log(parseInt(this.props.startDateValue))}
                    {
                        this.props.startDate.map((val) => {
                            if (val === parseInt(this.props.startDateValue)) {
                                return (<option value={ val } selected key={ val }>{ val }</option>);
                            } else{
                                return (<option value={ val } key={ val }>{ val }</option>);
                            }
                        })
                    }
                </select>
                <select id="endDate" className="rw-input" onChange={(e) => this.props.selectEndDateValuePO(e.target.value)} >
                    <option value="start" key="start">Année de fin</option>
                    {
                        this.props.endDate.map((val) => {
                            if (val === parseInt(this.props.endDateValue)) {
                                return (<option value={ val } selected key={ val }>{ val }</option>);
                            } else{
                                return (<option value={ val } key={ val }>{ val }</option>);
                            }
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
                {(this.props.roseValue != '' || this.props.startDateValue != 0 || this.props.endDateValue != 0) 
                    && <Glyphicon glyph="clear-filter" className="deletionGlyph" onClick={() => this.props.clearFiltersPO()} />}
                <div className="compass">
                    <div className="compass-main">
                        <span className="north-label" style={this.props.roseValue === 0 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>N</span>
                        <span className="dot part2" style={this.props.roseValue === 22.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="dot part3" style={this.props.roseValue === 45 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="dot part4" style={this.props.roseValue === 67.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="east-label" style={this.props.roseValue === 90 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>E</span>
                        <span className="dot part6" style={this.props.roseValue === 112.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="dot part7" style={this.props.roseValue === 135 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="dot part8" style={this.props.roseValue === 157.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="south-label" style={this.props.roseValue === 180 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>S</span>
                        <span className="dot part10" style={this.props.roseValue === 202.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="dot part11" style={this.props.roseValue === 225 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="dot part12" style={this.props.roseValue === 247.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="west-label" style={this.props.roseValue === 270 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>W</span>
                        <span className="dot part14" style={this.props.roseValue === 292.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="dot part15" style={this.props.roseValue === 315 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="dot part16" style={this.props.roseValue === 337.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
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
                            <div className="backgroundSquare"></div>
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
                            <div className={this.props.roseValue != '' ? "testrotate2": "testrotate2 testrotate2Hidden"} style={this.props.roseValue >= 0 ? {transform: "rotate(" + (this.props.roseValue - 80) + "deg)"} : {display: "none"} }>
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
                        <div>
                            <div className="basket_counter_position">
                                {this.props.picturesInBasket} / {this.props.configs.pictureAmount} <Message msgId={'photosObliques.pictureAmount'} /> - {parseFloat(this.props.basketSize / 1000000).toFixed(1)} / {this.props.configs.maxMoAmount  + " Mo"} <Message msgId={'photosObliques.maxCartSize'} />
                            </div>
                            <div className="basket_buttons_position">
                                <div className="tooltipDeletionBasket">
                                    <button className="PO_removeBasket" onClick={() => this.props.removeSelectedItemsInBasketPO(false)}><Glyphicon glyph="trash"/></button>
                                    <span className="tooltiptext"><Message msgId={'photosObliques.removeEverythingFromBasket'} /></span>
                                    {/* <span className="tooltiptext"><Message msgId={'photosObliques.removeSelectedElements'} /></span> */}
                                </div>
                                <div className="tooltipDownloadBasket">
                                    <button className="PO_downloadBasket" onClick={() => this.props.modalDisplayPO(true, 'downloadModal')}><Glyphicon glyph="download"/></button>
                                    <span className="tooltiptext"><Message msgId={'photosObliques.downloadButton'} /></span>
                                </div>
                            </div>
                        </div>
                        {
                            this.props.basket.map((val, key) => {
                                return (
                                    <div className={val.selected ? "row PO_searchResults PO_selected" : "row PO_searchResults"} key={key} onClick={(e) => this.props.clickPicturePO(val.id, e.ctrlKey, e.shiftKey)} onMouseEnter={() => this.props.pictureHoveredPO(val)} onMouseLeave={() => this.props.pictureHoveredPO()}>
                                        <div className="col-sm-4 PO_static">
                                            <img src={ val.urlOverview } className="PO_searchResultPictures" />
                                            <div className="PO_searchResultPictures_apercu PO_searchResultPicturesBasket_apercu" ><img src={val.urlOverview}/></div>
                                        </div>
                                        <div className="col-sm-5 text-align-left">
                                            <div><span  className="PO_bold">{ val.date }</span></div><br/>
                                            <div><i>{ val.owner }, { val.provider }</i></div><br />
                                            <hr />
                                            {console.log(val.fileSize)}
                                            <div>{val.fileSize != undefined && <span  className="PO_bold">{ parseFloat(val.fileSize / 1000000).toFixed(1) + "Mo" }</span> } - { val.id } </div>
                                        </div>
                                        <div className="col-sm-3 text-center">
                                            <div className="row">
                                                <div className={parseFloat(val.relevance).toFixed(0) >= 50 ? parseFloat(val.relevance).toFixed(0) >= 75 ? "PO_resultPrecision PO_high_high col-sm-6": "PO_resultPrecision PO_high_low col-sm-6" : parseFloat(val.relevance).toFixed(0) >= 25 ? "PO_resultPrecision PO_low_high col-sm-6": "PO_resultPrecision PO_low_low col-sm-6"}>{ parseFloat(val.relevance).toFixed(0) }%</div>
                                                <div className="col-sm-5 zoomToGlyph" onClick={() => this.props.zoomElementPO(val)}><Glyphicon glyph="zoom-to" /></div>
                                            </div>
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
            if (this.props.modalType === "deletionModal") {
                return (
                    <div id="modal">
                        <div className="mask"></div>
                        <div className="container auto">
                            <div className="message"><Message msgId={'photosObliques.deletionModal'}/></div>
                            <div onClick={() => this.props.modalDisplayPO(false, '')} className="close">x</div>
                            <div className="modal-validation">
                                <div className="col-sm-2"></div>
                                <button onClick={() => this.props.removeSelectedItemsInBasketPO(true)} className="col-sm-3 PO_addBasket"><Message msgId={'photosObliques.ok'} /></button>
                                <div className="col-sm-2"></div>
                                <button onClick={() => this.props.modalDisplayPO(false, '')} className="col-sm-3 PO_addBasket"><Message msgId={'photosObliques.cancel'} /></button>
                                <div className="col-sm-2"></div>
                            </div>
                        </div>
                    </div>
                )
            }
            
            if (this.props.modalType === "downloadModal") {
                return (
                    <div id="modal">
                        <div className="mask"></div>
                        <div className="container auto">
                            <div className="message"><Message msgId={'photosObliques.downloadModal'}/></div>
                            <div onClick={() => this.props.modalDisplayPO(false, '')} className="close">x</div>
                            <div className="row modal-form">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-10">
                                    <div className="row">
                                        <div className="col-sm-5">
                                            <label htmlFor="fname" className="popupTextLabels"><Message msgId={'photosObliques.fileName'}/></label>
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="text" id="fname" name="fname" />
                                        </div>
                                    </div>
                                    <div className="row top-spacing">
                                        <div className="col-sm-5">
                                            <label htmlFor="pname" className="popupTextLabels"><Message msgId={'photosObliques.prefixLabel'}/></label>
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="text" id="pname" name="pname" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-1"></div>
                            </div>
                            <div className="row modal-validation">
                                <div className="col-sm-2"></div>
                                <button onClick={() => {this.props.modalDisplayPO(true, 'iUnderstand'), this.props.saveDownloadFields(document.getElementById("fname").value,document.getElementById("pname").value)}} className="col-sm-3 PO_addBasket"><Message msgId={'photosObliques.ok'}/></button>
                                <div className="col-sm-2"></div>
                                <button onClick={() => this.props.modalDisplayPO(false, '')} className="col-sm-3 PO_addBasket"><Message msgId={'photosObliques.cancel'}/></button>
                                <div className="col-sm-2"></div>
                            </div>
                        </div>
                    </div>
                )
            }
            
            if (this.props.modalType === "iUnderstand") {
                return (
                    <div id="modal">
                        <div className="mask"></div>
                        <div className="container auto">
                            {!this.props.downloading && <div className="row">
                                <div className="col-sm-3">
                                    <Glyphicon glyph="info-sign" className="glyph-info-sign" />
                                </div>
                                <div className="col-sm-9 message">
                                    <Message msgId={'photosObliques.downloadIUnderstand'}/>
                                </div>
                            </div>}
                            {!this.props.downloading && <div className="row modal-validation">
                                <div className="col-sm-4"></div>
                                <div className="col-sm-4">
                                    <button onClick={() => {this.props.downloadBasketPO(), this.props.setDownloadingPO(true)}} className="PO_addBasket"><Message msgId={'photosObliques.understood'}/></button>
                                </div>
                                <div className="col-sm-4"></div>
                            </div>}
                            {this.props.downloading && this.renderSpinner("photosObliques.spinnerDownloadMsg")}
                        </div>
                    </div>
                )
            }
        }
    }

    /**
     * renderSpinner places a spinner on waiting times
     * @memberof rtge.component
     * @returns - spinner dom content
     */
    renderSpinner(msgId) {
        return (
            <div className="PO_loadingContainer">
                <div className="PO_loading">
                    <LoadingSpinner />
                    <Message msgId={msgId} />
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
