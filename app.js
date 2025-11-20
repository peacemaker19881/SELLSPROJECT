require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine
app.engine('hbs', exphbs.express4({ partialsDir: path.join(__dirname, 'views/partials') }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


// session store
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
secret: process.env.SESSION_SECRET || 'secret',
store: sessionStore,
resave: false,
saveUninitialized: false,
cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
sessionStore.sync();


// load routes
app.use('/', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/admin', require('./routes/admin'));
app.use('/payments', require('./routes/payments'));


app.get('/', async (req, res) => {
// show approved products on home
const { Product } = require('./models');
const products = await Product.findAll({ where: { approved: true, is_sold: false } });
res.render('index', { user: req.session.user, products });
});

// sync DB and start
(async () => {
try {
await sequelize.authenticate();
console.log('DB connected');
await sequelize.sync(); // in production use migrations instead
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
} catch (err) {
console.error('Unable to start server', err);
}
})();