//로그인을 위한 세션아이디 초기화
let session_id = ""

//회원가입
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
        //회원가입 insert 함수 추가
    }
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