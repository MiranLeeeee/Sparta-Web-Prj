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

    if(session_name === '로그인'){
        $('#form_comment').empty()
        $('#form_comment').html("로그인이 필요한 서비스입니다.<br><br><input value='로그인하러가기' class='button alt' type='button' onClick='showLogin();'>")
    }else {
        $("#name").val(session_name)
    }
})

//세션 이름 가져오기
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

//메인 페이지로 이동 (로그인)
function showLogin() {
    location.href = "/"
}