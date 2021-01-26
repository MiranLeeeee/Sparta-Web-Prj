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
		panelGroup.append(htmlString);

        htmlProduct = `<div>
                        <b>상품이름:</b> ${baseList[i]['fin_prdt_nm']}<br>
                        <b>가입대상:</b> ${baseList[i]['join_member']}<br>
                        <b>가입방법:</b> ${baseList[i]['join_way']}<br>
                        <b>만기후이자율:</b> ${baseList[i]['mtrt_int']}<br>
                        <b>유의사항:</b> ${baseList[i]['etc_note']}
                       </div><br><br>`

        let collapseBody = '#collapse'+(i+1) +"> .panel-body"
        //좋아요 정보 삽입할 것
        $(collapseBody).append(htmlBank)
        $(collapseBody).append(htmlProduct)

	}//for end
}

