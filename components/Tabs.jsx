import React from "react";
import Message from "@mapstore/components/I18N/Message";

const Tabs = (props) => {
    props = props.props;
    console.log(props);
    return (
        <div className="row RTGE_rowTabs">
            <div className="col-sm-6 text-center">
                <button className={props.activeTab === "PLUGIN:HOME"
                    ? "RTGE_homeButton RTGE_active"
                    : "RTGE_homeButton"} onClick={() => props.pluginChangeTab(props.tabTypes.HOME)}>
                    <Message msgId={'RTGE.welcome'}/>
                </button>
            </div>
            <div className="col-sm-6 text-center">
                <button className={props.activeTab === "PLUGIN:SELECT"
                    ? "RTGE_selectButton RTGE_active"
                    : "RTGE_selectButton"} onClick={() => props.pluginChangeTab(props.tabTypes.SELECT)}>
                    <Message msgId={'RTGE.selection'}/>
                </button>
            </div>
        </div>
    );
};

export default Tabs;
