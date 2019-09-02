// 查询账号-个人信息

function PeopleInfo(data) {
	$('#chakanInfoTable').bootstrapTable({
		data: data,
		striped: true,
		columns: [{
				field: 'number',
				align: 'center',
				valign: 'middle',
				formatter: function(value, row, index) {
					var pageSize = 10;
					return pageSize * (personPage - 1) + index + 1; // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
				}
			},
			{
				field: 'status',
				valign: 'middle',
				align: 'center',
				formatter: statusFormatter,

			},
			{
				field: 'option',
				valign: 'middle',
				align: 'center',
				formatter: option2Formatter,
				// events: optionEvents,
			},
			{
				field: 'EQDCode',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'staffName',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'uptel',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'usex',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'unation',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'udate',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'udate',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'uhousetype',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'upadress',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'umarry',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'uheigh',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'uweigh',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'ublood',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'ubelief',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'upoliticstate',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'uinterest',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'uqq',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'uwchat',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'umail',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'ucontactname',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'uforeignclass',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'ugrad',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'umajor',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'uedu',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'addtime',
				valign: 'middle',
				align: 'center',

				formatter: timeFormatter
			}
		]
	});
	$("#chakanInfoTable").bootstrapTable('load', data);

	function timeFormatter(e, value, row, index) {
		var timeDay = (value.addTime).split(" ")[0];
		return [
			timeDay
		].join('');
	};

	function option2Formatter(row, value, index) {
		// console.log(value.Guid)
		var btnVal;
		if (value.status == 0) {
			btnVal = "封号"
		} else {
			btnVal = "解封";
		}
		return [
			'<a class="statusOption" >',
			'<span id="statusOption">' + btnVal + '</span>',
			'</a><br/>',
			'<a class="logindetails" >',
			'<span id="logindetails">登陆情况</span>',
			'</a>',
		].join('');
	};


	function statusFormatter(row, value, index) {
		var statusVal, btnVal;
		if (value.status == 0) {
			statusVal = "正常";
			btnVal = "封号"
		} else {
			statusVal = "封号中";
			btnVal = "解封";
		}
		return [
			'<a class="statusCondition" >',
			'<span id="statusCondition">' + statusVal + '</span>',
			'</a>',
		].join('');
	}
};
// ///////////////////////////////////////////////////////////////
loadPersonDetailsInit(0);
function loadPersonDetailsInit(page){
	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and EQDCode like" +"'%" + '' + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve pull-left">上一页</button><button class="personBtnNext pull-right">下一页</button></p>'
		);
		$('.personBtnNext').click(function() {
			loadPersonDetailsInit(personPage)
		});
		$('.personBtnPrve').click(function() {
			loadPersonDetailsInit(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext').show()
				} else {
					$('.personBtnPrve').hide()
					$('.personBtnNext').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext').show()
					$('.personBtnPrve').show()
				} else {
					$('.personBtnNext').hide()
					$('.personBtnPrve').show()
				}
			}
		}
	});
}
	

// 单个条件筛选
// 易企点号
$(".thcont li").eq(3).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		skin: "layui-layer-lan",
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhyq"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails3(0)
			layer.closeAll()
		}
	});
});

function loadPersonDetails3(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and EQDCode like" + "'%" + $('.yq').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve2 pull-left">上一页</button><button class="personBtnNext2 pull-right">下一页</button></p>'
		);
		$('.personBtnNext2').click(function() {
			loadPersonDetails2(personPage)
		});
		$('.personBtnPrve2').click(function() {
			loadPersonDetails2(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve2').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext2').show()
				} else {
					$('.personBtnPrve2').hide()
					$('.personBtnNext2').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext2').show()
					$('.personBtnPrve2').show()
				} else {
					$('.personBtnNext2').hide()
					$('.personBtnPrve2').show()
				}
			}
		}
	});
};
// 姓名
$(".thcont li").eq(4).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhxm"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails4(0)
			layer.closeAll()
		}
	});
});

function loadPersonDetails4(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and staffName like" + "'%" + $('.xm').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve4 pull-left">上一页</button><button class="personBtnNext4 pull-right">下一页</button></p>'
		);
		$('.personBtnNext4').click(function() {
			loadPersonDetails4(personPage)
		});
		$('.personBtnPrve4').click(function() {
			loadPersonDetails4(Number(personPage) - 2)
		});

		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve4').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext4').show()
				} else {
					$('.personBtnPrve4').hide()
					$('.personBtnNext4').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext4').show()
					$('.personBtnPrve4').show()
				} else {
					$('.personBtnNext4').hide()
					$('.personBtnPrve4').show()
				}
			}
		}
	});
};
// 电话

$(".thcont li").eq(5).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhdh"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails5(0)
			layer.closeAll()
		}
	});

});

