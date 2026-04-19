import moment from "moment";
import React, { useEffect, useState } from "react";
import Layout from "../components/shared/Layout/Layout";
import API from "../services/API";
import { useSelector } from "react-redux";

const Donation = () => {
    const { user } = useSelector((state) => state.auth);
    const [data, setData] = useState([]);
    //find donor/hospital records
    const getRecords = async () => {
        try {
            if (user?.role === "donor") {
                const { data } = await API.post("/inventory/get-inventory-hospital", {
                    filters: {
                        inventoryType: "in",
                        donor: user?._id,
                    },
                });
                if (data?.success) {
                    setData(data?.inventory);
                }
            } else if (user?.role === "hospital") {
                const { data } = await API.post("/inventory/get-inventory-hospital", {
                    filters: {
                        inventoryType: "out",
                        hospital: user?._id,
                    },
                });
                if (data?.success) {
                    setData(data?.inventory);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getRecords();
    }, [user]);

    return (
        <Layout>
            <div className="container mt-4">
                <h4 className="mb-4">
                    {user?.role === "donor" ? "My Donation History" : "Blood Received from Organisations"}
                </h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Blood Group</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">{user?.role === "donor" ? "Donated To" : "Received From"}</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((record) => (
                            <tr key={record._id}>
                                <td>{record.bloodGroup}</td>
                                <td>{record.quantity} ML</td>
                                <td>
                                    {user?.role === "donor"
                                        ? record.organisation?.organisationName || record.organisation?.name || "N/A"
                                        : record.organisation?.organisationName || record.organisation?.name || "N/A"
                                    }
                                </td>
                                <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Donation;