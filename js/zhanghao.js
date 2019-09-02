$(document).ready(function() {
 	if (dataManger.type == 1) {
 		$('#firstOPtion').remove()
 		$('#firstOPtion2').remove()
 	} else if (dataManger.type == 2) {
 		$('#firstOPtion').remove()
 		$('#secOption').remove()
 		$('#firstOPtion2').remove()
 		$('#secOption2').remove()
 	} else if (dataManger.type == 3) {
 		$('#firstOPtion').remove()
 		$('#secOption').remove()
 		$('#thirdOption').remove()
 		$('#firstOPtion2').remove()
 		$('#secOption2').remove()
 		$('#thirdOption2').remove()
 	}
 	var cityAll;
 	var arr_Pro = [];
 	var arr_ProNum = [];
 	var arr_City = [];
 	var arr_CityNum = [];
 	$('#zhanghao').click(function() {
 		arr_person = [];
 		$(this).addClass('activeM').siblings('li').removeClass('activeM');
 		$('#zhanghaoManger').show().siblings('div').hide();
 		loadLookZhanghao(0)
 	});
 	// 查看账号
 	$('.lookZhanghao').click(function() {
 		arr_person = []
 		$(this).addClass('active').siblings('p').removeClass('active');
 		$('.zhanghaoDiv').show().siblings('div').hide();
 		loadLookZhanghao(0)
 	});
 	// 查看个人信息
 	$('.infoMation').click(function() {
 		$(this).addClass('active').siblings('p').removeClass('active');
 		$('#infiDiv').show().siblings('div').hide();
 		loadInfo()
 	});
 	// 权限显示
 	$('#powder').click(function() {
 		if ($(this).val() == 1) {
 			$('#powderCity').hide()
 			$('#powderCountry').hide()
 			$('#powderProvice').hide()
 		} else if ($(this).val() == 2) {
 			$('#powderProvice').show()
 			$('#powderCountry').hide()
 			$('#powderCity').hide()
 		} else if ($(this).val() == 3) {
 			$('#powderProvice').hide()
 			$('#powderCity').show()
 			$('#powderCountry').hide()
 		} else {
 			$('#powderProvice').hide()
 			$('#powderCity').hide()
 			$('#powderCountry').show()
 		}
 	});
 	// 权限修改显示
 	$('#powder2').click(function() {
 		if ($(this).val() == 1) {
 			$('#changeCity').hide()
 			$('#changeCountry').hide()
 			$('#changeProvice').hide()
 		} else if ($(this).val() == 2) {
 			$('#changeProvice').show()
 			$('#changeCountry').hide()
 			$('#changeCity').hide()
 		} else if ($(this).val() == 3) {
 			$('#changeProvice').hide()
 			$('#changeCity').show()
 			$('#changeCountry').hide()
 		} else {
 			$('#changeProvice').hide()
 			$('#changeCity').hide()
 			$('#changeCountry').show()
 		}
 	});
 	// 筛选人员
 	var searchCityNum, searchCountryNum, searchProviceName, searchCityName;
 	$('.searchBtn').click(function() {
 		searchProviceName = ""
 		searchCityName = ""
 		$('#c_province option:gt(0)').remove();
 		for (var i = 0; i < cityAll.length; i++) {
 			$('#c_province').append('<option value="' + i + '">' + cityAll[i].name + '</option>');
 		}
 		layer.open({
 			type: 1,
 			area: ['700px', '350px'],
 			title: ['高级筛选', 'font-size:18px;text-align: center;'],
 			content: $(".choosePersonDiv"),
 			btn: '确定',
 			yes: function(index, layero) {
 				layer.close(layer.index);
 				loadPerson(0)
 			}
 		});
 	});
 	// 搜索
 	function loadPerson(page) {
 		$.post('' + http_head + '/Admin/Get_AdminBySearch.ashx', {
 			"userGuid": dataManger.userGuid,
 			"page": page,
 			"name": $('.searchName').val(),
 			"usename": $('.searchCount').val(),
 			"sex": $('#searchSex').val(),
 			"province": searchProviceName,
 			"city": searchCityName,
 			"county": $('#c_county').val(),
 			"status": $('#countStatus').val()
 		}, function(data) {
 			var datasearch = JSON.parse(data);
 			if (datasearch.status == 200) {
 				loadTable(datasearch.items)
 				$('.choosePersonDiv input').val("")
 				$('.choosePersonDiv select').val("")
 			}
 		});
 	}
 	// 搜索省市区操作
 	$('#c_province').change(function() {
 		$('#c_city option:gt(0)').remove()
 		searchCityNum = $(this).val()
 		searchProviceName = cityAll[searchCityNum].name
 		for (var j = 0; j < cityAll[searchCityNum].sub.length; j++) {
 			$('#c_city').append('<option value="' + j + '">' + cityAll[searchCityNum].sub[j].name + '</option>')
 		}
 	});
 	$('#c_city').change(function() {
 		$('#c_county option:gt(0)').remove()
 		searchCountryNum = $(this).val()
 		searchCityName = cityAll[searchCityNum].sub[searchCountryNum].name
 		for (var m = 0; m < cityAll[searchCityNum].sub[searchCountryNum].sub.length; m++) {
 			$('#c_county').append('<option value="' + cityAll[searchCityNum].sub[searchCountryNum].sub[m].name + '">' +
 				cityAll[searchCityNum].sub[searchCountryNum].sub[m].name + '</option>')
 		}
 	});

 	// 分配省区域
 	$('.provideChoose').click(function() {
 		var proviceVal = "";
		setTimeout(function(){
			$.post('' + http_head + '/Option_AreasAnd.ashx', {
				"type": 0
			}, function(data) {
				for (var i = 0; i < data.length; i++) {
					$(".proviceTable").append('<span><label for="' + i + '"><input type="checkbox" value="' + data[i].name +
						'" id="' + i + '" name="proviceChecked">' + data[i].name + '</label></span>')
				}
			});
		},308);
 		layer.open({
 			type: 1,
 			area: ['800px', '450px'],
 			title: ['选择省负责人', 'font-size:18px;text-align: center;'],
 			content: $(".proviceTable"),
 			btn: '确定',
 			yes: function(index, layero) {
 				var groupCheckbox = $("input[name='proviceChecked']");
 				for (i = 0; i < groupCheckbox.length; i++) {
 					if (groupCheckbox[i].checked) {
 						proviceVal += groupCheckbox[i].value + ",";
 					}
 				}
 				$('.provideChoose').val(proviceVal.substring(0, Number(proviceVal.length) - 1));
 				$("input[name='proviceChecked']").attr("checked", false)
 				layer.close(layer.index);
 			}
 		});
 	});
 	// 分配市区域
	setTimeout(function(){
		$.post('' + http_head + '/Option_AreasAnd.ashx', {
			"type": 0
		}, function(data) {
			cityAll = data
			// 市区域处理
			if (dataManger.type == 2 || dataManger.type == 3) {
				arr_Pro = dataManger.province.split(",")
				for (var i = 0; i < cityAll.length; i++) {
					for (var j = 0; j < arr_Pro.length; j++) {
						if (arr_Pro[j] == cityAll[i].name) {
							arr_ProNum.push(i)
						}
					}
				}
			}
			// 区区域处理
			if (dataManger.type == 2 || dataManger.type == 3) {
				arr_City = dataManger.city.split(",");
				for (var m = 0; m < cityAll[arr_ProNum[0]].sub.length; m++) {
					for (var n = 0; n < arr_City.length; n++) {
						if (arr_City[n] == cityAll[arr_ProNum[0]].sub[m].name) {
							arr_CityNum.push(m)
						}
					}
				}
			}
			if (dataManger.type == 1 || dataManger.type == 0) {
				for (var i = 0; i < data.length; i++) {
					$('#province2').append('<option value="' + i + '" id="' + i + 'P">' + data[i].name + '</option>')
					$('#cityChoose1').append('<option value="' + i + '" id="' + i + 'P">' + data[i].name + '</option>')
					$('#cityChoose2').append('<option value="' + i + '" id="' + i + 'P">' + data[i].name + '</option>')
					$('#province2 #0P').remove()
					$('#province2 #1P').remove()
					$('#province2 #8P').remove()
					$('#province2 #21P').remove()
					$('#province2 #31P').remove()
					$('#cityChoose1 #0P').remove()
					$('#cityChoose1 #1P').remove()
					$('#cityChoose1 #8P').remove()
					$('#cityChoose1 #21P').remove()
					$('#cityChoose1 #31P').remove()
				}
				for (var m = 0; m < data.length; m++) {
					$('#province3').append('<option value="' + m + '">' + data[m].name + '</option>')
				}
			} else if (dataManger.type == 2) {
				for (var i = 0; i < arr_ProNum.length; i++) {
					$('#province2').append('<option value="' + arr_ProNum[i] + '" id="' + arr_ProNum[i] + 'P">' + cityAll[
						arr_ProNum[i]].name + '</option>')
					$('#cityChoose1').append('<option value="' + arr_ProNum[i] + '" id="' + arr_ProNum[i] + 'P">' + cityAll[
						arr_ProNum[i]].name + '</option>')
					$('#cityChoose2').append('<option value="' + arr_ProNum[i] + '" id="' + arr_ProNum[i] + 'P">' + cityAll[
						arr_ProNum[i]].name + '</option>')
					$('#province3').append('<option value="' + arr_ProNum[i] + '" id="' + arr_ProNum[i] + 'P">' + cityAll[
						arr_ProNum[i]].name + '</option>')
				}
			} else if (dataManger.type == 3) {
				for (var i = 0; i < arr_ProNum.length; i++) {
					$('#province3').append('<option value="' + arr_ProNum[i] + '" id="' + arr_ProNum[i] + 'P">' + cityAll[
						arr_ProNum[i]].name + '</option>')
				}
			}
		});
	},432);
 	
 	var cityNum;
 	$('#province2').change(function() {
 		cityNum = $(this).val()
 		$('.cityChoose').val("")
 	});
 	$('.cityChoose').click(function() {
 		$(".cityTable span").remove()
 		var cityVal = "";
 		for (var j = 0; j < cityAll[cityNum].sub.length; j++) {
 			$(".cityTable").append('<span><label for="' + j + 'C"><input type="checkbox" value="' + cityAll[cityNum].sub[j]
 				.name + '" id="' + j + 'C" name="cityChecked">' + cityAll[cityNum].sub[j].name + '</label></span>')
 		}
 		layer.open({
 			type: 1,
 			area: ['800px', '450px'],
 			title: ['选择市负责人', 'font-size:18px;text-align: center;'],
 			content: $(".cityTable"),
 			btn: '确定',
 			yes: function(index, layero) {
 				var groupCheckbox2 = $("input[name='cityChecked']");
 				for (i = 0; i < groupCheckbox2.length; i++) {
 					if (groupCheckbox2[i].checked) {
 						cityVal += groupCheckbox2[i].value + ",";
 					}
 				}
 				$('.cityChoose').val(cityVal.substring(0, Number(cityVal.length) - 1));
 				$("input[name='cityChecked']").attr("checked", false)
 				layer.close(layer.index);
 			}
 		});
 	});
 	// 区域负责人
 	var cityNum2;
 	$('#province3').change(function() {
 		cityNum2 = $(this).val()
 		$('#city3 option:gt(0)').remove()
 		if (dataManger.type == 1 || dataManger.type == 2 || dataManger.type == 0) {
 			setTimeout(function() {
 				for (var n = 0; n < cityAll[cityNum2].sub.length; n++) {
 					$('#city3').append('<option value="' + n + '">' + cityAll[cityNum2].sub[n].name + '</option>')
 				}
 			}, 100);
 		} else if (dataManger.type == 3) {
 			setTimeout(function() {
 				for (var n = 0; n < arr_CityNum.length; n++) {
 					$('#city3').append('<option value="' + arr_CityNum[n] + '">' + cityAll[cityNum2].sub[arr_CityNum[n]].name +
 						'</option>')
 					$('#countryChoose').append('<option value="' + arr_CityNum[n] + '">' + cityAll[cityNum2].sub[arr_CityNum[n]]
 						.name + '</option>')
 				}
 			}, 100);
 		}
 	})
 	// ~~~~~~~~~~~~~~~~~~~~~~~~修改管辖区~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 	// ~~~~~~~~~~~修改区代理~~~~~~~~~~~~~~~
 	var cityChoose2, countryVal3, countryChooseNum;
 	$('#cityChoose2').change(function() {
 		cityChoose2 = $(this).val()
 		$('#countryChoose option:gt(0)').remove()
 		setTimeout(function() {
 			for (var n = 0; n < cityAll[cityChoose2].sub.length; n++) {
 				$('#countryChoose').append('<option value="' + n + '">' + cityAll[cityChoose2].sub[n].name + '</option>')
 			}
 		}, 100);
 	})
 	$('#countryChoose').change(function() {
 		$('#quChoose').val("")
 		countryChooseNum = $(this).val()
 		$(".changeArea span").remove()
 		for (var n = 0; n < cityAll[cityChoose2].sub[countryChooseNum].sub.length; n++) {
 			$(".changeArea").append('<span><label for="' + n + 'C2"><input type="checkbox" value="' + cityAll[cityChoose2].sub[
 				countryChooseNum].sub[n].name + '" id="' + n + 'C2" name="countyChecked2">' + cityAll[cityChoose2].sub[
 				countryChooseNum].sub[n].name + '</label></span>')
 		}
 	});
 	$('#quChoose').click(function() {
 		countryVal3 = "";
 		layer.open({
 			type: 1,
 			area: ['800px', '450px'],
 			title: ['选择区负责人', 'font-size:18px;text-align: center;'],
 			content: $(".changeArea"),
 			btn: '确定',
 			yes: function(index, layero) {
 				var groupCheckbox4 = $("input[name='countyChecked2']");
 				for (i = 0; i < groupCheckbox4.length; i++) {
 					if (groupCheckbox4[i].checked) {
 						countryVal3 += groupCheckbox4[i].value + ",";
 					}
 				}
 				$('#quChoose').val(countryVal3.substring(0, Number(countryVal3.length) - 1));
 				$("input[name='countyChecked2']").attr("checked", false)
 				layer.close(layer.index);
 			}
 		});
 	});
 	// ~~~~~~~~~~~修改市代理~~~~~~~~~~~~~~~
 	var cityChangeNum, cityVal3;
 	$('#cityChoose1').change(function() {
 		$('#cityChooseInput').val("")
 		$('.changeCityDiv span').remove()
 		cityChangeNum = $(this).val();
 		for (var i = 0; i < cityAll[cityChangeNum].sub.length; i++) {
 			$(".changeCityDiv").append('<span><label for="' + i + 'City2"><input type="checkbox" value="' + cityAll[
 					cityChangeNum].sub[i].name + '" id="' + i + 'City2" name="cityChecked2">' + cityAll[cityChangeNum].sub[i].name +
 				'</label></span>')
 		}
 	});
 	$('#cityChooseInput').click(function() {
 		cityVal3 = ""
 		layer.open({
 			type: 1,
 			area: ['800px', '450px'],
 			title: ['选择区负责人', 'font-size:18px;text-align: center;'],
 			content: $(".changeCityDiv"),
 			btn: '确定',
 			yes: function(index, layero) {
 				var groupCheckbox5 = $("input[name='cityChecked2']");
 				for (i = 0; i < groupCheckbox5.length; i++) {
 					if (groupCheckbox5[i].checked) {
 						cityVal3 += groupCheckbox5[i].value + ",";
 					}
 				}
 				$('#cityChooseInput').val(cityVal3.substring(0, Number(cityVal3.length) - 1));
 				$("input[name='cityChecked2']").attr("checked", false)
 				layer.close(layer.index);
 			}
 		});
 	});
 	// ~~~~~~~~~~~修改省代理~~~~~~~~~~~~~~~
 	var proVal3;
 	$('#proChooseInput').click(function() {
 		proVal3 = ""
 		$('.changeProDiv span').remove();
 		for (var i = 0; i < cityAll.length; i++) {
 			$(".changeProDiv").append('<span><label for="' + i + '"><input type="checkbox" value="' + cityAll[i].name +
 				'" id="' + i + '" name="proviceChecked2">' + cityAll[i].name + '</label></span>')
 		}
 		layer.open({
 			type: 1,
 			area: ['800px', '450px'],
 			title: ['选择省份负责人', 'font-size:18px;text-align: center;'],
 			content: $(".changeProDiv"),
 			btn: '确定',
 			yes: function(index, layero) {
 				var groupCheckbox6 = $("input[name='proviceChecked2']");
 				for (i = 0; i < groupCheckbox6.length; i++) {
 					if (groupCheckbox6[i].checked) {
 						proVal3 += groupCheckbox6[i].value + ",";
 					}
 				}
 				$('#proChooseInput').val(proVal3.substring(0, Number(proVal3.length) - 1));
 				$("input[name='proviceChecked2']").attr("checked", false)
 				layer.close(layer.index);
 			}
 		});
 	});
 	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 	var cityNum3, country, countryVal2;
 	$('#city3').change(function() {
 		$('.countyChoose').val("")
 		cityNum3 = cityAll[cityNum2]
 		country = $(this).val()
 		$(".countryTable span").remove()
 		for (var n = 0; n < cityNum3.sub[country].sub.length; n++) {
 			$(".countryTable").append('<span><label for="' + n + 'C"><input type="checkbox" value="' + cityNum3.sub[country]
 				.sub[n].name + '" id="' + n + 'Conuty" name="countyChecked">' + cityNum3.sub[country].sub[n].name +
 				'</label></span>')
 		}
 	})

 	$('.countyChoose').click(function() {
 		countryVal2 = "";
 		layer.open({
 			type: 1,
 			area: ['800px', '450px'],
 			title: ['选择区负责人', 'font-size:18px;text-align: center;'],
 			content: $(".countryTable"),
 			btn: '确定',
 			yes: function(index, layero) {
 				var groupCheckbox3 = $("input[name='countyChecked']");
 				for (i = 0; i < groupCheckbox3.length; i++) {
 					if (groupCheckbox3[i].checked) {
 						countryVal2 += groupCheckbox3[i].value + ",";
 					}
 				}
 				$('.countyChoose').val(countryVal2.substring(0, Number(countryVal2.length) - 1));
 				$("input[name='countyChecked']").attr("checked", false)
 				layer.close(layer.index);
 			}
 		});
 	});
 	// 照片上传
 	var arr = ['', '']
 	$("#pic1").click(function() {
 		$("#upload1").click(); //隐藏了input:file样式后，点击头像就可以本地上传
 		$("#upload1").on("change", function() {
 			var objUrl1 = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
 			arr.splice(0, 1, this.files[0]);
 			if (objUrl1) {
 				$("#pic1Img").show()
 				$("#pic1Img").attr("src", objUrl1); //将图片路径存入src中，显示出图片
 				$("#pic1").val("重新选择")
 			}
 		});
 	});
 	$("#pic3").click(function() {
 		$("#upload3").click(); //隐藏了input:file样式后，点击头像就可以本地上传
 		$("#upload3").on("change", function() {
 			var objUrl3 = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
 			arr.splice(1, 1, this.files[0]);
 			if (objUrl3) {
 				$("#pic3Img").show()
 				$("#pic3Img").attr("src", objUrl3); //将图片路径存入src中，显示出图片
 				$("#pic3").val("重新选择")
 			}
 		});
 	});
 	$("#pic2").click(function() {
 		$("#upload2").click(); //隐藏了input:file样式后，点击头像就可以本地上传
 		$("#upload2").on("change", function() {
 			var objUrl2 = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
 			if (objUrl2) {
 				$("#pic2Img").show()
 				$("#pic2Img").attr("src", objUrl2); //将图片路径存入src中，显示出图片
 				$("#pic2").val("重新选择")
 			}
 		});
 	});
 	$("#pic4").click(function() {
 		$("#upload4").click(); //隐藏了input:file样式后，点击头像就可以本地上传
 		$("#upload4").on("change", function() {
 			var objUrl4 = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
 			if (objUrl4) {
 				$("#pic4Img").show()
 				$("#pic4Img").attr("src", objUrl4); //将图片路径存入src中，显示出图片
 				$("#pic4").val("重新选择")
 			}
 		});
 	});
 	//建立一個可存取到該file的url
 	function getObjectURL(file) {
 		var url = null;
 		if (window.createObjectURL != undefined) { // basic
 			url = window.createObjectURL(file);
 		} else if (window.URL != undefined) { // mozilla(firefox)
 			url = window.URL.createObjectURL(file);
 		} else if (window.webkitURL != undefined) { // webkit or chrome
 			url = window.webkitURL.createObjectURL(file);
 		}
 		return url;
 	}
 	var proVal, cityVal2, areaVal;
 	$('.addZhanghaoBtn').click(function() {
 		layer.open({
 			type: 1,
 			area: ['800px', '600px'],
 			title: ['添加管理人员', 'font-size:18px;text-align: center;'],
 			content: $(".addMangerDet"),
 			btn: '确定',
 			yes: function(index, layero) {
 				ajaxFileUpload();
 				layer.closeAll()
 			}
 		});
 	});

 	function ajaxFileUpload() {
 		if ($('#powder').val() == 1) {
 			proVal = "全国";
 			cityVal2 = " ";
 			areaVal = " ";
 		} else if ($('#powder').val() == 2) {
 			proVal = $('.provideChoose').val();
 			cityVal2 = " ";
 			areaVal = " ";
 		} else if ($('#powder').val() == 3) {
 			cityVal2 = $('.cityChoose').val();
 			proVal = cityAll[$('#province2').val()].name
 			areaVal = " ";
 		} else {
 			areaVal = $('.countyChoose').val();
 			proVal = cityAll[$('#province3').val()].name
 			cityVal2 = cityAll[$('#province3').val()].sub[$('#city3').val()].name
 		}
 		var password1 = $('.password').val() + "EQD";
 		var password2 = hex_sha1(password1);
 		var Pformdata = new FormData();
 		var Area = $('#s_province').val() + $('#s_city').val() + $('#s_county').val();
 		Pformdata.append('userGuid', dataManger.userGuid);
 		Pformdata.append('username', $('.cellphone').val());
 		Pformdata.append('password', password2);
 		Pformdata.append('name', $('.nameVal').val());
 		Pformdata.append('area', Area);
 		Pformdata.append('sex', $('#sexChoose').val());
 		Pformdata.append('IDCard', $('.idNumVal').val());
 		Pformdata.append('QQ', $('.qqVal').val());
 		Pformdata.append('WeChar', $('.weChatVal').val());
 		Pformdata.append('email', $('.emailVal').val());
 		Pformdata.append('type', $('#powder').val());
 		Pformdata.append('province', proVal);
 		Pformdata.append('city', cityVal2);
 		Pformdata.append('county', areaVal);
 		if (arr[0].length != 0) {
 			var img5val = arr[0];
 			Pformdata.append('headImage', img5val);
 		} else if (arr[1].length != 0) {
 			var img6val = arr[1];
 			Pformdata.append('handIDcard', img6val);
 		} else {}
 		$.ajax({
 			type: 'POST',
 			url: '' + http_head + '/Admin/Add_SuperAdmin.ashx',
 			data: Pformdata,
 			cache: false,
 			processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
 			contentType: false, // 不设置Content-type请求头
 			success: function(data) {
 				var data2 = JSON.parse(data)
 				layer.closeAll('loading');
 				if (data2.status == 200) {
 					layer.msg('添加成功', {
 						time: 1000,
 					});
 					location.href = "../html/MangerLogined.html"
 				} else {
 					layer.msg(data2.msg, {
 						time: 3000,
 					});
 				}
 			},
 			error: function(msg) {}
 		});
 	}
 	// 头像
 	$('.changeHeadImg').click(function(event) {
 		ajaxFileUpload2()
 	});

 	function ajaxFileUpload2() {
 		var Iformdata = new FormData();
 		var dataimg = $("#upload2")[0].files[0];
 		Iformdata.append('userGuid', dataManger.userGuid);
 		Iformdata.append('objectGuid', dataManger.userGuid);
 		Iformdata.append('headImage', dataimg);
 		$.ajax({
 			type: 'POST',
 			url: '' + http_head + '/Admin/Update_AdminHeadImage.ashx',
 			data: Iformdata,
 			cache: false,
 			processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
 			contentType: false, // 不设置Content-type请求头
 			success: function(data) {
 				var data3 = JSON.parse(data)
 				if (data3.status == 200) {
 					layer.msg('添加成功', {
 						time: 1000,
 					});
 					// location.href ="../html/MangerLogined.html"
 				} else {
 					layer.msg(data2.msg, {
 						time: 3000,
 					});
 				}
 			},
 			error: function(msg) {}
 		});
 	}

 	function ajaxFileUpload2() {}
 	// 查看账号操作
 	var arr_person = [];
 	var dataLook

 	function loadLookZhanghao(page) {
 		$.post('' + http_head + '/Admin/Get_AllUser.ashx', {
 			"userGuid": dataManger.userGuid,
 			"page": page
 		}, function(data) {
 			dataLook = JSON.parse(data);
 			if (dataLook.items.length >= 10) {
 				$('.loadMore').show()
 				$('.loadNo').hide()
 			} else {
 				$('.loadMore').hide()
 				$('.loadNo').show()
 			}
 			for (var i = 0; i < dataLook.items.length; i++) {
 				arr_person.push(dataLook.items[i])
 			}
 			loadTable(arr_person)
 			$('.loadMore').click(function() {
 				loadLookZhanghao(dataLook.page)
 			});
 		});
 	}

 	function loadTable(data) {
 		$('#zhanghaoTable').bootstrapTable({
 			data: data,
 			columns: [{
 					field: 'headimage',
 					title: '头像',
 					align: 'center',
 					valign: 'middle',
 					formatter: imgFormatter
 				},
 				{
 					field: 'name',
 					title: '姓名',
 					align: 'center',
 					valign: 'middle',
 				},
 				{
 					field: 'username',
 					title: '手机号',
 					align: 'center',
 					valign: 'middle',
 				},
 				{
 					field: 'sex',
 					title: '性别',
 					align: 'center',
 					valign: 'middle',
 				},
 				{
 					field: 'area',
 					title: '所在地',
 					align: 'center',
 					valign: 'middle',
 				},
 				{
 					field: 'province',
 					title: '管辖省份',
 					align: 'center',
 					valign: 'middle',
 				},
 				{
 					field: 'city',
 					title: '管辖城市',
 					align: 'center',
 					valign: 'middle',
 				},
 				{
 					field: 'county',
 					title: '管辖县区',
 					align: 'center',
 					valign: 'middle',
 				},
 				{
 					field: 'status',
 					title: '状态',
 					align: 'center',
 					valign: 'middle',
 				},
 				{
 					field: 'option',
 					title: '操作',
 					align: 'center',
 					valign: 'middle',
 					formatter: ZhanghaoFormatter,
 					events: ZhanghaoEvents
 				}
 			]
 		});
 		$("#zhanghaoTable").bootstrapTable('load', data);

 		function imgFormatter(e, value, row, index) {
 			var imgsrc;
 			if (value.headimage == "" + http_head + "") {
 				imgsrc = "暂无头像"
 			} else {
 				var imgUrl2 = value.headimage.replace(/.png/, "min.png")
 				imgsrc = '<img src="' + imgUrl2 + '" alt="暂无头像" />'
 			}
 			return [
 				imgsrc
 			].join('');
 		};

 		function ZhanghaoFormatter(e, value, row, index) {
 			var btnVal;
 			if (value.status == "禁用") {
 				btnVal = "激活"
 			} else {
 				btnVal = "禁用"
 			}
 			return [
 				'<a class="openArea" title="' + btnVal + '">',
 				'<span id="optionBtn1">' + btnVal + '</span>',
 				'</a>',
 				'<a class="option"  title="修改管辖区域">',
 				'<span id="optionBtn">修改管辖区域</span>',
 				'</a>',
 				'<a class="changePic"  title="修改头像">',
 				'<span id="changePicBtn">修改头像</span>',
 				'</a>',
 				'<a class="changeInfo"  title="修改信息">',
 				'<span id="changeInfoBtn">修改信息</span>',
 				'</a>',
 			].join('');
 		};
 	}
 	// 账号操作
 	var proValChange
 	var cityValChange
 	var cityValChange2
 	var countryValChange
 	window.ZhanghaoEvents = {
 		'click .openArea': function(e, value, row, index) {
 			if (row.status == "禁用") {
 				$.post('' + http_head + '/Admin/Open_User.ashx', {
 					"userGuid": dataManger.userGuid,
 					"objectGuid": row.userGuid
 				}, function(data) {
 					console.log(data)
 					var dataYes = JSON.parse(data)
 					if (dataYes.status == 200) {
 						arr_person = []
 						loadLookZhanghao(0)
 						layer.msg('激活成功', {
 							time: 1000,
 						});
 					}
 				});
 			} else {
 				$.post('' + http_head + '/Admin/Disable_User.ashx', {
 					"userGuid": dataManger.userGuid,
 					"objectGuid": row.userGuid
 				}, function(data) {
 					var dataYes = JSON.parse(data)
 					if (dataYes.status == 200) {
 						arr_person = []
 						loadLookZhanghao(0)
 						layer.msg('禁用成功', {
 							time: 1000,
 						});
 					}
 				});
 			}
 		},
 		'click .option': function(e, value, row, index) {
 			$('#powder2').click(function() {
 				if ($('#powder2').val() == 1) {
 					proValChange = "全国"
 				} else if ($('#powder2').val() == 3) {
 					$('#cityChoose1').change(function() {
 						proValChange = cityAll[$('#cityChoose1').val()].name
 					});
 				} else if ($('#powder2').val() == 4) {
 					$('#cityChoose2').change(function() {
 						proValChange = cityAll[$('#cityChoose2').val()].name;
 					});
 					$('#countryChoose').change(function() {
 						cityValChange = cityAll[$('#cityChoose2').val()].sub[$('#countryChoose').val()].name
 					});
 				}
 			});
 			console.log($('#powder2').val())
 			layer.open({
 				type: 1,
 				area: ['800px', '300px'],
 				title: ['修改下属管辖区域', 'font-size:18px;text-align: center;'],
 				content: $(".changeTable"),
 				btn: '确定',
 				yes: function(index, layero) {
 					if ($('#powder2').val() == 3) {
 						cityValChange2 = $('#cityChooseInput').val();
 						countryValChange = "";
 					} else if ($('#powder2').val() == 4) {
 						cityValChange2 = cityValChange;
 						countryValChange = $('#quChoose').val()
 					} else if ($('#powder2').val() == 2) {
 						cityValChange2 = ""
 						countryValChange = ""
 						proValChange = $('#proChooseInput').val()
 					} else if ($('#powder2').val() == 1) {
 						cityValChange2 = ""
 						countryValChange = ""
 					}
 					$.post('' + http_head + '/Admin/Update_AdminPower.ashx', {
 						"userGuid": dataManger.userGuid,
 						"objectGuid": row.userGuid,
 						"province": proValChange,
 						"city": cityValChange2,
 						"county": countryValChange,
 						"type": $('#powder2').val()
 					}, function(data) {
 						var dataChanged = JSON.parse(data)
 						if (dataChanged.status == 200) {
 							arr_person = []
 							loadLookZhanghao(0)
 							proValChange = "";
 							cityValChange2 = "";
 							countryValChange = "";
 							cityValChange = "";
 						} else {
 							layer.msg(dataChanged.msg, {
 								time: 3000,
 							});
 						}
 					});
 					layer.closeAll();
 				}
 			});
 		},
 		'click .changePic': function(e, value, row, index) {
 			layer.open({
 				type: 1,
 				area: ['500px', '450px'],
 				title: ['修改下属头像', 'font-size:18px;text-align: center;'],
 				content: $(".changePicDiv"),
 				btn: '确定',
 				yes: function(index, layero) {
 					var Iformdata2 = new FormData();
 					var dataimg2 = $("#upload4")[0].files[0];
 					Iformdata2.append('userGuid', dataManger.userGuid);
 					Iformdata2.append('objectGuid', row.userGuid);
 					Iformdata2.append('headImage', dataimg2);
 					$.ajax({
 						type: 'POST',
 						url: '' + http_head + '/Admin/Update_AdminHeadImage.ashx',
 						data: Iformdata2,
 						cache: false,
 						processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
 						contentType: false, // 不设置Content-type请求头
 						success: function(data) {
 							var data4 = JSON.parse(data)
 							if (data4.status == 200) {
 								layer.msg('修改成功', {
 									time: 1000,
 								});
 								arr_person = []
 								loadLookZhanghao(0)
 							} else {
 								layer.msg(data4.msg, {
 									time: 3000,
 								});
 							}
 						},
 						error: function(msg) {}
 					});
 					layer.closeAll();
 				}
 			})
 		},
 		'click .changeInfo': function(e, value, row, index) {
 			var dataPeoson = "";
 			$.post('' + http_head + '/Admin/Get_UserInfo.ashx', {
 				"userGuid": row.userGuid
 			}, function(data) {
 				dataPeoson = JSON.parse(data);
 				$('.underCount').val(dataPeoson.items.username)
 				$('.underName').val(dataPeoson.items.name)
 				$('.underSex').val(dataPeoson.items.sex)
 				$('.underIDNum').val(dataPeoson.items.IDCard)
 				$('.underAdress').val(dataPeoson.items.area)
 				$('.underQQ').val(dataPeoson.items.QQ)
 				$('.underWechat').val(dataPeoson.items.WeChat)
 				$('.underEmail').val(dataPeoson.items.email)
 				$('.underProcive').val(dataPeoson.items.province)
 				$('.underCity').val(dataPeoson.items.city)
 				$('.underCountry').val(dataPeoson.items.county)
 			});
 			layer.open({
 				type: 1,
 				area: ['600px', '450px'],
 				title: ['修改下属信息', 'font-size:18px;text-align: center;'],
 				content: $(".changeInfoDiv"),
 				btn: '确定',
 				yes: function(index, layero) {
 					$.post('' + http_head + '/Admin/Update_AdminInfo.ashx', {
 						"userGuid": dataPeoson.items.userGuid,
 						"para": "email='" + $('.underEmail').val() + "'," + "QQ='" + $('.underQQ').val() + "'," + "WeChat='" +
 							$('.underWechat').val() + "'"
 					}, function(data) {
 						var dataChange2 = JSON.parse(data)
 						if (dataChange2.status == 200) {
 							loadInfo()
 							layer.msg('修改成功', {
 								time: 1000,
 							});
 						} else {
 							layer.msg(dataChange2.msg, {
 								time: 1000,
 							});
 						}
 					});
 					layer.closeAll();
 				}
 			})
 		}
 	}
 	// 个人信息
 	function loadInfo() {
 		$.post('' + http_head + '/Admin/Get_UserInfo.ashx', {
 			"userGuid": dataManger.userGuid,
 		}, function(data) {
 			var dataInfo2 = JSON.parse(data);
 			$('.selfName').val(dataInfo2.items.name)
 			$('.selfTel').val(dataInfo2.items.username)
 			$('.selfQQ').val(dataInfo2.items.QQ)
 			$('.selfWechat').val(dataInfo2.items.WeChat)
 			$('.selfEmail').val(dataInfo2.items.email)
 			$('.selfProvice').val(dataInfo2.items.province)
 			$('.selfCity').val(dataInfo2.items.city)
 			$('.selfCountry').val(dataInfo2.items.county)
 			$('.selfIDNum').val(dataInfo2.items.IDCard)
 			$('.selfSex').val(dataInfo2.items.sex)
 			$('.selfArea').val(dataInfo2.items.area)
 			$('#pic2Img').attr('src', dataInfo2.items.headimage);
 		});
 	}
 	// 修改信息
 	$('.changeBtn').click(function() {
 		$.post('' + http_head + '/Admin/Update_AdminInfo.ashx', {
 			"userGuid": dataManger.userGuid,
 			"para": "email='" + $('.selfEmail').val() + "'," + "QQ='" + $('.selfQQ').val() + "'," + "WeChat='" + $(
 				'.selfWechat').val() + "'"
 		}, function(data) {
 			var dataChange = JSON.parse(data)
 			if (dataChange.status == 200) {
 				loadInfo()
 				layer.msg('修改成功', {
 					time: 1000,
 				});
 			} else {
 				layer.msg(dataChange.msg, {
 					time: 1000,
 				});
 			}
 		});
 	});
 })
