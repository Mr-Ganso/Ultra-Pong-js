const express = require("express"),
app = express(),
onlineRouter = require("./routes/online"),
path = require("path")

app.set('views', path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, 'public')))

app.get("/local", (req, res) => {res.render("Local Game")})

app.get("/online", (req, res) => {res.render("Online Game")})

app.listen(7777)