function loadPersonDetails5(page) {
	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and uptel like " + "'%" + $('.dh').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve5 pull-left">上一页</button><button class="personBtnNext5 pull-right">下一页</button></p>'
		);
		$('.personBtnNext5').click(function() {
			loadPersonDetails5(personPage);
		});
		$('.personBtnPrve5').click(function() {
			loadPersonDetails5(Number(personPage) - 2);
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items);
			if (personPage <= 1) {
				$('.personBtnPrve5').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext5').show()
				} else {
					$('.personBtnPrve5').hide()
					$('.personBtnNext5').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext5').show()
					$('.personBtnPrve5').show()
				} else {
					$('.personBtnNext5').hide()
					$('.personBtnPrve5').show()
				}
			}
		}
	});
};
// 性别
$(".thcont li").eq(6).on("click", function() {

	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '240px'],
		title: '搜索',
		content: $(".srhxb"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails6(0);
			layer.closeAll()
		}
	});
});

function loadPersonDetails6(page) {
	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and usex like " + "'%" + $('.xb').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve6 pull-left">上一页</button><button class="personBtnNext6 pull-right">下一页</button></p>'
		);
		$('.personBtnNext6').click(function() {
			loadPersonDetails6(personPage)
		});
		$('.personBtnPrve6').click(function() {
			loadPersonDetails6(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data);
		console.log("查询数据", dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve6').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext6').show()
				} else {
					$('.personBtnPrve6').hide()
					$('.personBtnNext6').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext6').show()
					$('.personBtnPrve6').show()
				} else {
					$('.personBtnNext6').hide()
					$('.personBtnPrve6').show()
				}
			}
		}
	});
};
// ，民族
$(".thcont li").eq(7).on("click", function() {
	
	$.post('' + http_head + '/Option_AreasAnd.ashx', {
		"type": 14
	}, function(data) {
		for (var i = 0; i < data.length; i++) {
			$('#nationChoose2').append('<option value="' + data[i].name + '">' + data[i].name + '</option>')
		}
		$(".select2").selectpicker('refresh');
	});
	
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '400px'],
		title: '搜索',
		content: $(".srhmz"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails7(0)
			layer.closeAll()
		}
	});
});

function loadPersonDetails7(page) {

	var nation;
	if ($('#nationChoose2').val() == null) {
		nation = ""
	} else {
		nation = $('#nationChoose2').val()
	}
	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and unation like " + "'%" + nation + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve7 pull-left">上一页</button><button class="personBtnNext7 pull-right">下一页</button></p>'
		);
		$('.personBtnNext7').click(function() {
			loadPersonDetails7(personPage)
		});
		$('.personBtnPrve7').click(function() {
			loadPersonDetails7(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log("查询数据", dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve7').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext7').show()
				} else {
					$('.personBtnPrve7').hide()
					$('.personBtnNext7').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext7').show()
					$('.personBtnPrve7').show()
				} else {
					$('.personBtnNext7').hide()
					$('.personBtnPrve7').show()
				}
			}
		}
	});
}

// 出生日期(待)
$(".thcont li").eq(8).on("click", function() {

	var personPage;
	layer.open({
		type: 1,
		area: ['400px', '500px'],
		title: '搜索',
		content: $(".srhcs"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails8(0)
			layer.closeAll()
		}
	});
	laydate.render({
		elem: '.cs',
		max: 0
	});
})

function loadPersonDetails8(page) {
	console.log($('.cs').val())
	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and udate like " + "'%" + $('.cs').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve8 pull-left">上一页</button><button class="personBtnNext8 pull-right">下一页</button></p>'
		);
		$('.personBtnNext8').click(function() {
			loadPersonDetails8(personPage)
		});
		$('.personBtnPrve8').click(function() {
			loadPersonDetails8(Number(personPage) - 2)
		});

		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve8').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext8').show()
				} else {
					$('.personBtnPrve8').hide()
					$('.personBtnNext8').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext8').show()
					$('.personBtnPrve8').show()
				} else {
					$('.personBtnNext8').hide()
					$('.personBtnPrve8').show()
				}
			}
		}
	});
}
// 户口性质
$(".thcont li").eq(10).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '240px'],
		title: '搜索',
		content: $(".srhhk"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails10(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails10(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and uhousetype like " + "'%" + $('.hk').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve10 pull-left">上一页</button><button class="personBtnNext10 pull-right">下一页</button></p>'
		);
		$('.personBtnNext10').click(function() {
			loadPersonDetails10(personPage)
		});
		$('.personBtnPrve10').click(function() {
			loadPersonDetails10(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve10').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext10').show()
				} else {
					$('.personBtnPrve10').hide()
					$('.personBtnNext10').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext10').show()
					$('.personBtnPrve10').show()
				} else {
					$('.personBtnNext10').hide()
					$('.personBtnPrve10').show()
				}
			}
		}
	});
}


// 现住址(待)

