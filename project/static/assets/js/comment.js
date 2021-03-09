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

function getName(session_id) {
    let session_name = ""
    if(session_id==='user'){
        session_name = '로그인'
    }else{
         $.ajax({
            type: "POST",
            url: "/getName",
            data: {
                'session_id': session_id
            },
            async: false,
            success: function (response) {
                session_name = response['result']['name']
            }
        })
    }

     return session_name
}