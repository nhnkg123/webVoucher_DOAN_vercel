let express = require ('express');
let app = express();
const handlebars = require('express-handlebars');

//set public static folder
app.use(express.static(__dirname + '/public'));

//use view engine
let paginateHelper = require('express-handlebars-paginate');
app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    defaultLayout: 'layout',
    extname: 'hbs',
    runtimeOptions: {allowProtoPropertiesByDefault: true},
    helpers: {
        createPagination: paginateHelper.createPagination,
    }
}))
app.set('view engine', 'hbs');

//Use body parser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Use cookie-parser
let cookiParser = require('cookie-parser');
app.use(cookiParser());

//Use session
let session = require('express-session');
app.use(session({
    cookie: {httpOnly: true, maxAge: null},
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    res.locals.username = req.session.user ? req.session.user.username : '';
    res.locals.isLoggedIn = req.session.user ? true : false;
    next();
});


app.use('/', require('./routes/indexRouter'));
app.use('/vouchers', require('./routes/voucherRouter'));
app.use('/users', require('./routes/userRouter'));
app.use('/ChienDich', require('./routes/ChienDichRouter'));
app.use('/DoiTac', require('./routes/DoiTacRouter'));



app.post('/', (req, res) => {
    const score = req.body.score;
    console.log(`Received new score: ${score}`);

    // ... code to save the score to a database or file ...
    
    res.sendStatus(200);
});




app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`);
});