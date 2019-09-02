var http_head = "http://47.94.173.253:8008";
var dataM = localStorage.getItem("GHY_MangerLogin");
if (dataM == null) {
	layer.msg('不能直接访问后台管理页面，请返回登陆', {
		time: 2000,
	});
	setTimeout(function() {
		location.href = "../mangerLogin.html";
	}, 2500);
} else {

	var dataManger = JSON.parse(dataM);
	$('.loginName').text(dataManger.name)
}

function load() {
	document.getElementById("mangerCon").click();
	setTimeout(function() {
		document.getElementById("lookManger").click();
	}, 100);
}
