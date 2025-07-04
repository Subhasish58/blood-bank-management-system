const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createInventoryController, getInventoryController, getDonorsController, getHospitalController,
    getOrganisationController,
    getOrganisationForHospitalController,
    getInventoryHospitalController,
    getRecentInventoryController,
} = require("../controllers/inventoryController");

const router = express.Router();

router.post("/create-inventory", authMiddleware, createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddleware, getInventoryController);

//GET DONAR RECORDS
router.get("/get-donors", authMiddleware, getDonorsController);

router.get("/get-hospitals", authMiddleware, getHospitalController);

router.get("/get-organisation", authMiddleware, getOrganisationController);

router.get(
    "/get-recent-inventory",
    authMiddleware,
    getRecentInventoryController
);

router.get(
    "/get-organisation-for-hospital",
    authMiddleware,
    getOrganisationForHospitalController
);

//GET HOSPITAL BLOOD RECORDSMore actions
router.post(
    "/get-inventory-hospital",
    authMiddleware,
    getInventoryHospitalController
);
module.exports = router;