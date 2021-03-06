const path = require('path');

const express = require('express');

const { body } = require('express-validator/check');
const adminController = require('../controllers/admin');
const auth = require('../middleware/in-Auth')
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product',auth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products',auth, adminController.getProducts);

// /admin/add-product => POST
router.post(
    '/add-product',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    auth,
    adminController.postAddProduct
  );

router.get('/edit-product/:productId',auth, adminController.getEditProduct);

router.post(
    '/edit-product',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    auth,
    adminController.postEditProduct
  );

router.delete('/product/:productId',auth, adminController.deleteProduct);

module.exports = router;
