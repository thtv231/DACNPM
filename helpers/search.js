module.exports = (query)=>{
    objSearch = {
        keyword : ""
    }
    

    if(query.keyword){
        objSearch.keyword = query.keyword
        objSearch.regex = RegExp(objSearch.keyword,"i")
        
    }

    return objSearch

}