$(".thcont li").eq(11).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['340px', '600px'],
		title: '搜索',
		content: $(".srhxz"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails11(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails11(page) {

	var p = $("#province1 option:selected").val();
	var c = $("#city1 option:selected").val();
	var d = $("#district1 option:selected").val();
	var address = p + c + d;

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and upadress like " + "'%" + address + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve11 pull-left">上一页</button><button class="personBtnNext11 pull-right">下一页</button></p>'
		);
		$('.personBtnNext11').click(function() {
			loadPersonDetails11(personPage)
		});
		$('.personBtnPrve11').click(function() {
			loadPersonDetails11(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve11').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext11').show()
				} else {
					$('.personBtnPrve11').hide()
					$('.personBtnNext11').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext11').show()
					$('.personBtnPrve11').show()
				} else {
					$('.personBtnNext11').hide()
					$('.personBtnPrve11').show()
				}
			}
		}
	});
}

// 婚否
$(".thcont li").eq(12).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '240px'],
		title: '搜索',
		content: $(".srhhf"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails12(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails12(page) {
	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and umarry like " + "'%" + $('.hf').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve12 pull-left">上一页</button><button class="personBtnNext12 pull-right">下一页</button></p>'
		);
		$('.personBtnNext12').click(function() {
			loadPersonDetails12(personPage)
		});
		$('.personBtnPrve12').click(function() {
			loadPersonDetails12(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve12').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext12').show()
				} else {
					$('.personBtnPrve12').hide()
					$('.personBtnNext12').hide()
				}
			} else {
				if (dataSearPerson.items.length > 10) {
					$('.personBtnNext12').show()
					$('.personBtnPrve12').show()
				} else {
					$('.personBtnNext12').hide()
					$('.personBtnPrve12').show()
				}
			}
		}
	});
}


// 身高
$(".thcont li").eq(13).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhsg"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails13(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails13(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and uheigh like " + "'%" + $('.sg').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve13 pull-left">上一页</button><button class="personBtnNext13 pull-right">下一页</button></p>'
		);
		$('.personBtnNext13').click(function() {
			loadPersonDetails13(personPage)
		});
		$('.personBtnPrve13').click(function() {
			loadPersonDetails13(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve13').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext13').show()
				} else {
					$('.personBtnPrve13').hide()
					$('.personBtnNext13').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext13').show()
					$('.personBtnPrve13').show()
				} else {
					$('.personBtnNext13').hide()
					$('.personBtnPrve13').show()
				}
			}
		}
	});
}


// 体重

$(".thcont li").eq(14).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhtz"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails14(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails14(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and uweigh like " + "'%" + $('.tz').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve14 pull-left">上一页</button><button class="personBtnNext14 pull-right">下一页</button></p>'
		);
		$('.personBtnNext14').click(function() {
			loadPersonDetails14(personPage)
		});
		$('.personBtnPrve14').click(function() {
			loadPersonDetails14(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve14').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext14').show()
				} else {
					$('.personBtnPrve14').hide()
					$('.personBtnNext14').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext14').show()
					$('.personBtnPrve14').show()
				} else {
					$('.personBtnNext14').hide()
					$('.personBtnPrve14').show()
				}
			}
		}
	});
}

// 血型
$(".thcont li").eq(15).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '280px'],
		title: '搜索',
		content: $(".srhxx"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails15(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails15(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and ublood like " + "'%" + $('.xx').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve15 pull-left">上一页</button><button class="personBtnNext15 pull-right">下一页</button></p>'
		);
		$('.personBtnNext15').click(function() {
			loadPersonDetails15(personPage)
		});
		$('.personBtnPrve15').click(function() {
			loadPersonDetails15(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve15').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext15').show()
				} else {
					$('.personBtnPrve15').hide()
					$('.personBtnNext15').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext15').show()
					$('.personBtnPrve15').show()
				} else {
					$('.personBtnNext15').hide()
					$('.personBtnPrve15').show()
				}
			}
		}
	});
}

