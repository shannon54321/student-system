var curPage = 1;
var pageSize = 15;
var tableData = [];


function bindEvent(){
	$('#menu-list').on('click','dd',function(){
		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		var id = $(this).data('id');

		if (id == 'student-list') {
            getTableData();
        }


		$('.student-content').fadeOut();
		$('#' + id).fadeIn();
	});


	//添加学生页面提交

	$('#add-student-btn').click(function(e){
		e.preventDefault();
		var data = $('#add-student-form').serializeArray();
		data = checkData(data);
		if (data) {
			transferData('/api/student/addStudent', data, function (res) {
                alert('提交成功');
                $('#menu-list > dd[data-id=student-list]').trigger('click');
            })
		}

	})
	$('#edit-student-btn').click(function (e) {
        e.preventDefault();
        var data = $('#edit-student-form').serializeArray();
        data = checkData(data);
        if (data) {
            transferData('/api/student/updateStudent', data, function (res) {
                alert('修改成功');
                $('#modal').slideUp();
                $('#menu-list > dd[data-id=student-list]').trigger('click');
            })
        }
        console.log(data);
    });
    $('#mask').click(function (e) {
        $('#modal').slideUp();
    })
    $('#tbody').on('click', '.btn', function () {
        var isEdit = $(this).hasClass('edit');
        var index = $(this).data('index');
        // tableData[index]
        if (isEdit) {
            renderEditModel(tableData[index]);
            $('#modal').slideDown();
        } else {
            var isDel = confirm('确认删除' + tableData[index].name  + '学生的信息？');
            if (isDel) {
                transferData('/api/student/delBySno', {
                    sNo: tableData[index].sNo,
                }, function(res) {
                    alert('删除成功');
                    $('#menu-list > dd[data-id=student-list]').trigger('click');
                })
            }
        }

    })

}
function renderEditModel(data) {
    var form = $('#edit-student-form')[0];
    for (var prop in data) {
        if (form[prop]) {
            form[prop].value = data[prop];
        }
    }
}

//  获取表格数据
function getTableData() {
    transferData('/api/student/findByPage', {
        page: curPage,
        size: pageSize
    }, function (res) {
        console.log(res);
        tableData = res.findByPage;
        renderTable(res.findByPage);
    })
}
// 渲染表格数据
function renderTable(data) {
    var str = '';
    data.forEach(function(item, index) {
        str += '<tr>\
        <td>' + item.sNo + '</td>\
        <td>' + item.name + '</td>\
        <td>' + (item.sex ? '女': '男') + '</td>\
        <td>' + item.email + '</td>\
        <td>' + (new Date().getFullYear() - item.birth )+ '</td>\
        <td>' + item.phone + '</td>\
        <td>' + item.address + '</td>\
        <td>\
            <button class="btn edit" data-index=' + index + '>编辑</button>\
            <button class="btn del" data-index=' + index + '>删除</button>\
        </td>\
    </tr>'
    });
    $('#tbody').html(str);
}



function transferData(url,data,cb){
	$.ajax({
		url: 'http://api.duyiedu.com' + url,
		type: 'get',
		data: $.extend({
			appkey: 'shannon_1584933284957'
		},data),
		dataType: 'json',
        success: function (res) {
            // console.log(JSON.parse(res));
            if (res.status == 'success') {
                cb(res.data)
            } else {
                alert(res.msg);
            }
        }
	})

}

function checkData(data){
	var obj = {};
	var flag = true;
	data.forEach(function(item,index){
		obj[item.name] = item.value;
		if (!item.value) {
			flag = false;
		}
	});
	if (!flag) {
		return false;

	}
	return obj;
}


function init(){
	bindEvent();
	$('#menu-list > dd[data-id=student-list]').trigger('click');
}

init();
