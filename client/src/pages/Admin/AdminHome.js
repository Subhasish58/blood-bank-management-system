import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";

const AdminHome = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <Layout>
            <div className="container mt-5">
                <div className="card shadow p-4">
                    <div className="card-body">
                        <h1 className="text-primary mb-3">
                            Welcome admin <span className="text-success">{user?.name}</span>
                        </h1>
                        <h4 className="text-muted mb-4">Manage Blood Bank App</h4>
                        <hr />
                        <p className="lead">
                            Thank you for helping us maintain the vital network of blood donors, hospitals, and
                            organizations. Your role is essential in ensuring that the right help reaches the right
                            place at the right time.
                        </p>
                        <ul className="list-group list-group-flush mb-3">
                            <li className="list-group-item">🩸 Monitor and manage blood inventory</li>
                            <li className="list-group-item">✅ Review and verify donor, hospital, and organization records</li>
                            <li className="list-group-item">📊 Track recent transactions and activity logs</li>
                            <li className="list-group-item">⚙️ Ensure smooth and efficient platform operations</li>
                        </ul>
                        <p className="fw-semibold text-dark">
                            Let’s make an impact — one unit at a time. <span className="text-danger">🩸</span>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminHome;
