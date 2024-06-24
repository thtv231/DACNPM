const inputQuantity = document.querySelectorAll("input[name='quantity']")
if(inputQuantity){
    inputQuantity.forEach(input =>{
        input.addEventListener("change",(e)=>{
            const productId = input.getAttribute("product_id")
            const quantity = parseInt(input.value)
            if(quantity > 1){

                window.location.href=`/cart/update/${productId}/${quantity}`
            }
        })
    })
}