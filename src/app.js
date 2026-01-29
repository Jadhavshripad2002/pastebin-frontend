const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const pasteRoutes = require("./routes/paste.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();


app.use(express.json());   
app.use(cors());

app.use("/api/healthz", healthRoutes);
app.use("/api/pastes", pasteRoutes);
app.use("/p", pasteRoutes);

app.use(errorHandler);

module.exports = app;
