const Product = require('../models/Product');
const multer = require("multer");
const Firm = require("../models/Firm");
const path = require("path");
const { findById } = require('../models/Vendor');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
    }
  });

const upload = multer({ storage: storage });

const addProduct = async(req,res) => {
    try {

        const {productName,price,category,bestSeller,description} = req.body;
        const image= req.file?req.file.filename:undefined;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({error:"no firm found"})
        }
        const product = new Product({
            productName,price,category,bestSeller,description,image,firm:firm._id
        })
        const savedProduct = await product.save();
        firm.products.push(savedProduct);
        await firm.save();

        res.status(200).json(savedProduct)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"});
        
    }
}

const getProductsByFirm = async(req,res) => {
    try {
        
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error: "No Firm Found"});
        }

        const restaurantName = firm.firmName;
        const products = await Product.find({firm:firmId});
        res.status(200).json({restaurantName,products});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
}

const deleteProductById = async(req,res) => {
    try {
        const productId = req.params.productId;
        console.log(productId)
        const findProduct = await Product.findById(productId)
        console.log(findProduct)
        if(!findProduct){
            return res.status(404).json({error: "No Product found"})
        }
        await Product.findByIdAndDelete(productId);
        res.status(200).json({msg: "Successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
}


module.exports = { addProduct:[upload.single('image') , addProduct],getProductsByFirm,deleteProductById } ;