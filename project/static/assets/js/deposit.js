let session_id = ""
session_id = decodeURI(location.href.substr(location.href.lastIndexOf('=') + 1))
let dataList = []
dataList = getProducts()

$(document).ready(function(){
    //전체 상품 보여주기
    showAccordion(dataList[0], dataList[1], 1)
}

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

//은행상품정보 데이터가져오기
function getProducts() {
    let jsonResult;
    let baseList = [];
	let optionList = [];

    $.ajax({
        type: "GET",
        url: "/getDepositData",
        data: {},
        async: false,
        success: function(response){
            jsonResult = JSON.parse(response);
            baseList = jsonResult["result"]["baseList"];
            optionList = jsonResult["result"]["optionList"];
        }
    })
    return [baseList, optionList]
}

//전체 상품 보여주기 (시각화)
function showAccordion(baseList, optionList, page){
    let panelGroup = $('#accordion');
    let htmlString = ""//금융상품 기본정보
    let htmlBank = ""//금융회사 정보
    let htmlProduct = ""//금융상품 상세정보
    let dataString = ""//금리 정보
    let htmlLike = ""//좋아요 정보
    let num = page * 10

    panelGroup.empty()
    if (page==6){
        num = num-7
    }

    for (let i = num-10; i< num; i++){
        htmlBank= getBankInfo(baseList[i]['kor_co_nm'])
        htmlString = `<div class="panel panel-default datapanel">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent="#accordion" href="#collapse${i+1}">
                                    <div class='titleDiv'>
                                        ${baseList[i]['fin_prdt_nm']}/ ${baseList[i]['kor_co_nm']}/ ${baseList[i]['join_member']}
                                    </div>
                                </a>
                            </h4>
                        </div>
                        <div id="collapse${i+1}" class="panel-collapse collapse">
                            <div class="panel-body">
                            </div>
                        </div>
				      </div>`;


        htmlProduct = `<div>
                        <b>상품이름:</b> ${baseList[i]['fin_prdt_nm']}<br>
                        <b>가입대상:</b> ${baseList[i]['join_member']}<br>
                        <b>가입방법:</b> ${baseList[i]['join_way']}<br>
                        <b>만기후이자율:</b> ${baseList[i]['mtrt_int']}<br>
                        <b>유의사항:</b> ${baseList[i]['etc_note']}
                       </div><br><br>`

        htmlLike = `<div style="text-align: right;">
                        <button class = 'likeBtn${i}' onClick="setLike(${i})">👍 좋아요: <p class="likeCount${i}">${likeCount}</p></button>
                    </div>`


        panelGroup.append(htmlString);
        let collapseBody = '#collapse'+(i+1) +"> .panel-body"
        $(collapseBody).append(htmlBank)
        $(collapseBody).append(htmlProduct)
        $(collapseBody).append('<h4>&#128176;금리정보</h4>')

        for (let j = 0; j < optionList.length; j++){
            if(baseList[i]['fin_prdt_cd']===optionList[j]['fin_prdt_cd']){
                dataString = `<table width="150px">
                <tr><th>저축금리유형</th><th>저축기간(개월)</th><th>저축금리<br>(소수점 둘째자리)</th><th>최고우대금리<br>(소수점 둘째자리)</th></tr>
                <tr><td>${optionList[j]['intr_rate_type_nm']}</td><td>${optionList[j]['save_trm']}</td><td>${optionList[j]['intr_rate']}</td><td>${optionList[j]['intr_rate2']}</td></tr>`

                $(collapseBody).append(dataString)

            }//if end
        }//for end j

	}//for end i
}

//은행 상세 정보 가져오기 (시각화)
function getBankInfo(bankName) {
    let htmlBank = ""
    $.ajax({
        type: "POST",
        url: "/getBankInfo",
        data: {
            'bankName': bankName
        },
        async: false,
        success: function(response){
            htmlBank = `<div>
                            <header class="align-center"><img class="image round" style = "width: 250px;" src=${response['banks']['logo']}/></header>
                            <h4>&#127970;은행정보</h4>
                            은행명: ${response['banks']['name']}<br>
                            전화번호: ${response['banks']['tel']}<br>
                            웹사이트: <a href=${response['banks']['website']}> ${response['banks']['website']}</a>
                        </div><br><br><h4>&#128181;상품정보</h4>`
        }
    })
    return htmlBank
}

//좋아요 버튼 클릭 시 좋아요 수 지정
function setLike(i){
    let prd_nm = dataList[0][i]['fin_prdt_nm']
    likeCount = getLike(prd_nm)
    likeCount = parseInt(likeCount)
    likeCount += 1

     $.ajax({
        type: "POST",
        url: "/updateLike",
        data: {
            'prd_nm': prd_nm,
            'like': likeCount
        },
        async: false,
        success: function(response){
            let likeCountText = parseInt($('.likeCount'+i).text())
            $('.likeCount'+i).text(likeCountText+1)
        }
    })
}

//좋아요 정보 가져오기
function getLike(prd_nm) {
    let likeCount = -1;

    $.ajax({
          type: "POST",
          url: "/getLike",
          data: {
            'prd_nm': prd_nm
          },
          async: false,
          success: function(response){
            likeCount = response['like']['like']
          }
    })
    return likeCount
}
