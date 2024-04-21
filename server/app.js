const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

const eventController = require("./controller/event");
const strategyController = require("./controller/strategy");
const tradeController = require("./controller/trade");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/event", eventController);
app.use("/strategy", strategyController);
app.use("/trade", tradeController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