// 信仰
$(".thcont li").eq(16).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '320px'],
		title: '搜索',
		content: $(".srhxy"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails16(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails16(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and ubelief like " + "'%" + $('.xy').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve16 pull-left">上一页</button><button class="personBtnNext16 pull-right">下一页</button></p>'
		);
		$('.personBtnNext16').click(function() {
			loadPersonDetails16(personPage)
		});
		$('.personBtnPrve16').click(function() {
			loadPersonDetails16(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve16').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext16').show()
				} else {
					$('.personBtnPrve16').hide()
					$('.personBtnNext16').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext16').show()
					$('.personBtnPrve16').show()
				} else {
					$('.personBtnNext16').hide()
					$('.personBtnPrve16').show()
				}
			}
		}
	});
}
// 政治面貌
$(".thcont li").eq(17).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '340px'],
		title: '搜索',
		content: $(".srhzz"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails17(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails17(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and upoliticstate like " + "'%" + $('.zz').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve17 pull-left">上一页</button><button class="personBtnNext17 pull-right">下一页</button></p>'
		);
		$('.personBtnNext17').click(function() {
			loadPersonDetails17(personPage)
		});
		$('.personBtnPrve17').click(function() {
			loadPersonDetails17(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve17').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext17').show()
				} else {
					$('.personBtnPrve17').hide()
					$('.personBtnNext17').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext17').show()
					$('.personBtnPrve17').show()
				} else {
					$('.personBtnNext17').hide()
					$('.personBtnPrve17').show()
				}
			}
		}
	});
}
// 兴趣爱好
$(".thcont li").eq(18).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhxq"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails18(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails18(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and uinterest like " + "'%" + $('.xq').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve18 pull-left">上一页</button><button class="personBtnNext18 pull-right">下一页</button></p>'
		);
		$('.personBtnNext18').click(function() {
			loadPersonDetails18(personPage)
		});
		$('.personBtnPrve18').click(function() {
			loadPersonDetails18(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve18').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext18').show()
				} else {
					$('.personBtnPrve18').hide()
					$('.personBtnNext18').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext18').show()
					$('.personBtnPrve18').show()
				} else {
					$('.personBtnNext18').hide()
					$('.personBtnPrve18').show()
				}
			}
		}
	});
}
// QQ
$(".thcont li").eq(19).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhqq"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails19(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails19(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and uqq like " + "'%" + $('.qq').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve pull-left">上一页</button><button class="personBtnNext pull-right">下一页</button></p>'
		);
		$('.personBtnNext').click(function() {
			loadPersonDetails(personPage)
		});
		$('.personBtnPrve').click(function() {
			loadPersonDetails(Number(personPage) - 2)
		});

		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext').show()
				} else {
					$('.personBtnPrve').hide()
					$('.personBtnNext').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext').show()
					$('.personBtnPrve').show()
				} else {
					$('.personBtnNext').hide()
					$('.personBtnPrve').show()
				}
			}
		}
	});
}
// 微信
$(".thcont li").eq(20).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhwx"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails20(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails20(page) {
	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and uwchat like " + "'%" + $('.wx').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve pull-left">上一页</button><button class="personBtnNext pull-right">下一页</button></p>'
		);
		$('.personBtnNext').click(function() {
			loadPersonDetails(personPage)
		});
		$('.personBtnPrve').click(function() {
			loadPersonDetails(Number(personPage) - 2)
		});

		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext').show()
				} else {
					$('.personBtnPrve').hide()
					$('.personBtnNext').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext').show()
					$('.personBtnPrve').show()
				} else {
					$('.personBtnNext').hide()
					$('.personBtnPrve').show()
				}
			}
		}
	});
}
// 邮箱
$(".thcont li").eq(21).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhyx"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails21(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails21(page) {
	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and umail like " + "'%" + $('.yx').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve pull-left">上一页</button><button class="personBtnNext pull-right">下一页</button></p>'
		);
		$('.personBtnNext').click(function() {
			loadPersonDetails(personPage)
		});
		$('.personBtnPrve').click(function() {
			loadPersonDetails(Number(personPage) - 2)
		});

		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext').show()
				} else {
					$('.personBtnPrve').hide()
					$('.personBtnNext').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext').show()
					$('.personBtnPrve').show()
				} else {
					$('.personBtnNext').hide()
					$('.personBtnPrve').show()
				}
			}
		}
	});
}
// 紧急联系人
$(".thcont li").eq(22).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhjj"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails22(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails22(page) {
	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and ucontactname like " + "'%" + $('.jj').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve pull-left">上一页</button><button class="personBtnNext pull-right">下一页</button></p>'
		);
		$('.personBtnNext').click(function() {
			loadPersonDetails(personPage)
		});
		$('.personBtnPrve').click(function() {
			loadPersonDetails(Number(personPage) - 2)
		});

		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext').show()
				} else {
					$('.personBtnPrve').hide()
					$('.personBtnNext').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext').show()
					$('.personBtnPrve').show()
				} else {
					$('.personBtnNext').hide()
					$('.personBtnPrve').show()
				}
			}
		}
	});
}
//外语等级
$(".thcont li").eq(23).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '280px'],
		title: '搜索',
		content: $(".srhwy"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails23(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails23(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and uforeignclass like " + "'%" + $('.wy').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve23 pull-left">上一页</button><button class="personBtnNext23 pull-right">下一页</button></p>'
		);
		$('.personBtnNext23').click(function() {
			loadPersonDetails23(personPage)
		});
		$('.personBtnPrve23').click(function() {
			loadPersonDetails23(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve23').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext23').show()
				} else {
					$('.personBtnPrve23').hide()
					$('.personBtnNext23').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext23').show()
					$('.personBtnPrve23').show()
				} else {
					$('.personBtnNext23').hide()
					$('.personBtnPrve23').show()
				}
			}
		}
	});
}
// 毕业院校
$(".thcont li").eq(24).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhby"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails24(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails24(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and ugrad like " + "'%" + $('.by').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve24 pull-left">上一页</button><button class="personBtnNext24 pull-right">下一页</button></p>'
		);
		$('.personBtnNext24').click(function() {
			loadPersonDetails24(personPage)
		});
		$('.personBtnPrve24').click(function() {
			loadPersonDetails24(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve24').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext24').show()
				} else {
					$('.personBtnPrve24').hide()
					$('.personBtnNext24').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext24').show()
					$('.personBtnPrve24').show()
				} else {
					$('.personBtnNext24').hide()
					$('.personBtnPrve24').show()
				}
			}
		}
	});
}
// 所学专业
$(".thcont li").eq(25).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: '搜索',
		content: $(".srhzy"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails25(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails25(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and umajor like " + "'%" + $('.zy').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve25 pull-left">上一页</button><button class="personBtnNext25 pull-right">下一页</button></p>'
		);
		$('.personBtnNext25').click(function() {
			loadPersonDetails25(personPage)
		});
		$('.personBtnPrve25').click(function() {
			loadPersonDetails25(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve25').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext25').show()
				} else {
					$('.personBtnPrve25').hide()
					$('.personBtnNext25').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext25').show()
					$('.personBtnPrve25').show()
				} else {
					$('.personBtnNext25').hide()
					$('.personBtnPrve25').show()
				}
			}
		}
	});
}
// 文化程度
$(".thcont li").eq(26).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['300px', '320px'],
		title: '搜索',
		content: $(".srhwh"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails26(0)
			layer.closeAll()
		}
	});

})

