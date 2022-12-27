const express = require('express');
const route = require('./Routes/userRoutes');
const cors = require('cors');
require('./db/dbConfig');
require('./Model/userModel');

const app = express();

app.use('/upload', express.static('upload'));
app.use(cors());
app.use(express.json());
app.use('/',route);

const port = 3500;

app.listen(port, ()=>{
    console.log(`Connected to ${port}`);
});

