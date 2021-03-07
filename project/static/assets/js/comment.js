let session_name = ""

$(document).ready(function(){
    let url = String(decodeURI (location.href))
    let url_list= new Array()
    let url_list = url.split("&&")

    let session_id = (url_list[1].split("="))[1]

})