function loadPersonDetails26(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and uedu like " + "'%" + $('.wh').val() +
			"%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve26 pull-left">上一页</button><button class="personBtnNext26 pull-right">下一页</button></p>'
		);
		$('.personBtnNext26').click(function() {
			loadPersonDetails26(personPage)
		});
		$('.personBtnPrve26').click(function() {
			loadPersonDetails26(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve26').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext26').show()
				} else {
					$('.personBtnPrve26').hide()
					$('.personBtnNext26').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext26').show()
					$('.personBtnPrve26').show()
				} else {
					$('.personBtnNext26').hide()
					$('.personBtnPrve26').show()
				}
			}
		}
	});
}
// 注册时间
$(".thcont li").eq(27).on("click", function() {
	var personPage;
	layer.open({
		type: 1,
		area: ['400px', '500px'],
		title: '搜索',
		content: $(".srhzc"),
		btn: '确定',
		yes: function(index, layero) {
			console.log(index, layero)
			loadPersonDetails27(0)
			layer.closeAll()
		},
	});
	laydate.render({
		elem: '.zc',
		max: 0
	});
})

function loadPersonDetails27(page) {

	$.post('' + http_head + '/servers/SuperAdmin/Get_UserBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page,
		"para": "and addTime like " + "'%" + $('.zc').val() + "%'"
	}, function(data) {
		$(".btnArea").replaceWith(
			'<p class="btnArea clearfix"><button class="personBtnPrve27 pull-left">上一页</button><button class="personBtnNext27 pull-right">下一页</button></p>'
		);
		$('.personBtnNext27').click(function() {
			loadPersonDetails27(personPage)
		});
		$('.personBtnPrve27').click(function() {
			loadPersonDetails27(Number(personPage) - 2)
		});
		var dataSearPerson = JSON.parse(data)
		console.log(dataSearPerson)
		if (dataSearPerson.status == 200) {
			personPage = dataSearPerson.page;
			PeopleInfo(dataSearPerson.items)
			if (personPage <= 1) {
				$('.personBtnPrve27').hide()
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext27').show()
				} else {
					$('.personBtnPrve27').hide()
					$('.personBtnNext27').hide()
				}
			} else {
				if (dataSearPerson.items.length >= 10) {
					$('.personBtnNext27').show()
					$('.personBtnPrve27').show()
				} else {
					$('.personBtnNext27').hide()
					$('.personBtnPrve27').show()
				}
			}
		}
	});
}
// 重置地址
$('#reset').click(function() {
	$("#distpicker").distpicker('reset');
});
$('#reset4').click(function() {
	$("#distpicker4").distpicker('reset');
});
$('#comreset').click(function() {
	$("#distpicker2").distpicker('reset');
});
$('#comreset2').click(function() {
	$("#distpicker3").distpicker('reset');
});
// 初始化置空
$("#distpicker3").distpicker({
	autoSelect: false
});
$("#distpicker2").distpicker({
	autoSelect: false
});
$("#distpicker").distpicker({
	autoSelect: false
});
$("#distpicker4").distpicker({
	autoSelect: false
});
// 企业信息查询
var timeDay;

