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

    showCommentByProduct(prd_nm);
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

//금융상품에 대한 공유댓글 시각화
function showCommentByProduct(prd_nm){
    $.ajax({
        type: "POST",
         url: "/showComments",
          data: {
            'prd_nm': prd_nm
          },
          async: false,
          success: function(response){ // 서버에서 준 결과를 response라는 변수에 담음
            let results = response['result']
            for (let i=0; i<results.length; i++){
                let cls = (prd_nm+(i+1)).replace(' ', '')
                $('#commentTable').append(`
                    <tr class=${cls}><td>${i+1}</td><td>${results[i]['name']}</td><td>${results[i]['comment']}</td><td><button onClick="deleteComment(${i+1});">삭제</button></td></tr>
                `)
            }
          }
    })
}

//공유댓글 삭제
function deleteComment(i) {
    let commentCount = -1

    if(prd_nm.indexOf(' ') != -1) {
        replaced_prd_nm = prd_nm.replace(' ', '')
    }else{
        replaced_prd_nm = prd_nm
    }
    replaced_prd_nm = prd_nm.replace(' ', '')
    password = window.prompt('비밀번호를 입력해주세요.');

    name = $('.'+replaced_prd_nm+i).children().eq(1).text()
    comment = $('.'+replaced_prd_nm+i).children().eq(2).text()

    commentCount = checkComment(i, password)

}