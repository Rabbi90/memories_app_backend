const mongoose = require('mongoose')
const config = require('./config')
const URL = config.db.URL

mongoose.connect(URL).then(() => {
    console.log('Connected to mongodb');
}).catch(error => {
    console.log(error.message);
    process.exit(1);
})