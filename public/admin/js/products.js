const checkBoxMulti = document.querySelector("[checkbox-multi]")
if(checkBoxMulti){
    
    const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']")
    const inputCheckIds = checkBoxMulti.querySelectorAll("input[name='id']")
    inputCheckAll.addEventListener("click",()=>{

        if(inputCheckAll.checked){
            inputCheckIds.forEach(item =>{
                item.checked = true
            })
        }else{
            inputCheckIds.forEach(item =>{
                item.checked = false
            })
        }
    })

    
    inputCheckIds.forEach(item =>{
        item.addEventListener("click",()=>{
            const count = checkBoxMulti.querySelectorAll("input[name='id']:checked").length
            
            if(count ==inputCheckIds.length ){
                inputCheckAll.checked = true
            }else{
                inputCheckAll.checked = false
            }

        })
    })

}


// delete item
const buttonDeletes = document.querySelectorAll("[button-delete]")
if(buttonDeletes.length >0){
    const formDeleteItem = document.querySelector("#form-delete-item")
    const path = formDeleteItem.getAttribute("path")
    buttonDeletes.forEach(item =>{
        item.addEventListener("click",()=>{
            const isConfirm = confirm("Bạn muốn xóa sản phẩm này ?")
            if(isConfirm){
                const id = item.getAttribute("data-id")
                const action = `${path}/${id}?_method=DELETE`
                formDeleteItem.action = action
                //console.log(formDeleteItem.action)
                formDeleteItem.submit()
            }

        })
    })
}


// delete item end
