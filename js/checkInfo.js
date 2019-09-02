$(document).ready(function() {
	$('#zhaopin').click(function() {
		$(this).addClass('activeM').siblings('li').removeClass('activeM');
		$('#checkInfoDiv').show().siblings('div').hide();
		$('.lookMangerInfo').addClass('active').siblings('p').removeClass('active');
		$('.lookMangerInfoDet').show().siblings('div').hide()
		PeopleInfo("")
	});
	// 个人信息
	$(".zz").css({
		color: "white"
	})
	$('.lookMangerInfo').click(function() {
		$(this).addClass('active').siblings('p').removeClass('active');
		$('.lookMangerInfoDet').show().siblings('div').hide()
		PeopleInfo("")
	});
	var day1 = new Date();
	day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
	var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();

	$('#test4').val(s1)
	$('#test5').val(s1)

	// 获取n天后的日期
	function GetDateStr(AddDayCount) {
		var dd = new Date();
		dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
		var y = dd.getFullYear();
		var m = (dd.getMonth() + 1) < 10 ? ('0' + (dd.getMonth() + 1)) : (dd.getMonth() + 1);
		var d = dd.getDate() < 10 ? ('0' + dd.getDate()) : dd.getDate();
		return y + "-" + m + "-" + d;
	}
	window.optionEvents = {
		'click .statusOption': function(e, value, row, index) {
			if (row.status == 0) {
				layer.open({
					type: 1,
					area: ['800px', '350px'],
					title: ['账号操作', 'font-size:18px;text-align: center;'],
					content: $(".zhanghaoStatusDiv"),
					btn: '确定',
					yes: function(index, layero) {
						if ($('#forbiddenReason').val() == "" || $('.forbiddenTime').val() == "") {
							layer.msg('请完善信息', {
								time: 2000,
							});
						} else {
							var timeEnd = GetDateStr(Number($('.forbiddenTime').val()))
							$.post('' + http_head + '/EQDSuperAdmin/DisabelAccount/Add_DisableAccount.ashx', {
								"userGuid": dataManger.userGuid,
								"objectGuid": row.Guid,
								"disableReason": $('#forbiddenReason').val(),
								"disableTimeLength": $('.forbiddenTime').val(),
								"endTime": timeEnd
							}, function(data) {
								var dataDel = JSON.parse(data)
								if (dataDel.status == 200) {
									loadPersonDetails(Number(personPage) - 1)
									layer.msg('已封号', {
										time: 2000,
									});
								} else {
									layer.msg(dataDel.msg, {
										time: 2000,
									});
								}
							});
							layer.closeAll()
						}
					}
				});
			} else {
				layer.open({
					type: 1,
					area: ['300px', '160px'],
					title: ['账号解封', 'font-size:18px;text-align: center;'],
					content: $(".jiefengStatusDiv"),
					btn: '确定',
					yes: function(index, layero) {
						$.post('' + http_head + '/EQDSuperAdmin/DisabelAccount/Cancel_DisableAccount.ashx', {
							"userGuid": dataManger.userGuid,
							"objectGuid": row.Guid,
						}, function(data) {
							var dataDel2 = JSON.parse(data)
							if (dataDel2.status == 200) {
								loadPersonDetails(Number(personPage) - 1)
								layer.msg('已解封', {
									time: 2000,
								});
							} else {
								layer.msg(dataDel2.msg, {
									time: 2000,
								});
							}
						});
						layer.closeAll()
					}
				})
			}
		},
		'click .logindetails': function(e, value, row, index) {
			console.log(row)
			var str = JSON.stringify(row); // 将对象转换为字符串
			sessionStorage.removeItem("LOOK_login");
			sessionStorage.setItem("LOOK_login", str);
			window.open("../html/lookloginedStatus.html")
		}
	}
	// 公司信息
	$('.comConformInfo').click(function() {
		$(this).addClass('active').siblings('p').removeClass('active');
		$('.comConformInfoDet').show().siblings('div').hide()
		comConformInfoFun("")
	});
	// 高级筛选公司

	// 	$('.chooseCompany').click(function() {
	// 		var comPage;
	// 		layer.open({
	// 			type: 1,
	// 			area: ['800px', '500px'],
	// 			title: ['高级筛选公司', 'font-size:18px;text-align: center;'],
	// 			content: $(".chooseCompanyTable"),
	// 			btn: '确定',
	// 			yes: function(index, layero) {
	// 				loadData(0)
	// 				layer.closeAll()
	// 			}
	// 		});
	// 
	// 	});
	// 
	// 	function loadData(page2) {
	// 		var comp2 = $('#comprovince2 option:selected').val();
	// 		var comc2 = $('#comcity2 option:selected').val();
	// 		var comd2 = $('#comdistrict2 option:selected').val();
	// 		var comaddress2 = comp2 + comc2 + comd2;
	// 		$.post('' + http_head + '/Admin/Company/Get_CompanyBySearch.ashx', {
	// 			"userGuid": dataManger.userGuid,
	// 			"page": page2,
	// 			"para": "and com_id_num like " + "'%" + $('#companyIDnum').val() + "%'" + "and com_name like " + "'%" +
	// 				$('#companyName').val() + "%'" + "and com_type like " +
	// 				"'%" + $('#companyType').val() + "%'" + "and staffnum like " + "'%" + $('#compangNum').val() + "%'" +
	// 				"and com_dutyman like " + "'%" + $('#companyDutyman').val() + "%'" + "and com_dutytel like " + "'%" + $(
	// 					'#companyDutymanTel').val() + "%'" + "and com_emai like " + "'%" + $('#companysEmail').val() + "%'" +
	// 				"and com_adress like " + "'%" + comaddress2 + "%'" + "and com_simplyName like " + "'%" + $(
	// 					'#companysimName').val() + "%'"
	// 		}, function(data) {
	// 			var dataCompany = JSON.parse(data)
	// 			$(".combtnArea").replaceWith(
	// 				'<p class="combtnArea clearfix"><button class="companyBtnPrve1 pull-left">上一页</button><button class="companyBtnNext1 pull-right">下一页</button></p>'
	// 			);
	// 			$('.companyBtnNext1').click(function() {
	// 				loadData(comPage)
	// 			});
	// 			$('.companyBtnPrve1').click(function() {
	// 				loadData(Number(comPage) - 2)
	// 			});
	// 			if (dataCompany.status == 200) {
	// 				comPage = dataCompany.page
	// 				comConformInfoFun(dataCompany.items)
	// 				if (comPage <= 1) {
	// 					$('.companyBtnPrve1').hide()
	// 					if (dataCompany.items.length >= 10) {
	// 						$('.companyBtnNext1').show()
	// 					} else {
	// 						$('.companyBtnPrve1').hide()
	// 						$('.companyBtnNext1').hide()
	// 					}
	// 				} else {
	// 					if (dataCompany.items.length >= 10) {
	// 						$('.companyBtnNext1').show()
	// 						$('.companyBtnPrve1').show()
	// 					} else {
	// 						$('.companyBtnNext1').hide()
	// 						$('.companyBtnPrve1').show()
	// 					}
	// 				}
	// 			}
	// 		});
	// 	}
	var timeDay;

	function comConformInfoFun(data) {
		$('#comConformInfoTable').bootstrapTable({
			url: data,
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
			timeDay = (value.createTime).split(" ")[0];
			console.log(value)
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

	var areadata, areaLength, val2, proviceWorkVal, proviceWorkName, cityWorkVal, cityWorkName, countyWorkVal,
		countyWorkName, addressChanpin3;
	$.post('' + http_head + '/Option_AreasAnd.ashx', {
		type: "0"
	}, function(data) {
		// console.log(data)
		areadata = data;
		areaLength = areadata.length;
		var len = areaLength;
		for (var i = 0; i < len; i++) {
			var proviceWorkOpt = document.createElement('option');
			proviceWorkOpt.innerText = areadata[i]['name'];
			proviceWorkOpt.value = i;
			proviceWork.append(proviceWorkOpt);
		}
	});
	$('#proviceWork').click(function() {
		var btn = document.getElementsByClassName('hangye1');
		var proviceWork = $('#proviceWork');
		var cityWork = $('#cityWork');
		var current = {
			proviceWork: '',
			cityWork: ''
		};
		$('#proviceWork').change(function(btn) {
			document.all['cityWork'].options.length = 1;
			val2 = $('#proviceWork').select().val();
			if (val2 != current.proviceWork) {
				current.proviceWork = val2;
				btn.disabled = true;
			}
			if (val2 != null) {
				cityWork.length = 1;
				var cityWorkLen = areadata[val2]["sub"].length;
				for (var j = 0; j < cityWorkLen; j++) {
					var cityWorkLenOpt = document.createElement('option');
					cityWorkLenOpt.innerText = areadata[val2]["sub"][j].name;
					cityWorkLenOpt.value = j;
					cityWork.append(cityWorkLenOpt);
				}
			}
			proviceWorkVal = $(this).val()
			proviceWorkName = areadata[proviceWorkVal].name
		});
		$('#cityWork').change(function(btn) {
			document.all['countyWork'].options.length = 1;
			var val3 = $('#cityWork').select().val();
			if (val3 != current.hangye2) {
				current.cityWork = val2;
				btn.disabled = true;
			}
			if (val3 != null) {
				countyWork.length = 1;
				var countyWorkLen = areadata[val2]["sub"][val3]["sub"].length;
				for (var m = 0; m < countyWorkLen; m++) {
					var countyWorkOpt = document.createElement('option');
					countyWorkOpt.innerText = areadata[val2]["sub"][val3]["sub"][m].name;
					countyWorkOpt.value = m;
					countyWork.append(countyWorkOpt);
				}
			}
			cityWorkVal = $(this).val()
			cityWorkName = areadata[proviceWorkVal]["sub"][cityWorkVal].name
		});
	});
	$('#countyWork').change(function(btn) {
		countyWorkVal = $(this).val()
		countyWorkName = areadata[proviceWorkVal]["sub"][cityWorkVal]["sub"][countyWorkVal].name;
		addressChanpin3 = proviceWorkName + cityWorkName + countyWorkName
	})
	$.post('' + http_head + '/Option_AreasAnd.ashx', {
		type: "2"
	}, function(data) {
		$("#hangye1").typeahead({
			source: data,
			items: 10,
			afterSelect: function(item) {
				$('#hangye1').siblings('.desc').text(item.dec)
			}
		});
	});
	// 工作圈
	laydate.render({
		elem: '#workStartTime',
		max: 0,
	});
	laydate.render({
		elem: '#workEndTime',
		max: 0,
	});
	$('.workArea').click(function() {
		$(this).addClass('active').siblings('p').removeClass('active');
		$('.workAreaDiv').show().siblings('div').hide();
	});
	// 搜索工作圈
	$('.searchWorkBtn').click(function() {

		layer.open({
			type: 1,
			area: ['800px', '650px'],
			title: ['搜索工作圈', 'font-size:18px;text-align: center;'],
			content: $(".chooseWorkAreaDiv"),
			btn: '确定',
			yes: function(index, layero) {
				loadWork(0)
				layer.close(index)
			}
		});
	});
	var workPage;

	function loadWork(page) {
		$.post('' + http_head + '/EQDSuperAdmin/WorkCircles/Get_WorkCircleBySearch.ashx', {
			"userGuid": dataManger.userGuid,
			"page": page,
			"content": $('#workContent').val(),
			"name": $('#workName').val(),
			"phone": $('#workTel').val(),
			"address": addressChanpin3,
			"startTime": $('#workStartTime').val(),
			"endTime": $('#workEndTime').val(),
			"type": $('#workType').val()
		}, function(data) {

			var dataWork = JSON.parse(data)
			loadWorkTable(dataWork.items)
			workPage = dataWork.page
			if (workPage <= 1) {
				$('.workAreaBtnPrve').hide()
				if (dataWork.items.length >= 10) {
					$('.workAreaBtnNext').show()
				} else {
					$('.workAreaBtnPrve').hide()
					$('.workAreaBtnNext').hide()
				}
			} else {
				if (dataWork.items.length >= 10) {
					$('.workAreaBtnNext').show()
					$('.workAreaBtnPrve').show()
				} else {
					$('.workAreaBtnNext').hide()
					$('.workAreaBtnPrve').show()
				}
			}
		});
	}
	$('.workAreaBtnNext').click(function() {
		loadWork(workPage)
	});
	$('.workAreaBtnPrve').click(function() {
		loadWork(Number(workPage) - 2)
	});

	function loadWorkTable(data) {
		$('#workAreaTable').bootstrapTable({
			data: data,
			columns: [{
					field: 'staffName',
					title: '注册人姓名',
					align: 'center',
					valign: 'middle',
				},
				{
					field: 'uname',
					title: '注册人手机号',
					align: 'center',
					valign: 'middle',
				},
				{
					field: 'departName',
					title: '部门',
					align: 'center',
					valign: 'middle',
				},
				{
					field: 'postName',
					title: '岗位',
					align: 'center',
					valign: 'middle',
				},
				{
					field: 'Message',
					title: '内容',
					align: 'left',
					valign: 'middle',
				},
				{
					field: 'CreateTime',
					title: '发布时间',
					align: 'center',
					valign: 'middle',
					formatter: workTimeFormatter,
				},
				{
					field: 'newImages',
					title: '图片',
					align: 'center',
					valign: 'middle',
					formatter: workImg2Formatter,
					events: workImg2Events
				},
				{
					field: 'location',
					title: '位置',
					align: 'center',
					valign: 'middle',
				},
				{
					field: 'option',
					title: '操作',
					align: 'center',
					valign: 'middle',
					formatter: workOptionFormatter,
					events: workOptionEvents
				}
			]
		});
		$("#workAreaTable").bootstrapTable('load', data);

		function workImg2Formatter(e, value, row, index) {
			return [
				'<a class="imgLook" >',
				'<span id="imgLook">查看</span>',
				'</a>',
			].join('');
		};

		function workOptionFormatter(e, value, row, index) {
			return [
				'<a class="deleteBtn" title="删除">',
				'<span id="deleteBtn">删除</span>',
				'</a>',
			].join('');
		};

		function workTimeFormatter(e, value, row, index) {
			var time1 = value.CreateTime.split("T")[0];
			return [
				time1
			].join('');
		};
	}
	var dicImg = {};
	window.workImg2Events = {
		'click .imgLook': function(e, value, row, index) {
			var arr_img = [];
			dicImg = {};
			var imgList = "";
			var m = row.newImages.length - 1;
			for (var i = 0; i < m; i++) {
				arr_img.push({
					'src': row.newImages[i],
				})
			}
			layer.photos({
				anim: 5,
				photos: {
					"start": 0,
					"data": arr_img
				}
			})
		}
	}
	window.workOptionEvents = {
		'click .deleteBtn': function(e, value, row, index) {
			layer.open({
				type: 1,
				area: ['300px', '180px'],
				title: ['删除工作圈', 'font-size:18px;text-align: center;'],
				content: $(".deleteWorkArea"),
				btn: '删除',
				yes: function(index, layero) {
					$.post('' + http_head + '/EQDSuperAdmin/WorkCircles/Delete_WorkCircle.ashx', {
						"userGuid": dataManger.userGuid,
						"workCircleId": row.Id
					}, function(data) {
						var dataDelWork = JSON.parse(data);
						if (dataDelWork.status == 200) {
							loadWork(Number(workPage) - 1)
						}
					});
					layer.close(index)
				}
			});
		}
	}
})
