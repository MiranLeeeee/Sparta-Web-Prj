let session_id = ""
session_id = decodeURI(location.href.substr(location.href.lastIndexOf('=') + 1))

/*navigation*/
//메인 페이지(Home)로 이동
function showHome() {
    if(session_id===""){
        location.href = "/?id=user"
    }else{
        location.href = "/?id="+session_id
    }
}

//적금 페이지(savings)로 이동
function showSavings() {
    if(session_id===""){
        location.href = "/savings?id=user"
    }else{
        location.href = "/savings?id="+session_id
    }
}
