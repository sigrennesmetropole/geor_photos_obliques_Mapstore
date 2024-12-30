/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { PHOTOSOBLIQUES_PANEL_WIDTH } from "../constants/photosObliques-constants.js";
import { tabTypesPO, loadTypesPO } from "../actions/photosObliques-action.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import { Glyphicon } from 'react-bootstrap';
import LoadingSpinner from '@mapstore/components/misc/LoadingSpinner';
import {getMessageById} from '@mapstore/utils/LocaleUtils';
export class photosObliques extends React.Component {

    static propTypes= {
        active: PropTypes.bool,
        hoveredPolygonVisibilityState: PropTypes.bool,
        width: PropTypes.number,
        panelClassName: PropTypes.string,
        pohometext: PropTypes.string,
        pomaxcartnumberofpics: PropTypes.number,
        activeTab: PropTypes.string,
        dockStyle: PropTypes.object,
        searchResult: PropTypes.array,
        itemId: PropTypes.string,
        itemCounterInBasket: PropTypes.number,
        basket: PropTypes.array,
        startDates: PropTypes.array,
        endDates: PropTypes.array,
        roseValue: PropTypes.number,
        startDateValue: PropTypes.number,
        endDateValue: PropTypes.number,
        toggleControl: PropTypes.func,
        changeTabPO: PropTypes.func,
        pictureHoveredPO: PropTypes.func
    };
    
    static contextTypes = {
        messages: PropTypes.object
    };

    static defaultProps= {
        active: false,
        hoveredPolygonVisibilityState: false,
        dockStyle: {zIndex: 100},
        panelClassName: 'photosObliques-panel',
        width: PHOTOSOBLIQUES_PANEL_WIDTH,
        activeTab: tabTypesPO.SEARCH,
        searchResult: [],
        itemCounterInBasket: 0,
        itemId: "",
        basket: [],
        startDates: [],
        endDates: [],
        roseValue: -1,
        startDateValue: 0,
        endDateValue: 0,
        toggleControl: ()=>{},
        changeTabPO: ()=>{},
        pictureHoveredPO: ()=>{}
    };

    constructor(props) {
        super(props);
        this.state = {
            pohometext: props.pohometext,
            pomaxcartnumberofpics: props.pomaxcartnumberofpics,
            pomaxcartsize: props.pomaxcartsize,
            podownloadinfomessage: props.podownloadinfomessage,
            pobackendurlaccess: props.pobackendurlaccess,
            pohelpurlaccess: props.pohelpurlaccess,
            xoffset: 0,
            yoffset: 0
        };
        props.initConfigsPO({
            ...props
        });
    };

