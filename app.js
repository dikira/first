var express     = require('express'),
    app         = express(),
    path        = require('path'),
    bodyParser  = require('body-parser'),
    env         = require('dotenv').config(),
    session     = require('express-session');

// If request url error or atack from hacker
app.use(function(req, res, next) {
    var err = null;
    try {
        decodeURIComponent(req.path)
    }
    catch(e) {
        err = e;
    }
    if (err){
        res.status(404);
        res.render('404');
    }
    next();
});

// session/cookie config
const {
    PORT = 3000,
    NODE_ENV = 'development',
    SESS_NAME = '_dkr',
    SESS_SECRET = 'ssh!quit,it\'asecret',
    SESS_LIFETIME = 1000 * 60 *60 * 2
} = process.env
const IN_PROD = NODE_ENV === 'production';


// ==================================================================================================
// Config
app.use(express.static(path.join(__dirname, 'assets')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());                             // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));     // to support URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public')));
// ==================================================================================================
// eND Config


// ==================================================================================================
// Global Variable
app.locals.BASEURL = 'http://localhost:3000';
// ==================================================================================================
// eND Global Variable


// ==================================================================================================
// Session
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {   
                maxAge: SESS_LIFETIME,
                sameSite: true,
                secure: IN_PROD
            }
}));
// ==================================================================================================
// eND Session



// ==================================================================================================
// Controller
var indexRoutes     = require('./controllers/index');
// var searchRoutes    = require('./controllers/search');
var machineRoutes   = require('./controllers/machine');
var grabRoutes      = require('./controllers/grab');
// ==================================================================================================
// eND Controller


// ==================================================================================================
// Routes
app.use('/', indexRoutes);
app.use('/login', function(req, res, next) {
    res.send('Login');
});

// app.use('/search', function(req, res, next) {
//     res.render('search');
// });

app.use('/search', require('./controllers/search'));



app.use('/read', require('./controllers/read'));
app.use('/subscribe', require('./controllers/subscribe-act'));

// =====================================================================================================



app.use('/grab', grabRoutes);
app.use('/coba', function (req, res, next) {
    // let html = 'jhon smith';
    let html = 'CARMEL CENTRAL SCHOOL DISTRICT<p class="new_p">nama kamu siapa?</p> PUTNAM COUNTY, NEW YORK<p class="new_p"></p> CLAIMS AUDITOR<p class="new_p"></p> The position of Internal Claims Auditor is an annual appointment by the Board of Education and is exempt from a civil service exam.';
    res.send(html.replace(/<([^(img)]\w)([^>].*)>/gi, '$1, dd'));
})



app.use('/machine', machineRoutes);
app.get('/hash', function (req, res) {
    const bcrypt = require('bcrypt');
    const md5 = require('md5');
    const base64 = require('js-base64').Base64;
    
    // let pass = "gantenging92e8";
    // let pass2 = base64.encode(pass);
    // let pass3 = md5(pass2);
    // let pass4 = bcrypt.hashSync(pass3, 10);
    
    // let decript = bcrypt.compareSync(pass3, pass4);
    
    function hash(pass, verifyHash = '', type = 'hash', salt = 10) {
        let pass2 = base64.encode(pass);
        let pass3 = md5(pass2);
        if (type != 'hash') {
            // Unhash
            return bcrypt.compareSync(pass3, verifyHash);
        } else {
            // Hash
            return bcrypt.hashSync(pass3, salt);
        }
    }
    let has = hash('gantengin');
    let cek = hash('gantengin', has, 'unhash')
    res.end(has+'\n'+cek);
    
    // res.end(pass+'\n'+pass2+'\n'+pass3+'\n'+pass4+'\n'+decript);
});





// Page not found
app.use(function(req, res, next){
    res.status(404);

    res.render('404');
  
    // // respond with html page
    // if (req.accepts('html')) {
    //     //   res.render('404', { url: req.url });
    //     res.type('txt').send('Not found');
    //     return;
    // }
  
    // // respond with json
    // if (req.accepts('json')) {
    //     res.send({ error: 'Not found' });
    //     return;
    // }
  
    // // default to plain-text. send()
    // res.type('txt').send('Not found');
});
// atau bisa ini
// app.get('*',function(req,res){
//     res.redirect('/login');
// });
// ==================================================================================================
// eND Routes



app.listen(PORT, () => {
    console.log('listening on *:3000');
});
