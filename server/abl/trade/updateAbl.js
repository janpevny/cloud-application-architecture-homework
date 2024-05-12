const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const tradeDao = require("../../dao/trade-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    ticker: { type: "string", minLength: 1 },
    strategyId: { type: "string", minLength: 32, maxLength: 32 },
    tradeType: { type: "string", enum: ["long", "short"] },
    amount: { type: "number" },
    entryDateTime: { type: "string" },
    entryPrice: { type: "number" },
    exitDateTime: { type: "string" },
    exitPrice: { type: "number" },
    profitLoss: { },
    notes: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let trade = req.body;

    // validate input
    const valid = ajv.validate(schema, trade);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const updatedTrade = tradeDao.update(trade);
    if (!updatedTrade) {
      res.status(404).json({
        code: "tradeNotFound",
        message: `Trade ${trade.id} not found`,
      });
      return;
    }

    res.json(updatedTrade);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
