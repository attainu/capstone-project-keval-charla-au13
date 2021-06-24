const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => console.log("DATABASE CONNECTED SUCCESSFULLY"))
    .catch((err) => console.log(`DATABASE CONNECTION FAILED ${err}`));


