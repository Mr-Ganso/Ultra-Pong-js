const { stringify } = require("querystring")

//modules
const express = require("express"),
app = express(),
server = require("http").createServer(app),
{Server} = require("socket.io"),
io = new Server(server),
onlineRouter = require("./routes/online")(io)

//actual code
app.set('views', "./client/views")
app.set("view engine", "ejs")
app.use(express.static("./client/public"))
app.use(express.json())

app.route("/")
.get((req, res) => {res.render("Home Page")})
.post((req, res) => {
    try {
        console.log("Redirecting to /" + req.body.submit.toLowerCase())
        res.redirect('/' + req.body.submit.toLowerCase())
    } catch (err) {
        console.log(err)
    }
})

app.get("/local", (req, res) => {res.render("Local Game")})

app.use("/online", onlineRouter)



server.listen(7777)