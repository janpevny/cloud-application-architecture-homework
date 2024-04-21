const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const tradeDao = require("../../dao/trade-dao.js");

const schema = {
  type: "object",
  properties: {
    strategyId: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["strategyId"],
  additionalProperties: false,
};

async function ListByStrategyAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.strategyId ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const tradeList = tradeDao.listByStrategy(reqParams.strategyId);

    res.json(tradeList);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListByStrategyAbl;
