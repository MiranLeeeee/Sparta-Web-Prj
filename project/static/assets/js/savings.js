let session_id = ""
session_id = decodeURI(location.href.substr(location.href.lastIndexOf('=') + 1))
let dataList = []
dataList = getProducts()

$(document).ready(function(){
    //전체 상품 보여주기
    showAccordion(dataList[0], dataList[1], 1)
    //페이지네이션
    showPagination(dataList[0])
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

        likeCount = getLike(baseList[i]['fin_prdt_nm'])
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

//은행상품정보 데이터가져오기
function getProducts() {
    let jsonResult;
    let baseList = [];
	let optionList = [];

    $.ajax({
        type: "GET",
        url: "/getSavingsData",
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


/*검색*/
//시각화 중복되는 부분 함수로 나중에 따로 구현할 것
//금융상품명으로 검색
function searchProducts() {
    let search = $('#query').val()
    let includeBool = false;
    let baseList = dataList[0]
    let optionList = dataList[1]
    let panelGroup = $('#accordion');
    let htmlString = ""
    let dataString = ""
    let htmlBank = ""
    let htmlProduct = ""
    panelGroup.empty()
    $('.pagination').css('display','none')

    for (let i = 0; i< baseList.length; i++){
        includeBool = baseList[i]['fin_prdt_nm'].includes(search)

        if(includeBool===true){
            htmlBank = getBankInfo(baseList[i]['kor_co_nm'])
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
                    </div>`

            htmlProduct = `<div>
                                <b>상품이름:</b> ${baseList[i]['fin_prdt_nm']}<br>
                                <b>가입대상:</b> ${baseList[i]['join_member']}<br>
                                <b>가입방법:</b> ${baseList[i]['join_way']}<br>
                                <b>만기후이자율:</b> ${baseList[i]['mtrt_int']}<br>
                                <b>유의사항:</b> ${baseList[i]['etc_note']}
                            </div><br><br>`

            likeCount = getLike(baseList[i]['fin_prdt_nm'])
            htmlLike = `<div style="text-align: right;">
                            <button class = 'likeBtn' onClick="setLike(${i})">👍 좋아요: <p class="likeCount">${likeCount}</p></button>
                            <button class = 'commentBtn' onClick="showComment(${i})">댓글공유게시판</button>
                        </div>`

            panelGroup.append(htmlString);
            let collapseBody = '#collapse'+(i+1) +"> .panel-body"
            $(collapseBody).append(htmlLike)
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

        $('.titleDiv').css({'width': '100%', 'text-align': 'left'})
        $('td').css('text-align', 'center');
        $('th').css('text-align', 'center');
        $('p').css('display', 'inline-block');

        }//if includeBool end
    }//for end
}

//금융회사로 검색
function searchByBankName(){
    let search = $("#select_banks option:checked").text().replace("\n", "");
    let panelGroup = $('#accordion');
    let includeBool = false;
    let baseList = dataList[0]
    let optionList = dataList[1]
    let htmlString = ""
    let dataString = ""
    let htmlBank = ""
    let htmlProduct = ""
    panelGroup.empty()
    $('.pagination').css('display','none')

    for (let i = 0; i< baseList.length; i++){
        includeBool = baseList[i]['kor_co_nm'].includes(search)
        if(includeBool===true){
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

            likeCount = getLike(baseList[i]['fin_prdt_nm'])
            htmlLike = `<div style="text-align: right;">
                        <button class = 'likeBtn' onClick="setLike(${i})">👍 좋아요: <p class="likeCount">${likeCount}</p></button>
                        <button class = 'commentBtn' onClick="showComment(${i})">댓글공유게시판</button>
                    </div>`

            let collapseBody = '#collapse'+(i+1) +"> .panel-body"

            panelGroup.append(htmlString);
            $(collapseBody).append(htmlLike)
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

        $('.titleDiv').css({'width': '100%', 'text-align': 'left'})
        $('td').css('text-align', 'center');
        $('th').css('text-align', 'center');
        $('p').css('display', 'inline-block');

        }//if includeBool end
    }//for end
}

/*페이지네이션*/
//시각화
function showPagination(baseList) {
    let page = (baseList.length)/10;
    let htmlString = ""
    for (let i=1; i<page+1; i++){
        htmlString = `<li><a href="javascript:showInfoByPage(${i});">${i}</a></li>`
        $('.pagination').append(htmlString)
    }
}

//페이지 번호 클릭 시 정보 보여주기
function showInfoByPage(page){
    showAccordion(dataList[0], dataList[1], page)
}