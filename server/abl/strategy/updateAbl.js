const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const strategyDao = require("../../dao/strategy-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    name: { type: "string", minLength: 3 },
    entryStrategy: { type: "string" },
    exitStrategy: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let strategy = req.body;

    // validate input
    const valid = ajv.validate(schema, strategy);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const updatedStrategy = strategyDao.update(strategy);
    if (!updatedStrategy) {
      res.status(404).json({
        code: "strategyNotFound",
        message: `Strategy ${strategy.id} not found`,
      });
      return;
    }

    res.json(updatedStrategy);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
