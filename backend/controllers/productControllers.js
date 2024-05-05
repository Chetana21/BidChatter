const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// Controller function to create a new product
const createProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    images,
    description,
    minimumPrice,
    biddingStartDate,
    biddingDuration,
    biddingType,
    createdBy,
    chat,
  } = req.body;

  // Calculate biddingEndDate based on biddingStartDate and biddingDuration
  const biddingEndDate = new Date(
    new Date(biddingStartDate).getTime() + biddingDuration * 60000
  );

  // Create the product in the database
  const product = await Product.create({
    productName,
    images,
    description,
    minimumPrice,
    biddingStartDate,
    biddingDuration,
    biddingType,
    createdBy,
    chat,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Failed to create the product");
  }
});

// Controller function to get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  if (products && products.length > 0) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error("No products found");
  }
});

module.exports = { createProduct, getAllProducts };
