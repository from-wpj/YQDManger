 $(document).ready(function(){
  var logineder = sessionStorage.getItem("LOOK_login");
  console.log( logineder )
  var loginInfo = JSON.parse(logineder)
  $('.checkerName').text(loginInfo.staffName)
  laydate.render({
                   elem: '#beginTime',
                   max:0,
                  });
  laydate.render({
                   elem: '#endTime',
                   // max:0,
                  });
       var day1 = new Date();
      day1.setTime(day1.getTime()-24*60*60*1000);
      var s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
    $('#endTime').val(s1)
        var dayCount;
        var dataItems;
        var timeSpendAll;
  $('#searchBtn').click(function() {
    dayCount = getDays($('#beginTime').val() , $('#endTime').val()) +1
    if ( $('#beginTime').val() ==""  || $('#endTime').val() =="" ) {
      layer.msg('请填写日期', {
                                                              time: 2000,
                                                            });
    }else{
            $.post(''+http_head+'/userashx/LoginLog/Get_LoginLogs.ashx', {
                  "userGuid" : loginInfo.Guid,
                  "startTime" : $('#beginTime').val(),
                  "endTime" : $('#endTime').val(),
                    }, function(data) {
                      var dataLogin = JSON.parse(data)
                      if (dataLogin.status == 200) {
                        layer.msg('查询成功', {
                                                              time: 2000,
                                                            });
                      }
                     dataItems = dataLogin.items
                      $('#loginTable').bootstrapTable({
                                                    url: dataLogin.items,
                                                    columns: [
                                                    {
                                                        field: 'createTime',
                                                        title: '登录日期',
                                                        align: 'center',
                                                        valign: 'middle',
                                                        formatter: loginDayFormatter
                                                    },
                                                    {
                                                        field: 'createTime',
                                                        title: '登录时间',
                                                        align: 'center',
                                                        valign: 'middle',
                                                        formatter: loginTimeFormatter
                                                    },
                                                    {
                                                        field: 'quitTime',
                                                        title: '离开时间',
                                                        align: 'center',
                                                        valign: 'middle',
                                                        formatter: quitTimeFormatter
                                                    },
                                                    {
                                                      field: 'time',
                                                      title: '在线时长',
                                                      align: 'center',
                                                      valign: 'middle',
                                                      formatter:timeAllFormatter,
                                                      // events:optionproduct3Events
                                                    }
                                                    ]
                                                });
                                                $("#loginTable").bootstrapTable('load', dataLogin.items);
                                                function loginDayFormatter(e,value, row, index){
                                                  var day = value.createTime.split(" ")[0]
                                                     return [
                                                      day
                                                      ].join('');
                                                };
                                                function loginTimeFormatter(e,value, row, index){
                                                  var loginTime = value.createTime.split(" ")[1]
                                                     return [
                                                      loginTime
                                                      ].join('');
                                                };
                                                function quitTimeFormatter(e,value, row, index){
                                                  var quitTime = value.quitTime.split(" ")[1]
                                                     return [
                                                      quitTime
                                                      ].join('');
                                                };
                                                function timeAllFormatter(e,value, row, index){
                                                  var timeAll;
                                                  if ( value.quitTime == "") {
                                                    timeAll ="暂无"
                                                  }else{
                                                    var dateBegin = new Date( value.createTime);
                                                    var dateEnd = new Date(value.quitTime);
                                                    var dataBE = dateEnd - dateBegin;
                                                    timeSpendAll = Number(dataBE)
                                                    timeAll =  MillisecondToDate(dataBE)
                                                  }
                                                     return [
                                                     timeAll
                                                      ].join('');
                                                };
            });
    }
  });
 // 毫秒转化时分秒
 function MillisecondToDate(msd) {
        var time = parseFloat(msd) / 1000;
        if (null != time && "" != time) {
            if (time > 60 && time < 60 * 60) {
                time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
                    parseInt(time / 60.0)) * 60) + "秒";
            }
            else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60) + "分钟" +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                    parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
            }
            else {
                time = parseInt(time) + "秒";
            }
        }
        return time;
  }