function comConformInfoFun(data) {
	$('#comConformInfoTable').bootstrapTable({
		data: data,
		columns: [{
				field: 'number',
				align: 'center',
				valign: 'middle',
				formatter: function(value, row, index) {
					var pageSize = 10;
					return pageSize * (comPage - 1) + index + 1; // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
				}
			},
			{
				field: 'com_logo',
				valign: 'middle',
				align: 'center',
				formatter: imgFormatter
			},
			{
				field: 'company',
				valign: 'middle',
				align: 'center',
			},

			{
				field: 'com_simplyName',
				valign: 'middle',
				align: 'center',
			},

			{
				field: 'staffnum',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'com_email',
				valign: 'middle',
				align: 'center',
			},

			{
				field: 'com_dutyman',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'com_dutytel',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'createTime',
				valign: 'middle',
				align: 'center',
				formatter: time3Formatter
			},
			{
				field: 'com_type',
				valign: 'middle',
				align: 'center',
			},
			{
				field: 'com_adress',
				valign: 'middle',
				align: 'center',
			},

		]
	});
	$("#comConformInfoTable").bootstrapTable('load', data);

	function time3Formatter(e, value, row, index) {
		timeDay = (value.createTime).split("T")[0];
		return [
			timeDay
		].join('');
	};

	function imgFormatter(e, value, row, index) {
		var imgU = value.com_logo.replace(/.png/, "min.png")
		return [
			'<img src="' + value.com_logo + '" alt="">'
		].join('');
	};
}
// ////////////////////////////////////////////////////
loadDataInit(0);
function loadDataInit(page2) {
	$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page2,
		"para": "and com_name like " + "'%" + '' + "%'"
	}, function(data) {
		var dataCompany = JSON.parse(data)

		$(".combtnArea").replaceWith(
			'<p class="combtnArea clearfix"><button class="companyBtnPrve pull-left">上一页</button><button class="companyBtnNext pull-right">下一页</button></p>'
		);
		$('.companyBtnNext').click(function() {
			loadDataInit(comPage)
		});
		$('.companyBtnPrve').click(function() {
			loadDataInit(Number(comPage) - 2)
		});
		if (dataCompany.status == 200) {
			comPage = dataCompany.page
			comConformInfoFun(dataCompany.items)
			if (comPage <= 1) {
				$('.companyBtnPrve').hide()
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext').show()
				} else {
					$('.companyBtnPrve').hide()
					$('.companyBtnNext').hide()
				}
			} else {
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext').show()
					$('.companyBtnPrve').show()
				} else {
					$('.companyBtnNext').hide()
					$('.companyBtnPrve').show()
				}
			}
		}
	});
}
// 单项筛选
// 企业名称
$('.thcontrc li').eq(2).on("click", function() {
	var comPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: ['搜索'],
		content: $(".srhmc"),
		btn: '确定',
		yes: function loadData(index, layero) {
			loadData2(0)
			layer.closeAll()
		}
	});
});

function loadData2(page2) {
	$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page2,
		"para": "and com_name like " + "'%" + $('.mc').val() + "%'"
	}, function(data) {
		var dataCompany = JSON.parse(data)

		$(".combtnArea").replaceWith(
			'<p class="combtnArea clearfix"><button class="companyBtnPrve2 pull-left">上一页</button><button class="companyBtnNext2 pull-right">下一页</button></p>'
		);
		$('.companyBtnNext2').click(function() {
			loadData2(comPage)
		});
		$('.companyBtnPrve2').click(function() {
			loadData2(Number(comPage) - 2)
		});
		if (dataCompany.status == 200) {
			comPage = dataCompany.page
			comConformInfoFun(dataCompany.items)
			if (comPage <= 1) {
				$('.companyBtnPrve2').hide()
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext2').show()
				} else {
					$('.companyBtnPrve2').hide()
					$('.companyBtnNext2').hide()
				}
			} else {
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext2').show()
					$('.companyBtnPrve2').show()
				} else {
					$('.companyBtnNext2').hide()
					$('.companyBtnPrve2').show()
				}
			}
		}
	});
}
// 企业简称
$('.thcontrc li').eq(3).on("click", function() {
	var comPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: ['搜索'],
		content: $(".srhjc"),
		btn: '确定',
		yes: function(index, layero) {
			loadData3(0)
			layer.closeAll()
		}
	});
});

function loadData3(page2) {
	$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page2,
		"para": "and com_simplyName like " + "'%" + $('.jc').val() + "%'"
	}, function(data) {
		var dataCompany = JSON.parse(data)
		$(".combtnArea").replaceWith(
			'<p class="combtnArea clearfix"><button class="companyBtnPrve3 pull-left">上一页</button><button class="companyBtnNext3 pull-right">下一页</button></p>'
		);
		$('.companyBtnNext3').click(function() {
			loadData3(comPage)
		});
		$('.companyBtnPrve3').click(function() {
			loadData3(Number(comPage) - 2)
		});
		if (dataCompany.status == 200) {
			comPage = dataCompany.page
			comConformInfoFun(dataCompany.items)
			if (comPage <= 1) {
				$('.companyBtnPrve3').hide()
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext3').show()
				} else {
					$('.companyBtnPrve3').hide()
					$('.companyBtnNext3').hide()
				}
			} else {
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext3').show()
					$('.companyBtnPrve3').show()
				} else {
					$('.companyBtnNext3').hide()
					$('.companyBtnPrve3').show()
				}
			}
		}
	});
};
// 企业人数(待)
$('.thcontrc li').eq(4).on("click", function() {
	var comPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: ['搜索'],
		content: $(".srhrs"),
		btn: '确定',
		yes: function(index, layero) {
			loadData4(0)
			layer.closeAll()
		}
	});
});

