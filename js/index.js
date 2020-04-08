

function init(){

	bindEvent();
}

var dialog = document.getElementsByClassName('dialog')[0];
var tableData = [];


function bindEvent(){

	var menuList = document.getElementsByClassName('menu-list')[0];
	menuList.addEventListener('click',changeMenu,false);

	var addStudentBtn = document.getElementById('add-student-btn');
    // 添加新增学生的点击事件
    addStudentBtn.addEventListener('click', function (e) {
        changeStudentInfo(e, '/api/student/addStudent', 'add-student-form');
    }, false);
	



	var editStudent = document.getElementById('edit-student-btn');
	editStudent.addEventListener('click', function (e) {
        changeStudentInfo(e, '/api/student/updateStudent', 'edit-student-form');
    }, false);




	var tbody = document.getElementById('tbody');
	tbody.addEventListener('click',tbodyClick,false);

	var mask = document.getElementsByClassName('mask')[0];
    mask.onclick = function (e) {
        dialog.classList.remove('show');
    }



}


function tbodyClick(e){
	var tagName = e.target.tagName.toLowerCase();
	if(tagName != 'button'){
		return false;
	}
	var isEdit = e.target.className.indexOf('edit') > -1;
	var isDel = e.target.className.indexOf('del') > -1;
	var index = e.target.getAttribute('data-index');
	if (isEdit) {
		dialog.classList.add('show');
		renderFrom(tableData[index]);
	}else if (isDel) {
		var delConfirm = confirm('确认删除？');
		if (delConfirm) {

			transferData('/api/student/delBySno',{
				sNo:tableData[index].sNo
			},function(){
				alert('已删除');
				var list = document.getElementsByClassName('list')[0];
			})
		}
	}
}
function renderFrom(data){
	var form = document.getElementById('edit-student-form');
	for(var prop in data){
		if (form[prop]) {
			form[prop].value = data[prop];
		}
	}
}





function changeStudentInfo(e,url,id){
	e.preventDefault();
	var form = document.getElementById(id);
	var date = getFormData(form);
	if (!data) {
		return false;
	}
	var msg = '';
	if (id == 'edit-student-form') {
		msg = '是否更新数据';
	}else{
		msg = '提交成功，是否跳转页面？';
	}


	transferData(url,data,function(){
		var isTurnPage = confirm(msg);
		if (isTurnPage) {
			var studentListTab = document.getElementsBYClassName('list')[0];
			studentListTab.click();
			if (id == 'edit-student-form') {
				var mask = document.getElementsBYClassName('mask')[0];
				mask.click();
			}
		}
		form.reset();

	})



}

// 数据交互 减少冗余 （）
function transferData(url,data,cb){
	if (!data) {
		data = {};
	}
	var resule = saveData('https://api.duyiedu.com' + url,Object.assign(data,{
		appkey: 'shannon_1584933284957'
	}));
	if (result.status == 'success') {
		cb(result);
	}else{
		alert(result.msg);
	}


}
function saveData(url,param){
	var resule = null;
	var xhr = null;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	}else{
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}

	if (typeof param == 'string') {
		xhr.open('GEt',url + '?' + param,false);
	}else if(typeof param == 'object'){
		var str = '';
		for(var prop in param){
			str += prop + '=' + param[prop] + '&';
		}
		xhr.open('GET',url + '?' + str,false);
	}else{
		xhr.open('GET',url + '?' + param.toString(),false);
	}
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				result = JSON.parse(xhr.responseText);
			}
		}
	}
	xhr.send();
	return result;

}


function getFormData(dom){
	var name = form.name.value;
    var sNo = form.sNo.value;
    var birth = form.birth.value;
    var sex = form.sex.value;
    var phone = form.phone.value;
    var email = form.email.value;
    var address = form.address.value;

	if (!name || !sNo || !birth || !phone || !email || !address) {
        alert('部分数据未填写，请填写完成后提交');
        return false;
    }
    return {
        name: name,
        sNo: sNo,
        birth: birth,
        sex: sex,
        phone: phone,
        email: email,
        address: address,
    }

}



function changeMenu(e){
	var target = e.target.tagName;
	if (target == 'DD') {
		initMenuCss(e.target);
		var id = e.target.getAttribute('data-id');
		var content = document.getElementById(id);

		initContentCss(content);



		if (id == 'student-list') {
            // 渲染右侧表格
            renderTable();
        }

	}

}
// 渲染右侧表格
function renderTable(){
	transferData('/api/student/findAll',"",function(res){
		var data = res.data;
		tableData = data;
		var str = '';
		data.forEach(function(item,index){
			str +='<tr>\
			<td>' + item.sNo + '</td>\
			<td>' + item.name + '</td>\
			<td>' + (item.sex ? '女' : '男') + '</td>\
			<td>' + item.email + '</td>\
			<td>' + (new Date().getFullYear() - item.birth) + '</td>\
			<td>' + item.phone + '</td>\
			<td>' + item.address +'</td>\
			<td>\
                <button class="btn edit" data-index=' + index + '>编辑</button>\
                <button class="btn del" data-index=' + index + '>删除</button>\
            </td>\
        </tr>'
		});
		var tBody = document.getElementById('tbody');
		tBody.innerHTML = str;
	})
}

function initMenuCss(dom){
	var active = document.getElementsByClassName('active');
	for (var i = 0; i < active.length; i++) {
		active[i].classList.remove('active');

	}
	dom.classList.add('active');

}
function initContentCss(dom){

	var contentActive = document.getElementsByClassName('student-content-active');
	for (var i = 0; i < contentActive.length; i++) {
		contentActive[i].classList.remove('student-content-active');
		
	}
	dom.classList.add('student-content-active');

}


init();