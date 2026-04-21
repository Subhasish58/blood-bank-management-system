const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getDonorsListController,
    getHospitalListController,
    getOrgListController,
    deleteDonorController,
    getEntityAnalyticsController,
} = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");

//router objectMore actions
const router = express.Router();

//Routes

//GET || DONOR LIST
router.get(
    "/donor-list",
    authMiddleware,
    adminMiddleware,
    getDonorsListController
);
//GET || HOSPITAL LIST
router.get(
    "/hospital-list",
    authMiddleware,
    adminMiddleware,
    getHospitalListController
);
//GET || ORG LIST
router.get("/org-list", authMiddleware, adminMiddleware, getOrgListController);
// ==========================

// DELETE DONOR || GET
router.delete(
    "/delete/:id",
    authMiddleware,
    adminMiddleware,
    deleteDonorController
);

//GET || ENTITY ANALYTICS (org or hospital)
router.get(
    "/entity-analytics",
    authMiddleware,
    adminMiddleware,
    getEntityAnalyticsController
);

//EXPORT
module.exports = router;