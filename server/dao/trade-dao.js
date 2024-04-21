const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const tradeFolderPath = path.join(__dirname, "storage", "tradeList");

// Method to read a trade from a file
function get(tradeId) {
  try {
    const filePath = path.join(tradeFolderPath, `${tradeId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadTrade", message: error.message };
  }
}

// Method to write a trade to a file
function create(trade) {
  try {
    trade.id = crypto.randomBytes(16).toString("hex");

    if (trade.exitPrice) {
      if (trade.tradeType === 'long') {
        trade.profitLoss = (trade.exitPrice - trade.entryPrice) * trade.amount;
      } else {
        trade.profitLoss = (trade.entryPrice - trade.exitPrice) * trade.amount;
      }
    }

    const filePath = path.join(tradeFolderPath, `${trade.id}.json`);
    const fileData = JSON.stringify(trade);
    fs.writeFileSync(filePath, fileData, "utf8");
    return trade;
  } catch (error) {
    throw { code: "failedToCreateTrade", message: error.message };
  }
}

// Method to update trade in a file
function update(trade) {
  try {
    const currenttrade = get(trade.id);
    if (!currenttrade) return null;
    const newtrade = { ...currenttrade, ...trade };

    if (newtrade.exitPrice) {
      if (newtrade.tradeType === 'long') {
        newtrade.profitLoss = (newtrade.exitPrice - newtrade.entryPrice) * newtrade.amount;
      } else {
        newtrade.profitLoss = (newtrade.entryPrice - newtrade.exitPrice) * newtrade.amount;
      }
    }

    const filePath = path.join(tradeFolderPath, `${trade.id}.json`);
    const fileData = JSON.stringify(newtrade);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newtrade;
  } catch (error) {
    throw { code: "failedToUpdateTrade", message: error.message };
  }
}

// Method to remove a trade from a file
function remove(tradeId) {
  try {
    const filePath = path.join(tradeFolderPath, `${tradeId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveTrade", message: error.message };
  }
}

// Method to list trades in a folder
function list() {
  try {
    const files = fs.readdirSync(tradeFolderPath);
    const tradeList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(tradeFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    tradeList.sort((a, b) => new Date(a.entryDateTime) - new Date(b.entryDateTime));
    return tradeList;
  } catch (error) {
    throw { code: "failedToListTrades", message: error.message };
  }
}

// get all trades by strategy id
function listByStrategy(strategyId) {
  try {
    const files = fs.readdirSync(tradeFolderPath);

    let tradeList = files.map((file) => {
      const fileData = fs.readFileSync(
          path.join(tradeFolderPath, file),
          "utf8"
      );
      return JSON.parse(fileData);
    });

    // Filter trades by strategyId
    tradeList = tradeList.filter(trade => trade.strategyId === strategyId);

    tradeList.sort((a, b) => new Date(a.entryDateTime) - new Date(b.entryDateTime));
    return tradeList;
  } catch (error) {
    throw { code: "failedToListTrades", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  listByStrategy,
};
