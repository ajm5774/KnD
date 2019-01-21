var mongoose = require('mongoose');
import config from '../config';

const url = `${config.mongo.connectionString}/karmabot`;
mongoose.connect(url, { useNewUrlParser: true });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export default db

