const Order = require("../../model/orders.model");
const Product = require("../../model/products.model");
const User = require("../../model/users.model");
const productHelper = require("../../helpers/products");

const md5 = require("md5");
const { success } = require("./checkout.controller");
module.exports.register = async (req, res) => {
  //console.log(cart)
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

module.exports.registerPost = async (req, res) => {
  //console.log(req.body)
  const existEmail = await User.findOne({
    email: req.body.email,
  });

  if (existEmail) {
    return res.json({
      message: "Email đã tồn tại",
      success: false,
    });
  }

  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  return res.cookie("tokenUser", user.tokenUser).json({
    message: "Đăng ký thành công",
    success: true,
    data: {
      accessToken: user.tokenUser,
    }
  });
};

module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    return res.json({
      message: "Tài khoản không tồn tại",
      success: false,
    });
  }

  if (md5(password) != user.password) {
    return res.json({
      message: "Mật khẩu không đúng",
      success: false,
    });
  }

  if (user.status == "inactive") {
    return res.json({
      message: "Tài khoản chưa được kích hoạt",
      success: false,
    });
  }

    res.cookie("tokenUser", user.tokenUser);

    return res.json({
      message: "Đăng nhập thành công",
      success: true,
      data: {
        accessToken: user.tokenUser,
      }
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");

  res.redirect("/");
};

module.exports.history = async (req, res) => {
  const orders = await Order.find({
    user_id: req.cookies.tokenUser,
  });

  // console.log(orders)
  for (const order of orders) {
    for (const product of order.products) {
      const productInfo = await Product.findOne({
        _id: product.product_id,
      }).select("title thumbnail slug");

      product.productInfo = productInfo;
      product.priceNew = productHelper.priceNewProduct(product);
      product.totalPrice = product.priceNew * product.quantity;
    }

    order.totalPrice = order.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
  }

  res.render("client/pages/user/history", {
    pageTitle: "Đơn mua",
    orders: orders,
  });
};
