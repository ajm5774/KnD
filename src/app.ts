require('dotenv').config();

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as rtm from './rtm';

let app = express();
let port = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

// Listen for real time messages
rtm.start()