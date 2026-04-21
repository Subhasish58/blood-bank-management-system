const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");
//GET BLOOD DATA
const bloodGroupDetailsContoller = async (req, res) => {
    try {
        const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
        const bloodGroupData = [];
        const organisation = new mongoose.Types.ObjectId(req.userId);
        //get single blood group
        await Promise.all(
            bloodGroups.map(async (bloodGroup) => {
                //COunt TOTAL IN
                const totalIn = await inventoryModel.aggregate([
                    {
                        $match: {
                            bloodGroup: bloodGroup,
                            inventoryType: "in",
                            organisation,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$quantity" },
                        },
                    },
                ]);
                //Count TOTAL OUT
                const totalOut = await inventoryModel.aggregate([
                    {
                        $match: {
                            bloodGroup: bloodGroup,
                            inventoryType: "out",
                            organisation,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$quantity" },
                        },
                    },
                ]);
                //CALCULATE TOTAL
                const availabeBlood =
                    (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

                //PUSH DATA
                bloodGroupData.push({
                    bloodGroup,
                    totalIn: totalIn[0]?.total || 0,
                    totalOut: totalOut[0]?.total || 0,
                    availabeBlood,
                });
            })
        );

        return res.status(200).send({
            success: true,
            message: "Blood Group Data Fetch Successfully",
            bloodGroupData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Bloodgroup Data Analytics API",
            error,
        });
    }
};

//GET BLOOD DATA FOR HOSPITAL
const bloodGroupDetailsHospitalContoller = async (req, res) => {
    try {
        const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
        const bloodGroupData = [];
        const hospital = new mongoose.Types.ObjectId(req.userId);
        //get single blood group
        await Promise.all(
            bloodGroups.map(async (bloodGroup) => {
                //Count TOTAL IN: blood received from donors (inventoryType "in", organisation = hospital)
                // + blood received from other hospitals (inventoryType "out", hospital = this hospital, organisation != this hospital)
                const totalInResult = await inventoryModel.aggregate([
                    {
                        $match: {
                            $or: [
                                { inventoryType: "in", organisation: hospital, bloodGroup: bloodGroup },
                                { inventoryType: "out", hospital: hospital, organisation: { $ne: hospital }, bloodGroup: bloodGroup },
                            ],
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$quantity" },
                        },
                    },
                ]);
                //Count TOTAL OUT: blood given to consumers (inventoryType "out", organisation = hospital, hospital = hospital)
                // + blood given to other hospitals (inventoryType "out", sender = hospital OR sender=null, organisation=hospital, hospital != hospital)
                const totalOutResult = await inventoryModel.aggregate([
                    {
                        $match: {
                            $or: [
                                // Hospital-to-consumer: organisation = hospital, hospital = hospital
                                { inventoryType: "out", organisation: hospital, hospital: hospital, bloodGroup: bloodGroup },
                                // Hospital-to-hospital (old records): sender=null, organisation=hospital, hospital != hospital
                                { inventoryType: "out", sender: null, organisation: hospital, hospital: { $ne: hospital }, bloodGroup: bloodGroup },
                                // Hospital-to-hospital (new records): sender = hospital
                                { inventoryType: "out", sender: hospital, bloodGroup: bloodGroup },
                            ],
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$quantity" },
                        },
                    },
                ]);
                const totalIn = totalInResult[0]?.total || 0;
                const totalOut = totalOutResult[0]?.total || 0;
                const availabeBlood = totalIn - totalOut;

                bloodGroupData.push({
                    bloodGroup,
                    totalIn,
                    totalOut,
                    availabeBlood,
                });
            })
        );

        return res.status(200).send({
            success: true,
            message: "Blood Group Data Fetch Successfully",
            bloodGroupData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Bloodgroup Data Analytics API",
            error,
        });
    }
};

module.exports = { bloodGroupDetailsContoller, bloodGroupDetailsHospitalContoller };