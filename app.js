// SET PATH=C:\Program Files\Nodejs;%PATH%
const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB,
    }),
  })
);

// cache
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(fileUpload());

// Public folder path
app.use(express.static("public"));
app.use(
  "/signin",
  express.static(path.join(`${__dirname}public/admincss/signin`))
);

// Routes
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");

// start
app.use("/admin", adminRouter);
app.use("/", userRouter);

app.listen(5000);
