const express = require("express");

const shopController = require("../controllers/shop");
const isAuthenticated = require("../middleware/is-authenticated");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuthenticated, shopController.getCart);

router.post("/cart", isAuthenticated, shopController.postCart);

router.post(
  "/cart-delete-item",
  isAuthenticated,
  shopController.postCartDeleteProduct
);

router.get("/orders", isAuthenticated, shopController.getOrders);

router.get("/orders/:orderId", isAuthenticated, shopController.getInvoice);

router.post("/create-order", isAuthenticated, shopController.postOrder);

module.exports = router;
