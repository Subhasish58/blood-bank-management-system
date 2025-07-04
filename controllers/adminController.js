const userModel = require("../models/userModel");

//GET DONOR LIST
const getDonorsListController = async (req, res) => {
    try {
        const donorData = await userModel
            .find({ role: "donor" })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Toatlcount: donorData.length,
            message: "Donar List Fetched Successfully",
            donorData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Donor List API",
            error,
        });
    }
};
//GET HOSPITAL LIST
const getHospitalListController = async (req, res) => {
    try {
        const hospitalData = await userModel
            .find({ role: "hospital" })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Toatlcount: hospitalData.length,
            message: "HOSPITAL List Fetched Successfully",
            hospitalData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Hospital List API",
            error,
        });
    }
};
//GET ORG LIST
const getOrgListController = async (req, res) => {
    try {
        const orgData = await userModel
            .find({ role: "organisation" })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Toatlcount: orgData.length,
            message: "ORG List Fetched Successfully",
            orgData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In ORG List API",
            error,
        });
    }
};
// =======================================

//DELETE DONOR
const deleteDonorController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: " Record Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting ",
            error,
        });
    }
};

//EXPORT
module.exports = {
    getDonorsListController,
    getHospitalListController,
    getOrgListController,
    deleteDonorController,
};