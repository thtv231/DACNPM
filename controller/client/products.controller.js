
const Products = require("../../model/products.model")

module.exports.prodcuts = async (req, res) => {
    
    const filterStatus = [
        // Các giá trị của filterStatus nên được định nghĩa ở đây
        { name:"Mới nhất",status: 'newest', class: '' },
        { name:"Giá tăng dần",status: 'ascending', class: '' },
        { name:"Giá giảm dần",status: 'descending', class: '' },
    ];
    
    const find = {
        deleted: false,
        status: "active"
    };

    if(req.query.keyword){
        const keyword = req.query.keyword
        const regex = RegExp(keyword,'i')
        find.title = regex
        
    }
    const products = await Products.find(find)
    if (req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status);
        
        if (index !== -1) {
            filterStatus[index].class = "active";
            
            if (req.query.status == "ascending") {
                products.sort((a, b) => a.price - b.price);
            } else if (req.query.status == "descending") {
                products.sort((a, b) => b.price - a.price);
            } else if (req.query.status == "newest") {
                products.sort((a, b) => b.position - a.position);
            }
        }
    } else {
        filterStatus[0].class = "active";
        products.sort((a, b) => b.position - a.position);
    }





    products.forEach(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
    })
    //console.log(prodcuts)





    res.render("client/pages/products/index",
        {
            products: products,
            filterStatus: filterStatus
        }
    )
}

module.exports.detail =async (req,res)=>{
    try {
        const find = {
            deleted: false,
            slug : req.params.slug,
            status:"active"
        }
        const product = await Products.findOne(find)
        console.log(product)
        res.render("client/pages/products/detail",{
            
            product:product
        }
            
        )
        
    } catch (error) {

        res.redirect("/products")
    }
    
}