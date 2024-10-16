/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { PHOTOSOBLIQUES_PANEL_WIDTH } from "../constants/photosObliques-constants.js";
import { tabTypes } from "../actions/photosObliques-action.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import { Glyphicon } from 'react-bootstrap';
import LoadingSpinner from '@mapstore/components/misc/LoadingSpinner';
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
            backendURLAccess: props.backendURLAccess,
            helpLink: props.helpLink,
            xoffset: 0,
            yoffset: 0
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
                            <div className="row PO_filterSelectionMainDiv">
                                <div className="col-sm-6">
                                    { this.searchFilters() }
                                </div>
                                <div className="col-sm-6">
                                    { this.renderCompass() }
                                </div>
                            </div>
                            <div className="row PO_validateForm">
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
                    <div className="row PO_filterResults">
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
                {!this.props.displayFilters && <button className="btn-primary PO_addBasket" id="PO_toggle_button" onClick={() => this.props.openSearchFiltersPO()}>
                    <Glyphicon glyph="search" /> <Message msgId={'photosObliques.updateSearch'} />
                </button>}
                {this.props.displayFilters && <div>
                    { this.renderFiltersSection() }
                </div>}
                <div className="PO_resultOrganizationFilters">
                    <span className="PO_resultAmount">{this.props.searchResult.length} / {this.props.photoCount} <Message msgId={'photosObliques.picturesFound'} /></span>
                    <span>
                        <span className="PO_bold">Trier par: </span>
                        <select id="filterSearchedValues" className="PO_startDate" onChange={() => this.props.filterSearchedValuesPO(document.getElementById("filterSearchedValues").value)}>
                            <option value="-relevance">Pertinence</option>
                            <option value="-year">Année</option>
                            <option value="-date">Date de prise de vue</option>
                            <option value="-owner">Propriétaire</option>
                            <option value="-provider">Prestataire</option>
                            <option value="-fileSize">Taille</option>
                        </select>
                    </span>
                </div>
                { this.props.searchResult.length === 0 && <div>
                    {this.renderSpinner("photosObliques.spinnerResultLoadingMessage")}
                </div> }
                {this.props.searchResult.length != 0 && <div className="PHOTOSOBLIQUES_scrollBar" id="PHOTOSOBLIQUES_scrollBar" onScroll={() => this.props.onScrollPO()}>
                    {
                        this.props.searchResult.map((val, key) => {
                            return (
                                <div className="row mapstore-side-card PO_searchResults" key={key} onMouseEnter={() => this.props.pictureHoveredPO(val)} onMouseLeave={() => this.props.pictureHoveredPO()}>
                                    <div className="col-sm-4 PO_static">
                                        <img src={ val.urlOverview } className="PO_searchResultPictures" onMouseEnter={(event) => {
                                            this.setState({xoffset: event.clientX, yoffset: event.clientY})
                                        }}/>
                                        {/* Nous avons mis en place un calcul qui permet de placer l'image a proximité de la div sorvolée
                                        * ce calcul est relatif à la position de la souris et la position de la div parente
                                        * dans les calculs, 40em correspond à la taille (théorique) de l'image et le -5em correspond à un décalage pour éviter de mettre la souris trop souvent dessus.
                                        */}
                                        <div className="PO_searchResultPictures_apercu" style={{
                                                position: "absolute",
                                                left: '0px',
                                                top: '0px',
                                            }}>
                                                <img  style={{
                                                    position: "fixed",
                                                    right: '560px',
                                                    top: window.innerHeight /2 > this.state.yoffset ? `${this.state.yoffset -200}px` : `${this.state.yoffset -350}px`,
                                                }}
                                                src={val.urlOverview} />
                                        </div>
                                    </div>
                                    <div className="col-sm-5">
                                        <p>
                                            <span  className="PO_bold"><Message msgId={'photosObliques.yearTaken'} />: </span> {val.year && <span className="PO_ellipsis">{ val.year }</span>}{val.year && <br/>}
                                            <span  className="PO_bold"><Message msgId={'photosObliques.date'} className="PO_bold" />: </span>{!val.date && <br />} {val.date && <span className="PO_ellipsis">{ val.date }</span>} {val.date && <br/>}
                                            <span  className="PO_bold"><Message msgId={'photosObliques.provider'} className="PO_bold" />: </span> {val.provider && <span className="PO_ellipsis">{ val.provider }</span>}{val.provider &&<br/>}
                                            <span  className="PO_bold"><Message msgId={'photosObliques.owner'} className="PO_bold" />: </span> {val.owner && <span className="PO_ellipsis">{ val.owner }</span>}{val.owner && <br/>}
                                            <span  className="PO_bold"><Message msgId={'photosObliques.weight'} className="PO_bold" />: </span> {val.fileSize && <span className="PO_ellipsis">{ parseFloat(val.fileSize / 1000000).toFixed(1) + "Mo" }</span>}
                                        </p>
                                    </div>
                                    <div className="col-sm-3 PO_tooltipZoom">
                                        <div className="row">
                                            <div className={parseFloat(val.relevance).toFixed(0) >= 50 ? parseFloat(val.relevance).toFixed(0) >= 75 ? "PO_resultPrecision PO_high_high col-sm-6": "PO_resultPrecision PO_high_low col-sm-6" : parseFloat(val.relevance).toFixed(0) >= 25 ? "PO_resultPrecision PO_low_high col-sm-6": "PO_resultPrecision PO_low_low col-sm-6"}>{ parseFloat(val.relevance).toFixed(0) }%</div>
                                            <div className="PO_zoomToGlyph col-sm-5" onClick={() => this.props.zoomElementPO(val)}>
                                                <Glyphicon glyph="zoom-to" />
                                            </div>
                                        </div>
                                        <span className={this.props.hoveredPolygonVisibilityState ? "PO_tooltiptext PO_tooltipHidden" : "PO_tooltiptext"}><Message msgId={'photosObliques.zoomTooltip'} /></span>
                                        <button className="btn-primary PO_addBasket PO_addBasketWidth" onClick={() => this.props.addBasketPO(val)}><Message msgId={'photosObliques.addBasket'} /></button>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>}
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
                        <button className="btn-primary PO_addBasket" onClick={() => this.props.cancelSearchFiltersPO()}>
                            <Message msgId={'photosObliques.cancelSearch'}/>
                        </button>
                    }
                    <button className="btn-primary PO_addBasket" onClick={() => {this.props.validateSearchFiltersPO(true, false, true), this.props.searchValuesFilteredPO(""), this.props.cancelSearchFiltersPO()}}>
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
                        <button className="btn-primary PO_addBasket" onClick={() => this.props.cancelSearchFiltersPO()}>
                            <Message msgId={'photosObliques.cancelSearch'}/>
                        </button>
                    }
                    <button className="btn-primary PO_addBasket" disabled>
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
                <h3 className="PO_filterTitle"><Message msgId={'photosObliques.filterTitle'} /></h3>
                <p><Message msgId={'photosObliques.filterYears'} /></p>
                <select id="PO_startDate" className="rw-input" onChange={(e) => this.props.selectStartDateValuePO(e.target.value)} >
                    <option value="start" key="start">Année de début</option>
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
                <select id="PO_endDate" className="rw-input" onChange={(e) => this.props.selectEndDateValuePO(e.target.value)} >
                    <option value="end" key="end">Année de fin</option>
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
            <>
                {(this.props.roseValue != '' || this.props.startDateValue != 0 || this.props.endDateValue != 0) 
                    && <Glyphicon glyph="clear-filter" className="PO_deletionGlyph" onClick={() => this.props.clearFiltersPO()} />}
                <div className="PO_compassMainStyle">
                    <Message msgId={'photosObliques.windRoseLabel'} />
                    <div className="PO_compass">
                        <div className="PO_compass-main">
                            <span className="PO_north-label" style={this.props.roseValue === '0' ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>N</span>
                            <span className="PO_dot PO_part2" style={this.props.roseValue === 22.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_dot PO_part3" style={this.props.roseValue === 45 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_dot PO_part4" style={this.props.roseValue === 67.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_east-label" style={this.props.roseValue === 90 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>E</span>
                            <span className="PO_dot PO_part6" style={this.props.roseValue === 112.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_dot PO_part7" style={this.props.roseValue === 135 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_dot PO_part8" style={this.props.roseValue === 157.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_south-label" style={this.props.roseValue === 180 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>S</span>
                            <span className="PO_dot PO_part10" style={this.props.roseValue === 202.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_dot PO_part11" style={this.props.roseValue === 225 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_dot PO_part12" style={this.props.roseValue === 247.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_west-label" style={this.props.roseValue === 270 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>W</span>
                            <span className="PO_dot PO_part14" style={this.props.roseValue === 292.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_dot PO_part15" style={this.props.roseValue === 315 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <span className="PO_dot PO_part16" style={this.props.roseValue === 337.5 ? {"backgroundColor": "#aaa"} : {"backgroundColor": "#ddd"}}></span>
                            <div className="PO_compass-rose">
                                <div className="cardial-points">
                                    <div className="PO_north-pointer PO_pointer"></div>
                                    <div className="PO_east-pointer PO_pointer"></div>
                                    <div className="PO_south-pointer PO_pointer"></div>
                                    <div className="PO_west-pointer PO_pointer"></div>          
                                </div>
                                <div className="PO_ordinal-points">
                                    <div className="PO_northeast-pointer"></div>
                                    <div className="PO_northwest-pointer"></div>
                                    <div className="PO_southeast-pointer"></div>
                                    <div className="PO_south-west-pointer"></div>
                                </div>
                            </div>
                            <div className="bt-center"></div>
                            <ul className="PO_circle">
                                <li id="PO_part1" onClick={() => this.props.windRoseClickPO('0')}>
                                </li>
                                <li id="PO_part2" onClick={() => this.props.windRoseClickPO(22.5)}>
                                    <div className="PO_text">2</div>
                                </li>
                                <li id="PO_part3" onClick={() => this.props.windRoseClickPO(45)}>
                                    <div className="PO_text">3</div>
                                </li>
                                <li id="PO_part4" onClick={() => this.props.windRoseClickPO(67.5)}>
                                    <div className="PO_text">4</div>
                                </li>
                                <li id="PO_part5" onClick={() => this.props.windRoseClickPO(90)}>
                                    <div className="PO_text">5</div>
                                </li>
                                <li id="PO_part6" onClick={() => this.props.windRoseClickPO(112.5)}>
                                    <div className="PO_text">6</div>
                                </li>
                                <li id="PO_part7" onClick={() => this.props.windRoseClickPO(135)}>
                                    <div className="PO_text">7</div>
                                </li>
                                <li id="PO_part8" onClick={() => this.props.windRoseClickPO(157.5)}>
                                    <div className="PO_text">8</div>
                                </li>
                                <li id="PO_part9" onClick={() => this.props.windRoseClickPO(180)}>
                                    <div className="PO_text">9</div>
                                </li>
                                <li id="PO_part10" onClick={() => this.props.windRoseClickPO(202.5)}>
                                    <div className="PO_text">10</div>
                                </li>
                                <li id="PO_part11" onClick={() => this.props.windRoseClickPO(225)}>
                                    <div className="PO_text">11</div>
                                </li>
                                <li id="PO_part12" onClick={() => this.props.windRoseClickPO(247.5)}>
                                    <div className="PO_text">12</div>
                                </li>
                                <li id="PO_part13" onClick={() => this.props.windRoseClickPO(270)}>
                                    <div className="PO_text">13</div>
                                </li>
                                <li id="PO_part14" onClick={() => this.props.windRoseClickPO(292.5)}>
                                    <div className="PO_text">14</div>
                                </li>
                                <li id="PO_part15" onClick={() => this.props.windRoseClickPO(315)}>
                                    <div className="PO_text">15</div>
                                </li>
                                <li id="PO_part16" onClick={() => this.props.windRoseClickPO(337.5)}>
                                    <div className="PO_text">16</div>
                                </li>
                                <div className={this.props.roseValue != '' ? "PO_rotate2": "PO_rotate2 PO_rotate2Hidden"} style={this.props.roseValue != '' ? {transform: "rotate(" + (this.props.roseValue - 80) + "deg)"} : {display: "none"} }>
                                    <div className={this.props.roseValue != '' ? "PO_losangeSelected" : "PO_hideLosangeSelected"}></div>
                                </div>
                                <div className="PO_rotate">
                                    <div className="PO_losange"></div>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </>
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
                    {!this.props.downloading && <div>
                        <div className="PO_basket_counter_position">
                            {this.props.itemCounterInBasket} / {this.props.basket.length} <Message msgId={'photosObliques.pictureSelected'} />
                            <span className="PO_basket_sort_position">
                                <span className="PO_bold">Trier par: </span>
                                <select id="filterBasketValues" className="PO_startDate" onChange={() => this.props.filterBasketValuesPO(document.getElementById("filterBasketValues").value)}>
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
                            <div className="PO_basket_counter_position">
                                {this.props.picturesInBasket} / {this.props.configs.pictureAmount} <Message msgId={'photosObliques.pictureAmount'} /> - {parseFloat(this.props.basketSize / 1000000).toFixed(1)} / {this.props.configs.maxMoAmount  + " Mo"} <Message msgId={'photosObliques.maxCartSize'} />
                            </div>
                            <div className="PO_basket_buttons_position">
                                <div className="PO_tooltipDeletionBasket">
                                    <button className="btn-primary PO_removeBasket" onClick={() => this.props.removeSelectedItemsInBasketPO(false)}><Glyphicon glyph="trash"/></button>
                                    { this.selectTooltipForDeletion() }
                                </div>
                                <div className="PO_tooltipDownloadBasket">
                                    <button className="btn-primary PO_downloadBasket" onClick={() => this.props.modalDisplayPO(true, 'downloadModal')}><Glyphicon glyph="download"/></button>
                                    { this.selectTooltipForDownload() }
                                </div>
                            </div>
                        </div>
                        {
                            this.props.basket.map((val, key) => {
                                return (
                                    <div className={val.selected ? "row mapstore-side-card PO_searchResults PO_searchResult_center PO_selected" : "row mapstore-side-card PO_searchResults PO_searchResult_center"} key={key} onClick={(e) => this.props.clickPicturePO(val.id, e.ctrlKey, e.shiftKey)} onMouseEnter={() => this.props.pictureHoveredPO(val)} onMouseLeave={() => this.props.pictureHoveredPO()}>
                                        <div className="col-sm-4 PO_static">
                                            <img src={ val.urlOverview } className="PO_searchResultPictures" onMouseEnter={(event) => {
                                                this.setState({xoffset: event.clientX, yoffset: event.clientY})
                                            }}/>
                                            <div className="PO_searchResultPictures_apercu PO_searchResultPicturesBasket_apercu" style={{
                                                position: "absolute",
                                                left: '0px',
                                                top: '0px',
                                                }}>
                                                <img  style={{
                                                    position: "fixed",
                                                    right: '560px',
                                                    top: window.innerHeight /2 > this.state.yoffset ? `${this.state.yoffset -200}px` : `${this.state.yoffset -300}px`,
                                                }}
                                                src={val.urlOverview} />
                                            </div>
                                        </div>
                                        <div className="col-sm-8 PO_flexContainer">
                                            <div className="col-sm-7 PO_text-align-left">
                                                <div><span  className="PO_bold">{ val.year } | { val.date }</span></div>
                                                <div><i>{ val.owner }, { val.provider }</i></div>
                                                <hr />
                                                <div>{val.fileSize && <span  className="PO_bold">{ parseFloat(val.fileSize / 1000000).toFixed(1) + "Mo" }</span> } {val.id && <span> - {val.id}</span> }</div>
                                            </div>
                                            <div className="col-sm-5">
                                                <div className="row PO_harmonizePrecision">
                                                    <div className={parseFloat(val.relevance).toFixed(0) >= 50 ? parseFloat(val.relevance).toFixed(0) >= 75 ? "PO_resultPrecision PO_high_high col-sm-6": "PO_resultPrecision PO_high_low col-sm-6" : parseFloat(val.relevance).toFixed(0) >= 25 ? "PO_resultPrecision PO_low_high col-sm-6": "PO_resultPrecision PO_low_low col-sm-6"}>{ parseFloat(val.relevance).toFixed(0) }%</div>
                                                    <div className="col-sm-5 PO_zoomToGlyph" onClick={() => this.props.zoomElementPO(val)}><Glyphicon glyph="zoom-to" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        {this.renderPopUp()}
                    </div>}
                    {this.props.downloading && this.renderSpinner("photosObliques.spinnerDownloadMsg")}
                </div>
            );
        }

    /**
     * countBasketSelectedElements renders the selection tabs to get all plkugins sub parts
     * @memberof photosObliques.component
     * @returns - navbar like for the plugin
     */
    countBasketSelectedElements(){
        var counter = 0;
        this.props.basket.map((val, key) => {
            if (val.selected === true) {
                counter = counter +1;
            }
        })
        return counter;
    }

    /**
     * selectTooltipForDeletion renders the selection tabs to get all plkugins sub parts
     * @memberof photosObliques.component
     * @returns - navbar like for the plugin
     */
    selectTooltipForDeletion(){
        if (this.countBasketSelectedElements() === 1) {
            return (<span className="PO_tooltiptext"><Message msgId={'photosObliques.removeSelectedElement'} /></span>)
        }
        if (this.countBasketSelectedElements() > 1) {
            return (<span className="PO_tooltiptext PO_bigTooltipDownload"><Message msgId={'photosObliques.removeSelectedElements'} /></span>)
            
        }
        if (this.countBasketSelectedElements() === 0) {
            return (<span className="PO_tooltiptext PO_bigTooltipDownload"><Message msgId={'photosObliques.removeEverythingFromBasket'} /></span>)
        }
    }

    /**
     * selectTooltipForDownload renders the selection tabs to get all plkugins sub parts
     * @memberof photosObliques.component
     * @returns - navbar like for the plugin
     */
    selectTooltipForDownload(){
        if (this.countBasketSelectedElements() === 1) {
            return (<span className="PO_tooltiptext"><Message msgId={'photosObliques.downloadOneButton'} /></span>)
        }
        if (this.countBasketSelectedElements() > 1) {
            return (<span className="PO_tooltiptext"><Message msgId={'photosObliques.downloadMultipleButton'} /></span>)
            
        }
        if (this.countBasketSelectedElements() === 0) {
            return (<span className="PO_tooltiptext"><Message msgId={'photosObliques.downloadAllButton'} /></span>)
        }
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
                    <div id="PO_modal">
                        <div className="PO_mask"></div>
                        <div className="container auto">
                            <div className="message"><Message msgId={'photosObliques.deletionModal'}/></div>
                            <div onClick={() => this.props.modalDisplayPO(false, '')} className="PO_close">x</div>
                            <div>
                                <div className="col-sm-2"></div>
                                <button onClick={() => this.props.removeSelectedItemsInBasketPO(true)} className="btn-primary col-sm-3 PO_addBasket PO_button_margin_bottom"><Message msgId={'photosObliques.ok'} /></button>
                                <div className="col-sm-2"></div>
                                <button onClick={() => this.props.modalDisplayPO(false, '')} className="col-sm-3 btn-primary PO_addBasket PO_button_margin_bottom"><Message msgId={'photosObliques.cancel'} /></button>
                                <div className="col-sm-2"></div>
                            </div>
                        </div>
                    </div>
                )
            }
            
            if (this.props.modalType === "downloadModal") {
                return (
                    <div id="PO_modal">
                        <div className="PO_mask"></div>
                        <div className="container auto">
                            <div className="message"><Message msgId={'photosObliques.downloadModal'}/></div>
                            <div onClick={() => this.props.modalDisplayPO(false, '')} className="PO_close">x</div>
                            <div className="row">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-10">
                                    <div className="row">
                                        <div className="col-sm-5">
                                            <label htmlFor="fname" className="PO_popupTextLabels"><Message msgId={'photosObliques.fileName'}/></label>
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="PO_text" id="fname" name="fname" placeholder="date du jour" />
                                        </div>
                                    </div>
                                    <div className="row PO_top-spacing">
                                        <div className="col-sm-5">
                                            <label htmlFor="pname" className="PO_popupTextLabels"><Message msgId={'photosObliques.prefixLabel'}/></label>
                                        </div>
                                        <div className="col-sm-5">
                                            <input type="PO_text" id="pname" name="pname" placeholder="pas de préfixe" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-1"></div>
                            </div>
                            <div className="row">
                                <div className="col-sm-2"></div>
                                <button onClick={() => {this.props.modalDisplayPO(true, 'iUnderstand'), this.props.saveDownloadFields(document.getElementById("fname").value,document.getElementById("pname").value)}} className="col-sm-3 btn-primary PO_addBasket PO_button_margin_bottom"><Message msgId={'photosObliques.ok'}/></button>
                                <div className="col-sm-2"></div>
                                <button onClick={() => this.props.modalDisplayPO(false, '')} className="col-sm-3 btn-primary PO_addBasket PO_button_margin_bottom"><Message msgId={'photosObliques.cancel'}/></button>
                                <div className="col-sm-2"></div>
                            </div>
                        </div>
                    </div>
                )
            }
            
            if (this.props.modalType === "iUnderstand") {
                return (
                    <div id="PO_modal">
                        <div className="PO_mask"></div>
                        <div className="container auto">
                            <div className="row">
                                <div className="col-sm-3">
                                    <Glyphicon glyph="info-sign" className="PO_glyph-info-sign" />
                                </div>
                                <div className="col-sm-9 message">
                                    <Message msgId={'photosObliques.downloadIUnderstand'}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4"></div>
                                <div className="col-sm-4">
                                    <button onClick={() => {this.props.downloadBasketPO(), this.props.setDownloadingPO(true)}} className="btn-primary PO_addBasket PO_button_margin_bottom"><Message msgId={'photosObliques.understood'}/></button>
                                </div>
                                <div className="col-sm-4"></div>
                            </div>
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
                <div className="PO_masterclass row PHOTOSOBLIQUES_rowTabs">
                    <div className="col-sm-5 PO_text-center">
                        <button className={this.props.activeTab === "PHOTOSOBLIQUES:HOME"
                            ? "PHOTOSOBLIQUES_homeButton PHOTOSOBLIQUES_active"
                            : "PHOTOSOBLIQUES_homeButton"} onClick={() => this.props.changeTabPO(tabTypes.HOME)}>
                            <Message msgId={'photosObliques.welcome'}/>
                        </button>
                    </div>
                    <div className="col-sm-5 PO_text-center">
                        {this.props.basket.length != 0 && <button className={this.props.activeTab === "PHOTOSOBLIQUES:SELECT"
                            ? "PHOTOSOBLIQUES_selectButton PHOTOSOBLIQUES_active"
                            : "PHOTOSOBLIQUES_selectButton"} onClick={() => this.props.changeTabPO(tabTypes.SELECT)}>
                            <Message msgId={'photosObliques.selection'}/>
                        </button>}
                        {this.props.basket.length === 0 && <button className={this.props.activeTab === "PHOTOSOBLIQUES:SELECT"
                            ? "PHOTOSOBLIQUES_selectButton PHOTOSOBLIQUES_active PO_greyed "
                            : "PHOTOSOBLIQUES_selectButton PO_greyed"} disabled onClick={() => this.props.changeTabPO(tabTypes.SELECT)}>
                            <Message msgId={'photosObliques.selection'}/>
                        </button>}
                    </div>
                    <div className="col-sm-2 PO_text-center">
                        <button className="PHOTOSOBLIQUES_selectButton" onClick={() => window.open(this.props.helpLink,'_blank')} >
                            <Glyphicon glyph="question-sign" />
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
            content = <div className="PO_masterclass">{this.renderHomeTab()}</div>
            break;
        case tabTypes.SELECT:
            content = <div className="PO_masterclass">{this.renderSelectionTab()}</div>
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
