const express = require("express");
const path = require("path");
const flash = require("express-flash");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const moment = require("moment");
const { Server } = require("socket.io");
const { createServer } = require("http");
require("dotenv").config();

const database = require("./config/database");
database.connect();

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const systemAdmin = require("./config/system");

const app = express();
const port = process.env.PORT || 3000;

// SocketIO
const server = createServer(app);
const io = new Server(server);
global._io = io;

// Flash Message
app.use(cookieParser('UHSDFWAEFVPOQIWRBV'));
app.use(expressSession({ cookie: { maxAge: 60000 }}));
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// App Locals Variables
app.locals.prefixAdmin = systemAdmin.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

// Routes
routeAdmin(app);
route(app);
app.get("*", (req, res) => {
  res.render("client/pages/errors/404-not-found", {
    titlePage: "404 NOT FOUND"
  })
})

server.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