function loadData4(page2) {
	$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page2,
		"para": "and staffnum like " + "'%" + $('#compangNum').val() + "%'"
	}, function(data) {
		var dataCompany = JSON.parse(data)
		$(".combtnArea").replaceWith(
			'<p class="combtnArea clearfix"><button class="companyBtnPrve4 pull-left">上一页</button><button class="companyBtnNext4 pull-right">下一页</button></p>'
		);
		$('.companyBtnNext4').click(function() {
			loadData4(comPage)
		});
		$('.companyBtnPrve4').click(function() {
			loadData4(Number(comPage) - 2)
		});
		if (dataCompany.status == 200) {
			comPage = dataCompany.page
			comConformInfoFun(dataCompany.items)
			if (comPage <= 1) {
				$('.companyBtnPrve4').hide()
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext4').show()
				} else {
					$('.companyBtnPrve4').hide()
					$('.companyBtnNext4').hide()
				}
			} else {
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext4').show()
					$('.companyBtnPrve4').show()
				} else {
					$('.companyBtnNext4').hide()
					$('.companyBtnPrve4').show()
				}
			}
		}
	});
};
// 企业邮箱
$('.thcontrc li').eq(5).on("click", function() {
	var comPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: ['搜索'],
		content: $(".srhyx2"),
		btn: '确定',
		yes: function(index, layero) {
			loadData5(0)
			layer.closeAll()
		}
	});
});

function loadData5(page2) {
	$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page2,
		"para": "and com_emai like " + "'%" + $('.yx2').val() + "%'"
	}, function(data) {
		var dataCompany = JSON.parse(data)
		$(".combtnArea").replaceWith(
			'<p class="combtnArea clearfix"><button class="companyBtnPrve5 pull-left">上一页</button><button class="companyBtnNext5 pull-right">下一页</button></p>'
		);
		$('.companyBtnNext5').click(function() {
			loadData5(comPage)
		});
		$('.companyBtnPrve5').click(function() {
			loadData5(Number(comPage) - 2)
		});
		if (dataCompany.status == 200) {
			comPage = dataCompany.page
			comConformInfoFun(dataCompany.items)
			if (comPage <= 1) {
				$('.companyBtnPrve5').hide()
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext5').show()
				} else {
					$('.companyBtnPrve5').hide()
					$('.companyBtnNext5').hide()
				}
			} else {
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext5').show()
					$('.companyBtnPrve5').show()
				} else {
					$('.companyBtnNext5').hide()
					$('.companyBtnPrve5').show()
				}
			}
		}
	});
};
// 法人姓名
$('.thcontrc li').eq(6).on("click", function() {
	var comPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: ['搜索'],
		content: $(".srhfr"),
		btn: '确定',
		yes: function(index, layero) {
			loadData6(0)
			layer.closeAll()
		}
	});
});

function loadData6(page2) {
	$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page2,
		"para": "and com_dutyman like " + "'%" + $('.fr').val() + "%'"
	}, function(data) {
		var dataCompany = JSON.parse(data)
		$(".combtnArea").replaceWith(
			'<p class="combtnArea clearfix"><button class="companyBtnPrve6 pull-left">上一页</button><button class="companyBtnNext6 pull-right">下一页</button></p>'
		);
		$('.companyBtnNext6').click(function() {
			loadData6(comPage)
		});
		$('.companyBtnPrve6').click(function() {
			loadData6(Number(comPage) - 2)
		});
		if (dataCompany.status == 200) {
			comPage = dataCompany.page
			comConformInfoFun(dataCompany.items)
			if (comPage <= 1) {
				$('.companyBtnPrve6').hide()
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext6').show()
				} else {
					$('.companyBtnPrve6').hide()
					$('.companyBtnNext6').hide()
				}
			} else {
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext6').show()
					$('.companyBtnPrve6').show()
				} else {
					$('.companyBtnNext6').hide()
					$('.companyBtnPrve6').show()
				}
			}
		}
	});
};
// 法人电话
$('.thcontrc li').eq(7).on("click", function() {
	var comPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: ['搜索'],
		content: $(".srhdh2"),
		btn: '确定',
		yes: function(index, layero) {
			loadData7(0)
			layer.closeAll()
		}
	});
});

function loadData7(page2) {
	$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page2,
		"para": "and com_dutytel like " + "'%" + $('.dh2').val() + "%'"
	}, function(data) {
		var dataCompany = JSON.parse(data)

		$(".combtnArea").replaceWith(
			'<p class="combtnArea clearfix"><button class="companyBtnPrve7 pull-left">上一页</button><button class="companyBtnNext7 pull-right">下一页</button></p>'
		);
		$('.companyBtnNext7').click(function() {
			loadData7(comPage)
		});
		$('.companyBtnPrve7').click(function() {
			loadData7(Number(comPage) - 2)
		});
		if (dataCompany.status == 200) {
			comPage = dataCompany.page
			comConformInfoFun(dataCompany.items)
			if (comPage <= 1) {
				$('.companyBtnPrve7').hide()
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext7').show()
				} else {
					$('.companyBtnPrve7').hide()
					$('.companyBtnNext7').hide()
				}
			} else {
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext7').show()
					$('.companyBtnPrve7').show()
				} else {
					$('.companyBtnNext7').hide()
					$('.companyBtnPrve7').show()
				}
			}
		}
	});
};
//企业性质

