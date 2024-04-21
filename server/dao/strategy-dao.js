const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const strategyFolderPath = path.join(__dirname, "storage", "strategyList");

// Method to read a strategy from a file
function get(strategyId) {
  try {
    const filePath = path.join(strategyFolderPath, `${strategyId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadStrategy", message: error.message };
  }
}

// Method to write a strategy to a file
function create(strategy) {
  try {
    strategy.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(strategyFolderPath, `${strategy.id}.json`);
    const fileData = JSON.stringify(strategy);
    fs.writeFileSync(filePath, fileData, "utf8");
    return strategy;
  } catch (error) {
    throw { code: "failedToCreateStrategy", message: error.message };
  }
}

// Method to update strategy in a file
function update(strategy) {
  try {
    const currentStrategy = get(strategy.id);
    if (!currentStrategy) return null;
    const newStrategy = { ...currentStrategy, ...strategy };
    const filePath = path.join(strategyFolderPath, `${strategy.id}.json`);
    const fileData = JSON.stringify(newStrategy);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newStrategy;
  } catch (error) {
    throw { code: "failedToUpdateStrategy", message: error.message };
  }
}

// Method to remove a strategy from a file
function remove(strategyId) {
  try {
    const filePath = path.join(strategyFolderPath, `${strategyId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveStrategy", message: error.message };
  }
}

// Method to list strategies in a folder
function list() {
  try {
    const files = fs.readdirSync(strategyFolderPath);
    const strategyList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(strategyFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    strategyList.sort((a, b) => new Date(a.name) - new Date(b.name));
    return strategyList;
  } catch (error) {
    throw { code: "failedToListStrategies", message: error.message };
  }
}


module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
