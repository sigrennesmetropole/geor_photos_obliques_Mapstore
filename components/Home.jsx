import React from "react";
import Message from "@mapstore/components/I18N/Message";

const Home = (props) => {
    props = props.props;
    console.log(props);
    return (
        <>
            <div className="col-sm-6">
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
            </div>
            <div className="col-sm-6">
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
                            <li id="part1" onClick={() => props.windRoseClick(1)}>
                                <div class="text">1</div>
                            </li>
                            <li id="part2" onClick={() => props.windRoseClick(2)}>
                                <div class="text">2</div>
                            </li>
                            <li id="part3" onClick={() => props.windRoseClick(3)}>
                                <div class="text">3</div>
                            </li>
                            <li id="part4" onClick={() => props.windRoseClick(4)}>
                                <div class="text">4</div>
                            </li>
                            <li id="part5" onClick={() => props.windRoseClick(5)}>
                                <div class="text">5</div>
                            </li>
                            <li id="part6" onClick={() => props.windRoseClick(6)}>
                                <div class="text">6</div>
                            </li>
                            <li id="part7" onClick={() => props.windRoseClick(7)}>
                                <div class="text">7</div>
                            </li>
                            <li id="part8" onClick={() => props.windRoseClick(8)}>
                                <div class="text">8</div>
                            </li>
                            <li id="part9" onClick={() => props.windRoseClick(9)}>
                                <div class="text">9</div>
                            </li>
                            <li id="part10" onClick={() => props.windRoseClick(10)}>
                                <div class="text">10</div>
                            </li>
                            <li id="part11" onClick={() => props.windRoseClick(11)}>
                                <div class="text">11</div>
                            </li>
                            <li id="part12" onClick={() => props.windRoseClick(12)}>
                                <div class="text">12</div>
                            </li>
                            <li id="part13" onClick={() => props.windRoseClick(13)}>
                                <div class="text">13</div>
                            </li>
                            <li id="part14" onClick={() => props.windRoseClick(14)}>
                                <div class="text">14</div>
                            </li>
                            <li id="part15" onClick={() => props.windRoseClick(15)}>
                                <div class="text">15</div>
                            </li>
                            <li id="part16" onClick={() => props.windRoseClick(16)}>
                                <div class="text">16</div>
                            </li>

                            <div class="testrotate">
                                <div class="losange"></div>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="row validateForm">
                <button onClick={() => props.validateSearchFilters()}>
                    <Message msgId={'PLUGIN.ValidateSearch'}/>
                </button>
                <span>XXX Photos disponibles</span>
            </div>
        </>
    );
};

export default Home;