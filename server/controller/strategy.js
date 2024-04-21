const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/strategy/getAbl");
const ListAbl = require("../abl/strategy/listAbl");
const CreateAbl = require("../abl/strategy/createAbl");
const UpdateAbl = require("../abl/strategy/updateAbl");
const DeleteAbl = require("../abl/strategy/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
