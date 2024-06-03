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


// form search
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