let session_name = ""
let prd_nm = ""

$(document).ready(function(){
    let url = String(decodeURI (location.href))
    let url_list = new Array()
    let url_list = url.split("&&")

    let session_id = (url_list[1].split("="))[1]
    session_name = getName(session_id)
    prd_nm = (url_list[0].split("="))[1]

    $('#prd_nm').empty()
    $('#prd_nm').append(prd_nm)
})

