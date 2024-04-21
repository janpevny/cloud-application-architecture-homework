const strategyDao = require("../../dao/strategy-dao.js");

async function ListAbl(req, res) {
  try {
    const strategyList = strategyDao.list();

    res.json(strategyList);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
