import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../components/shared/Spinner";
import Layout from "../components/shared/Layout/Layout";
import LayoutNoSidebar from "../components/shared/Layout/LayoutNoSidebar";
import Modal from "../components/shared/modal/Modal";
import API from "../services/API";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const { loading, error, user } = useSelector((state) => state.auth);
    const [data, setData] = useState([]);
    const [donorData, setDonorData] = useState([]);
    const navigate = useNavigate();

    //get function for org/hospital/admin
    const getBloodRecords = async () => {
        try {
            const { data } = await API.get("/inventory/get-inventory");
            if (data?.success) {
                setData(data?.inventory);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //get donor records for donation history
    const getDonorRecords = async () => {
        try {
            const { data } = await API.post("/inventory/get-inventory-hospital", {
                filters: {
                    inventoryType: "in",
                    donor: user?._id,
                },
            });
            if (data?.success) {
                setDonorData(data?.inventory);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user?.role !== "donor") {
            getBloodRecords();
        }
        if (user?.role === "donor") {
            getDonorRecords();
        }
    }, [user]);

    useEffect(() => {
        if (user?.role === "admin") {
            navigate("/admin");
        }
    }, [user, navigate]);

    // For donors - show donation history directly on homepage (no sidebar)
    if (user?.role === "donor") {
        return (
            <LayoutNoSidebar>
                {loading ? (
                    <Spinner />
                ) : (
                    <div className="container mt-4">
                        <h4 className="mb-4">My Donation History</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Blood Group</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Donated To</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donorData?.map((record) => (
                                    <tr key={record._id}>
                                        <td>{record.bloodGroup}</td>
                                        <td>{record.quantity} ML</td>
                                        <td>
                                            {record.organisation?.hospitalName || record.organisation?.organisationName || "N/A"}
                                        </td>
                                        <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </LayoutNoSidebar>
        );
    }

    // For org/hospital/admin - show inventory page with sidebar
    return (
        <Layout>
            {error && <span>{alert(error)}</span>}
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="container">
                        <h4
                            className="ms-4"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop"
                            style={{ cursor: "pointer" }}
                        >
                            <i className="fa-solid fa-plus text-success py-4"></i>
                            Add Inventory
                        </h4>
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th scope="col">Blood Group</th>
                                    <th scope="col">Inventory Type</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">{user?.role === "hospital" ? "From" : "Donor Email"}</th>
                                    <th scope="col">TIme & Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((record) => (
                                    <tr key={record._id}>
                                        <td>{record.bloodGroup}</td>
                                        <td>{record.inventoryType}</td>
                                        <td>{record.quantity} (ML)</td>
                                        <td>{record.email}</td>
                                        <td>
                                            {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Modal />
                    </div>
                </>
            )}
        </Layout>
    );
};

export default HomePage;