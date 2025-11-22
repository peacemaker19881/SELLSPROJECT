require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-hbs');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const sequelize = require('./config/database');
require('./models');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars view engine setup
app.engine(
  'hbs',
  exphbs.express4({
    defaultLayout: './views/seller_dashboard',
    layoutsDir: path.join(__dirname, 'views'),
    partialsDir: path.join(__dirname, 'views/partials'),
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/admin', require('./routes/admin'));
app.use('/payments', require('./routes/payments'));

app.get('/', (req, res) => {
  res.render('index');
});

// Start app with DB connect
(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    await sequelize.sync();

    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Unable to start server', err);
  }
})();
