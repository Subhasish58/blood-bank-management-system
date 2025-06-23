import React, { useState, useEffect } from "react";
import Header from "../../components/shared/Layout/Header";
import API from "./../../services/API";
import moment from "moment";

const Analytics = () => {
    const [data, setData] = useState([]);
    const [inventoryData, setInventoryData] = useState([]);
    const colors = [
        "#884A39",
        "#C38154",
        "#FFC26F",
        "#4F709C",
        "#4942E4",
        "#0079FF",
        "#FF0060",
        "#22A699",
    ];
    //GET BLOOD GROUP DATA
    const getBloodGroupData = async () => {
        try {
            const { data } = await API.get("/analytics/bloodGroups-data");
            if (data?.success) {
                setData(data?.bloodGroupData);
                // console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //lifrecycle method
    useEffect(() => {
        getBloodGroupData();
    }, []);

    //get function
    const getBloodRecords = async () => {
        try {
            const { data } = await API.get("/inventory/get-recent-inventory");
            if (data?.success) {
                setInventoryData(data?.inventory);
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBloodRecords();
    }, []);
    return (
        <>
            <Header />
            <div className="d-flex flex-row flex-wrap">
                {data?.map((record, i) => (
                    <div
                        className="card m-2 p-1"
                        key={i}
                        style={{ width: "18rem", backgroundColor: `${colors[i]}` }}
                    >
                        <div className="card-body">
                            <h1 className="card-title bg-light text-dark text-center mb-3">
                                {record.bloodGroup}
                            </h1>
                            <p className="card-text">
                                Total In : <b>{record.totalIn}</b> (ML)
                            </p>
                            <p className="card-text">
                                Total Out : <b>{record.totalOut}</b> (ML)
                            </p>
                        </div>
                        <div className="card-footer text-light bg-dark text-center">
                            Total Available : <b>{record.availabeBlood}</b> (ML)
                        </div>
                    </div>
                ))}
            </div>
            <div className="container my-4">
                <h2 className="text-primary border-bottom pb-2">Recent Blood Transactions</h2>
                <div className="table-responsive mt-3">
                    <table className="table table-hover table-bordered table-striped shadow-sm">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>Blood Group</th>
                                <th>Inventory Type</th>
                                <th>Quantity</th>
                                <th>Donor Email</th>
                                <th>Time & Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-center align-middle">
                            {inventoryData?.map((record) => (
                                <tr key={record._id}>
                                    <td><b>{record.bloodGroup}</b></td>
                                    <td>
                                        <span className={`badge ${record.inventoryType === "in" ? "bg-success" : "bg-danger"}`}>
                                            {record.inventoryType.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{record.quantity} (ML)</td>
                                    <td>{record.email || <i className="text-muted">N/A</i>}</td>
                                    <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
};

export default Analytics;