//获得两个日期之间相差的天数
    function getDays(date1 , date2){
      var date1Str = date1.split("-");//将日期字符串分隔为数组,数组元素分别为年.月.日
      //根据年 . 月 . 日的值创建Date对象
      var date1Obj = new Date(date1Str[0],(date1Str[1]-1),date1Str[2]);
      var date2Str = date2.split("-");
      var date2Obj = new Date(date2Str[0],(date2Str[1]-1),date2Str[2]);
      var t1 = date1Obj.getTime();
      var t2 = date2Obj.getTime();
      var dateTime = 1000*60*60*24; //每一天的毫秒数
      var minusDays = Math.floor(((t2-t1)/dateTime));//计算出两个日期的天数差
      var days = Math.abs(minusDays);//取绝对值
      return days;
    }
    // 统计
     var riqiArr = [];
    $('#tongjiBtn').click(function(event) {
          riqiArr = []
          layer.open({
                                           type: 1,
                                           area: ['1000px','518px'],
                                           title: ['统计数据', 'font-size:18px;text-align: center;'],
                                           content: $(".tongjiDiv"),
                                           yes: function(index, layero){

                                           }
                                        })
          var shuzu =[];
          var dateDay =[];
          var timeCount = [];
          var tdicTime = {};
           // 时间处理
             for (var i = 0; i < dayCount; i++) {
                    var rizi = addDate($('#beginTime').val(),i).substring(0,10);
                    var rizi2 = rizi.replace(/-/g, "/");
            shuzu.push(rizi2)
             }
                   for (var i = 0; i < dataItems.length; i++) {
                      dateDay.push(dataItems[i].createTime.split(" ")[0])
                      if ( dataItems[i].createTime !="" && dataItems[i].quitTime !=""  ) {
                        tdicTime[''+dataItems[i].createTime.split(" ")[0]+''] = new Date( dataItems[i].quitTime) - new Date( dataItems[i].createTime)
                      }
                    }
                    timeCount.push(tdicTime)
             function addDate(date,days){
                  var d=new Date(date);
                  d.setDate(d.getDate()+days);
                  var m=d.getMonth()+1;
                  return d.getFullYear()+'-'+m+'-'+d.getDate();
             }
             function findTime(date){
                  var tdic = {};
                  tdic["time"] = 0;
                  tdic["count"]=0;
                  tdic["date"] =date;
                  for (var i = 0; i < dateDay.length; i++) {
                    if ( date == dateDay[i]) {
                      if ( dataItems[i].createTime !="" && dataItems[i].quitTime !=""  ) {
                          tdic["time"] += new Date( dataItems[i].quitTime) - new Date( dataItems[i].createTime);
                    }
                        tdic["count"]+=1;
                  }
                 }
                 return tdic;
           }
          var thlist = "";
          var timeSpend= 0;
          var loginCount = 0;
          var onLineTime;
           for (var j = 0; j <dayCount; j++) {
               thlist+='<th data-field="'+"date"+j+'">'+shuzu[j]+'</th>';
               riqiArr.push({
                                 createTime : findTime(shuzu[j]).date,
                                 allTime : MillisecondToDate(findTime(shuzu[j]).time),//
                                 cishu: findTime(shuzu[j]).count,
                               })
               if ( findTime(shuzu[j]).count!=0 ) {
                loginCount+= Number(findTime(shuzu[j]).count) ;
               }
               if ( findTime(shuzu[j]).time!=0 ) {
                timeSpend+= Number(findTime(shuzu[j]).time) ;
               }
                       }
               onLineTime = Math.floor(timeSpend/loginCount)
               console.log( MillisecondToDate(onLineTime) )
               $('.loginTime').text( MillisecondToDate(onLineTime) )
             loadTongjitable(riqiArr)
    });

    function loadTongjitable(data){
       $('#tongjiTable').bootstrapTable({
                                                    url: data,
                                                    columns:
                                                    [
                                                        {
                                                        field: 'createTime',
                                                        title: '登录日期',
                                                        align: 'center',
                                                        valign: 'middle',
                                                        },
                                                        {
                                                        field: 'allTime',
                                                        title: '总时长',
                                                        align: 'center',
                                                        valign: 'middle',
                                                        // formatter: loginTimeFormatter
                                                        },
                                                        {
                                                        field: 'cishu',
                                                        title: '次数',
                                                        align: 'center',
                                                        valign: 'middle',
                                                        // formatter: loginDayFormatter
                                                        },
                                                    ]
                                                });
     $("#tongjiTable").bootstrapTable('load', data);

    }
 })
