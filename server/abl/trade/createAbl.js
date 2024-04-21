const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const tradeDao = require("../../dao/trade-dao.js");

const schema = {
  type: "object",
  properties: {
    ticker: { type: "string", minLength: 1 },
    strategyId: { type: "string", minLength: 32, maxLength: 32 },
    tradeType: { type: "string", enum: ["long", "short"] },
    amount: { type: "number" },
    entryDateTime: { type: "string", format: "date-time" },
    entryPrice: { type: "number" },
    exitDateTime: { type: "string", format: "date-time" },
    exitPrice: { type: "number" },
    profitLoss: { type: "number" },
    notes: { type: "string" },
  },
  required: ["ticker", "strategyId", "tradeType", "amount", "entryDateTime", "entryPrice"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
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

    trade = tradeDao.create(trade);
    res.json(trade);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
