var curPage = 1;
var pageSize = 4;
var tableData = [];
var allPage = 1;

function bindEvent(){
	$('#menu-list').on('click','dd',function(){
		$(this).siblings().removeClass('active');
		$(this).addClass('active');

		var id = $(this).data('id');

		if (id == 'student-list') {
            curPage = 1;
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
		if (!data) {
            alert('请将信息填写完全后提交');
        } else {
			transferData('/api/student/addStudent', data, function (res) {
                alert('提交成功');
                $('#add-student-form')[0].reset();
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
    });
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

    });
    $('#search-btn').click(function () {
        var val = $('#search-inp').val();

        // 将当前页置为1 获取表格数据
        curPage = 1;
        getTableData(val);
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

// 获取学生列表数据
function getTableData(val) {
    // 过滤表格数据
    if (val) {
        // 默认不分性别
        var sex = -1;
        // 搜索关键字为输入框内数据
        var search = val.trim();
        // 如果输入框内有男/ 女关键字  则修改性别属性 以及搜索关键字
        if (val.indexOf('男') != -1) {
            sex = 0;
            search = val.replace('男', '').trim();
        }
        if (val.indexOf('女') != -1) {
            sex = 1;
            search = val.replace('女', '').trim();
        }
        transferData('/api/student/searchStudent', {
            page: curPage,
            size: pageSize,
            search: search ? search : null,
            sex: sex
        }, function (res) {
            // 保存表格数据
            
            tableData = res.searchList;
            allPage = Math.ceil(res.cont / pageSize);
            renderTable(res.searchList);
        })
    // 不过滤表格数据
    } else {
        transferData('/api/student/findByPage', {
            page: curPage,
            size: pageSize
        }, function (res) {
            // 保存表格数据
            tableData = res.findByPage;
            allPage = Math.ceil(res.cont / pageSize);
            renderTable(res.findByPage);
        });
    }
    
}

// function getTableData() {
//     transferData('/api/student/findByPage', {
//         page: curPage,
//         size: pageSize,
//         search: search ? search : null,
//         sex: sex
//     }, function (res) {
//         console.log(res);
//         tableData = res.findByPage;
//         allPage = Math.ceil(res.cont / pageSize);
//         renderTable(res.findByPage);
//     })
// }
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
    $('#page').turnpage({
        curPage: curPage,
        allPage: allPage,
        callback: function (page) {
            curPage = page;
            getTableData($('#search-inp').val())
            
        }
    })
}



function transferData(url,data,cb){
	$.ajax({
		url: 'https://api.duyiedu.com' + url,
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
// 将表单数据转换成对象
function checkData(data){
	var obj = {};
    // for循环的数据可以是数组  也可以是对象（类数组）
    // forEach循环只能是数组
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (!item.value) {
            // 如果是数组的forEach  或者map  filter  方法中return的话  代表的是方法的返回值  
            // 否则是最近一层函数的返回值
            return false;
        }
        obj[item.name] = item.value;
    }
    return obj;
}


function init(){
	bindEvent();
	$('#menu-list > dd[data-id=student-list]').trigger('click');
}

init();
