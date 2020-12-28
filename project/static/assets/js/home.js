
//회원가입
function join() {
    let name = $('#name').val()
    let email = $('#email').val()
    let gender = $("input[name='gender']:checked").val();
    let birth = $('#birth').val()
    let id = $('#userId').val()
    let password = $('#userPW').val()

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
    }
    else if(password===''){
        alert("비밀번호를 입력해주세요")
    }
    else {
        alert("회원가입을 축하합니다.")
        //회원가입 insert 함수 추가
    }
}

//이메일 및 생년월일 정규표현식 검증
function isEmail(emailValue) {
	let regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	return regEmail.test(emailValue);
}

function isBirth(birthValue){
    let regBirth = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    return regBirth.test(birthValue)
}