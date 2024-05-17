import React from "react";
import Message from "@mapstore/components/I18N/Message";
import TabsComponent from "../components/Tabs";
import ContentComponent from "../components/Content";

const Extension = (props) => {
    // console.log(props);
    return (
        <div id="SAMPLE_EXTENSION" >
        {/* <TabsComponent activeTab='props.activeTab' tabTypes='props.tabTypes' pluginChangeTab='props.pluginChangeTab' /> */}
            <TabsComponent props={props} />
            <ContentComponent props={props} />
        </div>
    );
};

export default Extension;
