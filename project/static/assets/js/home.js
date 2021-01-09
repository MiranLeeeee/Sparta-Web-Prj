//로그인을 위한 세션아이디 초기화
let session_id = ""

//home화면 로그인 활성화
$(document).ready(function(){
    if(session_id === "" || session_id === "?id=user"){
        $('#loginBtn').css('display', 'inline')
        $('#logoutBtn').css('display', 'none')
    }else {
        $('#loginBtn').css('display', 'none')
        $('#logoutBtn').css('display', 'inline')
    }
})

/*회원가입*/
//회원가입 메인 함수 (null check)
function join() {
    let name = $('#name').val()
    let email = $('#email').val()
    let gender = $("input[name='gender']:checked").val();
    let birth = $('#birth').val()
    let id = $('#userId').val()
    let password = $('#userPW').val()

    //필수항목 검증
    if(name===''){
        alert("이름을 입력해주세요")
    }else if(email===''){
        alert("이메일을 입력해주세요")
    }else if(isEmail(email)===false){
        alert("이메일 형식에 맞게 입력해주세요")
    }else if(birth===''){
        alert("생년월일을 입력해주세요")
    }else if(isBirth(birth)===false){
        alert("생년월일 형식에 맞게 입력해주세요")
    }else if(id===''){
        alert("아이디를 입력해주세요")
    }else if (validUserId(id)>0){
        alert("이미 존재하는 아이디입니다. 다른 아이디를 입력해주세요")
    }else if(password===''){
        alert("비밀번호를 입력해주세요")
    }else {
        alert("회원가입을 축하합니다.")
        insertMemberInfo(name, email, gender, birth, id, password)
    }
}

//이미 가입된 회원인지 확인
function validUserId(id){
    let validValue= -1
    let countResult = -1
    $.ajax({
        type: "POST",
        url: "/validUserId",
        data: {
            'id': id
        },
        async: false,
        success: function(response){
            countResult = response["countResult"]
        }
    })
    return countResult
}

//회원 정보 삽입
function insertMemberInfo(name, email, gender, birth, id, password){
    $.ajax({
        type: "POST",
        url: "/insertMemberInfo",
        data: {
            'name': name,
            'email': email,
            'gender': gender,
            'birth': birth,
            'id': id,
            'password': password
        }
     })
}

/*회원가입시 입력 값 정규표현식 검증*/
//이메일 검증
function isEmail(emailValue) {
	let regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	return regEmail.test(emailValue);
}

//생년월일 검증
function isBirth(birthValue){
    let regBirth = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    return regBirth.test(birthValue)
}

/*로그인*/
//로그인정보와 회원정보 일치여부확인
function login() {
    let id = $('#loginId').val()
    let password = $('#loginPW').val()

    let validValue= -1
    let countResult = -1
    $.ajax({
        type: "POST",
        url: "/validUserId",
        data: {
            'id': id
        },
        async: false,
        success: function(response){
            countResult = response["countResult"]
        }
     })

    //회원정보에 아이디가 존재여부에 따른 alert
    if(countResult===1){
        //해당 아이디의 비밀번호 일치여부확인
        validValue = getPWCount(id, password)
        if(validValue===1){
            loginToken(id, password)
        }else {
            alert("비밀번호를 제대로 입력해주세요.")
        }
    }else {
        alert("아이디를 제대로 입력해주세요.")
    }

}

//입력한 아이디의 비밀번호가 일치하는지 확인
function getPWCount(id, password) {
    let countResult = -1
    $.ajax({
        type: "POST",
        url: "/validUserPW",
        data: {
            'id': id,
            'password': password
        },
        async: false,
        success: function(response){
            countResult = response["countResult"]
        }
    })
    return countResult
}

//로그인 성공시 실행
function loginToken(id, password){
    session_id = id
    alert(session_id+'님 환영합니다 👍')
    $('#loginModal').modal('hide')
    $('#loginBtn').css('display', 'none')
    $('#logoutBtn').css('display', 'inline')
}

/*각 서브페이지로 이동*/
//정기예금 페이지(deposit)로 이동
function showDeposit() {
    //로그인된 아이디가 없으면 'user'로 대체
    if(session_id===""){
        location.href = "/deposit?id=user"
    }else{
        location.href = "/deposit?id="+session_id
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

//회원가입으로 이동시 modal 변경
function register() {
    $('#loginModal').modal('hide')
}