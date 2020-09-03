require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var passport = require("passport");
var flash = require("connect-flash");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var store = new MongoDBStore({
    uri:
        "mongodb+srv://tuanpham31798:" +
        process.env.MONGODB_ATLS_PW +
        "@tuanpham31798-zt6uf.mongodb.net/" +
        process.env.MONGODB_ATLS_DATABASE +
        "?retryWrites=true&w=majority",
    collection: "sessions"
});

app.use(
    session({
        secret: "TuanPham",
        resave: true,
        key: "user",
        saveUninitialized: true,
        store: store,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require("./config/passport.js")(passport);
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

require("./routes/admin.js")(app, passport);

mongoose.promise = global.Promise;
mongoose.connect(
    "mongodb+srv://tuanpham31798:" +
    process.env.MONGODB_ATLS_PW +
    "@tuanpham31798-zt6uf.mongodb.net/" +
    process.env.MONGODB_ATLS_DATABASE +
    "?retryWrites=true&w=majority",
    {
        keepAlive: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
const connection = mongoose.connection;
connection.once("open", () =>
    console.log("MongoDB --  Kết nối cơ sở dữ liệu thành công!")
);
connection.on("error", (err) => {
    console.log(
        "MongoDB lỗi kết nối. Hãy đảm bảo rằng mongodb đang chạy. " + err
    );
    process.exit();
});
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
