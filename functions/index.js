const functions = require('firebase-functions');
const express = require('express');
const messageRouter = require('./routers/messages/route');

const app = express();
app.use('/', messageRouter);

exports.api = functions.region('asia-northeast1').https.onRequest(app);
