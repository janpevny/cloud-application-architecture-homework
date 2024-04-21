const tradeDao = require("../../dao/trade-dao.js");

async function ListAbl(req, res) {
  try {
    const tradeList = tradeDao.list();

    res.json(tradeList);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
