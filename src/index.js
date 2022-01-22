require('dotenv').config();
const { sqlLogger } = require('./utils/loggingUtils');
const Sentry = require('@sentry/node');
const { setup: setupDatabase } = require('@benhdev-projects/database');
const routes = require('./routing');
const middleware = require('./middleware');

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

setupDatabase(sqlLogger);

if (process.env.SENTRY_DSN != '') {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		tracesSampleRate: 1.0,
	});
}

const app = express();
const server = http.createServer(app);

const limiter = rateLimit({
	windowMs: 1000,
	max: 1,
	standardHeaders: true,
});

app.use(limiter);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/v1', routes);

app.use(middleware.error);
app.use(middleware.notFound);

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Prosperity API is now listening on port ${port}`));

