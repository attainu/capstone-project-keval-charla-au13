const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { readdirSync } = require("fs");
require('dotenv').config()


// App
const app = express()

// Database
require("./config/mongoConnect");

// middleware

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "3mb" }));
app.use(cors());

//routes middleware

readdirSync('./routes').map((r) =>
    app.use("/api", require("./routes/" + r))
);



const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

