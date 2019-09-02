$(document).ready(function() {
 	$('#mangerCon').click(function() {
 		$(this).addClass('activeM').siblings('li').removeClass('activeM');
 		$('#mangerLook').show().siblings('div').hide();
 	});
 	//退出操作
 	$('.quitOut').click(function() {
 		localStorage.removeItem("GHY_MangerLogin");
 		location.href = "../mangerLogin.html"
 	});
 	// 查看注册的个人
 	// setTimeout(function(){activeteacher()},500)
 	$('.lookManger').click(function() {
 		$(this).addClass('active').siblings('p').removeClass('active');
 		$('.lookMangerDet').show().siblings('div').hide();
 		People(0)
 		laydate.render({
 			elem: '#test4',
 			max: 0,
 			done: function(value, date, endDate) {
 				People(0)
 			}
 		});
 	});
 	// 查看注册的公司
 	$('.lookCompany').click(function() {
 		$(this).addClass('active').siblings('p').removeClass('active');
 		$('.lookCompanyDet').show().siblings('div').hide();
 		Company()
 		laydate.render({
 			elem: '#test5',
 			max: 0,
 			done: function(value, date, endDate) {
 				Company()
 			}
 		});
 	});
 	// 查看认证的公司信息
 	$('.comConform').click(function() {
 		$(this).addClass('active').siblings('p').removeClass('active');
 		$('.comConformDet').show().siblings('div').hide();
 		$('#test6').val(0)
 		comConform(0, 0)
 	});
 	// 查看认证的公司信息
 	$('.regCounts').click(function() {
 		window.open("../html/regCounts.html")
 	});
 	// 查看快速注册公司信息
 	$('.regFastCompany').click(function() {
 		$(this).addClass('active').siblings('p').removeClass('active');
 		$('.regFastCompanyDiv').show().siblings('div').hide();
 		$('#testFast').val(0)
 		fastCompany(0, 0)
 	});
 	$('#testFast').change(function() {
 		fastCompany(0, $(this).val())
 	});
 	var timeDay, fastPage;

 	function fastCompany(page, type) {
 		$.post('' + http_head + '/comtemp/getCheckComSuer.ashx', {
 			"userGuid": dataManger.userGuid,
 			"page": page,
 			"type": type
 		}, function(data) {
 			var datacomCon = JSON.parse(data);
 			loadFast(datacomCon.items)
 			fastPage = datacomCon.page
 			if (fastPage <= 1) {
 				$('.comBtnPrve2').hide()
 				if (datacomCon.items.length >= 10) {
 					$('.comBtnNext2').show()
 				} else {
 					$('.comBtnPrve2').hide()
 					$('.comBtnNext2').hide()
 				}
 			} else {
 				if (datacomCon.items.length >= 10) {
 					$('.comBtnNext2').show()
 					$('.comBtnPrve2').show()
 				} else {
 					$('.comBtnNext2').hide()
 					$('.comBtnPrve2').show()
 				}
 			}
 		});
 	}

 	function loadFast(data) {
 		$('#fastRegTable').bootstrapTable({
 			url: data,
 			columns: [{
 					field: 'comName',
 					title: '公司全称',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: 'phone',
 					title: '电话',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: 'creatTime',
 					title: '注册时间',
 					valign: 'middle',
 					align: 'center',
 					formatter: timeFormatter,
 				},
 				{
 					field: 'more',
 					title: '操作',
 					valign: 'middle',
 					align: 'center',
 					formatter: moreFormatter,
 					events: fastRegEvents
 				}
 			]
 		});
 		$("#fastRegTable").bootstrapTable('load', data);

 		function timeFormatter(e, value, row, index) {
 			timeDay = (value.creatTime).split(" ")[0];
 			return [
 				timeDay
 			].join('');
 		};

 		function moreFormatter(e, value, row, index) {
 			return [
 				'<a class="more"  title="查看详情">',
 				'<span id="more">查看详情</span>',
 				'</a>  ',
 			].join('');
 		};
 	}
 	var checkId;
 	window.fastRegEvents = {
 		'click .more': function(e, value, row, index) {
 			// if (  row.isdelete != 0  ) {
 			//   $('.fastbtnArea').hide()
 			// }else{
 			//   $('.fastbtnArea').show()
 			// }
 			checkId = row
 			layer.open({
 				type: 1,
 				area: ['600px', '90%'],
 				title: ['审批公司注册', 'font-size:18px;text-align: center;'],
 				content: $(".checkFastRegDiv"),
 				shade: false
 			});
 			$('.fastCompanyName').text(row.comName)
 			$('.fastPhone').text(row.phone)
 			$('.checkFastRegDiv img').attr('src', row.imgUrl);
 		}
 	}
 	//拒绝
 	$('.fastRefuseBtn').click(function() {
 		$.post('' + http_head + '/comtemp/setCheck_comsuper.ashx', {
 			"userGuid": dataManger.userGuid,
 			"Id": checkId.id,
 			"type": -1
 		}, function(data) {
 			layer.closeAll();
 			fastCompany(0, $('#testFast').val())
 		})
 	});
 	// 同意
 	$('.fastAgreeBtn').click(function() {
 		$.post('' + http_head + '/comtemp/setCheck_comsuper.ashx', {
 			"userGuid": dataManger.userGuid,
 			"Id": checkId.id,
 			"type": 1
 		}, function(data) {
 			layer.closeAll();
 			fastCompany(0, $('#testFast').val())
 		})
 		sessionStorage.removeItem("COM_info");
 		// 将对象转换为字符串
 		var str = JSON.stringify(checkId);
 		sessionStorage.removeItem("COM_info");
 		sessionStorage.setItem("COM_info", str);
 		window.open("../../71guangwang/html/fastRegcomInfo.html")
 	});
 	// 查看讲师申请
 	var applyTime, typeVal;
 	$('.comTeacher').click(function() {
 		typeVal = 0
 		$(this).addClass('active').siblings('p').removeClass('active');
 		$('.teacherApply').show().siblings('div').hide();
 		$('#test7').val(0)
 		loadTeacher(0, 0);
 	});
 	$('#test6').change(function() {
 		comConform(0, $(this).val())
 	});
 	$('#test7').change(function() {
 		typeVal = $(this).val()
 		loadTeacher(0, $(this).val())
 	});
 	var day1 = new Date();
 	day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
 	var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
 	$('#test4').val(s1)
 	$('#test5').val(s1)
 	var regpersonPage;

 	function People(page) {
 		$.post('' + http_head + '/Admin/Get_Register.ashx', {
 			"userGuid": dataManger.userGuid,
 			"page": page,
 			"date": $('#test4').val()
 		}, function(data) {
 			var dataReg = JSON.parse(data);
 			if (dataReg.status == 200) {
 				regpersonPage = dataReg.items.page
 				layer.msg(dataReg.msg, {
 					time: 1000,
 				});
 				loadRegPerson(dataReg.items.list)
 				if (regpersonPage <= 1) {
 					$('.personBtnPrve2').hide()
 					if (dataReg.items.list.length >= 10) {
 						$('.personBtnNext2').show()
 					} else {
 						$('.personBtnPrve2').hide()
 						$('.personBtnNext2').hide()
 					}
 				} else {
 					if (dataReg.items.list.length >= 10) {
 						$('.personBtnNext2').show()
 						$('.personBtnPrve2').show()
 					} else {
 						$('.personBtnNext2').hide()
 						$('.personBtnPrve2').show()
 					}
 				}
 			}
 		});
 	}
 	$('.personBtnNext2').click(function() {
 		People(regpersonPage)
 	});
 	$('.personBtnPrve2').click(function() {
 		People(Number(regpersonPage) - 2)
 	});

 	function loadRegPerson(data) {
 		$('#chakanRegTable').bootstrapTable({
 			url: data,
 			columns: [{
 					field: 'uname',
 					title: '电话',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: 'Guid',
 					title: 'Guid',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: 'addTime',
 					title: '注册时间',
 					valign: 'middle',
 					align: 'center',
 					formatter: timeFormatter
 				}
 			]
 		});
 		$("#chakanRegTable").bootstrapTable('load', data);

 		function timeFormatter(e, value, row, index) {
 			var timeDay = (value.addTime).split("T")[0];
 			var timeDay2 = (value.addTime).split("T")[1];
 			var timeSec = timeDay2.substring(0, 5);
 			return [
 				timeDay
 			].join('');
 		};
 	}
 	$('.layui-this').click(function() {
 		People()
 	});
 
 	function Company() {
 		$.post('' + http_head + '/Admin/Get_Com_Register.ashx', {
 			"userGuid": dataManger.userGuid,
 			"page": 0,
 			"date": $('#test5').val()
 		}, function(data) {
 			var dataCom = JSON.parse(data);
 			layer.msg(dataCom.msg, {
 				time: 1000,
 			});
 			$('#chakanRegComTable').bootstrapTable({
 				url: dataCom.items.list,
 				columns: [{
 						field: 'com_name',
 						title: '公司名称'
 					},
 					{
 						field: 'com_contact',
 						title: '联系方式',
 					},
 					{
 						field: 'com_adress',
 						title: '公司地址',
 					},
 					{
 						field: 'com_hangye',
 						title: '所属行业',
 					},
 					{
 						field: 'com_dutyman',
 						title: '公司法人',
 					},
 					{
 						field: 'com_dutytel',
 						title: '法人电话',
 					},
 					{
 						field: 'com_dutyIDnum',
 						title: '法人身份证号',
 					},
 					{
 						field: 'com_emai',
 						title: '公司邮箱',
 					},
 					{
 						field: 'createTime',
 						title: '注册时间',
 						formatter: time2Formatter
 					},
 					{
 						field: 'staffName',
 						title: '注册人姓名',
 					},
 					{
 						field: 'uname',
 						title: '注册人手机号',
 					},
 				]
 			});
 			$("#chakanRegComTable").bootstrapTable('load', dataCom.items.list);

 			function time2Formatter(e, value, row, index) {
 				var timeDay = (value.createTime).split("T")[0];
 				return [
 					timeDay
 				].join('');
 			};
 		});
 	}
 	$('.lookComBtn').click(function() {
 		Company()
 	});
 	var timeDay, comformdPage;

 	function comConform(page, type) {
 		$.post('' + http_head + '/CompanyCheck/Get_Company.ashx', {
 			"userGuid": dataManger.userGuid,
 			"page": page,
 			"type": type
 		}, function(data) {
 			var datacomCon = JSON.parse(data);
 			comformdPage = datacomCon.page
 			loadcomformd(datacomCon.items)
 			if (comformdPage <= 1) {
 				$('.comBtnPrve').hide()
 				if (datacomCon.items.length >= 10) {
 					$('.comBtnNext').show()
 				} else {
 					$('.comBtnPrve').hide()
 					$('.comBtnNext').hide()
 				}
 			} else {
 				if (datacomCon.items.length >= 10) {
 					$('.comBtnNext').show()
 					$('.comBtnPrve').show()
 				} else {
 					$('.comBtnNext').hide()
 					$('.comBtnPrve').show()
 				}
 			}
 		});
 	}
 	$('.comBtnNext').click(function() {
 		comConform(comformdPage, $('#test6').val())
 	});
 	$('.comBtnPrve').click(function() {
 		comConform(Number(comformdPage) - 2, $('#test6').val())
 	});

 	function loadcomformd(data) {
 		$('#comConformTable').bootstrapTable({
 			url: data,
 			columns: [{
 					field: 'com_name',
 					title: '公司名称',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: '',
 					title: '企业编码',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: '',
 					title: '企业简称',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: '',
 					title: '成立日期',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: '',
 					title: '员工人数',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: '',
 					title: '电子邮箱',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: '',
 					title: '通讯地址',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: '',
 					title: '企业网站',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: '',
 					title: '企业微信公众号',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: 'createName',
 					title: '注册人姓名',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: 'createrPhone',
 					title: '注册人电话',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: 'createTime',
 					title: '注册时间',
 					valign: 'middle',
 					align: 'center',
 					formatter: time3Formatter
 				},
 				{
 					field: 'com_type',
 					title: '企业性质',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: 'com_adress',
 					title: '公司注册地',
 					valign: 'middle',
 					align: 'center',
 				},
 				{
 					field: 'more',
 					title: '查看详情',
 					formatter: moreFormatter,
 					events: moreEvents
 				},
 			]
 		});
 		$("#comConformTable").bootstrapTable('load', data);

 		function time3Formatter(e, value, row, index) {
 			timeDay = (value.createTime).split("T")[0];
 			return [
 				timeDay
 			].join('');
 		};

 		function moreFormatter(e, value, row, index) {
 			return [
 				'<a class="more"  title="查看详情">',
 				'<span id="more">查看详情</span>',
 				'</a>  ',
 			].join('');
 		};
 	}
 	window.moreEvents = {
 		'click .more': function(e, value, row, index) {
 			$('.cover').show();
 			var comTitle = row.com_name + "认证详情";
 			layer.open({
 				type: 1,
 				area: ['1000px', '500px'],
 				title: [comTitle, 'font-size:18px;text-align: center;'],
 				content: $(".companyDetails"),
 				shade: false
 			});
 			$('.layui-layer-close').click(function() {
 				$('.cover').hide();
 			});
 			$.post('' + http_head + '/Com/Com_get_autheninfo.ashx', {
 				"comid": row.Id,
 				"userGuid": dataManger.userGuid,
 				"type": 1
 			}, function(data) {
 				var dataRegInfo = JSON.parse(data).items;
 				$('.IDcardfront img').attr('src', dataRegInfo.com_dutyIDnum_photo_front);
 				$('.IDcardback img').attr('src', dataRegInfo.com_dutyIDnum_photo_back);
 				$('.IDcardhand img').attr('src', dataRegInfo.com_dutyIDnum_handphoto);
 				$('.codecertifi img').attr('src', dataRegInfo.com_codecertifi_photo);
 				$('.buslicense img').attr('src', dataRegInfo.com_buslicense_photo);
 				$('.productcertifi img').attr('src', dataRegInfo.com_productcertifi_photo);
 				$('.tax img').attr('src', dataRegInfo.com_tex_photo);
 				$('.comName').text(row.com_name)
 				$('.com_type').text(row.com_type)
 				$('.creatDate').text(row.createTime)
 				$('.conAddress').text(row.com_adress)
 				$('.regName').text(row.createName)
 				$('.regTel').text(row.createrPhone)
 			})
 			// 审核企业
 			if (row.status == 0) {
 				$('.checkArea').show()
 				$('.pass').hide()
 				$('.noPass').hide()
 				$('.agree').click(function() {
 					if ($('#message').val().length == 0) {
 						layer.msg('请输入理由', {
 							time: 2000,
 						});
 					} else {
 						checkCom(1)
 						$('.cover').hide();
 						layer.closeAll()
 					}
 				});
 				$('.refuse').click(function() {
 					if ($('#message').val().length == 0) {
 						layer.msg('请输入理由', {
 							time: 2000,
 						});
 					} else {
 						checkCom(2)
 						$('.cover').hide();
 						layer.close(layer.index);
 					}
 				});

 			} else if (row.status == 1) {
 				$('.checkArea').hide()
 				$('.pass').show()
 				$('.noPass').hide()
 			} else {
 				$('.checkArea').hide()
 				$('.pass').hide()
 				$('.noPass').show()
 			}

 			function checkCom(type) {
 				$.post('' + http_head + '/CompanyCheck/Check_Company.ashx', {
 					"userGuid": dataManger.userGuid,
 					"type": type,
 					"message": $('#message').val(),
 					"companyId": row.Id
 				}, function(data) {
 					var dataSuccess = JSON.parse(data);
 					if (dataSuccess.status == 200) {
 						comConform(0, 0)
 					}
 				});
 			}
 		}
 	}

 	function DoCellData(cell, row, col, data) {}

 	function DoBeforeAutotable(table, headers, rows, AutotableSettings) {}
 	// 导出公司注册表格
 	$('.downComBtn').click(function() {
 		$('#chakanRegComTable').tableExport({
 			separator: '\t',
 			fileName: $('#test5').val() + "日注册公司明细表",
 			tableName: '公司注册表',
 			type: 'excel',
 			escape: 'true',
 			htmlContent: 'false',
 			consoleLog: 'false',
 			excelstyles: ['background-color', 'color', 'border-bottom-color', 'border-bottom-style',
 				'border-bottom-width', 'border-top-color', 'border-top-style', 'border-top-width', 'border-left-color',
 				'border-left-style', 'border-left-width', 'border-right-color', 'border-right-style', 'border-right-width',
 				'text-algin', 'font-size', 'margin-left'
 			],
 			jspdf: {
 				format: 'bestfit',
 				margins: {
 					left: 20,
 					right: 10,
 					top: 20,
 					bottom: 20
 				},
 				autotable: {
 					styles: {
 						overflow: 'linebreak'
 					},
 					tableWidth: 'wrap',
 					tableExport: {
 						onBeforeAutotable: DoBeforeAutotable,
 						onCellData: DoCellData
 					}
 				}
 			}
 		});
 	});
 	// 导出个人注册表格
 	$('.downBtn').click(function() {
 		$('#chakanRegTable').tableExport({
 			separator: '\t',
 			fileName: $('#test4').val() + "日注册个人明细表",
 			tableName: '个人注册表',
 			type: 'excel',
 			escape: 'true',
 			htmlContent: 'false',
 			consoleLog: 'false',
 			excelstyles: ['background-color', 'color', 'border-bottom-color', 'border-bottom-style',
 				'border-bottom-width', 'border-top-color', 'border-top-style', 'border-top-width', 'border-left-color',
 				'border-left-style', 'border-left-width', 'border-right-color', 'border-right-style', 'border-right-width',
 				'text-algin', 'font-size', 'margin-left'
 			],
 			jspdf: {
 				format: 'bestfit',
 				margins: {
 					left: 20,
 					right: 10,
 					top: 20,
 					bottom: 20
 				},
 				autotable: {
 					styles: {
 						overflow: 'linebreak'
 					},
 					tableWidth: 'wrap',
 					tableExport: {
 						onBeforeAutotable: DoBeforeAutotable,
 						onCellData: DoCellData
 					}
 				}
 			}
 		});
 	});
 	// 导出公司数据
 	$('.downConformBtn').click(function() {
 		if ($('#test6').val() == 0) {
 			var titleHead = "未审核";
 		} else {
 			titleHead = "已审核"
 		}
 		$('#comConformTable').tableExport({
 			separator: '\t',
 			fileName: titleHead + "公司明细表",
 			tableName: '认证详情',
 			type: 'excel',
 			escape: 'true',
 			htmlContent: 'false',
 			consoleLog: 'false',
 			excelstyles: ['background-color', 'color', 'border-bottom-color', 'border-bottom-style',
 				'border-bottom-width', 'border-top-color', 'border-top-style', 'border-top-width', 'border-left-color',
 				'border-left-style', 'border-left-width', 'border-right-color', 'border-right-style', 'border-right-width',
 				'text-algin', 'font-size', 'margin-left'
 			],
 			jspdf: {
 				format: 'bestfit',
 				margins: {
 					left: 20,
 					right: 10,
 					top: 20,
 					bottom: 20
 				},
 				autotable: {
 					styles: {
 						overflow: 'linebreak'
 					},
 					tableWidth: 'wrap',
 					tableExport: {
 						onBeforeAutotable: DoBeforeAutotable,
 						onCellData: DoCellData
 					}
 				}
 			}
 		});
 	});
 	// 讲师操作
 	var teaPage;

 	function loadTeacher(page, type) {
 		$.post('' + http_head + '/Lectures/Get_Lecture_ByChecker.ashx', {
 			"userGuid": dataManger.userGuid,
 			"type": type,
 			"page": page
 		}, function(data) {
 			var dataApply = JSON.parse(data)
 			teaPage = dataApply.items.page;
 			if (dataApply.status == 200) {
 				regedTeacher(dataApply.items.rows)
 			} else {
 				layer.msg(dataApply.msg, {
 					time: 1000,
 				});
 			}
 			if (teaPage <= 1) {
 				$('.teaBtnPrve').hide()
 				if (dataApply.items.rows.length >= 10) {
 					$('.teaBtnNext').show()
 				} else {
 					$('.teaBtnPrve').hide()
 					$('.teaBtnNext').hide()
 				}
 			} else {
 				if (dataApply.items.rows.length >= 10) {
 					$('.teaBtnNext').show()
 					$('.teaBtnPrve').show()
 				} else {
 					$('.teaBtnNext').hide()
 					$('.teaBtnPrve').show()
 				}
 			}
 		});
 	}
 	$('.teaBtnNext').click(function() {
 		loadTeacher(teaPage, $('#test7').val())
 	});
 	$('.teaBtnPrve').click(function() {
 		loadTeacher(Number(teaPage) - 2, $('#test7').val())
 	});

 	function regedTeacher(data) {
 		$('#teacherApplyTable').bootstrapTable({
 			url: data,
 			columns: [{
 					field: 'lectureImage',
 					title: '头像',
 					formatter: imgFormatter
 				},
 				{
 					field: 'realName',
 					title: '姓名',
 				},
 				{
 					field: 'sex',
 					title: '性别'
 				},
 				{
 					field: 'phone',
 					title: '电话',

 				},
 				{
 					field: 'province',
 					title: '省份'
 				},
 				{
 					field: 'city',
 					title: '城市'
 				},
 				{
 					field: 'createTime',
 					title: '申请时间',
 					formatter: time4Formatter
 				},
 				{
 					field: 'option',
 					title: '操作',
 					formatter: moreFormatter,
 					events: optionTeacherEvents
 				},
 			]
 		});
 		$("#teacherApplyTable").bootstrapTable('load', data);

 		function imgFormatter(e, value, row, index) {
 			var imgUrl = value.lectureImage
 			return [
 				'<img src="' + imgUrl + '" alt="" />'
 			].join('');
 		};

 		function time4Formatter(e, value, row, index) {
 			applyTime = (value.createTime).split("T")[0];
 			return [
 				applyTime
 			].join('');
 		};

 		function moreFormatter(e, value, row, index) {
 			if (typeVal == 0) {
 				var optionVal =
 					'<a class="lookMore"><span id="lookMore">查看</span></a><a class="refuse"  title="拒绝申请"><span id="refuse">拒绝</span></a><a class="agree"  title="同意申请"><span id="agree">同意</span></a>'
 			} else if (typeVal == 1) {
 				optionVal =
 					'<a class="lookMore"><span id="lookMore">查看</span></a><a class="refused"  title="已审批"><span id="refuse">已审批</span></a>'
 			}
 			return [
 				optionVal
 			].join('');
 		};
 	}
 	window.optionTeacherEvents = {
 		'click .agree': function(e, value, row, index) {
 			$.post('' + http_head + '/Lectures/Set_Lecture_ByChecker.ashx', {
 				"userGuid": dataManger.userGuid,
 				"lectureGuid": row.lectureGuid,
 				"type": 1,
 				"message": " "
 			}, function(data) {
 				var dataAgree = JSON.parse(data)
 				layer.msg('审核完成', {
 					time: 1000,
 				});
 				loadTeacher(Number(teaPage) - 1, $('#test7').val())
 			});
 		},
 		'click .lookMore': function(e, value, row, index) {
 			$.post('' + http_head + '/Lectures/Get_Lecture_ByCreater.ashx', {
 				"userGuid": row.lectureGuid
 			}, function(data) {
 				var arr_imgHref = []
 				var dataTea = JSON.parse(data)
 				arr_imgHref = dataTea.items.Qualifications.split(";")
 				$('.teaImgShow img').remove()
 				for (var i = 0; i < arr_imgHref.length; i++) {
 					$('.teaImgShow').append('<img src="' + http_head + '' + arr_imgHref[i] + '" alt="" />')
 				}
 				$('.teaName').text(dataTea.items.realname)
 				$('.teaSex').text(dataTea.items.sex)
 				$('.teaPhone').text(dataTea.items.phone)
 				$('.teaEmail').text(dataTea.items.email)
 				$('.teaAssistant').text(dataTea.items.Assistant)
 				$('.assistantPhone').text(dataTea.items.AssistantPhone)
 				$('.address').text(dataTea.items.address)
 				$('.expevse').text(dataTea.items.CooperativePrice)
 				$('.teaResearchField').text(dataTea.items.ResearchField)
 				$('.teaInfoDiv').html(dataTea.items.LecturerBackground)
 				$('.guestExample').html(dataTea.items.CustCase)
 				$('.serveredCompany').html(dataTea.items.ServiceCom)
 			});
 			layer.open({
 				type: 1,
 				area: ['800px', '100%'],
 				title: ['讲师认证详情', 'font-size:18px;text-align: center;'],
 				content: $(".teacherDetailsDiv"),
 			});
 		},
 		'click .refuse': function(e, value, row, index) {
 			layer.open({
 				type: 1,
 				area: ['600px', '280px'],
 				title: ['审批讲师', 'font-size:18px;text-align: center;'],
 				content: $(".refuseDiv"),
 				btn: '确定',
 				yes: function(index, layero) {
 					$.post('' + http_head + '/Lectures/Set_Lecture_ByChecker.ashx', {
 						"userGuid": dataManger.userGuid,
 						"lectureGuid": row.lectureGuid,
 						"type": 2,
 						"message": $('#refuseReason').val()
 					}, function(data) {
 						var dataAgree = JSON.parse(data)
 						layer.msg('审核完成', {
 							time: 1000,
 						});
 						loadTeacher(Number(teaPage) - 1, $('#test7').val())
 					});
 				}
 			});
 		},
 	}
 })
