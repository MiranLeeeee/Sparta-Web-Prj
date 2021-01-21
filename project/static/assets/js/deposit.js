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
}

//은행 이름 가져오기
function getBankNames(){
    let htmlSelect = ""
    $('#select_banks').empty()
    $.ajax({
        type: "GET",
        url: "/getBankNames",
        async: false,
        success: function(response){
            let arrayBanks = response["banks"]
            for(let i=0;i<arrayBanks.length;i++){
                htmlSelect = `<option>${arrayBanks[i]["name"]}</option>`
                $('#select_banks').append(htmlSelect)
            }//for end
        }//success end
    })//ajax end
}

