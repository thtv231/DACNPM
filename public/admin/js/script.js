// buttonStatus

const buttonStatus = document.querySelectorAll("[btn-status]")
if(buttonStatus.length>0){
    const url = new URL(window.location.href)
    buttonStatus.forEach(item =>{
        
        item.addEventListener("click",()=>{
               const status = item.getAttribute("btn-status") 
               if(status){
                   url.searchParams.set("status",status)

               }else {
                    url.searchParams.delete("status")
                }
                window.location.href = url.href

        })
    })
}

// buttonStatus

// formSearch
const formSearch = document.querySelector("#form-search")
if(formSearch){
    const url = new URL(window.location.href)
    formSearch.addEventListener("submit",(e)=>{
        e.preventDefault()
        const keyword = e.target.elements.keyword.value
        if(keyword){
            url.searchParams.set("keyword",keyword)

        }else {
            url.searchParams.delete("keyword")

        }

        window.location.href = url.href
    })
}

// formSearch

// pagination phân trang
//const buttonPagination = document.querySelectorAll()
const buttonPagination = document.querySelectorAll("[button-pagination]")
if(buttonPagination){

    let url = new URL(window.location.href)
    buttonPagination.forEach(item =>{
        item.addEventListener("click",()=>{
            const page =item.getAttribute("button-pagination")
            url.searchParams.set("page",page)
            window.location.href = url.href
        })
    })
}

// pagination phân trang

// change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status ]")
if(buttonChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("#form-change-status")
    const path = formChangeStatus.getAttribute("path")
    buttonChangeStatus.forEach(item =>{
        item.addEventListener("click",()=>{
            const status = item.getAttribute("data-status")
            const id = item.getAttribute("data-id")
            const changeStatus = status=="active"?"inactive":"active"
            const action = path+`/${changeStatus}/${id}?_method=PATCH`
            formChangeStatus.action = action
            
            formChangeStatus.submit()
            

        })
    })
}

// change status end


//change multi status

const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti){
    formChangeMulti.addEventListener("submit",(e)=>{
        const type = e.target.elements.type.value
        if(type=="delete"){
            const isConfirm = confirm("Bạn muốn xóa những sản phẩm này")
            if(!isConfirm){
                return
            }
        }
        e.preventDefault()
        let ids = []
        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputCheckIds =checkboxMulti.querySelectorAll("input[name='id']:checked")
        const inputIds = document.querySelector("input[name='ids']")
        inputCheckIds.forEach(item =>{
            if(type=="change-position"){
                const position = item.closest("tr").querySelector("input[name='position']").value
                ids.push(`${item.value}-${position}`)
            }else{

                ids.push(item.value)
            }
        })

        inputIds.value = ids.join(", ")
        //console.log(inputIds.value)
        formChangeMulti.submit()


    })
}

//change multi status end

// show alert
const showAlert = document.querySelector("[show-alert]")
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closeAlert = showAlert.querySelector("[close-alert]")
    closeAlert.addEventListener("click",()=>{
        showAlert.classList.add("alert-hidden")
    })
    setTimeout(()=>{
        showAlert.classList.add("alert-hidden")
    },time)
}
// show alert end

// upload image
const uploadImage = document.querySelector("[upload-image]")
if(uploadImage){
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]")
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]")
    uploadImage.addEventListener("change",(e)=>{
        const file = e.target.files[0]
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file)
        }
    })
    const buttonDeleteImage = document.querySelector("[delete-image-preview]")
    buttonDeleteImage.addEventListener("click",()=>{
        uploadImagePreview.src=""
        uploadImageInput.value=""
    })
}
// end upload image



