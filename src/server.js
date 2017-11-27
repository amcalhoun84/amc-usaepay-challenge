const express = require('express'),
	app = express(),
	router = express.Router(),
	path = require('path'),
	pug = require('pug'),
	cors = require('cors'),
	//favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	http = require('http'),		
	rs = require('randomstring'), // using michaelcalhoun or abcdefgh... was not a secure seed.
	sha256 = require('sha256'),  // secure hashing.
	request = require('request'),
	rp = require('request-promise'), // allows and facilitates async requests.
	port = normalizePort(process.env.PORT || '3000'); // programming by convention, extension of the native environment to ensure that the port works properly.

app.set('view engine', 'pug');
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());	// I was continuously having issues with running the two servers, so I decided to take a gamble and use a cross-origin-resource-sharing stop-gap. In the future, especially if I am not pressed for time, I will not be using it.
//app.use(express.static(path.join(__dirname, './src')));
app.set('port', port);


// app.use('/api', index);

app.get('/api/transactions', (req, res) => { 
	res.send('Use POST method to make a purchase.\nTry with a transaction ref number if you are looking for a particular purchase!');
});

app.post('/api/transactions', (req, res) => { 
		console.log("BODY:", req.body);

		var authKey = generateAuth();

		var options = { 
			method: "POST", 
			uri: "https://sandbox.usaepay.com/api/v2/transactions",
			headers: { 	// originally I was going to have this be an input constant, but the changing nature of the authkey required this to be variable to prevent crashes.
				"User-Agent" : "uelib v6.8",
				// This is of course AWFUL AWFUL security protocol, but it's a work around for this nagging issue I couldn't figure out a work around for.
				"Content-Type" : "application/json",
				"Authorization" : "Basic " + authKey
			},
			body: req.body,
			json: true
		};

		rp(options)
			.then((promise) => { 
				var response = promise;
				console.log(response);
				res.send(response);
			})
			.catch((err) => { 
				console.error(err);
				throw err;
			}); 
});

/* Extra credit -- Refund, Voiding transaction;

// refund

*/

router.post('/transactions/:refId', (req, res) => { 
	console.log("BODY: ", req.body);

	var authKey = generateAuth();

	var options = {
		method: "POST",
		uri: "https://sandbox.usaepay.com/api/v2/transactions/" + req.params.refId,
		headers: { 
			"User-Agent" : "uelib v6.8",
			"Content-Type" : "application/json",
			"Authorization" : "Basic " + authKey
		},
		body: req.body,
		json: true
	};
		rp(options)
			.then((promise) => { 
				var response = JSON.parse(promise);
				console.log(sys.inspect(response));
				res.send(promise);
			})
			.catch((err) => { 
				console.error(err);
				throw err;
			});
});

// Catch 404 and forward to error handler

app.listen(port);
app.on('error', onError);
app.on('listening', onListening);

console.log("Listening on port: " + port);

//var authCheck = generateAuth();
//console.log("AuthKey Check: " + authCheck); // -- match spot check


// Routes ===================================================================================




// 404
app.use((req, res, next) => { 
	var err = new Error('Not found');
	err.status = 404;
	next(err);
});

// error handler

app.use((err, req, res, next) => { 
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.render('error') //, { 
		// message: err.message,
		//error: err
});

app.use('*', (req, res) => {
	res.sendFile(__dirname + '/index.html');

});


// Server Functions

function normalizePort(val) { 
	var port = parseInt(val, 10);

	// pipes and ports, good for checking if there is any server connection issues. 

	if(isNaN(port)) return val;
	if(port >= 0) return port;
};

function onError(error) { 
	if(error.syscall !== 'listen') throw error;
	const bind = typeof port === 'string' ? 'Pipe' + port : 'Port' + port;

	switch(error.code) {
		case 'EACCES': 
			console.error(bind + ' requires elevated privileges / admin account.');
			process.exit(1);
			break;
		case 'EADDRINUSE': 
			console.error(bind + ' already in use.')
			process.exit(1);
			break;
		default: 
			throw error;
			break;
	}
};

function onListening() { 

	var addr = server.address();
	var bind = typeof addr == 'string' ? 'pipe' + addr : 'port' + addr.port;
	debug('Listening on ' + bind);
};

function generateAuth() { 
	const seed = rs.generate(),
		apiKey = "_thFml1E11cq1X6zJZV9P5hGBG5TOc46",
		apiPin = "1234",
		prehash = apiKey + seed + apiPin,
		apihash = 's2/' + seed + '/' + sha256(prehash);
		authKey = new Buffer(apiKey + ":" + apihash).toString('base64');
		console.log("Authorization: Basic " + authKey) // great for testing on postman. Did a lot to help me figure out the idiosyncracies of the API.
		return authKey;

};