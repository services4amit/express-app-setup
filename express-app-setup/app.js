var createError = require("http-errors");
var express = require("express");
var compression = require("compression");
const helmet = require("helmet");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const AppError = require("./appError");
const errorHandler = require("./errorHandler");
const mw = require("./my-middleware");

process.env.NODE_ENV = process.env.environment || "PROD";

// Mongo connection started
var mongoconnect = () => {
  if (envVar != "local") {
    var options = {
      user:
        process.env.MONGODB_USER ||
        configFile[envVar].dev.marmaduke_conn_details.user_name,
      pass:
        utilities.decodeSpecialChars(process.env.MONGODB_PWD) ||
        configFile[envVar].dev.marmaduke_conn_details.password,
      authMechanism: "PLAIN",
      sslValidate: false,
      ssl: true,
      authSource: "$external",
      useNewUrlParser: true,
      reconnectTries: 3,
      reconnectInterval: 1000,
    };

    var uri =
      process.env.MONGODB_URL ||
      configFile[envVar].marmaduke_conn_details.mongo_db_url;

    mongoose.connect(uri, options, (err, client) => {
      logger.info("mongodb url: " + uri);
      if (err) {
        return logger.error(err, 400, fileOwner);
      }
      logger.info("connected to MongoDB", fileOwner);
    });
  } else {
    const options = {
      useNewUrlParser: true,
      reconnectTries: 3,
      reconnectInterval: 1000,
    };
    mongoose.connect(
      configFile[envVar].marmaduke_conn_details.mongo_db_url,
      options,
      (err, client) => {
        if (err) {
          return logger.error(err, 400, fileOwner);
        }
        logger.info("connected to MongoDB", fileOwner);
      }
    );
  }
};

mongoconnect();

mongoose.connection.on("connected", () => {
  logger.info("MongoDB connected", fileOwner);
});

mongoose.connection.on("disconnected", () => {
  mongoconnect();
  logger.info("MongoDB connection lost", fileOwner);
});

mongoose.connection.on("reconnect", () => {
  logger.info("MongoDB reconnected", fileOwner);
});

// Mongo connection ended

//Middleware started

//Routing and app wise middlewares
//Choose res.render() or res.json()
//res.render()-- server side rendering
//res.json()-- client side rendering
//res.download()-- to download the file

//res.render()-- server side rendering--
//view engines like pug/Jade
// We will give 2 things to res.render() 1. view name and data in view
//app.set() used to set view engine app.set('view engine',ejs) & app.set('views',path)
// Need to set the path of folder where views are present app.set('views',path.join(__dirname,'myViews'))
// res.render("index")

// HEADERS already sent ,we can check like if(!res.headersSent) for handling this
var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// //Access-control-allow-origin
// app.use(cors());

// //allow from auto.com
// app.use(cors({
//     origin:'https://www.auto.com'
// }))
// app.options('*',cors());

// For code compression
app.use(compression());

// For security
app.use(helmet());
// This disables the `contentSecurityPolicy` middleware but keeps the rest.
// app.use(
//     helmet({
//       contentSecurityPolicy: false,
//     })
//   );

// view engine setup start
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.static(path.join(__dirname, "public")));

// view engine setup end

// Middleware methods start
function loginRequest(req, res, next) {
  console.log("inside login middleware");
  let obj = {
    a: "aa",
  };
  res.locals.obj = obj;
  next();
}

function logoutRequest(req, res, next) {
  console.log("inside logout middleware");
}

function mwArr1(req, res, next) {
  console.log("inside middleware Array1");
  next();
}

function mwArr2(req, res, next) {
  console.log("inside middleware Array2");
  next();
}

// Middleware methods end

// Adding Middleware start----------
app.use("/api", loginRequest);

// Adding array of middlewares
app.use("/api", [mwArr1, mwArr2]);

// Adding middlewares from another file with cond
app.use("/api", mw({ option1: "", option2: "sdsds" }));

// Adding series of middlewares
app.use(
  "/api",
  (req, res, next) => {
    console.log("series 1");
    next();
  },
  (req, res, next) => {
    console.log("series 2");
    next();
  }
);

// Routes
app.use("/api", usersRouter);

app.use("/api", logoutRequest);

// If invalid routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl}`));
});

// Error handler MW
app.use(errorHandler);

// Adding Middleware start----------

module.exports = app;

// Process managers
// Restart the app automatically if it crashes.
// Gain insights into runtime performance and resource consumption.
// Modify settings dynamically to improve performance.
// Control clustering.
// Like PM2

// Production Best Practices: Security
// 1. Don’t use deprecated or vulnerable versions of Express
// 2. USE SSL insted of TLS
// 3.Use Helmet
// 4.Prevent brute-force attacks against authorization
// A simple and powerful technique is to block authorization attempts using two metrics:
// The first is number of consecutive failed attempts by the same user name and IP address.
// The second is number of failed attempts from an IP address over some long period of time. For example, block an IP address if it makes 100 failed attempts in one day.
// rate-limiter-flexible package provides tools to make this technique easy and fast.
//

// 5.Ensure your dependencies are secure
// npm audit
// npm install -g snyk , snyk test, snyk wizard

// Additional considerations
// Here are some further recommendations from the excellent Node.js Security Checklist. Refer to that blog post for all the details on these recommendations:

// Use csurf middleware to protect against cross-site request forgery (CSRF).
// Always filter and sanitize user input to protect against cross-site scripting (XSS) and command injection attacks.
// Defend against SQL injection attacks by using parameterized queries or prepared statements.
// Use the open-source sqlmap tool to detect SQL injection vulnerabilities in your app.
// Use the nmap and sslyze tools to test the configuration of your SSL ciphers, keys, and renegotiation as well as the validity of your certificate.
// Use safe-regex to ensure your regular expressions are not susceptible to regular expression denial of service attacks.

// Production best practices: performance and reliability
// Things to do in your code
// 1.Use gzip compression
// 2.Don’t use synchronous functions
// 3.For debugging use debug lib, for app activity use winston
// 4.Handle exceptions properly
// 5. What not to do:
// Additionally, using uncaughtException is officially recognized as crude.
// So listening for uncaughtException is just a bad idea. T
// his is why we recommend things like multiple processes and supervisors:
// crashing and restarting is often the most reliable way to recover from an error.

// 6.Use a tool such as JSHint or JSLint to help you find implicit exceptions like reference
// errors on undefined variables.

// Things to do in your environment / setup

// 1.Set NODE_ENV to “production” ,Tests indicate that just doing this can improve app performance by a factor of three!
// 2.Ensure your app automatically restarts by using process manager
// 3.Run your app in a cluster
