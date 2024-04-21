const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/trade/getAbl");
const ListAbl = require("../abl/trade/listAbl");
const ListByStrategy = require("../abl/trade/listByStrategyAbl");
const CreateAbl = require("../abl/trade/createAbl");
const UpdateAbl = require("../abl/trade/updateAbl");
const DeleteAbl = require("../abl/trade/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.get("/list-by-strategy", ListByStrategy);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
