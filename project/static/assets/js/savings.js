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

//정기예금 페이지(deposit)로 이동
function showDeposit() {
    if(session_id===""){
        location.href = "/deposit?id=user"
    }else{
    location.href = "/deposit?id="+session_id
    }
}

//검색창 display
function displaySearch(){
    let val = $("#choiceMain").val()
    if (val==='상품검색'){
        $('#queryDiv').css('display', 'inline')
        $('#selectDiv').css('display', 'none')
    }else {
        $('#selectDiv').css('display', 'inline')
        $('#queryDiv').css('display', 'none')
        getBankNames()
}

