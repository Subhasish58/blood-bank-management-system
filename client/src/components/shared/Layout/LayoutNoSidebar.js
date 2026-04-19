import React from "react";
import Header from "./Header";

const LayoutNoSidebar = ({ children }) => {
    return (
        <>
            <div className="header">
                <Header />
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LayoutNoSidebar;