    /**
     * onClose closes the plugins Panel
     * @memberof photosObliques.component
     * @returns - toggleControl action
     */
    onClose() {
        return this.props.toggleControl();
    };

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
                        <div className="helpBtnAccess" onClick={() => window.open(this.props.pohelpurlaccess,'_blank')} style={this.props.pohelpurlaccess === '' ? {"display":"none"} : {"display":"block"}} >
                            <Glyphicon glyph="question-sign" />
                        </div>
                        <div className="row PO_filterSelectionMainDiv">
                            <div className="col-sm-6">
                                { this.searchFilters() }
                            </div>
                            <div className="col-sm-6">
                                { this.renderCompass() }
                            </div>
                        </div>
                        <div className="row PO_validateSearch">
                            { this.validateSection() }
                        </div>
                    </>
                }
            </>
        );
    };

    /**
     * renderHomeTab home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    renderSearchTab() {
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
    };

    /**
     * filterResults home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    filterResults(){
        return (
            <>
                {!this.props.displayFilters && <button className="btn-primary PO_customBtn" id="PO_toggle_button" onClick={() => this.props.openSearchFiltersPO()}>
                    <Glyphicon glyph="search" /> <Message msgId={'photosObliques.updateSearch'} />
                </button>}
                {this.props.displayFilters && <div>
                    { this.renderFiltersSection() }
                </div>}
                <div className="PO_resultOrganizationFilters">
                    <span className="PO_resultAmount">{this.props.prevPhotoCount} <Message msgId={'photosObliques.picturesFound'} /></span>
                    <span>
                        <span className="PO_bold"><Message msgId={'photosObliques.orderBy'}/>: </span>
                        <select id="filterSearchedValues" className="PO_filterSearchedVal PO_sortSearchedValues" onChange={() => this.props.filterSearchedValuesPO(document.getElementById("filterSearchedValues").value)}>
                            <option className="PO_dropdownMenu" value="-relevance">{getMessageById(this.context.messages, 'photosObliques.relevance')}</option>
                            <option className="PO_dropdownMenu" value="-year">{getMessageById(this.context.messages, 'photosObliques.yearTaken')}</option>
                            <option className="PO_dropdownMenu" value="-date">{getMessageById(this.context.messages, 'photosObliques.date')}</option>
                            <option className="PO_dropdownMenu" value="-owner">{getMessageById(this.context.messages, 'photosObliques.owner')}</option>
                            <option className="PO_dropdownMenu" value="-provider">{getMessageById(this.context.messages, 'photosObliques.provider')}</option>
                            <option className="PO_dropdownMenu" value="-fileSize">{getMessageById(this.context.messages, 'photosObliques.weight')}</option>
                        </select>
                    </span>
                </div>
                { this.props.searchResult.length === 0 && <div>
                    {this.renderSpinner("photosObliques.spinnerResultLoadingMessage")}
                </div> }
                {
                    this.props.searchResult[0]?.provider === 'none' &&
                    <div className="PO_bold text-center PO_NoResultFound">
                        <Message msgId={'photosObliques.noResultsFound'} />
                    </div>
                }
                {this.props.searchResult.length != 0 && this.props.searchResult[0].provider != 'none' && 
                <div className="PHOTOSOBLIQUES_scrollBar" id="PHOTOSOBLIQUES_scrollBar" onScroll={() => this.props.onScrollPO()} style={this.props.displayFilters ? {"pointerEvents": "none", "opacity": "0.3"} : {"pointerEvents": "auto", "opacity" : "1"}}>
                    {
                        this.props.searchResult.map((val, key) => {
                            return (
                                <div id={val.id} className="row mapstore-side-card PO_searchResults" key={key} onMouseEnter={() => this.props.pictureHoveredPO(val)} onMouseLeave={() => this.props.pictureHoveredPO()}>
                                    <div className="col-sm-4 PO_static">
                                        <img src={ val.urlOverview } className="PO_searchResultPictures" onMouseEnter={(event) => {
                                            this.setState({xoffset: event.clientX, yoffset: event.clientY})
                                        }}/>
                                        {/* Nous avons mis en place un calcul qui permet de placer l'image a proximité de la div sorvolée
                                        * ce calcul est relatif à la position de la souris et la position de la div parente.
                                        * selon la position de la souris sur la fenêtre (window.innerheight) le décalage sera modifié pour ne pas couper l'image avec le haut ou le bas de l'écran.
                                        * un décalage à droite est défini pour ne pas survoler à nouveau la feêtre et redéclaencher la focntion de manière intempestive.
                                        */}
                                        <div className="PO_searchResultPictures_apercu">
                                                <img  style={{
                                                    position: "fixed",
                                                    right: '560px',
                                                    top: window.innerHeight /2 < this.state.yoffset ? `${this.state.yoffset -400}px` : `${this.state.yoffset -200}px`
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
                                        <button className={this.addBasketButtonClassNames(val.id)} onClick={() => this.props.addBasketPO(val)}><Message msgId={'photosObliques.addBasket'} /></button>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>}
                {this.props.searchResult.length != 0 && this.props.searchResult[0].provider != 'none' && 
                <div className="PO_resultLoaded"> {this.props.loading && <span className="PO_loadingMore"> <LoadingSpinner/></span>}
                    <span className="PO_numResultsLoaded"><Message msgId={'photosObliques.picturesLoaded'}/> : {this.props.searchResult.length} / {this.props.prevPhotoCount} </span>
                </div>}
            </>
        )
    };

    /**
     * addBasketButtonClassNames update css classes of addBasketButton for buttons already in basket
     * @memberof photosObliques.component
     * @returns - list of css classes
     */
    addBasketButtonClassNames(pictureId){
        let addBasketBtnClassNames = "btn-primary PO_customBtn PO_addBasketWidth";
        this.props.basket.map((item) => {
            if(item.id === pictureId){
                addBasketBtnClassNames += " PO_addedInBasket";
            }
        })
        return addBasketBtnClassNames;
    };

    /**
     * validateSection home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    validateSection(){
        return (
            <>
                {
                    this.props.filtersTriggered === true &&
                    <button className="btn-primary PO_customBtn" onClick={() => this.props.cancelSearchFiltersPO()}>
                        <Message msgId={'photosObliques.cancelSearch'}/>
                    </button>
                }
                <button className="btn-primary PO_customBtn" onClick={() => {this.props.validateSearchFiltersPO(true, loadTypesPO.NEW), this.props.searchValuesFilteredPO([])}}>
                    <Message msgId={'photosObliques.ValidateSearch'}/>
                </button>
                <span>{ this.props.photoCount } <Message msgId={'photosObliques.picturesAvailable'}/></span>
            </>
        )
    };

    /**
     * searchFilters home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    searchFilters() {
        return (
            <>
                <h3 className="PO_filterTitle"><Message msgId={'photosObliques.filterTitle'} /></h3>
                <p className="PO_filterSubTitles"><Message msgId={'photosObliques.filterYears'} /></p>
                <select id="PO_startDate" className="rw-input" onChange={(e) => this.props.selectStartDateValuePO(parseInt(e.target.value))} >
                    <option className="PO_dropdownMenu" value={0} key="start">{getMessageById(this.context.messages, 'photosObliques.defaultStartDateOption')}</option>
                    {
                        this.props.startDates.map((val) => {
                            if (val === parseInt(this.props.startDateValue)) {
                                return (<option className="PO_dropdownMenu" value={ val } selected key={ val }>{ val }</option>);
                            } else{
                                return (<option className="PO_dropdownMenu" value={ val } key={ val }>{ val }</option>);
                            }
                        })
                    }
                </select>
                <select id="PO_endDate" className="rw-input" onChange={(e) => this.props.selectEndDateValuePO(parseInt(e.target.value))} >
                    <option className="PO_dropdownMenu" value={0} key="end">{getMessageById(this.context.messages, 'photosObliques.defaultEndDateOption')}</option>
                    {
                        this.props.endDates.map((val) => {
                            if (val === parseInt(this.props.endDateValue)) {
                                return (<option className="PO_dropdownMenu" value={ val } selected key={ val }>{ val }</option>);
                            } else{
                                return (<option className="PO_dropdownMenu" value={ val } key={ val }>{ val }</option>);
                            }
                        })
                    }
                </select>
            </>
        )
    };

    /**
     * renderCompass home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    renderCompass() {
        return (
            <>
                {(this.props.roseValue !== -1 || this.props.startDateValue != 0 || this.props.endDateValue != 0) 
                    && <Glyphicon glyph="clear-filter" className="PO_deletionGlyph" onClick={() => this.props.clearFiltersPO()} />}
                <div className="PO_compassMainStyle">
                    <p className="PO_filterSubTitles"><Message msgId={'photosObliques.windRoseLabel'} /></p>
                    <div className="PO_compass">
                        <div className="PO_compass-main">
                        <span className="PO_north-label" style={this.props.roseValue === 0.1 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>N</span>
                        <span className="PO_dot PO_part2" style={this.props.roseValue === 22.5 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_dot PO_part3" style={this.props.roseValue === 45 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_dot PO_part4" style={this.props.roseValue === 67.5 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_east-label" style={this.props.roseValue === 90 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>E</span>
                        <span className="PO_dot PO_part6" style={this.props.roseValue === 112.5 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_dot PO_part7" style={this.props.roseValue === 135 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_dot PO_part8" style={this.props.roseValue === 157.5 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_south-label" style={this.props.roseValue === 180 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>S</span>
                        <span className="PO_dot PO_part10" style={this.props.roseValue === 202.5 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_dot PO_part11" style={this.props.roseValue === 225 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_dot PO_part12" style={this.props.roseValue === 247.5 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_west-label" style={this.props.roseValue === 270 ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}>W</span>
                        <span className="PO_dot PO_part14" style={this.props.roseValue === 292.5 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_dot PO_part15" style={this.props.roseValue === 315 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
                        <span className="PO_dot PO_part16" style={this.props.roseValue === 337.5 ? {"backgroundColor": "#444"} : {"backgroundColor": "#ddd"}}></span>
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
                                <li id="PO_part1" onClick={() => this.props.windRoseClickPO(0.1)}>
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
                                <div className={this.props.roseValue != -1 ? "PO_rotate2": "PO_rotate2 PO_rotate2Hidden"} style={this.props.roseValue != -1 ? {transform: "rotate(" + (this.props.roseValue - 80) + "deg)"} : {display: "none"} }>
                                    <div className={this.props.roseValue != -1 ? "PO_losangeSelected" : "PO_hideLosangeSelected"}></div>
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
    };

    /**
     * renderSelectionTab home tab content
     * @memberof photosObliques.component
     * @returns - dom of the home tab content
     */
    renderCartTab() {
        return (
            <div id="PHOTOSOBLIQUES_EXTENSION PHOTOSOBLIQUES_scrollBar">
                {!this.props.downloading && <div>
                    <div className="PO_basket_sort_position">
                        {this.props.itemCounterInBasket != 0 && <span className="PO_filterBasketValues">
                            {this.props.itemCounterInBasket} / {this.props.basket.length} <Message msgId={'photosObliques.pictureSelected'} />
                        </span>}
                        {this.props.itemCounterInBasket === 0 && <span></span>}
                        <span className="PO_basket_sort_position">
                            <span className="PO_bold PO_filterBasketValues"><Message msgId={'photosObliques.orderBy'} />: </span>
                            <select id="filterBasketValues" className="PO_filterValues PO_sortSearchedValues" onChange={() => this.props.filterBasketValuesPO(document.getElementById("filterBasketValues").value)}>
                                <option className="PO_dropdownMenu" value="-relevance">{getMessageById(this.context.messages, 'photosObliques.relevance')}</option>
                                <option className="PO_dropdownMenu" value="-year">{getMessageById(this.context.messages, 'photosObliques.yearTaken')}</option>
                                <option className="PO_dropdownMenu" value="-date">{getMessageById(this.context.messages, 'photosObliques.date')}</option>
                                <option className="PO_dropdownMenu" value="-owner">{getMessageById(this.context.messages, 'photosObliques.owner')}</option>
                                <option className="PO_dropdownMenu" value="-provider">{getMessageById(this.context.messages, 'photosObliques.provider')}</option>
                                <option className="PO_dropdownMenu" value="-fileSize">{getMessageById(this.context.messages, 'photosObliques.weight')}</option>
                            </select>
                        </span>
                    </div>
                    <div>
                        <div className="PO_basket_counter_position">
                            <Message msgId={'photosObliques.maxLimits'} /> {this.props.picturesInBasket} / {this.props.configs.pomaxcartnumberofpics} <Message msgId={'photosObliques.pictureAmount'} /> - {parseFloat(this.props.basketSize / 1000000).toFixed(1)} / {this.props.configs.pomaxcartsize  + " Mo"}
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
                                        <div className="PO_searchResultPictures_apercu PO_searchResultPicturesBasket_apercu">
                                            <img  style={{
                                                position: "fixed",
                                                right: '560px',
                                                top: window.innerHeight /2 < this.state.yoffset ? `${this.state.yoffset -450}px` : `${this.state.yoffset -200}px`
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
    };

    /**
     * countBasketSelectedElements renders the selection tabs to get all plugins sub parts
     * @memberof photosObliques.component
     * @returns - navbar like for the plugin
     */
    countBasketSelectedElements(){
        var counter = 0;
        this.props.basket.map((val) => {
            if (val.selected === true) {
                counter = counter +1;
            }
        })
        return counter;
    };

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
    };

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
    };

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
                                <button onClick={() => this.props.removeSelectedItemsInBasketPO(true)} className="btn-primary col-sm-3 PO_customBtn PO_button_margin_bottom"><Message msgId={'photosObliques.ok'} /></button>
                                <div className="col-sm-2"></div>
                                <button onClick={() => this.props.modalDisplayPO(false, '')} className="col-sm-3 btn-primary PO_customBtn PO_button_margin_bottom"><Message msgId={'photosObliques.cancel'} /></button>
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
                            <div className="PO_numberPicsToDwnld">{this.props.itemCounterInBasket != 0 ? this.props.itemCounterInBasket : this.props.basket.length} <Message msgId={'photosObliques.numberOfFilesDownloaded'}/></div>
                            <div className="row fileNameChoice">
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
                                <button onClick={() => {this.props.modalDisplayPO(true, 'iUnderstand'), this.props.saveDownloadFieldsPO(document.getElementById("fname").value,document.getElementById("pname").value)}} className="col-sm-3 btn-primary PO_customBtn PO_button_margin_bottom"><Message msgId={'photosObliques.ok'}/></button>
                                <div className="col-sm-2"></div>
                                <button onClick={() => this.props.modalDisplayPO(false, '')} className="col-sm-3 btn-primary PO_customBtn PO_button_margin_bottom"><Message msgId={'photosObliques.cancel'}/></button>
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
                                    <button onClick={() => {this.props.downloadBasketPO(), this.props.setDownloadingPO(true)}} className="btn-primary PO_customBtn PO_button_margin_bottom"><Message msgId={'photosObliques.understood'}/></button>
                                </div>
                                <div className="col-sm-4"></div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    };

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
    };

        /**
     * renderTabMenu renders the selection tabs to get all plkugins sub parts
     * @memberof photosObliques.component
     * @returns - navbar like for the plugin
     */
    renderTabMenu() {
        return (
            <div className="PO_masterclass row PHOTOSOBLIQUES_rowTabs">
                <div className="col-sm-6 PO_text-center">
                    <button className={this.props.activeTab === "PHOTOSOBLIQUES:SEARCH"
                        ? "PHOTOSOBLIQUES_SearchTabButton PHOTOSOBLIQUES_active"
                        : "PHOTOSOBLIQUES_SearchTabButton"} onClick={() => this.props.changeTabPO(tabTypesPO.SEARCH)}>
                        <Message msgId={'photosObliques.search'}/>
                    </button>
                </div>
                <div className="col-sm-6 PO_text-center">
                    {this.props.basket.length != 0 && <button className={this.props.activeTab === "PHOTOSOBLIQUES:CART"
                        ? "PHOTOSOBLIQUES_CartTabButton PHOTOSOBLIQUES_active"
                        : "PHOTOSOBLIQUES_CartTabButton"} onClick={() => this.props.changeTabPO(tabTypesPO.CART)}>
                        <Message msgId={'photosObliques.cart'}/><span className="nbPictInBasket"> ({this.props.basket.length}) </span>
                    </button>}
                    {this.props.basket.length === 0 && <button className={this.props.activeTab === "PHOTOSOBLIQUES:CART"
                        ? "PHOTOSOBLIQUES_CartTabButton PHOTOSOBLIQUES_active PO_greyed "
                        : "PHOTOSOBLIQUES_CartTabButton PO_greyed"} disabled>
                        <Message msgId={'photosObliques.cart'}/>
                    </button>}
                </div>
            </div>
        );
    };

        /**
     * renderContent organise which tab is active
     * @memberof photosObliques.component
     * @returns - tab dom content
     */
    renderContent = () => {
        var content;
        switch (this.props.activeTab) {
        case tabTypesPO.SEARCH:
            content = <div className="PO_masterclass">{this.renderSearchTab()}</div>
            break;
        case tabTypesPO.CART:
            content = <div className="PO_masterclass">{this.renderCartTab()}</div>
            break;
        default:
            break;
        }
        return content;
    };

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
    };
};
