const express = require("express");
const app = express();
const routes = require("./routers/route");
const PORT = 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
  res.send("Final Project 2 Kelompok 10");
});

app.listen(PORT, () => {
  console.log('running on PORT ${PORT}')
})
module.exports = app;
