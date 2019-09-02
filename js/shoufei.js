$(document).ready(function() {
    $('#shoufei').click(function() {
        $(this).addClass('activeM').siblings('li').removeClass('activeM');
        $('#shouFeiDiv').show().siblings('div').hide();
    });
    $('.addFunctionBtn').click(function() {
        layer.open({
            type: 1,
            area: ['800px', '500px'],
            title: ['添加功能设置', 'font-size:18px;text-align: center;'],
            content: $('.addFunctionDiv'),
            btn: '确定',
            yes: function(index, layero) {
                setTimeout(function() {
                    $.post('' + http_head + '/Admin/ComSpace/Add_ComSpaceModular.ashx', {
                        "userGuid": dataManger.userGuid,
                        "ModularName": $('.modelName').val(),
                        "VipPrice": $('.modelPrice').val(),
                        "ModularDescribe": $('#modelDescrib').val()
                    }, function(data) {
                        var dataModel = JSON.parse(data);
                        if (dataModel.status == 200) {
                            loadingManger()
                            $('.modelName').val("");
                            $('.modelPrice').val("");
                            $('#modelDescrib').val("")
                        } else {
                            layer.msg(dataModel.msg, {
                                time: 1000,
                            });
                        }
                    });
                    layer.closeAll()
                }, 200)
            }
        });
    });
    //功能设置
    $('.functionSet').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.functionSetDiv').show().siblings('div').hide();
    });
    //活动设置
    $('.activeSet').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.activeSetDiv').show().siblings('div').hide();
        $('#chooseActivityType').val(0)
        loadActivity(0, 0)
    });
    $('#chooseActivityType').change(function() {
        loadActivity(0, $(this).val())
    });
    var actmPage = 0;
    function loadActivity(page, status) {
        setTimeout(function() {
            $.post('' + http_head + '/Activity/Get_ActiveByAdmin.ashx', {
                "userGuid": dataManger.userGuid,
                "page": page,
                "status": status
            }, function(data) {
                var data = JSON.parse(data)
                if(data.status==200){
                    $("#activityTable").bootstrapTable('load', data.items);
                    loadActivityTable(data.items);
                    actmPage = data.page;
                    $(".actmNext").on("click", function() {
                        loadActivity(Number(actmPage),status)
                    });
                    $(".actmPrve").on("click", function() {
                        loadActivity(Number(actmPage - 2),status);
                        if (actmPage == 2) {
                            $(".actmPrve").removeClass("show-btn");
                        }
                    });
                    if (actmPage == 1) {
                        if (data.items.length < 12) {
                            $(".actmNext").removeClass("show-btn")
                        } else {
                            $(".actmNext").addClass("show-btn")
                        }
                    } else if (actmPage > 1) {
                        $(".actmPrve").addClass("show-btn");
                        if (data.items.length >= 12) {
                            $(".actmNext").addClass("show-btn")
                        } else {
                            $(".actmNext").removeClass("show-btn")
                        }
                    }
                }
            });
        }, 220)
    };
    loadActivity(actmPage,0);

    function loadActivityTable(data) {
        $('#activityTable').bootstrapTable({
            data: data,
            columns: [{
                field: 'activeTitle',
                title: '活动标题',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'activeCity',
                title: '举办城市',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'activeStartTime',
                title: '活动时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'activer',
                title: '负责人',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'option',
                title: '操作',
                align: 'center',
                valign: 'middle',
                formatter: optionproductFormatter,
                events: optionActivityEvents,
            }]
        });
        // $("#activityTable").bootstrapTable('load', data);

        function optionproductFormatter(e, value, row, index) {
            var optionVal;
            if (value.status == 0) {
                optionVal = '<a class="lookMore" title="查看活动"><span id="lookMore">查看</span></a><a class="agree" title="同意"><span id="agree">同意</span></a><a class="refuse" title="拒绝"><span id="refuse">拒绝</span></a>'
            } else if (value.status == 1) {
                optionVal = '<a class="lookMore" title="查看活动"><span id="lookMore">查看</span></a><a class="checked" title="已同意"><span id="agreed">已同意</span></a>'
            } else {
                optionVal = '<a class="lookMore" title="查看活动"><span id="lookMore">查看</span></a><a class="checked" title="已拒绝"><span id="refused">已拒绝</span></a>'
            }
            return [
                optionVal
            ].join('');
        };
    }
    window.optionActivityEvents = {
        // 查看
        'click .lookMore': function(e, value, row, index) {},
        // 同意
        'click .agree': function(e, value, row, index) {
            setTimeout(function() {
                $.post('' + http_head + '/Activity/Set_ActivityByAdmin.ashx', {
                    "userGuid": dataManger.userGuid,
                    "activityId": row.Id,
                    "msg": "同意",
                    "status": 1
                }, function(data) {
                    var dataAgree = JSON.parse(data);
                    if (dataAgree.status == 200) {
                        layer.msg('审核成功', {
                            time: 1000,
                        });
                        loadActivity(0, 0)
                    }
                });
            }, 237);
        },
        // 拒绝
        'click .refuse': function(e, value, row, index) {
            layer.open({
                type: 1,
                area: ['400px', '260px'],
                title: ['审批活动', 'font-size:18px;text-align: center;'],
                content: $('.refuseActivityDiv'),
                btn: '确定',
                yes: function(index, layero) {
                    setTimeout(function() {
                        $.post('' + http_head + '/Activity/Set_ActivityByAdmin.ashx', {
                            "userGuid": dataManger.userGuid,
                            "activityId": row.Id,
                            "msg": $('#refuseActivityReason').val(),
                            "status": 2
                        }, function(data) {
                            var dataAgree = JSON.parse(data);
                            if (dataAgree.status == 200) {
                                layer.msg('已拒绝', {
                                    time: 1000,
                                });
                                loadActivity(0, 0)
                            }
                        });
                        layer.closeAll()
                    }, 257);
                }
            })
        },
    }
    loadingManger()
    // 活动推广/////////////////////////////////////////////////////////////
    $('.activity').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.activityDiv').show().siblings('div').hide();
    });

    function loadActTable(data) {
        $("#actTable").bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'createTime',
                title: '开始时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '结束时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }]
        })
    };

    function loadAct() {
        setTimeout(function() {
            $.post(http_head + '/Admin/Home/getAcitivityByManager.ashx', {
                "userGuid": dataManger.userGuid
            }, function(data) {
                var data = JSON.parse(data);
                loadActTable(data.items);
                $('#actTable').bootstrapTable("load", data.items);
            })
        }, 277);
    };
    loadAct();
    // 1.添加活动推荐
    $(".addAct").on("click", function() {
        layer.open({
            type: 1,
            area: ['600px', '500px'],
            title: ['添加推荐活动', 'font-size:18px;text-align: center;'],
            content: $('.addActDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($(".actId").val() == "") {
                    layer.msg("请输入活动ID", {
                        time: 1200
                    })
                } else if ($(".dataLong").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".actCode").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/Home/activity_set.ashx', {
                            "userGuid": dataManger.userGuid,
                            "Id": $(".actId").val(),
                            "months": $(".dataLong").val(),
                            "outTradeNo": $(".actCode").val(),
							"sortnum": $("actPx").val()
                        }, function(data) {
                            var data = JSON.parse(data)
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadAct(); //重新加载表格数据                   
                                $(".actId").val('');
                                $(".dataLong").val('');
                                $(".actCode").val('');
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 297);
                }
            }
        })
    });
    $(".why-icon").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '500px'],
            title: ['什么是活动ID', 'font-size:18px;text-align: center;'],
            content: $('.whatIdDiv'),
        })
    });
    // 2.添加活动分类
    // 2.1 活动分类表
    function loadActSortTable(data) {
        $("#actSortTable").bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'type',
                title: '活动类别',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'createTime',
                title: '开始时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '结束时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }]
        })
    };

    function loadSortAct() {
        setTimeout(function() {
            $.post(http_head + '/Admin/Home/getAcitivityByManager.ashx', {
                "userGuid": dataManger.userGuid,
                "type": 121
            }, function(data) {
                var data = JSON.parse(data);
                loadActSortTable(data.items);
                $('#actSortTable').bootstrapTable("load", data.items);
            })
        }, 317);
    };
    loadSortAct();
    // 选择插件
    var actSort;
    var actSortList = ["论坛", "大会", "研讨会", "培训", "市场活动", "展览", "聚会", "酒会", "其他"];
    $(".hyitems2").selectivity({
        allowClear: true,
        items: actSortList,
        placeholder: '请选择分类'
    });
    $(".hyitems2").on("change", function(e) {
        actSort = e.value;
        if (actSort == null) {
            $(".fa-sort-desc").css({
                "borderTopColor": "black"
            });
        } else {
            $(".fa-sort-desc").css({
                "borderTopColor": "white"
            })
        }
    });
    $(".hyitems2").on("selectivity-open", function(e) {
        if (actSort == "" || actSort == null) {
            $(".fa-sort-desc").css({
                borderTop: "none",
                borderBottom: "4px solid black"
            })
        } else {
            $(".fa-sort-desc").css({
                borderTop: "none",
                borderBottom: "4px solid white"
            })
        }
    })
    $(".hyitems2").on("selectivity-close", function(e) {
        if (actSort == '' || actSort == null) {
            $(".fa-sort-desc").css({
                borderBottom: "none",
                borderTop: "4px solid black"
            })
        } else {
            $(".fa-sort-desc").css({
                borderBottom: "none",
                borderTop: "4px solid white"
            })
        }
    });
    $(".addActSort").on("click", function() {
        layer.open({
            type: 1,
            area: ['600px', '700px'],
            title: ['添加活动分类', 'font-size:18px;text-align: center;'],
            content: $('.addActSortDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($(".actId2").val() == "") {
                    layer.msg("请输入活动ID", {
                        time: 1200
                    })
                } else if (actSort == undefined) {
                    layer.msg("请选择活动分类", {
                        time: 1200
                    })
                } else if ($(".dataLong2").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".actCode2").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/Home/activity_set.ashx', {
                            "userGuid": dataManger.userGuid,
                            "Id": $(".actId2").val(),
                            "months": $(".dataLong2").val(),
                            "outTradeNo": $(".actCode2").val(),
                            "type": actSort
                        }, function(data) {
                            var data = JSON.parse(data)
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadSortAct(); //重新加载表格数据       
                                $(".actId2").val('');
                                $(".dataLong2").val('');
                                $(".actCode2").val('');
                                $(".fa-sort-desc").css({
                                    "borderTopColor": "black"
                                });
                                actSort = undefined;
                                $(".selectivity-single-selected-item").replaceWith('<div class="selectivity-placeholder"> 请选择分类</div>');
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 337);
                }
            }
        })
    });
    // 机构推广///////////////////////////////////////////////////////////////////////////////
    $('.orgnize').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.orgnizeDiv').show().siblings('div').hide();
    });
    // 1.推荐机构
    // 1.1 机构表格
    function loadOrgTable(data) {
        $('#orgTable').bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'comId',
                title: '机构',
                align: 'center',
                valign: 'middle',
                formatter: orglink2,
                events: viewOrg2
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }],
        });

        function orglink2(e, value, row, index) {
            return '<a class="viewOrg2 status2">查看机构(ID=' + value.comId + ') </a>'
        }
    };
    window.viewOrg2 = {
        'click .viewOrg2': function(e, value, row, index) {
            window.open("http://www.eqidd.com/comSpace/index.html?conpanyId=" + row.comId)
        }
    };

    function loadOrg() {
        setTimeout(function() {
            $.post(http_head + '/Admin/Home/getHomeComByManager.ashx', {
                "userGuid": dataManger.userGuid
            }, function(data) {
                var data = JSON.parse(data);
                loadOrgTable(data.items)
                $('#orgTable').bootstrapTable("load", data.items);
            })
        }, 357);
    }
    loadOrg();
    // 1.1.添加机构推荐
    $(".addOrg").on("click", function() {
        layer.open({
            type: 1,
            area: ['600px', '500px'],
            title: ['添加推荐机构', 'font-size:18px;text-align: center;'],
            content: $('.addOrgDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($(".orgId").val() == "") {
                    layer.msg("请输入活动ID", {
                        time: 1200
                    })
                } else if ($(".dataLong3").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".orgCode").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/Home/com_set.ashx', {
                            "userGuid": dataManger.userGuid,
                            "comId": $(".orgId").val(),
                            "months": $(".dataLong3").val(),
                            "outTradeNo": $(".orgCode").val(),
							"sortnum": $(".orgPx").val()
                        }, function(data) {
                            var data = JSON.parse(data);
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadOrg(); //重新加载表格数据                   
                                $(".orgId").val('');
                                $(".dataLong3").val('');
                                $(".orgCode").val('');
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 377);
                }
            }
        })
    });
    $(".why-icon2").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '500px'],
            title: ['什么是活动ID', 'font-size:18px;text-align: center;'],
            content: $('.whatIdDiv2'),
        })
    })
    // 2.机构分类
    // 2.1.机构分类表格
    function loadOrgSortTable(data) {
        $('#orgSortTable').bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'comId',
                title: '机构ID',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'type',
                title: '机构类型',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }],
        });
    };

    function loadOrgSort() {
        setTimeout(function() {
            $.post(http_head + '/Admin/Home/getHomeComByManager.ashx', {
                "userGuid": dataManger.userGuid,
                "type": "机构分类"
            }, function(data) {
                var data = JSON.parse(data);
                loadOrgSortTable(data.items)
                $('#orgSortTable').bootstrapTable("load", data.items);
            })
        }, 397);
    }
    loadOrgSort();
    // 2.1.添加机构分类
    // 选择插件
    var orgSort;
    var orgSortList = ["生产制造", "农林牧渔", "互联网/IT", "批发/零售/连锁", "建筑/装饰", "金融", "水/电/气供应", "其他"];
    $(".hyitems3").selectivity({
        allowClear: true,
        items: orgSortList,
        placeholder: '请选择分类'
    });
    $(".hyitems3").on("change", function(e) {
        orgSort = e.value;
        if (orgSort == null) {
            $(".fa-sort-desc").css({
                "borderTopColor": "black"
            });
        } else {
            $(".fa-sort-desc").css({
                "borderTopColor": "white"
            })
        }
    });
    $(".hyitems3").on("selectivity-open", function(e) {
        if (orgSort == "" || orgSort == null) {
            $(".fa-sort-desc").css({
                borderTop: "none",
                borderBottom: "4px solid black"
            })
        } else {
            $(".fa-sort-desc").css({
                borderTop: "none",
                borderBottom: "4px solid white"
            })
        }
    })
    $(".hyitems3").on("selectivity-close", function(e) {
        if (orgSort == '' || orgSort == null) {
            $(".fa-sort-desc").css({
                borderBottom: "none",
                borderTop: "4px solid black"
            })
        } else {
            $(".fa-sort-desc").css({
                borderBottom: "none",
                borderTop: "4px solid white"
            })
        }
    });
    $(".addOrgSort").on("click", function() {
        layer.open({
            type: 1,
            area: ['600px', '600px'],
            title: ['添加推荐机构', 'font-size:18px;text-align: center;'],
            content: $('.addOrgSortDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($(".orgId2").val() == "") {
                    layer.msg("请输入活动ID", {
                        time: 1200
                    })
                } else if ($(".dataLong4").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".orgCode2").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/Home/com_set.ashx', {
                            "userGuid": dataManger.userGuid,
                            "comId": $(".orgId2").val(),
                            "months": $(".dataLong4").val(),
                            "outTradeNo": $(".orgCode2").val(),
                            "type": orgSort
                        }, function(data) {
                            var data = JSON.parse(data);
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadOrgSort(); //重新加载表格数据                   
                                $(".orgId").val('');
                                $(".dataLong3").val('');
                                $(".orgCode").val('');
                                $(".fa-sort-desc").css({
                                    "borderTopColor": "black"
                                });
                                orgSort = undefined;
                                $(".selectivity-single-selected-item").replaceWith('<div class="selectivity-placeholder"> 请选择分类</div>');
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 417);
                }
            }
        })
    });
    // 金师库侧边栏推荐讲师////////////////////////////////////////////////////////////////////////////////
    $('.recommend').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.recommendDiv').show().siblings('div').hide();
    });
    // 推荐讲师表格
    function loadJskRecTable(data) {
        $("#jskRecTable").bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'userImage',
                title: '头像',
                align: 'center',
                valign: 'middle',
                formatter: headImg
            }, {
                field: 'userName',
                title: '姓名',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'createTime',
                title: '推荐时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'userPhone',
                title: '手机号',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'isDelete',
                title: '是否删除',
                align: 'center',
                valign: 'middle',
                formatter: isOutTime
            }]
        });

        function headImg(e, value, row, index) {
            return '<img class="headPic" src="' + value.userImage + '" />'
        };

        function isOutTime(e, value, row, index) {
            if (value.isDelete == 0) {
                return '<span class="status2">正常</span>'
            } else {
                return '<span class="status">已删除</span>'
            }
        }
    };
    var jskRecPage = 0;

    function loadJskRec(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/side/GetSideTeacherByManager.ashx', {
                "userGuid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                loadJskRecTable(data.items);
                $("#jskRecTable").bootstrapTable("load", data.items);
                jskRecPage = data.page;
                // 下一页
                $(".recBtnNext").on("click", function() {
                    loadJskRec(Number(jskRecPage));
                });
                // 上一页
                $(".recBtnPrve").on("click", function() {
                    loadJskRec(Number(jskRecPage - 2));
                    if (jskRecPage == 2) {
                        $(".recBtnPrve").removeClass("show-btn");
                    }
                });
                if (jskRecPage > 1) {
                    $(".recBtnPrve").addClass("show-btn");
                    if (data.items.length < 12) {
                        $(".recBtnNext").removeClass("show-btn");
                    } else {
                        $(".recBtnNext").addClass("show-btn");
                    }
                } else if (jskRecPage == 1) {
                    if (data.items.length < 12) {
                        $(".recBtnNext").removeClass("show-btn");
                    } else {
                        $(".recBtnNext").addClass("show-btn");
                    }
                }
            })
        }, 213);
    };
    loadJskRec(jskRecPage);
    // 添加金师库推荐讲师
    // 检索讲师
    var recJskTeacherGuid;
    $(".searchJskTeacher").on("click", function() {
        $.post(http_head + '/Admin/Home/searchByphone.ashx', {
            "phone": $(".teachPhoneJsk").val()
        }, function(data) {
            var data = JSON.parse(data);
            if ($(".teachPhoneJsk").val()) {
                if (data.status == 200) {
                    recJskTeacherGuid = data.userGuid;
                    layer.msg("检索成功", {
                        time: 1200
                    })
                } else {
                    layer.msg("未找到该讲师", {
                        time: 1200
                    })
                }
            } else {
                layer.msg("请输入讲师手机号", {
                    time: 1200
                })
            }
        })
    });
    // 添加图片
    var arrJsk = [];
    $(".chooseImgJsk").click(function() {
        $("#headImgJsk").click(); //隐藏了input:file样式后，点击头像就可以本地上传
    });
    $("#headImgJsk").on("change", function() {
        arrJsk = []
        arrJsk = this.files[0]
        ajaxFileUploadJsk(arrJsk)
    });
    // 上传图片
    function ajaxFileUploadJsk(file) {
        var imgDataJsk = new FormData();
        imgDataJsk.append('willcompress', "true");
        imgDataJsk.append('file', file);
        $.ajax({
            type: 'post',
            url: '' + http_head + '/Reimburse/Upload_Files.ashx',
            data: imgDataJsk,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function(data) {
                var data2 = JSON.parse(data)
                if (data2.status == 200) {
                    layer.msg('上传成功', {
                        time: 1000,
                    });
                    arr_imgHref = http_head + data2.items.split(";")[0];
                    $(".chooseImgJsk").show();
                    $(".chooseImgJsk").attr("value", "重新上传");
                    arr_img = [];
                    $('.imageDiv').remove();
                    $(".realImgJsk").attr("src", data2.items.split(";")[0]); //表格图片
                    $("#showImgJsk").attr("src", arr_imgHref); //弹窗已选图片
                }
            },
        });
    };
    $(".addJskRec").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加推荐讲师', 'font-size:18px;text-align: center;'],
            content: $('.addJskTeacherRec'),
            btn: '确定',
            yes: function(index, layero) {
                if (recJskTeacherGuid == undefined) {
                    layer.msg("请输入讲师手机号并检索", {
                        time: 1200
                    })
                } else if ($("#showImgJsk").attr("src") == "../image/upload.png") {
                    layer.msg("请上传头像", {
                        time: 1200
                    })
                } else if ($(".teachNameJsk").val() == "") {
                    layer.msg("请输入讲师姓名", {
                        time: 1200
                    })
                } else if ($(".lastDateJsk").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".recCodeJsk").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/side/SetTeacher.ashx', {
                            "createrGuid": dataManger.userGuid,
                            "userGuid": recJskTeacherGuid,
                            "userImage": $(".realImgJsk").attr("src"),
                            "userName": $(".teachNameJsk").val(),
                            "months": $(".lastDateJsk").val(),
                            "outTradeNo": $(".recCodeJsk").val(),
                            "userPhone": $(".teachPhoneJsk").val()
                        }, function(data) {
                            var data = JSON.parse(data);
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadJskRec(jskRecPage - 1); //重新加载表格数据
                                recJskTeacherGuid = undefined;
                                $(".teachNameJsk").val('');
                                $(".lastDateJsk").val('');
                                $(".recCodeJsk").val('');
                                $(".teachPhoneJsk").val('');
                                $("#showImgJsk").attr("src", "../image/upload.png");
                                $(".realImgJsk").removeAttr("src");
                                $(".chooseImgJsk").attr("value", "选择照片");
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 437);
                }
            }
        })
    });
    // 金师库推荐课程//////////////////////////////////////////////////////////////////
    $('.course').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.courseDiv').show().siblings('div').hide();
    });
    // 推荐课程表格
    function loadCourseTable(data) {
        $("#courseTable").bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'courseId',
                title: '课程',
                align: 'center',
                valign: 'middle',
                formatter: courselink,
                events: viewCourse
            }, {
                field: 'createTime',
                title: '推荐时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'isDelete',
                title: '是否删除',
                align: 'center',
                valign: 'middle',
                formatter: isOutTime
            }]
        });

        function isOutTime(e, value, row, index) {
            if (value.isDelete == 0) {
                return '<span class="status2">正常</span>'
            } else {
                return '<span class="status">已删除</span>'
            }
        };

        function courselink(e, value, row, index) {
            return '<a class="viewCourse status2">查看课程(ID=' + value.courseId + ')</a>'
        }
    };
    window.viewCourse = {
        'click .viewCourse': function(e, value, row, index) {
            window.open("http://www.jinshiku.cn/html/courseDetails.html?id=" + row.Id + "");
        }
    };
    var coursePage = 0;

    function loadCourse(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/side/course_sideGetByManager.ashx', {
                "userGuid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                loadCourseTable(data.items);
                $("#courseTable").bootstrapTable("load", data.items);
                coursePage = data.page;
                // 下一页
                $(".courseNext").on("click", function() {
                    loadCourse(Number(coursePage));
                });
                // 上一页
                $(".coursePrve").on("click", function() {
                    loadCourse(Number(coursePage - 2));
                    if (coursePage == 2) {
                        $(".coursePrve").removeClass("show-btn");
                    }
                });
                if (coursePage > 1) {
                    $(".coursePrve").addClass("show-btn");
                    if (data.items.length < 12) {
                        $(".courseNext").removeClass("show-btn");
                    } else {
                        $(".courseNext").addClass("show-btn");
                    }
                } else if (coursePage == 1) {
                    if (data.items.length < 12) {
                        $(".courseNext").removeClass("show-btn");
                    } else {
                        $(".courseNext").addClass("show-btn");
                    }
                }
            })
        }, 233);
    };
    loadCourse(coursePage);
    // 添加课程
    $(".addCourse").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加推荐课程', 'font-size:18px;text-align: center;'],
            content: $('.addCourseDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($(".courseId").val() == "") {
                    layer.msg("请输入课程ID", {
                        time: 1200
                    })
                } else if ($(".courseLong").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".courseCode").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/side/Course_sideSet.ashx', {
                            "userGuid": dataManger.userGuid,
                            "courseId": $(".courseId").val(),
                            "months": $(".courseLong").val(),
                            "outTradeNo": $(".courseCode").val()
                        }, function(data) {
                            var data = JSON.parse(data);
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadCourse(coursePage - 1); //重新加载表格数据                  
                                $(".courseId").val('');
                                $(".courseLong").val('');
                                $(".courseCode").val('');
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 457);
                }
            }
        })
    });
    $(".why-icon3").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '500px'],
            title: ['什么是课程ID', 'font-size:18px;text-align: center;'],
            content: $('.whatIdDiv3'),
        })
    });
    // 金师库侧边推荐机构/////////////////////////////////////////////////////////////////////
    $('.jskOrg').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.jskOrgDiv').show().siblings('div').hide();
    });
    // 推荐机构表格
    function loadJskOrgTable(data) {
        $("#jskOrgTable").bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'comId',
                title: '机构',
                align: 'center',
                valign: 'middle',
                formatter: orglink,
                events: viewOrg
            }, {
                field: 'createTime',
                title: '推荐时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'isDelete',
                title: '是否删除',
                align: 'center',
                valign: 'middle',
                formatter: isOutTime
            }]
        });

        function isOutTime(e, value, row, index) {
            if (value.isDelete == 0) {
                return '<span class="status2">正常</span>'
            } else {
                return '<span class="status">已删除</span>'
            }
        };

        function orglink(e, value, row, index) {
            return '<a class="viewOrg status2">查看机构(ID=' + value.Id + ') </a>'
        }
    };
    window.viewOrg = {
        'click .viewOrg': function(e, value, row, index) {
            window.open("http://www.eqidd.com/comSpace/index.html?conpanyId=" + row.comId)
        }
    };
    var jskOrgPage = 0;

    function loadJskOrg(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/side/com_sideGetByManager.ashx', {
                "userGuid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                loadJskOrgTable(data.items);
                $("#jskOrgTable").bootstrapTable("load", data.items);
                jskOrgPage = data.page;
                // 下一页
                $(".orgNext").on("click", function() {
                    loadJskOrg(Number(jskOrgPage));
                });
                // 上一页
                $(".orgPrve").on("click", function() {
                    loadJskOrg(Number(jskOrgPage - 2));
                    if (jskOrgPage == 2) {
                        $(".orgPrve").removeClass("show-btn");
                    }
                });
                if (jskOrgPage > 1) {
                    $(".orgPrve").addClass("show-btn");
                    if (data.items.length < 12) {
                        $(".orgNext").removeClass("show-btn");
                    } else {
                        $(".orgNext").addClass("show-btn");
                    }
                } else if (jskOrgPage == 1) {
                    if (data.items.length < 12) {
                        $(".orgNext").removeClass("show-btn");
                    } else {
                        $(".orgNext").addClass("show-btn");
                    }
                }
            })
        }, 227);
    };
    loadJskOrg(jskOrgPage);
    // 添加机构
    $(".addJskOrg").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加推荐课程', 'font-size:18px;text-align: center;'],
            content: $('.addJskOrgDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($(".jskOrgId").val() == "") {
                    layer.msg("请输入机构ID", {
                        time: 1200
                    })
                } else if ($(".jskOrgLong").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".jskOrgCode").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/side/com_sideSet.ashx', {
                            "userGuid": dataManger.userGuid,
                            "comId": $(".jskOrgId").val(),
                            "months": $(".jskOrgLong").val(),
                            "outtradeNo": $(".jskOrgCode").val()
                        }, function(data) {
                            var data = JSON.parse(data);
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadJskOrg(jskOrgPage - 1); //重新加载表格数据                  
                                $(".jskOrgId").val();
                                $(".jskOrgLong").val();
                                $(".jskOrgCode").val();
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 457);
                }
            }
        })
    });
    $(".why-icon4").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '500px'],
            title: ['什么是课程ID', 'font-size:18px;text-align: center;'],
            content: $('.whatIdDiv4'),
        })
    });
    // 金师库推荐咨询师//////////////////////////////////////////////////////////////////////
    $('.consultant').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.consultantDiv').show().siblings('div').hide();
    });
    // 推荐讲师表格
    function loadCstTable(data) {
        $("#jskCstTable").bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'userImage',
                title: '头像',
                align: 'center',
                valign: 'middle',
                formatter: headImg
            }, {
                field: 'userName',
                title: '姓名',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'createTime',
                title: '推荐时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'userPhone',
                title: '手机号',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'isDelete',
                title: '是否删除',
                align: 'center',
                valign: 'middle',
                formatter: isOutTime
            }]
        });

        function headImg(e, value, row, index) {
            return '<img class="headPic" src="' + value.userImage + '" />'
        };

        function isOutTime(e, value, row, index) {
            if (value.isDelete == 0) {
                return '<span class="status2">正常</span>'
            } else {
                return '<span class="status">已删除</span>'
            }
        }
    };
    var cstPage = 0;

    function loadCst(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/side/advisers_getByManager.ashx', {
                "userGuid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                loadCstTable(data.items);
                $("#jskCstTable").bootstrapTable("load", data.items);
                cstPage = data.page;
                // 下一页
                $(".cstNext").on("click", function() {
                    loadCst(Number(cstPage));
                });
                // 上一页
                $(".cstPrve").on("click", function() {
                    loadCst(Number(cstPage - 2));
                    if (cstPage == 2) {
                        $(".cstPrve").removeClass("show-btn");
                    }
                });
                if (cstPage > 1) {
                    $(".cstPrve").addClass("show-btn");
                    if (data.items.length < 12) {
                        $(".cstNext").removeClass("show-btn");
                    } else {
                        $(".cstNext").addClass("show-btn");
                    }
                } else if (cstPage == 1) {
                    if (data.items.length < 12) {
                        $(".cstNext").removeClass("show-btn");
                    } else {
                        $(".cstNext").addClass("show-btn");
                    }
                }
            })
        }, 267);
    };
    loadCst(cstPage);
    // 2.添加咨询师
    // 检索讲师
    var cstTeacherGuid;
    $(".searchCstTeacher").on("click", function() {
        setTimeout(function() {
            $.post(http_head + '/Admin/Home/searchByphone.ashx', {
                "phone": $(".teachPhoneCst").val()
            }, function(data) {
                var data = JSON.parse(data);
                if ($(".teachPhoneCst").val()) {
                    if (data.status == 200) {
                        cstTeacherGuid = data.userGuid;
                        layer.msg("检索成功", {
                            time: 1200
                        })
                    } else {
                        layer.msg("未找到该讲师", {
                            time: 1200
                        })
                    }
                } else {
                    layer.msg("请输入讲师手机号", {
                        time: 1200
                    })
                }
            })
        }, 477);
    });
    // 添加图片
    var arrCst = [];
    $(".chooseImgCst").click(function() {
        $("#headImgCst").click(); //隐藏了input:file样式后，点击头像就可以本地上传
    });
    $("#headImgCst").on("change", function() {
        arrCst = []
        arrCst = this.files[0];
        ajaxFileUploadCst(arrCst)
    });
    // 上传图片
    function ajaxFileUploadCst(file) {
        var imgDataCst = new FormData();
        imgDataCst.append('willcompress', "true");
        imgDataCst.append('file', file);
        $.ajax({
            type: 'post',
            url: '' + http_head + '/Reimburse/Upload_Files.ashx',
            data: imgDataCst,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function(data) {
                var data2 = JSON.parse(data)
                if (data2.status == 200) {
                    layer.msg('上传成功', {
                        time: 1000,
                    });
                    arr_imgHref = http_head + data2.items.split(";")[0];
                    $(".chooseImgCst").show();
                    $(".chooseImgCst").attr("value", "重新上传");
                    arr_img = [];
                    $('.imageDiv').remove();
                    $(".realImgCst").attr("src", data2.items.split(";")[0]); //表格图片
                    $("#showImgCst").attr("src", arr_imgHref); //弹窗已选图片
                }
            },
        });
    };
    $(".addJskCst").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加推荐讲师', 'font-size:18px;text-align: center;'],
            content: $('.addConsultantDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if (cstTeacherGuid == undefined) {
                    layer.msg("请输入讲师手机号并检索", {
                        time: 1200
                    })
                } else if ($("#showImgCst").attr("src") == "../image/upload.png") {
                    layer.msg("请上传头像", {
                        time: 1200
                    })
                } else if ($(".teachNameCst").val() == "") {
                    layer.msg("请输入讲师姓名", {
                        time: 1200
                    })
                } else if ($(".lastDateCst").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".recCodeCst").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/side/advisers_sideSet.ashx', {
                            "createrGuid": dataManger.userGuid,
                            "userGuid": cstTeacherGuid,
                            "userImage": $(".realImgCst").attr("src"),
                            "userName": $(".teachNameCst").val(),
                            "months": $(".lastDateCst").val(),
                            "outTradeNo": $(".recCodeCst").val(),
                            "userPhone": $(".teachPhoneCst").val()
                        }, function(data) {
                            var data = JSON.parse(data);
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadCst(cstPage - 1); //重新加载表格数据
                                cstTeacherGuid = undefined;
                                $(".teachNameCst").val('');
                                $(".lastDateCst").val('');
                                $(".recCodeCst").val('');
                                $(".teachPhoneCst").val('');
                                $("#showImgCst").attr("src", "../image/upload.png");
                                $(".realImgCst").removeAttr("src");
                                $(".chooseImgCst").attr("value", "选择照片");
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 497);
                }
            }
        })
    });
    // 金师库侧边推荐活动////////////////////////////////////////////////////////////
    $('.jskAct').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.jskActDiv').show().siblings('div').hide();
    });
    // 推荐活动表格
    function loadJskActTable(data) {
        $("#jskActTable").bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'activityId',
                title: '活动',
                align: 'center',
                valign: 'middle',
                formatter: actlink,
                events: viewAct
            }, {
                field: 'createTime',
                title: '推荐时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'isDelete',
                title: '是否删除',
                align: 'center',
                valign: 'middle',
                formatter: isOutTime
            }]
        });

        function isOutTime(e, value, row, index) {
            if (value.isDelete == 0) {
                return '<span class="status2">正常</span>'
            } else {
                return '<span class="status">已删除</span>'
            }
        };

        function actlink(e, value, row, index) {
            return '<a class="viewAct status2">查看活动(ID=' + value.activityId + ') </a>'
        }
    };
    window.viewAct = {
        'click .viewAct': function(e, value, row, index) {
            window.open("http://www.jinshiku.cn/html/activityDetails.html?id=" + row.activityId)
        }
    };
    var jskActPage = 0;

    function loadJskAct(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/side/activity_sideGetByManager.ashx', {
                "userGuid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                loadJskActTable(data.items);
                $("#jskActTable").bootstrapTable("load", data.items);
                jskActPage = data.page;
                // 下一页
                $(".actNext").on("click", function() {
                    loadJskAct(Number(jskActPage));
                });
                // 上一页
                $(".actPrve").on("click", function() {
                    loadJskAct(Number(jskActPage - 2));
                    if (jskActPage == 2) {
                        $(".actPrve").removeClass("show-btn");
                    }
                });
                if (jskActPage > 1) {
                    $(".actPrve").addClass("show-btn");
                    if (data.items.length < 12) {
                        $(".actNext").removeClass("show-btn");
                    } else {
                        $(".actNext").addClass("show-btn");
                    }
                } else if (jskActPage == 1) {
                    if (data.items.length < 12) {
                        $(".actNext").removeClass("show-btn");
                    } else {
                        $(".actNext").addClass("show-btn");
                    }
                }
            })
        }, 190);
    };
    loadJskAct(jskActPage);
    // 添加活动
    $(".addJskAct").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加推荐活动', 'font-size:18px;text-align: center;'],
            content: $('.addJskActDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($(".jskActId").val() == "") {
                    layer.msg("请输入活动ID", {
                        time: 1200
                    })
                } else if ($(".jskActLong").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".jskActCode").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/side/activity_sideSet.ashx', {
                            "userGuid": dataManger.userGuid,
                            "activityId": $(".jskActId").val(),
                            "months": $(".jskActLong").val(),
                            "outtradeNo": $(".jskActCode").val()
                        }, function(data) {
                            var data = JSON.parse(data);
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadJskAct(jskActPage - 1); //重新加载表格数据                                  
                                $(".jskActId").val('');
                                $(".jskActLong").val('');
                                $(".jskActCode").val('');
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 507)
                }
            }
        })
    });
    $(".why-icon5").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '500px'],
            title: ['什么是课程ID', 'font-size:18px;text-align: center;'],
            content: $('.whatIdDiv5'),
        })
    });
    // 金师库侧边培训需求/////////////////////////////////////////////////
    $('.jskTrain').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.jskTrainDiv').show().siblings('div').hide();
    });
    // 培训需求表格
    function loadJskTrainTable(data) {
        $("#jskTrainTable").bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'TrainNeedId',
                title: '培训需求',
                align: 'center',
                valign: 'middle',
                formatter: trainlink,
                events: viewTrain
            }, {
                field: 'createTime',
                title: '推荐时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'isDelete',
                title: '是否删除',
                align: 'center',
                valign: 'middle',
                formatter: isOutTime
            }]
        });

        function isOutTime(e, value, row, index) {
            if (value.isDelete == 0) {
                return '<span class="status2">正常</span>'
            } else {
                return '<span class="status">已删除</span>'
            }
        };

        function trainlink(e, value, row, index) {
            return '<a class="viewTrain status2">查看培训需求(ID=' + value.TrainNeedId + ') </a>'
        }
    };
    window.viewTrain = {
        'click .viewTrain': function(e, value, row, index) {
            window.open("http://www.jinshiku.cn/html/needDetails.html?id=" + row.TrainNeedId)
        }
    };
    var jskTrainPage = 0;

    function loadJskTrain(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/side/NeedTrain_sideGetByManager.ashx', {
                "userGuid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                loadJskTrainTable(data.items);
                $("#jskTrainTable").bootstrapTable("load", data.items);
                jskTrainPage = data.page;
                // 下一页
                $(".trainNext").on("click", function() {
                    loadJskTrain(Number(jskTrainPage));
                });
                // 上一页
                $(".trainPrve").on("click", function() {
                    loadJskTrain(Number(jskTrainPage - 2));
                    if (jskTrainPage == 2) {
                        $(".trainPrve").removeClass("show-btn");
                    }
                });
                if (jskTrainPage > 1) {
                    $(".trainPrve").addClass("show-btn");
                    if (data.items.length < 12) {
                        $(".trainNext").removeClass("show-btn");
                    } else {
                        $(".trainNext").addClass("show-btn");
                    }
                } else if (jskTrainPage == 1) {
                    if (data.items.length < 12) {
                        $(".trainNext").removeClass("show-btn");
                    } else {
                        $(".trainNext").addClass("show-btn");
                    }
                }
            })
        }, 307);
    };
    loadJskTrain(jskTrainPage);
    // 添加培训需求
    $(".addJskTrain").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加推荐活动', 'font-size:18px;text-align: center;'],
            content: $('.addJskTrainDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($(".jskTrainId").val() == "") {
                    layer.msg("请输入培训需求ID", {
                        time: 1200
                    })
                } else if ($(".jskTrainLong").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".jskTrainCode").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/side/NeedTrain_sideSet.ashx', {
                            "userGuid": dataManger.userGuid,
                            "TrainNeedId": $(".jskTrainId").val(),
                            "months": $(".jskTrainLong").val(),
                            "outTradeNo": $(".jskTrainCode").val()
                        }, function(data) {
                            var data = JSON.parse(data);
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadJskTrain(jskTrainPage - 1); //重新加载表格数据                                  
                                $(".jskTrainId").val('');
                                $(".jskTrainLong").val('');
                                $(".jskTrainCode").val('');
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 517)
                }
            }
        })
    });
    $(".why-icon6").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '500px'],
            title: ['什么是培训需求ID', 'font-size:18px;text-align: center;'],
            content: $('.whatIdDiv6'),
        })
    });
    // 金师库侧边咨询需求///////////////////////////////////////////////////////////////
    $('.jskAdvisory').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.jskAdvisoryDiv').show().siblings('div').hide();
    });
    // 咨询需求表格
    function loadJskAdvisoryTable(data) {
        $("#jskAdvisoryTable").bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'AdviserNeedId',
                title: '咨询需求ID',
                align: 'center',
                valign: 'middle',
                formatter: adviserlink,
                events: viewAdviser
            }, {
                field: 'createTime',
                title: '推荐时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'isDelete',
                title: '是否删除',
                align: 'center',
                valign: 'middle',
                formatter: isOutTime
            }]
        });

        function isOutTime(e, value, row, index) {
            if (value.isDelete == 0) {
                return '<span class="status2">正常</span>'
            } else {
                return '<span class="status">已删除</span>'
            }
        };

        function adviserlink(e, value, row, index) {
            return '<a class="viewAdviser status2">查看咨询需求(ID=' + value.AdviserNeedId + ') </a>'
        }
    };
    window.viewAdviser = {
        'click .viewAdviser': function(e, value, row, index) {
            window.open("http://www.jinshiku.cn/html/needsAdDetails.html?id=" + row.AdviserNeedId)
        }
    };
    var jskAdvisoryPage = 0;

    function loadJskAdvisory(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/side/NeedAdviser_sideGetByManager.ashx', {
                "userGuid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                loadJskAdvisoryTable(data.items);
                $("#jskAdvisoryTable").bootstrapTable("load", data.items);
                jskAdvisoryPage = data.page;
                // 下一页
                $(".advisoryNext").on("click", function() {
                    loadJskAdvisory(Number(jskAdvisoryPage));
                });
                // 上一页
                $(".advisoryPrve").on("click", function() {
                    loadJskAdvisory(Number(jskAdvisoryPage - 2));
                    if (jskAdvisoryPage == 2) {
                        $(".advisoryPrve").removeClass("show-btn");
                    }
                });
                if (jskAdvisoryPage > 1) {
                    $(".advisoryPrve").addClass("show-btn");
                    if (data.items.length < 12) {
                        $(".advisoryNext").removeClass("show-btn");
                    } else {
                        $(".advisoryNext").addClass("show-btn");
                    }
                } else if (jskAdvisoryPage == 1) {
                    if (data.items.length < 12) {
                        $(".advisoryNext").removeClass("show-btn");
                    } else {
                        $(".advisoryNext").addClass("show-btn");
                    }
                }
            })
        }, 367);
    };
    loadJskAdvisory(jskAdvisoryPage);
    // 添加咨询需求
    $(".addJskAdvisory").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加推荐活动', 'font-size:18px;text-align: center;'],
            content: $('.addJskAdvisoryDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($(".jskAdvisoryId").val() == "") {
                    layer.msg("请输入培训需求ID", {
                        time: 1200
                    })
                } else if ($(".jskAdvisoryLong").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".jskAdvisoryCode").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/side/NeedAdviser_sideSet.ashx', {
                            "userGuid": dataManger.userGuid,
                            "AdviserNeedId": $(".jskAdvisoryId").val(),
                            "months": $(".jskAdvisoryLong").val(),
                            "outTradeNo": $(".jskAdvisoryCode").val()
                        }, function(data) {
                            var data = JSON.parse(data);
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadJskAdvisory(jskAdvisoryPage - 1); //重新加载表格数据                                    
                                $(".jskAdvisoryId").val('');
                                $(".jskAdvisoryLong").val('');
                                $(".jskAdvisoryCode").val('');
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 527)
                }
            }
        })
    });
    $(".why-icon7").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '500px'],
            title: ['什么是咨询需求ID', 'font-size:18px;text-align: center;'],
            content: $('.whatIdDiv7'),
        })
    });
    // 金师库侧边轮播图////////////////////////////////////////////////////////////////////////////////////////
    $('.jskLunbo').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.jskLunboDiv').show().siblings('div').hide();
    });
    // 轮播图表格
    var jskLbPage = 0;

    function loadLbTable(data) {
        $('#jskLunboTable').bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'image',
                title: '图片',
                align: 'center',
                valign: 'middle',
                formatter: lunboImg
            }, {
                field: 'title',
                title: '标题',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'sort',
                title: '排序',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'contentUrl',
                title: '链接地址',
                align: 'center',
                valign: 'middle',
            }, {
                title: '操作',
                align: 'center',
                valign: 'middle',
                events: optionLunbo,
                formatter: function(value, row, index) {
                    return '<span class="status2 changeImg">更换图片</span><span class="status delImg">删除图片</span>';
                }
            }],
        });

        function lunboImg(e, value, row, index) {
            return '<img class="lunboPic" src="' + value.imageUrl + '" />'
        }
    };
    window.optionLunbo = {
        // 删除
        'click .delImg': function(e, value, row, index) {
            setTimeout(function() {
                $.post(http_head + '/yiqixue/Delete_Yiqidian_Slide.ashx', {
                    "userGuid": dataManger.userGuid,
                    "slideId": row.Id
                }, function(data) {
                    var data = JSON.parse(data);
                    if (data.status == 200) {
                        layer.msg('删除成功', {
                            time: 1000,
                        });
                    }
                    loadLb();
                })
            }, 537)
        },
        // 修改
        'click .changeImg': function(e, value, row, index) {
            $(".chooseImgLb2").attr("value", "选择照片");
            $("#showImgLb2").attr("src", "../image/upload.png");
            // 添加图片
            var arrLb2 = [];
            $(".chooseImgLb2").click(function() {
                $("#headImgLb2").click(); //隐藏了input:file样式后，点击头像就可以本地上传
            });
            $("#headImgLb2").on("change", function() {
                arrLb2 = []
                arrLb2 = this.files[0]
                ajaxFileUploadLb2(arrLb2)
            });
            // 上传图片
            function ajaxFileUploadLb2(file) {
                var imgDataLb = new FormData();
                imgDataLb.append('willcompress', "true");
                imgDataLb.append('file', file);
                $.ajax({
                    type: 'post',
                    url: '' + http_head + '/Reimburse/Upload_Files.ashx',
                    data: imgDataLb,
                    cache: false,
                    processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                    contentType: false, // 不设置Content-type请求头
                    success: function(data) {
                        var data2 = JSON.parse(data)
                        if (data2.status == 200) {
                            layer.msg('上传成功', {
                                time: 1000,
                            });
                            arr_imgHref = http_head + data2.items.split(";")[0];
                            $(".chooseImgLb2").show();
                            $(".chooseImgLb2").attr("value", "重新上传");
                            $("#showImgLb2").attr("src", arr_imgHref); //弹窗已选图片
                        }
                    },
                });
            };
            layer.open({
                type: 1,
                area: ['800px', '660px'],
                title: ['添加图片', 'font-size:18px;text-align: center;'],
                content: $('.changeImgDiv'),
                btn: '确定',
                yes: function(index, layero) {
                    if ($("#showImgLb2").attr("src") == "../image/upload.png") {
                        layer.msg("请上传图片", {
                            time: 1200
                        })
                    } else if ($(".jskLbTitle2").val() == "") {
                        layer.msg("请输入图片标题", {
                            time: 1200
                        })
                    } else if ($(".jskLbSort2").val() == "") {
                        layer.msg("请输入图片排序", {
                            time: 1200
                        })
                    } else if ($(".jskLbLink2").val() == "") {
                        layer.msg("请输入图片链接", {
                            time: 1200
                        })
                    } else {
                        var formData = new FormData();
                        formData.append("userGuid", dataManger.userGuid);
                        formData.append("title", $(".jskLbTitle2").val());
                        formData.append("sort", $(".jskLbSort2").val());
                        formData.append("contentUrl", $(".jskLbLink2").val());
                        formData.append("image", $("#headImgLb2")[0].files[0]);
                        formData.append("slideId", row.Id);
                        $.ajax({
                            type: 'POST',
                            url: '' + http_head + '/yiqixue/Update_Yiqidian_Slide.ashx',
                            data: formData,
                            cache: false,
                            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                            contentType: false, // 不设置Content-type请求头
                            success: function(data) {
                                var data = JSON.parse(data);
                                if (data.status == 200) {
                                    layer.closeAll(); //关闭layer
                                    loadLb(jskLbPage - 1); //重新加载表格数据                                   
                                    $(".jskLbTitle2").val('');
                                    $(".jskLbSort2").val('');
                                    $(".jskLbLink2").val('');
                                    $("#showImgLb2").attr("src", "../image/upload.png");
                                    layer.msg("添加成功", {
                                        time: 1200
                                    });
                                }
                            },
                            error: function(msg) {}
                        });
                    }
                }
            })
        }
    };

    function loadLb() {
        $.post(http_head + '/yiqixue/Get_Yiqixue_Slide.ashx', function(data) {
            var data = JSON.parse(data);
            loadLbTable(data.items)
            $('#jskLunboTable').bootstrapTable("load", data.items);
        })
    }
    loadLb();
    // 添加图片
    var arrLb = [];
    var imgFile2;
    $(".chooseImgLb").click(function() {
        $("#headImgLb").click(); //隐藏了input:file样式后，点击头像就可以本地上传
    });
    $("#headImgLb").on("change", function() {
        imgFile2 = this.files[0];
        ajaxFileUploadLb(imgFile2)
    });
    
    // 上传图片
    function ajaxFileUploadLb(file) {
        var imgDataLb = new FormData();
        imgDataLb.append('willcompress', "true");
        imgDataLb.append('file', file);
        $.ajax({
            type: 'post',
            url: '' + http_head + '/Reimburse/Upload_Files.ashx',
            data: imgDataLb,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function(data) {
                var data2 = JSON.parse(data)
                if (data2.status == 200) {
                    layer.msg('上传成功', {
                        time: 1000,
                    });
                    arr_imgHref = http_head + data2.items.split(";")[0];
                    $(".chooseImgLb").show();
                    $(".chooseImgLb").attr("value", "重新上传");
                    $("#showImgLb").attr("src", arr_imgHref); //弹窗已选图片
                }
            },
        });
    };
    // 上传
    $(".addJskLunbo").on("click", function() {
        $(".chooseImgLb").attr("value", "选择照片");
        $("#showImgLb").attr("src", "../image/upload.png");
        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加图片', 'font-size:18px;text-align: center;'],
            content: $('.addJskLbDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($("#showImgLb").attr("src") == "../image/upload.png") {
                    layer.msg("请上传图片", {
                        time: 1200
                    })
                } else if ($(".jskLbTitle").val() == "") {
                    layer.msg("请输入图片标题", {
                        time: 1200
                    })
                } else if ($(".jskLbSort").val() == "") {
                    layer.msg("请输入图片排序", {
                        time: 1200
                    })
                } else if ($(".jskLbLink").val() == "") {
                    layer.msg("请输入图片链接", {
                        time: 1200
                    })
                } else {
                    var formData = new FormData();
                    formData.append("userGuid", dataManger.userGuid);
                    formData.append("title", $(".jskLbTitle").val());
                    formData.append("sort", $(".jskLbSort").val());
                    formData.append("contentUrl", $(".jskLbLink").val());
                    formData.append("image", imgFile2);
                    $.ajax({
                        type: 'POST',
                        url: '' + http_head + '/yiqixue/Add_Yiqixue_Slide.ashx',
                        data: formData,
                        cache: false,
                        processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                        contentType: false, // 不设置Content-type请求头
                        success: function(data) {
                            var data = JSON.parse(data);
                            console.log(data)
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadLb(jskLbPage - 1); //重新加载表格数据                                   
                                $(".jskLbTitle").val('');
                                $(".jskLbSort").val('');
                                $(".jskLbLink").val('');
                                $("#showImgLb").attr("src", "../image/upload.png");
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        },
                        error: function(msg) {}
                    });
                }
            }
        })
    });
    // eqd首页轮播
    $('.eqdLunbo').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.eqdLunboDiv').show().siblings('div').hide();
    });
    // eqd轮播图表格
    var eqdLbPage = 0;
    function loadeqdLbTable(data) {
        $('#eqdLbTable').bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'imageUrl',
                title: '图片',
                align: 'center',
                valign: 'middle',
                formatter: lunboImg
            }, {
                field: 'title',
                title: '标题',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'sort',
                title: '排序',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'Url',
                title: '链接地址',
                align: 'center',
                valign: 'middle',
            }, {
                title: '操作',
                align: 'center',
                valign: 'middle',
                events: optionLunbo,
                formatter: function(value, row, index) {
                    return '<span class="status2 changeImg2">更换图片</span><span class="status delImg2">删除图片</span>';
                }
            }],
        });

        function lunboImg(e, value, row, index) {
            return '<img class="lunboPic" src="' + value.imageUrl + '" />'
        }
    };
    window.optionLunbo = {
        // 删除
        'click .delImg2': function(e, value, row, index) {
            layer.open({
                type: 1,
                area: ['200px', '150px'],
                title: ['添加图片', 'font-size:18px;text-align: center;'],
                content: $('.eqdDel'),
                btn: '确定',
                yes: function(index, layero) {
                    setTimeout(function() {
                        $.post(http_head + '/EQDimages/Delete_EQDimage.ashx', {
                            "userGuid": dataManger.userGuid,
                            "imageId": row.Id
                        }, function(data) {
                            var data = JSON.parse(data);
                            if (data.status == 200) {
                                layer.msg('删除成功', {
                                    time: 1000,
                                });
                                layer.closeAll(); //关闭layer
                            }
                            loadeqdLb();
                        })
                    }, 537);
                }
            });      
        }, 
        // 修改
        'click .changeImg2': function(e, value, row, index) {
            $(".chooseImgLb4").attr("value", "选择照片");
            $("#showImgLb4").attr("src", "../image/upload.png");
            // 添加图片
            var arreqdLb2 = [];
            var eqdImgFile;
            $(".chooseImgLb4").click(function() {
                $("#headImgLb4").click(); //隐藏了input:file样式后，点击头像就可以本地上传
            });
            $("#headImgLb4").on("change", function() {
                arreqdLb2 = []
                eqdImgFile = this.files[0]
                ajaxFileUploadLb4(eqdImgFile)
            });
            // 上传图片
            function ajaxFileUploadLb4(file) {
                var imgDataLb = new FormData();
                imgDataLb.append('willcompress', "true");
                imgDataLb.append('file', file);
                $.ajax({
                    type: 'post',
                    url: '' + http_head + '/Reimburse/Upload_Files.ashx',
                    data: imgDataLb,
                    cache: false,
                    processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                    contentType: false, // 不设置Content-type请求头
                    success: function(data) {
                        var data2 = JSON.parse(data)
                        if (data2.status == 200) {
                            layer.msg('上传成功', {
                                time: 1000,
                            });
                            arr_imgHref = http_head + data2.items.split(";")[0];
                            $(".chooseImgLb4").show();
                            $(".chooseImgLb4").attr("value", "重新上传");
                            $("#showImgLb4").attr("src", arr_imgHref); //弹窗已选图片
                        }
                    },
                });
            };
            layer.open({
                type: 1,
                area: ['800px', '660px'],
                title: ['更换图片', 'font-size:18px;text-align: center;'],
                content: $('.changeImgeqd'),
                btn: '确定',
                yes: function(index, layero) {
                    if ($("#showImgLb4").attr("src") == "../image/upload.png") {
                        layer.msg("请上传图片", {
                            time: 1200
                        })
                    } else if ($(".eqdLbTitle2").val() == "") {
                        layer.msg("请输入图片标题", {
                            time: 1200
                        })
                    } else if ($(".eqdLbSort2").val() == "") {
                        layer.msg("请输入图片排序", {
                            time: 1200
                        })
                    } else if ($(".eqdLbLink2").val() == "") {
                        layer.msg("请输入图片链接", {
                            time: 1200
                        })
                    } else {
                        var formData = new FormData();
                        formData.append("userGuid", dataManger.userGuid);
                        formData.append("title", $(".eqdLbTitle2").val());
                        formData.append("sort", $(".eqdLbSort2").val());
                        formData.append("url", $(".eqdLbLink2").val());
                        formData.append("file", eqdImgFile);
                        formData.append("imageId", row.Id);
                        $.ajax({
                            type: 'POST',
                            url: '' + http_head + '/EQDimages/Update_EQDimage.ashx',
                            data: formData,
                            cache: false,
                            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                            contentType: false, // 不设置Content-type请求头
                            success: function(data) {
                                var data = JSON.parse(data);
                                if (data.status == 200) {
                                    layer.closeAll(); //关闭layer
                                    loadeqdLb(eqdLbPage - 1); //重新加载表格数据                                   
                                    $(".eqdLbTitle2").val('');
                                    $(".eqdLbSort2").val('');
                                    $(".eqdLbLink2").val('');
                                    $("#showImgLb4").attr("src", "../image/upload.png");
                                    layer.msg("修改成功", {
                                        time: 1200
                                    });
                                }
                            },
                            error: function(msg) {}
                        });
                    }
                }
            });
        }
    };
    function loadeqdLb() {
        $.post(http_head + '/EQDimages/Get_EQDimage.ashx',{
            "source":0
        }, function(data) {
            var data = JSON.parse(data);
            console.log("eqd",data)
            loadeqdLbTable(data.items)
            $('#eqdLbTable').bootstrapTable("load", data.items);
        })
    };
    loadeqdLb();

    // 添加eqd图片
    var arreqdLb = [];
    var imgFile;
    $(".chooseImgLb3").click(function() {
        $("#headImgLb3").click(); //隐藏了input:file样式后
    });
    $("#headImgLb3").on("change", function() {
        arreqdLb = [];
        imgFile = this.files[0]
        ajaxFileUploadLb3(imgFile); //上传
    });
    // $("#headImgLb3").localResizeIMG({
    //     width: 200,
    //     quality: 0.1,
    //     success: function(result) {
    //         var img = new Image();
    //         img.src = result.base64;
    //         imgFile = dataURLtoFile(img.src, arreqdLb.name); //压缩  
    //         ajaxFileUploadLb3(imgFile); //上传
    //     }
    // });
    // 上传图片
    function ajaxFileUploadLb3(file) {
        var imgDataLb = new FormData();
        imgDataLb.append('willcompress', "true");
        imgDataLb.append('file', file);
        $.ajax({
            type: 'post',
            url: '' + http_head + '/Reimburse/Upload_Files.ashx',
            data: imgDataLb,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function(data) {
                var data2 = JSON.parse(data)
                if (data2.status == 200) {
                    layer.msg('上传成功', {
                        time: 1000,
                    });
                    arr_imgHref = http_head + data2.items.split(";")[0];
                    
                    $(".chooseImgLb3").show();
                    $(".chooseImgLb3").attr("value", "重新上传");
                    $("#showImgLb3").attr("src", arr_imgHref); //弹窗已选图片
                }
            },
        });
    };
    // 上传
    $(".addEqdLb").on("click", function() {
        $(".chooseImgLb3").attr("value", "选择照片");
        $("#showImgLb3").attr("src", "../image/upload.png");

        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加图片', 'font-size:18px;text-align: center;'],
            content: $('.addeqdLbDiv'),
            btn: '确定',
            yes: function(index, layero) {
                if ($("#showImgLb3").attr("src") == "../image/upload.png") {
                    layer.msg("请上传图片", {
                        time: 1200
                    })
                } else if ($(".eqdLbTitle").val() == "") {
                    layer.msg("请输入图片标题", {
                        time: 1200
                    })
                } else if ($(".eqdLbSort").val() == "") {
                    layer.msg("请输入图片排序", {
                        time: 1200
                    })
                } else if ($(".eqdLbLink").val() == "") {
                    layer.msg("请输入图片链接", {
                        time: 1200
                    })
                } else {
                    var formData = new FormData();
                    formData.append("userGuid", dataManger.userGuid);
                    formData.append("source", 0);
                    formData.append("title", $(".eqdLbTitle").val());
                    formData.append("sort", $(".eqdLbSort").val());
                    formData.append("url", $(".eqdLbLink").val());
                    formData.append("file", imgFile);

                    $.ajax({
                        type: 'POST',
                        url: '' + http_head + '/EQDimages/Add_EQDimage.ashx',
                        data: formData,
                        cache: false,
                        processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                        contentType: false, // 不设置Content-type请求头
                        success: function(data) {
                            var data = JSON.parse(data);
                            console.log(data)
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadeqdLb(eqdLbPage - 1); //重新加载表格数据                                   
                                $(".eqdLbTitle").val('');
                                $(".eqdLbSort").val('');
                                $(".eqdLbLink").val('');
                                $("#showImgLb3").attr("src", "../image/upload.png");
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        },
                        error: function(msg) {}
                    });
                }
            }
        })
    });

    // 咨询师推广//////////////////////////////////////////////////////////////////////////////
    $('.advisory').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.advisoryDiv').show().siblings('div').hide();
    });
    // 推荐咨询师
    // 1.1咨询师表格
    function loadAdvTable(data) {
        $('#advTable').bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'userImage',
                title: '头像',
                align: 'center',
                valign: 'middle',
                formatter: headImg
            }, {
                field: 'userName',
                title: '姓名',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'userPhone',
                title: '手机号',
                align: 'center',
                valign: 'middle',
            }],
        });

        function headImg(e, value, row, index) {
            var headImg = "http://47.94.173.253:8008"+value.userImage;
            return '<img class="headPic" src="' + headImg + '" />'
        }
    };
    var advPage = 0;

    function loadAdv(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/Home/advisers_getByManger.ashx', {
                "userGuid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                if(data.status==200){
                    loadAdvTable(data.items);
                    $('#advTable').bootstrapTable("load", data.items);
                    advPage = data.page;
                    $(".advNext").on("click", function() {
                        loadAdv(Number(advPage))
                    });
                    $(".advPrve").on("click", function() {
                        loadAdv(Number(advPage - 2));
                        if (advPage == 2) {
                            $(".advPrve").removeClass("show-btn");
                        }
                    });
                    if (advPage == 1) {
                        if (data.items.length < 12) {
                            $(".advNext").removeClass("show-btn")
                        } else {
                            $(".advNext").addClass("show-btn")
                        }
                    } else if (advPage > 1) {
                        $(".advPrve").addClass("show-btn");
                        if (data.items.length >= 12) {
                            $(".advNext").addClass("show-btn")
                        } else {
                            $(".advNext").removeClass("show-btn")
                        }
                    }
                }   
            })
        }, 547);
    };
    loadAdv(advPage);
    // 推荐咨询师
    // 2.1.讲师分类表格
    function loadAdvSort(data) {
        $('#advSortTable').bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'userImage',
                title: '头像',
                align: 'center',
                valign: 'middle',
                formatter: headImg2
            }, {
                field: 'userName',
                title: '姓名',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'type',
                title: '讲师类别',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'userPhone',
                title: '手机号',
                align: 'center',
                valign: 'middle',
            },{
                title: '状态',
                align: 'center',
                valign: 'middle',
                formatter: isdel
            }],
        });

        function headImg2(e, value, row, index) {
            var headImg = "http://47.94.173.253:8008"+value.userImage;
            return '<img class="headPic" src="' + headImg + '" />'
        };
        function isdel(e,value,row,index){
            var dateNow = new Date();
            var startTime = new Date(Date.parse(value.endTime));
            
            if(dateNow>startTime){
                return '<span class="status">已过期</span>'
            }else{
                return '<span class="status2">正常</span>'
            }
            
        }
    };
    var advPage2 = 0;
    function loadSortAdv(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/Home/adviserstype_getByManager.ashx', {
                "userGuid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                if (data.status==200) {
                    loadAdvSort(data.items);
                    $('#advSortTable').bootstrapTable("load", data.items);
                    advPage2 = data.page;
                    $(".advNext2").on("click", function() {
                        loadSort(Number(advPage2))
                    });
                    $(".advPrve2").on("click", function() {
                        loadSort(Number(advPage2 - 2));
                        if (advPage2 == 2) {
                            $(".advPrve2").removeClass("show-btn");
                        }
                    });
                    if (advPage2 == 1) {
                        if (data.items.length < 12) {
                            $(".advNext2").removeClass("show-btn")
                        } else {
                            $(".advNext2").addClass("show-btn")
                        }
                    } else if (advPage2 > 1) {
                        $(".advPrve2").addClass("show-btn");
                        if (data.items.length >= 12) {
                            $(".advNext2").addClass("show-btn")
                        } else {
                            $(".advNext2").removeClass("show-btn")
                        }
                    }
                }
                
            })
        }, 361);
    };
    loadSortAdv(advPage);
    // 1.2添加推荐咨询师
    // 检索咨询师
    var advTeacherGuid;
    $(".searchAdvTeacher").on("click", function() {
        $.post(http_head + '/Admin/Home/searchByphone.ashx', {
            "phone": $(".advTeachPhone").val()
        }, function(data) {
            var data = JSON.parse(data);
            if ($(".advTeachPhone").val()) {
                if (data.status == 200) {
                    advTeacherGuid = data.userGuid;
                    layer.msg("检索成功", {
                        time: 1200
                    })
                } else {
                    layer.msg("未找到该讲师", {
                        time: 1200
                    })
                }
            } else {
                layer.msg("请输入讲师手机号", {
                    time: 1200
                })
            }
        })
    });
    // 添加图片
    var arrAdv = [];

    function dataURLtoFile(dataurl, filename) { //将base64转换为file文件
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {
            type: mime
        });
    };
    $(".chooseImgAdv").click(function() {
        $("#headImgAdv").click(); //隐藏了input:file样式后，点击头像就可以本地上传
    });
    $("#headImgAdv").on("change", function() {
        arrAdv = this.files[0];
    });
    $("#headImgAdv").localResizeIMG({
        width: 200,
        quality: 0.1,
        success: function(result) {
            var img = new Image();
            img.src = result.base64;
            var imgFile = dataURLtoFile(img.src, arrAdv.name); //压缩  
            ajaxFileUpload2adv(imgFile); //上传
        }
    });
    //建立一個可存取到該file的url
    function getObjectURL2adv(file) {
        var urlAdv = null;
        if (window.createObjectURL != undefined) { // basic
            urlAdv = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            urlAdv = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            urlAdv = window.webkitURL.createObjectURL(file);
        }
        return urlAdv;
    }
    // 上传图片
    function ajaxFileUpload2adv(file) {
        var imgData2 = new FormData();
        imgData2.append('willcompress', "true");
        imgData2.append('file', file);
        $.ajax({
            type: 'post',
            url: '' + http_head + '/Reimburse/Upload_Files.ashx',
            data: imgData2,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function(data) {
                var data2 = JSON.parse(data)
                if (data2.status == 200) {
                    layer.msg('上传成功', {
                        time: 1000,
                    });
                    arr_imgHref = http_head + data2.items.split(";")[0];
                    $(".chooseImgAdv").show();
                    $(".chooseImgAdv").attr("value", "重新上传");
                    arr_img = [];
                    $('.imageDivAdv').remove();
                    $(".realImgAdv").attr("src", data2.items.split(";")[0]); //表格图片
                    $("#showImgAdv").attr("src", arr_imgHref); //弹窗已选图片
                }
            },
        });
    }
    $(".addAdvTeacher").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加推荐咨询师', 'font-size:18px;text-align: center;'],
            content: $('.addTeacherAdv'),
            btn: '确定',
            yes: function(index, layero) {
                if (advTeacherGuid == undefined) {
                    layer.msg("请输入讲师手机号并检索", {
                        time: 1200
                    })
                } else if ($("#showImgAdv").attr("src") == "../image/upload.png") {
                    layer.msg("请上传头像", {
                        time: 1200
                    })
                } else if ($(".advTeachName").val() == "") {
                    layer.msg("请输入讲师姓名", {
                        time: 1200
                    })
                } else if ($(".advLastDate").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".advCode").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/Home/adcisers_set.ashx', {
                            "createrGuid": dataManger.userGuid,
                            "userGuid": advTeacherGuid,
                            "userImage": $(".realImgAdv").attr("src"),
                            "userName": $(".advTeachName").val(),
                            "months": $(".advLastDate").val(),
                            "outTradeNo": $(".advCode").val(),
                            "userPhone": $(".advTeachPhone").val(),
							"sortnum": $(".zxspx").val()
							
                        }, function(data) {
                            var data = JSON.parse(data)
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadAdv(); //重新加载表格数据
                                advTeacherGuid = undefined;
                                $(".advTeachName").val('');
                                $(".advLastDate").val('');
                                $(".advCode").val('');
                                $(".advTeachPhone").val('');
                                $("#showImgAdv").attr("src", "../image/upload.png");
                                $(".realImgAdv").removeAttr("src");
                                $(".chooseImgAdv").attr("value", "选择照片");
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            } else {
                                console.log(data)
                            }
                        });
                    }, 577);
                }
            }
        })
    });
    // 2.2添加咨询师分类
    //分类
    var sortAdvTeacher;
    setTimeout(function() {
        var name = ["人力资源管理咨询", "供应链管理咨询", "生产制造咨询", "市场调查咨询", "工程咨询", "其他"];
        // 搜索插件
        $(".hyitemsAdv").selectivity({
            allowClear: true,
            items: name,
            placeholder: '请选择分类'
        });
        $(".hyitemsAdv").on("change", function(e) {
            sortAdvTeacher = e.value;
            if (sortAdvTeacher == null) {
                $(".fa-sort-desc").css({
                    "borderTopColor": "black"
                });
                $("#selectI").remove();
                $("#select9 dd").addClass("selected");
            } else {
                $(".fa-sort-desc").css({
                    "borderTopColor": "white"
                })
            }
        });
        $(".hyitemsAdv").on("selectivity-open", function(e) {
            if (sortAdvTeacher == "" || sortAdvTeacher == null) {
                $(".fa-sort-desc").css({
                    borderTop: "none",
                    borderBottom: "4px solid black"
                })
            } else {
                $(".fa-sort-desc").css({
                    borderTop: "none",
                    borderBottom: "4px solid white"
                })
            }
        })
        $(".hyitemsAdv").on("selectivity-close", function(e) {
            if (sortAdvTeacher == '' || sortAdvTeacher == null) {
                $(".fa-sort-desc").css({
                    borderBottom: "none",
                    borderTop: "4px solid black"
                })
            } else {
                $(".fa-sort-desc").css({
                    borderBottom: "none",
                    borderTop: "4px solid white"
                })
            }
        })
    }, 311);
    // 检索讲师
    var advSortTeacherGuid;
    $(".advSortSearchTeacher").on("click", function() {
        $.post(http_head + '/Admin/Home/searchByphone.ashx', {
            "phone": $(".advSortTeachPhone").val()
        }, function(data) {
            var data = JSON.parse(data);
            if ($(".advSortTeachPhone").val()) {
                if (data.status == 200) {
                    advSortTeacherGuid = data.userGuid;
                    layer.msg("检索成功", {
                        time: 1200
                    })
                } else {
                    layer.msg("未找到该讲师", {
                        time: 1200
                    })
                }
            } else {
                layer.msg("请输入讲师手机号", {
                    time: 1200
                })
            }
        })
    });
    // 添加图片
    var arrAdvSort = []
    $(".chooseImgAdvSort").click(function() {
        $("#headImgAdvSort").click(); //隐藏了input:file样式后，点击头像就可以本地上传
    });
    $("#headImgAdvSort").on("change", function() {
        arrAdvSort = []
        arrAdvSort = this.files[0]
        ajaxFileUploadAdvSort(arrAdvSort)
    });
    // 上传图片
    function ajaxFileUploadAdvSort(file) {
        var imgData3 = new FormData();
        imgData3.append('willcompress', "true");
        imgData3.append('file', file);
        $.ajax({
            type: 'post',
            url: '' + http_head + '/Reimburse/Upload_Files.ashx',
            data: imgData3,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function(data) {
                var data3 = JSON.parse(data)
                if (data3.status == 200) {
                    layer.msg('上传成功', {
                        time: 1000,
                    });
                    arr_imgHref = http_head + data3.items.split(";")[0];
                    $(".chooseImgAdvSort").show();
                    $(".chooseImgAdvSort").attr("value", "重新上传")
                    arr_img = [];
                    $('.imageDiv').remove();
                    $(".realImgAdvSort").attr("src", data3.items.split(";")[0]); //表格图片
                    $("#showImgAdvSort").attr("src", arr_imgHref); //弹窗已选图片
                }
            },
            error: function() {}
        });
    }
    $(".addSortAdvTeacher").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '100%'],
            title: ['添加咨询师分类', 'font-size:18px;text-align: center;'],
            content: $('.addTeacherSortAdv'),
            btn: '确定',
            yes: function(index, layero) {
                if (advSortTeacherGuid == undefined) {
                    layer.msg("请输入讲师手机号并检索", {
                        time: 1200
                    })
                } else if ($("#showImgAdvSort").attr("src") == "../image/upload.png") {
                    layer.msg("请上传头像", {
                        time: 1200
                    })
                } else if ($(".advSortTeachName").val() == "") {
                    layer.msg("请输入讲师姓名", {
                        time: 1200
                    })
                } else if (sortAdvTeacher == undefined) {
                    layer.msg("请选择讲师分类", {
                        time: 1200
                    })
                } else if ($(".advSortLastDate").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".advSortCode").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    $.post('' + http_head + '/Admin/Home/adciserstype_set.ashx', {
                        "createrGuid": dataManger.userGuid,
                        "userGuid": advSortTeacherGuid,
                        "userImage": $(".realImgAdvSort").attr("src"),
                        "userName": $(".advSortTeachName").val(),
                        "months": $(".advSortLastDate").val(),
                        "outTradeNo": $(".advSortCode").val(),
                        "userPhone": $(".advSortTeachPhone").val(),
                        "type": sortAdvTeacher,
						"sortnum":$(".jspxSort").val()
                    }, function(data) {
                        var data = JSON.parse(data)
                        if (data.status == 200) {
                            layer.closeAll(); //关闭layer
                            // loadSort(); //重新加载表格数据
                            advSortTeacherGuid = undefined;
                            $(".advSortTeachName").val('');
                            $(".advSortLastDate").val('');
                            $(".advSortCode").val('');
                            $(".advSortTeachPhone").val('');
                            $("#showImgAdvSort").attr("src", "../image/upload.png");
                            $(".realImgAdvSort").removeAttr("src");
                            $(".chooseImgAdvSort").attr("value", "选择照片");
                            $(".fa-sort-desc").css({
                                "borderTopColor": "black"
                            });
                            sortAdvTeacher = undefined;
                            $(".selectivity-single-selected-item").replaceWith('<div class="selectivity-placeholder"> 请选择分类</div>');
                            layer.msg("添加成功", {
                                time: 1200
                            });
                        }
                    });
                }
            }
        })
    });
    // 讲师推广 //////////////////////////////////////////////////////////////////////////////
    $('.spread').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.spreadDiv').show().siblings('div').hide();
    });
    // 1.推荐讲师
    // 1.1讲师表格
    function loadRecTable(data) {
        $('#recommendTable').bootstrapTable({
            data: data,
            columns: [{
                field: 'sort',
                title: '排序',
                align: 'center',
                valign: 'middle',
               
            }, {
                field: 'userImage',
                title: '头像',
                align: 'center',
                valign: 'middle',
                formatter: headImg
            }, {
                field: 'userName',
                title: '姓名',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'userPhone',
                title: '手机号',
                align: 'center',
                valign: 'middle',
            },{
                title: '状态',
                align: 'center',
                valign: 'middle',
                formatter: isdel
            }],
        });

        function headImg(e, value, row, index) {
            return '<img class="headPic" src="' + value.userImage + '" />'
        };
        function isdel(e,value,row,index){
            var dateNow = new Date();
            var startTime = new Date(Date.parse(value.endTime));
            
            if(dateNow>startTime){
                return '<span class="status">已过期</span>'
            }else{
                return '<span class="status2">正常</span>'
            }
            
        }
    };
    var tjskPage = 0;

    function loadRec(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/Home/GetHomeTeacherByManager.ashx', {
                "Guid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                if (data.status == 200) {
                    loadRecTable(data.items);
                    $('#recommendTable').bootstrapTable("load", data.items);
                    tjskPage = data.page;
                    $(".jstjNext").on("click", function() {
                        loadRec(Number(tjskPage))
                    });
                    $(".jstjPrve").on("click", function() {
                        loadRec(Number(tjskPage - 2));
                        if (tjskPage == 2) {
                            $(".jstjPrve").removeClass("show-btn");
                        }
                    });
                    if (tjskPage == 1) {
                        if (data.items.length < 12) {
                            $(".jstjNext").removeClass("show-btn")
                        } else {
                            $(".jstjNext").addClass("show-btn")
                        }
                    } else if (tjskPage > 1) {
                        $(".jstjPrve").addClass("show-btn");
                        if (data.items.length >= 12) {
                            $(".jstjNext").addClass("show-btn")
                        } else {
                            $(".jstjNext").removeClass("show-btn")
                        }
                    }
                }
            })
        }, 547);
    };
    loadRec(tjskPage);
    // 1.2.添加推荐讲师
    // 检索讲师
    var recTeacherGuid;
    $(".searchTeacher").on("click", function() {
        $.post(http_head + '/Admin/Home/searchByphone.ashx', {
            "phone": $(".teachPhone").val()
        }, function(data) {
            var data = JSON.parse(data);
            if ($(".teachPhone").val()) {
                if (data.status == 200) {
                    recTeacherGuid = data.userGuid;
                    layer.msg("检索成功", {
                        time: 1200
                    })
                } else {
                    layer.msg("未找到该讲师", {
                        time: 1200
                    })
                }
            } else {
                layer.msg("请输入讲师手机号", {
                    time: 1200
                })
            }
        })
    });
    // 添加图片
    var arr2 = [];
    $(".chooseImg").click(function() {
        $("#headImg").click(); //隐藏了input:file样式后，点击头像就可以本地上传
    });
    $("#headImg").on("change", function() {
        arr2 = this.files[0];
    });
    $("#headImg").localResizeIMG({
        width: 200,
        quality: 0.1,
        success: function(result) {
            var img = new Image();
            img.src = result.base64;
            var imgFile = dataURLtoFile(img.src, arr2.name); //压缩  
            ajaxFileUpload2(imgFile); //上传
        }
    });
    //建立一個可存取到該file的url
    function getObjectURL2(file) {
        var url2 = null;
        if (window.createObjectURL != undefined) { // basic
            url2 = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url2 = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url2 = window.webkitURL.createObjectURL(file);
        }
        return url2;
    }
    // 上传图片
    function ajaxFileUpload2(file) {
        var imgData2 = new FormData();
        imgData2.append('willcompress', "true");
        imgData2.append('file', file);
        $.ajax({
            type: 'post',
            url: '' + http_head + '/Reimburse/Upload_Files.ashx',
            data: imgData2,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function(data) {
                var data2 = JSON.parse(data)
                if (data2.status == 200) {
                    layer.msg('上传成功', {
                        time: 1000,
                    });
                    arr_imgHref = http_head + data2.items.split(";")[0];
                    $(".chooseImg").show();
                    $(".chooseImg").attr("value", "重新上传");
                    arr_img = [];
                    $('.imageDiv').remove();
                    $(".realImg").attr("src", data2.items.split(";")[0]); //表格图片
                    $("#showImg").attr("src", arr_imgHref); //弹窗已选图片
                }
            },
        });
    }
    $(".addRecTeacher").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '660px'],
            title: ['添加推荐讲师', 'font-size:18px;text-align: center;'],
            content: $('.addTeacherRec'),
            btn: '确定',
            yes: function(index, layero) {
                if (recTeacherGuid == undefined) {
                    layer.msg("请输入讲师手机号并检索", {
                        time: 1200
                    })
                } else if ($("#showImg").attr("src") == "../image/upload.png") {
                    layer.msg("请上传头像", {
                        time: 1200
                    })
                } else if ($(".teachName").val() == "") {
                    layer.msg("请输入讲师姓名", {
                        time: 1200
                    })
                } else if ($(".lastDate").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".recCode").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    setTimeout(function() {
                        $.post('' + http_head + '/Admin/Home/Teacher_recommend.ashx', {
                            "createrGuid": dataManger.userGuid,
                            "userGuid": recTeacherGuid,
                            "userImage": $(".realImg").attr("src"),
                            "userName": $(".teachName").val(),
                            "months": $(".lastDate").val(),
                            "outTradeNo": $(".recCode").val(),
                            "userPhone": $(".teachPhone").val(),
							"sortnum": $(".jspx").val()
                        }, function(data) {
                            var data = JSON.parse(data)
                            if (data.status == 200) {
                                layer.closeAll(); //关闭layer
                                loadRec(); //重新加载表格数据
                                recTeacherGuid = undefined;
                                $(".teachName").val('');
                                $(".lastDate").val('');
                                $(".recCode").val('');
                                $(".teachPhone").val('');
                                $("#showImg").attr("src", "../image/upload.png");
                                $(".realImg").removeAttr("src");
                                $(".chooseImg").attr("value", "选择照片");
                                layer.msg("添加成功", {
                                    time: 1200
                                });
                            }
                        });
                    }, 577);
                }
            }
        })
    });
    // 2，讲师分类
    // 2.1.讲师分类表格
    function loadSortTable(data) {
        $('#sortTable').bootstrapTable({
            data: data,
            columns: [{
                field: 'num',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: function(value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'userImage',
                title: '头像',
                align: 'center',
                valign: 'middle',
                formatter: headImg2
            }, {
                field: 'userName',
                title: '姓名',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'type',
                title: '讲师类别',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'endTime',
                title: '到期时间',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'outTradeNo',
                title: '交易码',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'userPhone',
                title: '手机号',
                align: 'center',
                valign: 'middle',
            },{
                title: '状态',
                align: 'center',
                valign: 'middle',
                formatter: isdel
            }],
        });

        function headImg2(e, value, row, index) {
            return '<img class="headPic" src="' + value.userImage + '" />'
        };
        function isdel(e,value,row,index){
            var dateNow = new Date();
            var startTime = new Date(Date.parse(value.endTime));
            
            if(dateNow>startTime){
                return '<span class="status">已过期</span>'
            }else{
                return '<span class="status2">正常</span>'
            }
            
        }
    };
    var jsflPage = 0;
    function loadSort(page) {
        setTimeout(function() {
            $.post(http_head + '/Admin/Home/GetHomeTeacherTypeByManager.ashx', {
                "Guid": dataManger.userGuid,
                "page": page
            }, function(data) {
                var data = JSON.parse(data);
                if (data.status==200) {
                    loadSortTable(data.items);
                    $('#sortTable').bootstrapTable("load", data.items);
                    jsflPage = data.page;
                    $(".jstjNext2").on("click", function() {
                        loadSort(Number(jsflPage))
                    });
                    $(".jstjPrve2").on("click", function() {
                        loadSort(Number(jsflPage - 2));
                        if (jsflPage == 2) {
                            $(".jstjPrve2").removeClass("show-btn");
                        }
                    });
                    if (jsflPage == 1) {
                        if (data.items.length < 12) {
                            $(".jstjNext2").removeClass("show-btn")
                        } else {
                            $(".jstjNext2").addClass("show-btn")
                        }
                    } else if (jsflPage > 1) {
                        $(".jstjPrve2").addClass("show-btn");
                        if (data.items.length >= 12) {
                            $(".jstjNext2").addClass("show-btn")
                        } else {
                            $(".jstjNext2").removeClass("show-btn")
                        }
                    }
                }
                
            })
        }, 361);
    };
    loadSort(jsflPage);
    // 2.2添加讲师分类
    //分类
    var sortTeacher;
    setTimeout(function() {
        $.post('' + http_head + '/Option_AreasAnd.ashx', {
            "type": 45
        }, function(data) {
            var name = [];
            for (var i = 0; i < data.length; i++) {
                name.push(data[i].name);
            }
            // 搜索插件
            $(".hyitems").selectivity({
                allowClear: true,
                items: name,
                placeholder: '请选择分类'
            });
            $(".hyitems").on("change", function(e) {
                sortTeacher = e.value;
                if (sortTeacher == null) {
                    $(".fa-sort-desc").css({
                        "borderTopColor": "black"
                    });
                    $("#selectI").remove();
                    $("#select9 dd").addClass("selected");
                } else {
                    $(".fa-sort-desc").css({
                        "borderTopColor": "white"
                    })
                }
            });
            $(".hyitems").on("selectivity-open", function(e) {
                if (sortTeacher == "" || sortTeacher == null) {
                    $(".fa-sort-desc").css({
                        borderTop: "none",
                        borderBottom: "4px solid black"
                    })
                } else {
                    $(".fa-sort-desc").css({
                        borderTop: "none",
                        borderBottom: "4px solid white"
                    })
                }
            })
            $(".hyitems").on("selectivity-close", function(e) {
                if (sortTeacher == '' || sortTeacher == null) {
                    $(".fa-sort-desc").css({
                        borderBottom: "none",
                        borderTop: "4px solid black"
                    })
                } else {
                    $(".fa-sort-desc").css({
                        borderBottom: "none",
                        borderTop: "4px solid white"
                    })
                }
            })
        })
    }, 311);
    //////////////////////////////////////////////
    // 检索讲师
    var recTeacherGuid2;
    $(".searchTeacher2").on("click", function() {
        $.post(http_head + '/Admin/Home/searchByphone.ashx', {
            "phone": $(".teachPhone2").val()
        }, function(data) {
            var data = JSON.parse(data);
            if ($(".teachPhone2").val()) {
                if (data.status == 200) {
                    recTeacherGuid2 = data.userGuid;
                    layer.msg("检索成功", {
                        time: 1200
                    })
                } else {
                    layer.msg("未找到该讲师", {
                        time: 1200
                    })
                }
            } else {
                layer.msg("请输入讲师手机号", {
                    time: 1200
                })
            }
        })
    });
    // 添加图片
    var arr3 = [];
    $(".chooseImg2").click(function() {
        $("#headImg2").click(); //隐藏了input:file样式后，点击头像就可以本地上传
    });
    $("#headImg2").on("change", function() {
        arr3 = this.files[0];
    });
    $("#headImg2").localResizeIMG({
        width: 200,
        quality: 0.1,
        success: function(result) {
            var img = new Image();
            img.src = result.base64;
            var imgFile = dataURLtoFile(img.src, arr3.name); //压缩  
            ajaxFileUpload3(imgFile); //上传
        }
    });
    // 上传图片
    function ajaxFileUpload3(file) {
        var imgData3 = new FormData();
        imgData3.append('willcompress', "true");
        imgData3.append('file', file);
        $.ajax({
            type: 'post',
            url: '' + http_head + '/Reimburse/Upload_Files.ashx',
            data: imgData3,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function(data) {
                var data3 = JSON.parse(data)
                if (data3.status == 200) {
                    layer.msg('上传成功', {
                        time: 1000,
                    });
                    arr_imgHref = http_head + data3.items.split(";")[0];
                    $(".chooseImg2").show();
                    $(".chooseImg2").attr("value", "重新上传")
                    arr_img = [];
                    $('.imageDiv').remove();
                    $(".realImg2").attr("src", data3.items.split(";")[0]); //表格图片
                    $("#showImg2").attr("src", arr_imgHref); //弹窗已选图片
                }
            },
            error: function() {}
        });
    }
    $(".addSortTeacher").on("click", function() {
        layer.open({
            type: 1,
            area: ['800px', '100%'],
            title: ['添加讲师分类', 'font-size:18px;text-align: center;'],
            content: $('.addTeacherSort'),
            btn: '确定',
            yes: function(index, layero) {
                if (recTeacherGuid2 == undefined) {
                    layer.msg("请输入讲师手机号并检索", {
                        time: 1200
                    })
                } else if ($("#showImg2").attr("src") == "../image/upload.png") {
                    layer.msg("请上传头像", {
                        time: 1200
                    })
                } else if ($(".teachName2").val() == "") {
                    layer.msg("请输入讲师姓名", {
                        time: 1200
                    })
                } else if (sortTeacher == undefined) {
                    layer.msg("请选择讲师分类", {
                        time: 1200
                    })
                } else if ($(".lastDate2").val() == "") {
                    layer.msg("请输入推荐时长", {
                        time: 1200
                    })
                } else if ($(".recCode2").val() == "") {
                    layer.msg("请输入交易码", {
                        time: 1200
                    })
                } else {
                    $.post('' + http_head + '/Admin/Home/setTeacherByType.ashx', {
                        "createrGuid": dataManger.userGuid,
                        "userGuid": recTeacherGuid2,
                        "userImage": $(".realImg2").attr("src"),
                        "userName": $(".teachName2").val(),
                        "months": $(".lastDate2").val(),
                        "outTradeNo": $(".recCode2").val(),
                        "userPhone": $(".teachPhone2").val(),
                        "type": sortTeacher,
						"sortnum": $(".recPx").val()
                    }, function(data) {
                        var data = JSON.parse(data)
                        if (data.status == 200) {
                            layer.closeAll(); //关闭layer
                            loadSort(); //重新加载表格数据
                            recTeacherGuid2 = undefined;
                            $(".teachName2").val('');
                            $(".lastDate2").val('');
                            $(".recCode2").val('');
                            $(".teachPhone2").val('');
                            $("#showImg2").attr("src", "../image/upload.png");
                            $(".realImg2").removeAttr("src");
                            $(".chooseImg2").attr("value", "选择照片");
                            $(".fa-sort-desc").css({
                                "borderTopColor": "black"
                            });
                            sortTeacher = undefined;
                            $(".selectivity-single-selected-item").replaceWith('<div class="selectivity-placeholder"> 请选择分类</div>');
                            layer.msg("添加成功", {
                                time: 1200
                            });
                        }
                    });
                }
            }
        })
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////
    //试用设置
    $('.trySet').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.trySetDiv').show().siblings('div').hide();
    });
    // 易企购广告设置
    var productId, dataProductDet
    var arr_img = [];
    var arr_imgHref = [];
    var fileList;
    $('.eqbuy').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.eqbuyDiv').show().siblings('div').hide();
        $('#lookProductType').val(0)
        loadProduct(0)
    });
    $('#addProductBtn').click(function() {
        layer.open({
            type: 1,
            area: ['800px', '100%'],
            title: ['添加产品广告', 'font-size:18px;text-align: center;'],
            content: $('.addProductDiv'),
            btn: '确定',
            yes: function(index, layero) {
                ajaxImgUpload()
                layer.closeAll()
            }
        })
    });
    $('#lookProductType').change(function() {
        loadProduct($(this).val())
    });

    function loadProduct(type) {
        setTimeout(function() {
            $.post('' + http_head + '/ComSpace/Advert/Get_ProductAdvert.ashx', {
                "type": type
            }, function(data) {
                var dataProductTable = JSON.parse(data)
                loadProductTable(dataProductTable.items)
            });
        }, 389)
    }

    function loadProductTable(data) {
        $('#productTable').bootstrapTable({
            url: data,
            columns: [{
                field: 'productName',
                title: '产品名称',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'productType',
                title: '产品种类',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'company',
                title: '公司',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'productArea',
                title: '所在地',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'option',
                title: '操作',
                align: 'center',
                valign: 'middle',
                formatter: optionproductFormatter,
                events: optionproductEvents,
            }]
        });
        $("#productTable").bootstrapTable('load', data);

        function optionproductFormatter(e, value, row, index) {
            return ['<a class="removeProduct" id="删除需求">', '<span id="removeProduct">删除</span>', '</a>',
                // '<a class="changeProduct"  title="修改需求">',
                // '<span id="changeProduct">修改</span>',
                // '</a>  ',
            ].join('');
        };
    }
    window.optionproductEvents = {
        'click .removeProduct': function(e, value, row, index) {
            layer.open({
                type: 1,
                area: ['300px', '200px'],
                title: ['删除', 'font-size:18px;text-align: center;'],
                content: $('.deleteProductDiv'),
                btn: '确定',
                yes: function(index, layero) {
                    setTimeout(function() {
                        $.post('' + http_head + '/ComSpace/Advert/Delete_ProductAdvert.ashx', {
                            "userGuid": dataManger.userGuid,
                            "advertId": row.Id
                        }, function(data) {
                            var dataDelDemand = JSON.parse(data)
                            if (dataDelDemand.status == 200) {
                                loadProduct($('#lookProductType').val())
                            }
                        });
                    }, 363)
                    layer.closeAll()
                }
            })
        }
    }
    laydate.render({
        elem: '#adBeginTime',
    });
    laydate.render({
        elem: '#adEndTime',
    });
    $('#hrefBtn').click(function() {
        getProduct($('#productHref').val())
    });
    // 产品详情
    function getProduct(href) {
        productId = href.split("=")[1]
        $.post('' + http_head + '/ComSpace/ComSpaceProduct/Get_ComSpaceProductById.ashx', {
            "productId": productId
        }, function(data) {
            dataProductDet = JSON.parse(data)
            $('.productName').val(dataProductDet.items.ProductName)
            $('.productType').val(dataProductDet.items.ProductType)
            $('.productPrice').val(dataProductDet.items.ProductPrice)
            $('.productArea').val(dataProductDet.items.area)
        })
    }
    var arr = []
    $("#pic5").click(function() {
        $("#upload5").click(); //隐藏了input:file样式后，点击头像就可以本地上传
        // ajaxFileUpload(arr)
    });
    $("#upload5").on("change", function() {
        arr = []
        var objUrl5 = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
        arr = this.files[0]
        ajaxFileUpload(arr)
        if (objUrl5) {
            // $("#pic5").hide()
            $("#pic5Img").show()
            $("#pic5Img").attr("src", objUrl5); //将图片路径存入src中，显示出图片
            $("#pic5").val("重新选择")
        }
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
    // 上传图片
    function ajaxFileUpload(file) {
        var Pformdata2 = new FormData();
        Pformdata2.append('willcompress', "true");
        Pformdata2.append('file', file);
        $.ajax({
            type: 'post',
            url: '' + http_head + '/Reimburse/Upload_Files.ashx',
            data: Pformdata2,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function(data) {
                var data2 = JSON.parse(data)
                if (data2.status == 200) {
                    layer.msg('上传成功', {
                        time: 1000,
                    });
                    arr_imgHref = data2.items.split(";")[0];
                    $("#pic5").show()
                    arr_img = [];
                    $('.imageDiv').remove()
                }
            },
            error: function() {}
        });
    }

    function ajaxImgUpload() {
        var Pformdata = new FormData();
        Pformdata.append('userGuid', dataManger.userGuid);
        Pformdata.append('productId', productId);
        Pformdata.append('companyId', dataProductDet.items.CompanyId);
        Pformdata.append('productName', dataProductDet.items.ProductName);
        Pformdata.append('productType', dataProductDet.items.ProductType);
        Pformdata.append('productPrice', dataProductDet.items.ProductPrice);
        Pformdata.append('productArea', dataProductDet.items.area);
        Pformdata.append('startTime', $('#adBeginTime').val());
        Pformdata.append('endTime', $('#adEndTime').val());
        Pformdata.append('sort', $('#sort').val());
        Pformdata.append('type', $('#chooseadType').val());
        Pformdata.append('productImg', arr_imgHref);
        $.ajax({
            type: 'post',
            url: '' + http_head + '/ComSpace/Advert/Add_ProductAdvert.ashx',
            data: Pformdata,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function(data) {
                var data2 = JSON.parse(data)
                if (data2.status == 200) {
                    layer.msg('上传成功', {
                        time: 1000,
                    });
                    arr_img = [];
                    arr_imgHref = [];
                    $('.eqbuyDiv form input').val("")
                    $('.eqbuyDiv form #hrefBtn').val("确定")
                    $('.eqbuyDiv form #pic5').val("上传照片")
                    $('#upload5').val("")
                    $('.imageDiv').remove()
                    $("#pic5Img").hide()
                }
            },
            error: function() {}
        });
    }
    // 易企购需求设置
    var demandId, dataDemand
    $('.eqbuyDemand').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.eqbuyDemandDiv').show().siblings('div').hide();
        $('#lookDemandType').val(2)
        loadDemand(2)
    });
    $('#lookDemandType').change(function() {
        loadDemand($(this).val())
    });
    $('#addDemandBtn').click(function() {
        layer.open({
            type: 1,
            area: ['800px', '100%'],
            title: ['添加需求广告', 'font-size:18px;text-align: center;'],
            content: $('.addDemandDiv'),
            btn: '确定',
            yes: function(index, layero) {
                upDemand()
                layer.closeAll()
            }
        })
    });
    laydate.render({
        elem: '#demandBeginTime',
    });
    laydate.render({
        elem: '#demandEndTime',
    });
    $('#demandhrefBtn').click(function() {
        getDemand($('#demandHref').val())
    });

    function getDemand(href) {
        demandId = href.split("=")[1]
        $.post('' + http_head + '/ComSpace/ComSpaceOther/Get_ComSpaceDemandById.ashx', {
            "DemandID": demandId
        }, function(data) {
            dataDemand = JSON.parse(data);
            $('.demandName').val(dataDemand.items.ProductName)
            $('.demandType').val(dataDemand.items.ProductType)
            $('.demandPrice').val(dataDemand.items.DemandPrice)
            $('.demandArea').val(dataDemand.items.DemandAddress)
        });
    }

    function upDemand() {
        $.post('' + http_head + '/ComSpace/Advert/Add_ProductAdvert.ashx', {
            "userGuid": dataManger.userGuid,
            "productId": demandId,
            "productImg": "",
            "companyId": dataDemand.items.CompanyId,
            "productName": dataDemand.items.ProductName,
            "productType": dataDemand.items.ProductType,
            "productPrice": dataDemand.items.DemandPrice,
            "productArea": $('.demandArea').val(),
            "startTime": $('#demandBeginTime').val(),
            "endTime": $('#demandEndTime').val(),
            "sort": $('#demandSort').val(),
            "type": $('#demandType').val()
        }, function(data) {
            var dataDemandUped = JSON.parse(data);
            if (dataDemandUped.status == 200) {
                layer.msg(dataDemandUped.msg, {
                    time: 1000,
                });
                $('.eqbuyDemandDiv form input').val("")
                $('.eqbuyDemandDiv form #demandhrefBtn').val("确定")
            }
        });
    }

    function loadDemand(type) {
        setTimeout(function() {
            $.post('' + http_head + '/ComSpace/Advert/Get_ProductAdvert.ashx', {
                "type": type
            }, function(data) {
                var dataDemandTable = JSON.parse(data)
                loadDemandTable(dataDemandTable.items)
            });
        }, 231)
    }

    function loadDemandTable(data) {
        $('#demandTable').bootstrapTable({
            url: data,
            columns: [{
                field: 'productName',
                title: '需求名称',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'productType',
                title: '需求种类',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'company',
                title: '公司',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'productArea',
                title: '所在地',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'option',
                title: '操作',
                align: 'center',
                valign: 'middle',
                formatter: optiondemandFormatter,
                events: optiondemandEvents,
            }]
        });
        $("#demandTable").bootstrapTable('load', data);

        function optiondemandFormatter(e, value, row, index) {
            return ['<a class="removeDemand" id="删除需求">', '<span id="removeDemand">删除</span>', '</a>',
                // '<a class="changeDemand"  title="修改需求">',
                // '<span id="changeDemand">修改</span>',
                // '</a>  ',
            ].join('');
        };
    }
    window.optiondemandEvents = {
        'click .removeDemand': function(e, value, row, index) {
            layer.open({
                type: 1,
                area: ['300px', '200px'],
                title: ['删除', 'font-size:18px;text-align: center;'],
                content: $('.deleteDemandDiv'),
                btn: '确定',
                yes: function(index, layero) {
                    $.post('' + http_head + '/ComSpace/Advert/Delete_ProductAdvert.ashx', {
                        "userGuid": dataManger.userGuid,
                        "advertId": row.Id
                    }, function(data) {
                        var dataDelDemand = JSON.parse(data)
                        if (dataDelDemand.status == 200) {
                            loadDemand($('#lookDemandType').val())
                        }
                    });
                    layer.closeAll()
                }
            })
        }
    };
    // 交易记录
    var tradePage, type;
    var arr_trade = []
    var day1 = new Date();
    day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
    var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
    $('#tradeTime1').val(s1)
    $('#tradeTime2').val(s1)
    $('.tradeCheck').click(function() {
        $(this).addClass('active').siblings('p').removeClass('active');
        $('.tradeCheckDiv').show().siblings('div').hide();
        arr_trade = []
        $('#tradeType').val(1)
        loadTrade(0, 1)
    });
    laydate.render({
        elem: '#tradeTime1',
        max: 0,
    });
    laydate.render({
        elem: '#tradeTime2',
        max: 0,
    });
    //
    function loadingManger() {
        $.post('' + http_head + '/Admin/ComSpace/Get_ComSpaceModular.ashx', {}, function(data) {
            var dataManger = JSON.parse(data)
            loadMangerTable(dataManger.items)
        });
    }

    function loadMangerTable(data) {
        $('#mangerTable').bootstrapTable({
            url: data,
            columns: [{
                field: 'ModularName',
                title: '模块名称',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'VipPrice',
                title: '参考价格(元/年)',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'discount',
                title: '折扣',
                align: 'center',
                valign: 'middle',
                formatter: disCountFormatter
            }, {
                field: 'resultMondy',
                title: '实际价格(元/年)',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'ModularDescribe',
                title: '描述',
                align: 'left',
                valign: 'middle',
            }, {
                field: 'option',
                title: '操作',
                align: 'center',
                valign: 'middle',
                events: optionEvents,
                formatter: optionFormatter
            }]
        });
        $("#mangerTable").bootstrapTable('load', data);

        function optionFormatter(e, value, row, index) {
            return ['<a class="removeModel" id="删除模块">', '<span id="removeModel">删除</span>', '</a>', '<a class="changeModel"  title="修改模块">', '<span id="changeModel">修改</span>', '</a>  ', ].join('');
        };

        function disCountFormatter(e, value, row, index) {
            var disCount = (value.discount) * 10
            return [
                disCount
            ].join('');
        };
    }
    window.optionEvents = {
        'click .removeModel': function(e, value, row, index) {
            layer.open({
                type: 1,
                area: ['300px', '200px'],
                title: ['删除设置', 'font-size:18px;text-align: center;'],
                content: $('.deleteDiv'),
                btn: '确定',
                yes: function(index, layero) {
                    $.post('' + http_head + '/Admin/ComSpace/Del_ComSpaceModular.ashx', {
                        "userGuid": dataManger.userGuid,
                        "ModularId": row.Id
                    }, function(data) {
                        var dataDel = JSON.parse(data);
                        if (dataDel.status == 200) {
                            loadingManger()
                        }
                    });
                    layer.closeAll()
                }
            })
        },
        'click .changeModel': function(e, value, row, index) {
            $('.modelName2').val(row.ModularName);
            $('.modelPrice2').val(row.VipPrice);
            $('#modelDescrib2').val(row.ModularDescribe)
            $('#discount').val(row.discount)
            layer.open({
                type: 1,
                area: ['800px', '500px'],
                title: ['修改功能设置', 'font-size:18px;text-align: center;'],
                content: $('.changeFunctionDiv'),
                btn: '确定',
                yes: function(index, layero) {
                    $.post('' + http_head + '/Admin/ComSpace/Update_ComSpaceModular.ashx', {
                        "userGuid": dataManger.userGuid,
                        "ModularId": row.Id,
                        "ModularName": $('.modelName2').val(),
                        "para": "VipPrice='" + $('.modelPrice2').val() + "'," + "ModularDescribe='" + $('#modelDescrib2').val() + "'," + "ModularName='" + $('.modelName2').val() + "'," + "discount='" + $('#discount').val() + "'"
                    }, function(data) {
                        var dataModel2 = JSON.parse(data);
                        if (dataModel2.status == 200) {
                            loadingManger()
                            $('.modelName2').val("");
                            $('.modelPrice2').val("");
                            $('#modelDescrib2').val("")
                        }
                    });
                    layer.closeAll()
                }
            });
        }
    }
    // 交费记录
    $('#tradeBtn').click(function() {
        arr_trade = []
        type = $('#tradeType').val()
        loadTrade(0, type)
    });

    function loadTrade(page, type) {
        $.post('' + http_head + '/ComSpace/ComSpacePayRecord/Get_ComSpacePayRecordByEQD.ashx', {
            "userGuid": dataManger.userGuid,
            "page": page,
            "orderType": type,
            "startTime": $('#tradeTime1').val(),
            "endTime": $('#tradeTime2').val()
        }, function(data) {
            var dataTable = JSON.parse(data);
            tradePage = dataTable.page;
            var dataArr = [];
            for (var i = 0; i < dataTable.items.length; i++) {
                arr_trade.push(dataTable.items[i])
            }
            if (dataTable.items.length == 0) {
                loadTradeTable(dataArr)
            } else {
                loadTradeTable(arr_trade)
                if (dataTable.items.length > 9) {
                    $('.loadMoreTrade').show()
                    $('.loadAllTrade').hide()
                } else {
                    $('.loadMoreTrade').hide()
                    $('.loadAllTrade').show()
                }
            }
        });
    }
    $('.loadMoreTrade').click(function() {
        loadTrade(tradePage, $('#tradeType').val());
    });

    function loadTradeTable(data) {
        $('#tradeTable').bootstrapTable({
            url: data,
            columns: [{
                field: 'company',
                title: '公司名称',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'OrderCode',
                title: '订单号',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'amountMondy',
                title: '缴费金额(元)',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'type',
                title: '付费方式',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'funcType',
                title: '付费内容',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'years',
                title: '付费时长(年)',
                align: 'center',
                valign: 'middle',
            }, {
                field: 'status',
                title: '是否付款',
                align: 'center',
                valign: 'middle',
                formatter: statusFormatter
            }, {
                field: 'createTime',
                title: '付费日期',
                align: 'center',
                valign: 'middle',
                formatter: payFormatter
            }]
        });
        $("#tradeTable").bootstrapTable('load', data);

        function payFormatter(e, value, row, index) {
            var timePay = value.createTime.split(" ")[0].replace(/\//g, '-')
            return [
                timePay
            ].join('');
        };

        function statusFormatter(e, value, row, index) {
            var statusPay;
            if (value.status == 1) {
                statusPay = "已付款"
            } else if (value.status == -2) {
                statusPay = "未付款"
            }
            return [
                statusPay
            ].join('');
        };
    }
})