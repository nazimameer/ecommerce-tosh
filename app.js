// SET PATH=C:\Program Files\Nodejs;%PATH%
const path = require('path');
const express = require('express');
const sessions = require('express-session');
const fileUpload =require('express-fileupload')

const app = express();

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  secret: 'keyvenomonoose',
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false,
}));
// cache
app.use((req, res, next) => {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
  );
  next();
});
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(fileUpload())

// Public folder path
app.use(express.static('public'));
app.use('/signin', express.static(path.join(`${__dirname}public/admincss/signin`)));



// Routes
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');

// start
app.use('/admin', adminRouter);
app.use('/', userRouter);


app.listen(8000);
 