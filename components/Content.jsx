import React from "react";
import Message from "@mapstore/components/I18N/Message";
import HomeComponent from "../components/Home";
import SelectComponent from "../components/Select";

const Content = (props) => {
    props = props.props;
    // console.log(props);
    var content;

    switch (props.activeTab) {
        case props.tabTypes.HOME:
            content = <HomeComponent props={props} />
            break;
        case props.tabTypes.SELECT:
            content = <SelectComponent props={props} />    
            break;
        default:
            break;
    }
    return content;
};

export default Content;