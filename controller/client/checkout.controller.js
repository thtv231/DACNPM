const Cart = require("../../model/cart.model");
const Product = require("../../model/products.model");
const productHelper = require("../../helpers/products");
const Order = require("../../model/orders.model");
const config = require("../../config/index").config;
const querystring = require("qs");
const crypto = require("crypto");
const moment = require("moment");
const helper = require("../../helpers/sortObject");
const Transaction = require("../../model/transactions.model");

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart.products.length > 0) {
    let total = 0;
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      });

      productInfo.priceNew = productHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      total += parseInt(productInfo.priceNew) * parseInt(item.quantity);
    }
    cart.totalPrice = total;
  }

  //console.log(cart)
  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body.userInfo;
  const cart = await Cart.findOne({
    _id: cartId,
  });

  let products = [];

  for (const product of cart.products) {
    let objProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo = await Product.findOne({
      _id: product.product_id,
    });
    objProduct.price = productInfo.price;
    objProduct.discount = Math.round(
      (objProduct.price * productInfo.discountPercentage) / 100
    );
    products.push(objProduct);
  }

  const shipping = 10;
  const total = products.reduce(
    (sum, item) => sum + (item.price - item.discount) * item.quantity,
    0
  );

  const objOrder = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
    shipping: shipping,
    payment: total + shipping,
    status: "0",
  };

  if (res.locals.user) {
    objOrder.user_id = res.locals.user.tokenUser;
  }

  await Cart.updateOne(
    {
      _id: cartId,
    },
    { products: [] }
  );

  const order = new Order(objOrder);
  await order.save();

  return res.json({
    status: "success",
    order: order,
    message: "Tạo đơn hàng thành công",
  });
};

module.exports.success = async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findOne({
    _id: orderId,
  });
  //console.log(order)
  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;
    product.priceNew = productHelper.priceNewProduct(product);
    product.totalPrice = product.priceNew * product.quantity;
  }

  order.totalPrice = order.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  //console.log(order)

  return res.json({
    status: "success",
    order: order,
  });
};

module.exports.update = async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findOne({
    _id: orderId,
  });

  if (!order) {
    return res.json({
      status: "error",
      message: "Đơn hàng không tồn tại",
    });
  }

  const payment = req.body.payment;

  if (payment == "Cash") {
    // update payment status to 1 and update payment method
    await Order.updateOne(
      {
        _id: orderId,
      },
      {
        status: "1",
        payment_type: "Cash",
      }
    );

    // Update product quantity
    for (const product of order.products) {
      await Product.updateOne(
        {
          _id: product.product_id,
        },
        {
          $inc: {
            stock: -product.quantity,
          },
        }
      );
    }
  }

  return res.json({
    status: "success",
    message: "Cập nhật đơn hàng thành công  ",
  });
};

// VNPay Payment Integration

module.exports.createPaymentUrl = async (req, res) => {
  const orderId = req.body.orderId;
  const order = await Order.findOne({
    _id: orderId,
  });
  if (!order) {
    return res.json({
      status: "error",
      message: "Đơn hàng không tồn tại",
    });
  }

  if (order.status !== "0") {
    return res.json({
      status: "error",
      message: "Đơn hàng đã được xử lý",
    });
  }

  const transaction = new Transaction({
    order_id: orderId,
    status: "0",
  });
  await transaction.save();

  process.env.TZ = "Asia/Ho_Chi_Minh";

  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");

  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const tmnCode = config.vnp_TmnCode;
  const secretKey = config.vnp_HashSecret;
  let vnpUrl = config.vnp_Url;
  const returnUrl = config.vnp_ReturnUrl;
  const amount = order.payment;
  const bankCode = "VNBANK";

  const locale = "vn";
  const currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = transaction._id;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = helper.sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  res.json({ code: "00", data: vnpUrl, status: "success" });
};

module.exports.VNPAY_IPN = async (req, res) => {
  console.log(req.query);
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];

  const rspCode = vnp_Params["vnp_ResponseCode"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const transaction_id = vnp_Params["vnp_TxnRef"];

  const transaction = await Transaction.findOne({
    _id: transaction_id,
  });

  if (!transaction) {
    return res.status(200).json({ RspCode: "01", Message: "Order not found" });
  }

  const order_id = transaction.order_id;

  const order = await Order.findOne({
    _id: order_id,
  });

  vnp_Params = helper.sortObject(vnp_Params);
  const secretKey = config.vnp_HashSecret;
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash !== signed) {
    return res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
  }

  const paymentStatus = order.status; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  if (paymentStatus === "1") {
    return res.status(200).json({
      RspCode: "02",
      Message: "This order has been updated to the payment status",
    });
  }

  const checkAmount = order.payment === vnp_Params["vnp_Amount"] / 100; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (checkAmount) {
    //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
    if (rspCode === "00") {
      //thanh cong
      //paymentStatus = '1'
      // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
      await Order.updateOne(
        {
          _id: order_id,
        },
        {
          status: "1",
          payment_type: "VNPay",
        }
      );

      // Update product quantity
      for (const product of order.products) {
        await Product.updateOne(
          {
            _id: product.product_id,
          },
          {
            $inc: {
              stock: -product.quantity,
            },
          }
        );
      }

      await Transaction.updateOne(
        {
          _id: transaction_id,
        },
        {
          status: "1",
        }
      );

      res.status(200).json({ RspCode: "00", Message: "Success" });
    } else {
      //that bai
      //paymentStatus = '2'
      // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
      res.status(200).json({ RspCode: "00", Message: "Success" });
    }
  } else {
    return res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
  }
};

module.exports.transaction = async (req, res) => {
  const transaction_id = req.params.id;
  const transaction = await Transaction.findOne({
    _id: transaction_id,
  });

  if (!transaction) {
    return res.json({
      status: "error",
      message: "Giao dịch không tồn tại",
    });
  }

  return res.json({
    status: "success",
    transaction: transaction,
  });
};