$('.thcontrc li').eq(9).on("click", function() {
	var comPage;
	layer.open({
		type: 1,
		area: ['300px', '200px'],
		title: ['搜索'],
		content: $(".srhxz2"),
		btn: '确定',
		yes: function(index, layero) {
			loadData9(0)
			layer.closeAll()
		}
	});

});

function loadData9(page2) {
	$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page2,
		"para": "and com_type like " + "'%" + $('.xz2').val() + "%'"
	}, function(data) {
		var dataCompany = JSON.parse(data)
		$(".combtnArea").replaceWith(
			'<p class="combtnArea clearfix"><button class="companyBtnPrve9 pull-left">上一页</button><button class="companyBtnNext9  pull-right">下一页</button></p>'
		);
		$('.companyBtnNext9').click(function() {
			loadData9(comPage)
		});
		$('.companyBtnPrve9').click(function() {

			loadData9(Number(comPage) - 2)
		});
		if (dataCompany.status == 200) {
			comPage = dataCompany.page
			comConformInfoFun(dataCompany.items)
			if (comPage <= 1) {
				$('.companyBtnPrve9').hide()
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext9').show()
				} else {
					$('.companyBtnPrve9').hide()
					$('.companyBtnNext9').hide()
				}
			} else {
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext9').show()
					$('.companyBtnPrve9').show()
				} else {
					$('.companyBtnNext9').hide()
					$('.companyBtnPrve9').show()
				}
			}
		}
	});
};
// 注册地
$('.thcontrc li').eq(10).on("click", function() {
	var comPage;
	layer.open({
		type: 1,
		area: ['340px', '600px'],
		title: ['搜索'],
		content: $(".srhzcd"),
		btn: '确定',
		yes: function(index, layero) {
			loadData10(0)
			layer.closeAll()
		}
	});

});

function loadData10(page2) {
	var comp = $('#comprovince option:selected').val();
	var comc = $('#comcity option:selected').val();
	var comd = $('#comdistrict option:selected').val();
	var comaddress = comp + comc + comd;
	$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page2,
		"para": "and com_adress like " + "'%" + comaddress + "%'"
	}, function(data) {
		var dataCompany = JSON.parse(data)
		$(".combtnArea").replaceWith(
			'<p class="combtnArea clearfix"><button class="companyBtnPrve10 pull-left">上一页</button><button class="companyBtnNext10  pull-right">下一页</button></p>'
		);
		$('.companyBtnNext10').click(function() {
			loadData10(comPage)
		});
		$('.companyBtnPrve10').click(function() {
			loadData10(Number(comPage) - 2)
		});
		if (dataCompany.status == 200) {
			comPage = dataCompany.page
			comConformInfoFun(dataCompany.items)
			if (comPage <= 1) {
				$('.companyBtnPrve10').hide()
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext10').show()
				} else {
					$('.companyBtnPrve10').hide()
					$('.companyBtnNext10').hide()
				}
			} else {
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext10').show()
					$('.companyBtnPrve10').show()
				} else {
					$('.companyBtnNext10').hide()
					$('.companyBtnPrve10').show()
				}
			}
		}
	});
};
// 时间
$('.thcontrc li').eq(8).on("click", function() {
	var comPage;
	layer.open({
		type: 1,
		area: ['340px', '600px'],
		title: ['搜索'],
		content: $(".srhsj"),
		btn: '确定',
		yes: function(index, layero) {
			loadData8(0)
			layer.closeAll()
		}
	});
	laydate.render({
		elem: '.sj',
		max: 0
	})

});

function loadData8(page2) {
	var comp = $('#comprovince option:selected').val();
	var comc = $('#comcity option:selected').val();
	var comd = $('#comdistrict option:selected').val();
	var comaddress = comp + comc + comd;
	console.log($(".sj").val())
	$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
		"userGuid": dataManger.userGuid,
		"page": page2,
		"para": "and createTime like " + "'%" + $(".sj").val() + "%'"
	}, function(data) {
		var dataCompany = JSON.parse(data)
		$(".combtnArea").replaceWith(
			'<p class="combtnArea clearfix"><button class="companyBtnPrve8 pull-left">上一页</button><button class="companyBtnNext8  pull-right">下一页</button></p>'
		);
		$('.companyBtnNext8').click(function() {
			loadData8(comPage)
		});
		$('.companyBtnPrve8').click(function() {
			loadData8(Number(comPage) - 2)
		});
		if (dataCompany.status == 200) {
			comPage = dataCompany.page
			comConformInfoFun(dataCompany.items)
			if (comPage <= 1) {
				$('.companyBtnPrve8').hide()
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext8').show()
				} else {
					$('.companyBtnPrve8').hide()
					$('.companyBtnNext8').hide()
				}
			} else {
				if (dataCompany.items.length >= 10) {
					$('.companyBtnNext8').show()
					$('.companyBtnPrve8').show()
				} else {
					$('.companyBtnNext8').hide()
					$('.companyBtnPrve8').show()
				}
			}
		}
	});
};
