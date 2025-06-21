const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createInventoryController, getInventoryController, getDonorsController, getHospitalController } = require("../controllers/inventoryController");

const router = express.Router();

router.post("/create-inventory", authMiddleware, createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddleware, getInventoryController);

//GET DONAR RECORDS
router.get("/get-donors", authMiddleware, getDonorsController);

router.get("/get-hospitals", authMiddleware, getHospitalController);

module.exports = router;