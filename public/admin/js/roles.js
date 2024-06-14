// permission
const tablePermission = document.querySelector("[table-permission]")
if(tablePermission){
    const buttonSubmit = document.querySelector("[button-submit]")
    buttonSubmit.addEventListener("click",()=>{
        let perMission = []
        const rows = tablePermission.querySelectorAll("[data-name]")
        
        rows.forEach(row =>{
            const name = row.getAttribute("data-name")
            
            const inputs = row.querySelectorAll("input")
            
            if(name=="id"){
                inputs.forEach(input =>{
                    const id = input.value
                    
                    perMission.push({
                        id:id,
                        perMission:[]

                    })
                })
            }else{
                inputs.forEach((input,index)=>{
                    const checked = input.checked
                    //console.log(`${index}--${name}--${checked}`)
                    if(checked){
                        perMission[index].perMission.push(name)
                    }    
                })
            }
        
        })

        if(perMission.length > 0){
            const formChangePermission = document.querySelector("#form-change-permission")
            const inputPerMission = formChangePermission.querySelector("input[name='permission']")
            inputPerMission.value = JSON.stringify(perMission)
            formChangePermission.submit()
        }

    })
}

// permission end

// permission data default
const dataRecords = document.querySelector("[data-record]")
if(dataRecords){
    const records =JSON.parse( dataRecords.getAttribute("data-record"))
    const tablePermission = document.querySelector("[table-permission]")
    
    records.forEach((record,index) =>{
        const permissions = record.permissions
        permissions.forEach(permission =>{
        const row = tablePermission.querySelector(`[data-name='${permission}']`)

        const input = row.querySelectorAll("input")[index]
        input.checked =true



        })
    })
}

// permission data default end
