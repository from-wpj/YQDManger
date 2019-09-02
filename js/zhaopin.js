 $(document).ready(function(){
  postLoad(0)
function postLoad(page,place,type,category){
   $.post(''+http_head+'/Extended/Get_EQDRecruit.ashx', {
          "page":page,
          "workPlace":place,
          "recruitType":type,
          "positionCategory":category
        }, function(data) {
          var dataPost = JSON.parse(data);
          $('#postDetailsTable').bootstrapTable({
                data: dataPost.items,
                columns: [
                {
                    field: 'positionName',
                    title: '职位'
                },
                {
                    field: 'positionCategory',
                    title: '职位类别'
                },
                {
                    field: 'recruitType',
                    title: '职位类型'
                },
                 {
                    field: 'workPlace',
                    title: '工作地点',
                },
                {
                    field: 'createTime',
                    title: '发布时间',
                    formatter: postTFormatter
                 },
                {
                   field: 'option',
                    title: '删除',
                    formatter: delFormatter,
                    events:delEvents
                }
            ]
      });
             $("#postDetailsTable").bootstrapTable('load', dataPost.items);
        });
        function postTFormatter(value, row,index){
                   var postT = (row.createTime).split("T")[0];
            return[
                    postT
             ].join('');
      }
      function delFormatter(value, row,index){
            return[
                '<a class="delete"  title="delete">',
                    '<span id="delete">删除</span>',
                    '</a>  ',
             ].join('');
      }
}
      window.delEvents = {
          'click .delete': function (e, value, row, index) {
             $('.cover').show()
              layer.open({
                  type: 1,
                  area: '600px',
                  title: ['删除招聘信息', 'font-size:18px;text-align: center;'],
                  content: $('.makeSureDel'),
                  btn:'确定',
                  shade: false
                     });
              $('.layui-layer-btn0').click(function() {
                    $('.cover').hide();
                    $.post(''+http_head+'/Extended/Del_EQDRecruit.ashx', {
                      "userGuid":dataManger.userGuid,
                      "recruitId":row.Id
                    }, function(data) {
                      var dataDel = JSON.parse(data);
                      if ( dataDel.status == 200 ) {
                        postLoad(0)
                      }
                    });
              });
              $('.layui-layer-close').click(function() {
                  $('.cover').hide();
              });
             }
      }
      $('#zhaopin').click(function() {
         $(this).addClass('activeM').siblings('li').removeClass('activeM');
         $('.zhaopinDiv').show().siblings('div').hide();
      });
      $('.addZhaopin').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.addZhaoPin').show().siblings('div').hide();
      });
      $('.lookZhaopin').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.lookZhaoPin').show().siblings('div').hide();
        postLoad(0)
      });
      $("#page").Page({
          totalPages: 100,//分页总数
          liNums: 5,//分页的数字按钮数(建议取奇数)
          activeClass: 'activP', //active 类样式定义
          callBack : function(page){
              postLoad((page-1))
          }
      });
      $('.zhaopinBtn').click(function() {
        if ( $('.positionName').val().length == 0 || $('#theDemand').val().length == 0 || $('.recruitType').val().length == 0 || $('.workPlace').val().length == 0 || $('.positionCategory').val().length == 0 || $('#theDescription').val().length == 0 ) {
                  layer.msg("请完善招聘要求信息", {
                                      time: 1000,
                                    });
        }else{
        $.post(''+http_head+'/Extended/Add_EQDRecruit.ashx', {
          "userGuid":dataManger.userGuid,
          "positionName":$('.positionName').val(),
          "recruitType":$('.recruitType').val(),
          "workPlace":$('.workPlace').val(),
          "positionCategory":$('.positionCategory').val(),
          "theDescription":$('#theDescription').val(),
          "theDemand":$('#theDemand').val()
        }, function(data) {
            var zhaopinData = JSON.parse(data)
            if ( zhaopinData.status == 200 ) {
                $('.zhaopinForm input').val("")
                $('.zhaopinForm textarea').val("");
                layer.msg("添加成功", {
                                      time: 1000,
                                    });
            }
        });
        }
      });

})
