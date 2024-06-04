const express = require('express')
const path = require('path')
const router = require("./router/client/index.router.js")
const database = require("./config/database.config.js")
const routerAdmin = require("./router/admin/index.router.js")
const flash = require("express-flash")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const methodOverride = require('method-override')
const bodyParser = require('body-parser')


require('dotenv').config()

const app = express()
const port = process.env.PORT

app.set("views",`${__dirname}/views`)
app.set("view engine","pug")
app.use(express.static(`${__dirname}/public`))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended:false}))

// flash
app.use(cookieParser("ABCXYZ"))
app.use(session({cookie:{maxAge:60000}}))
app.use(flash())
// flash end

// tinymce

app.use('/tinymce',
 express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// tinymce end

const systermConfig = require("./config/systerm")
app.locals.prefixAdmin = systermConfig.prefixAdmin

//router
router(app)
routerAdmin(app)
//router

// database
database.connect()
// database






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})