import cors from 'cors';
import express from 'express';
import db from './db';
import routes from './routes';

db.connect();

var app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(4000);

