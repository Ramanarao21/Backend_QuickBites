const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');
const bodyParser = require("body-parser");
const firmRoutes = require('./routes/firmRoutes')
const cors = require("cors")
const path = require('path');






const app = express()
const PORT  = process.env.PORT || 7008;

dotEnv.config();

app.use(cors())


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Succesfully Connected"))
    .catch((error) => console.log(error))

app.use(bodyParser.json());
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product' , productRoutes);
app.use('/uploads' , express.static('uploads'));


app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})

app.use('/',(req,res) => {
    res.send("<h3> Welcome to QuickBites")
})