const Cart = require("../../model/cart.model");
const Product = require("../../model/products.model");
const productHelper = require("../../helpers/products");

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  let cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart && cart.products.length > 0) {
    let total = 0;

    const products = await Promise.all(
      cart.products.map(async (item) => {
        const productId = item.product_id;
        const productInfo = await Product.findOne({
          _id: productId,
        });
        productInfo.priceNew = productHelper.priceNewProduct(productInfo);
        item.productInfo = productInfo.toObject(); // Convert Mongoose document to plain object if necessary
        total += parseInt(productInfo.priceNew) * parseInt(item.quantity);
        return {
          ...productInfo.toObject(), // Convert Mongoose document to plain object if necessary
          id: productInfo._id,
          name: productInfo.name,
          price: productInfo.priceNew,
          quantity: item.quantity,
        };
      })
    );

    // Convert the cart to a plain object for modification
    cart = cart.toObject();
    cart.totalPrice = total;
    cart.products = products;
  }

  res.json({
    cart,
    status: "success",
  });
};

module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );
  if (existProductInCart) {
    const newQuantity = quantity + existProductInCart.quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuantity,
      }
    );
  } else {
    const objCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objCart },
      }
    );
  }

  return res.json({
    status: "success",
    message: "Thêm vào giỏ hàng thành công",
  });
};

module.exports.delete = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );

  return res.json({
    status: "success",
    message: "Xóa sản phẩm khỏi giỏ hàng thành công",
  });
};

module.exports.update = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;
  const quantity = req.params.quantity;

  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      "products.$.quantity": quantity,
    }
  );

  return res.json({
    status: "success",
    message: "Cập nhật giỏ hàng thành công",
  });
};
