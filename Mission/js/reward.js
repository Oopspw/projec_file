var httpUrl = sessionStorage.getItem('httpUrl');
var infversionApp = sessionStorage.getItem('infversionApp');
var userid = sessionStorage.getItem('userid');
var token = sessionStorage.getItem('token');
var taskid = sessionStorage.getItem('taskid');
var infversion_1 = "6.3";

$('.B-mask').hide();
/* 导航栏切换 */
$('.titleLi').click(function () {
    if (this.id == 'explain') {
        $(this).children().addClass('acshow');
        $(this).siblings().children().removeClass('acshow');
    } else if (this.id == 'taskShow') {
        $(this).children().addClass('acshow');
        $(this).siblings().children().removeClass('acshow');
    }
});

/* Swiper 4.0.7 */
var mySwiper = new Swiper('.swiper-container', {
    on: {
        slideNextTransitionEnd: function () {
            $("#taskShow").children().addClass('acshow');
            $("#taskShow").siblings().children().removeClass('acshow');
            $('.tast-details2').css('height', '100%');
            $("body").css('backgroundColor', '#fff');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        slidePrevTransitionEnd: function () {
            $("#explain").children().addClass('acshow');
            $("#explain").siblings().children().removeClass('acshow');
            $('.tast-details2').css('height', '12.5rem');
            $("body").css('backgroundColor', '#f7f6fb');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
    }
});

$('#explain').click(function () {
    mySwiper.slidePrev();
    $('.tast-details2').css('height', '12.5rem');
    $("body").css('backgroundColor', '#fff');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
});
$('#taskShow').click(function () {
    mySwiper.slideNext();
    $('.tast-details2').css('height', '100%');
    $("body").css('backgroundColor', '#f7f6fb');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
});　
$(".bodybox1").on("touchstart", function (e) {　　
    e.preventDefault();　　　　
    startX = e.originalEvent.changedTouches[0].pageX,
        startY = e.originalEvent.changedTouches[0].pageY;　　
});　　
$(".bodybox1").on("touchmove", function (e) {　　　　
    e.preventDefault();
    moveEndY = e.originalEvent.changedTouches[0].pageY,
        Y = moveEndY - startY;　　　　
    if (Y < 0) {　　　　　　　
        setTimeout(function() {　
            mySwiper.slideNext();
            $('.tast-details2').css('height', '100%');
            $("body").css('backgroundColor', '#f7f6fb');
            $('body').css('scrollTop', '0');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }, 500);　　　　
    }　　　　　　
});

/* 悬赏任务详情页面数据进行渲染 */
function getReardIndex() {
    $.ajax({
        type: "POST",
        url: httpUrl + "/TaskWebInterface-http/wapapi",
        data: JSON.stringify({
            userid: userid,
            token: token,
            async: false,
            taskid: taskid,
            Infversion: infversion_1,
            "Method": "QueryXuanShangDetailTaskWap"
        }),
        dataType: "json",
        success: function (obj) {
            console.log(obj);
            $('.tastTitle').text(obj.data[0].maintitle);
            $('.weTips').text(obj.data[0].subtitle);
            $('#rewardGold').text(obj.data[0].gold);
            $('#rewardDay').text(obj.data[0].resetdays);
            $('#rewardNum').text(obj.data[0].restnum);
            $('.details-content').html(obj.data[0].taskdetail);
            var status = obj.data[0].status;
            var refreshTime = obj.data[0].datediff;
            //流程图状态 按钮状态
            if (status == "-1") { //名额已满
                $('.ensure').text('名额已满').css({
                    'color': '#33be2d'
                }).css({
                    'backgroundColor': '#e6e6e6'
                }).attr('disabled', 'ture').attr('data-status', status);
            } else if (status == "0") { //尚未领取任务
                $('.ensure').text('立马参与').removeAttr('disabled').attr('data-status', status);
            } else if (status == "1") { //领取了任务还没有做
                $('.ensure').text('任务将在' + refreshTime + '之后结束').css('fontSize', '.28rem').removeAttr('disabled').attr('data-status', status);
                $(".pic-show>li:eq(0)").addClass("golden cross");
            } else if (status == "2") { //图片没上传完 
                $('.ensure').text('任务将在' + refreshTime + '之后结束').css('fontSize', '.28rem').removeAttr('disabled').attr('data-status', status);
                $(".pic-show>li:eq(0)").addClass("golden cross");
            } else if (status == "3") { //提交待审核 
                $(".pic-show>li:eq(0)").removeClass("wait").addClass("golden cross");
                $(".pic-show>li:eq(1)").removeClass("wait").addClass("golden cross").append("<style>.second::before{color:#000}</style>");
                $('.ensure').text('审核中').css({
                    'color': '#33be2d'
                }).css({
                    'backgroundColor': '#e6e6e6'
                }).attr('disabled', 'ture').attr('data-status', status);
            } else if (status == "4") { //审核失败
                $(".pic-show>li:eq(0)").removeClass("wait").addClass("golden cross");
                $(".pic-show>li:eq(1)").removeClass("wait").addClass("golden cross secondTrue");
                $(".pic-show>li:eq(2)").removeClass("wait").addClass("golden wait");
                $('.ensure').text('审核未通过,重新提交').removeAttr('disabled').attr('data-status', status);
            } else if (status == "5") { //审核通过
                $(".pic-show>li:eq(0)").addClass("golden cross");
                $(".pic-show>li:eq(1)").addClass("golden cross").append("<style>.second::before{color:#000}</style>");
                $(".pic-show>li:eq(2)").addClass("golden cross");
                $(".pic-show>li:eq(3)").addClass("golden fouthTrue");
                $('.ensure').text('审核通过').css({
                    'color': '#33be2d'
                }).css({
                    'backgroundColor': '#e6e6e6'
                }).attr('disabled', 'ture').attr('data-status', status);
            }
        },
        error: function () {},
    });
}
getReardIndex();

/* 渲染上传图片页面的数据 */
function getUpPicIndex() {
    $.ajax({
        type: "POST",
        async: false,
        url: httpUrl + "/TaskWebInterface-http/wapapi",
        data: JSON.stringify({
            userid: userid,
            token: token,
            taskid: taskid,
            Infversion: infversion_1,
            "Method": "UserCanYuXuanShangWap"
        }),
        dataType: "json",
        success: function (obj) {
            if (obj.code == "1000") {
                console.log(obj);
                $('#rewardIndex').hide();
                $('.tab-box').hide();
                $('._isStart').hide();
                $('#rewardPicIndex').show();
                //在这里增加一个判断，判断用户是首次提交还是重新提交  首次提交与重新提交的渲染使用不同的模板
                //获取状态值
                $('#kefuh').text(obj.data.weixinkefu);
                var btn_status = $('.ensure').attr('data-status');
                //console.log(btn_status);
                //根据返回的状态值进行判断选择渲染模板
                if (btn_status == '-1' || btn_status == '0' || btn_status == '1' || btn_status == '3' || btn_status == '5') {
                    var firstHtml = template("pictemplate", obj);
                    $('#picTemplate_show').append(firstHtml);
                    //定义的隐式全局变量  是第一次访问就赋值为"1"
                    _commitDegree = '1';
                    //声明一个数组（长度与data中数组对应）
                    commintimageitem = new Array(obj.data.shilituimageitem.length);
                } else if (btn_status == '2' || btn_status == '4') {
                    var secondHtml = template("_pictemplate", obj);
                    $('#picTemplate_show').append(secondHtml);
                    //定义的隐式全局变量  非第一次访问就赋值为"2"
                    _commitDegree = '2';
                    var k = obj.data.commintimageitem;
                    //声明一个数组（长度与data中数组对应）
                    commintimageitem = new Array(obj.data.commintimageitem.length);
                    //对data中的 imageitem 数组进行遍历，判断图片的状态
                    for (var i = 0; i < k.length; i++) {
                        if (k[i].userimagestatus == "0") {
                            var picObj = {};
                            picObj.userimageid = k[i].id;
                            picObj.usertemplateid = k[i].usertemplateid;
                            picObj.userimage = k[i].userimage;
                            commintimageitem.splice(i, 1, picObj);
                        } else if (k[i].userimagestatus == "1") {
                            commintimageitem.splice(i, 1, '');
                        }
                    }
                    console.log(commintimageitem);
                }
            } else if (obj.code == "1200") {
                $('.ensure').text('名额已满').css({
                    'color': '#33be2d'
                }).css({
                    'backgroundColor': '#e6e6e6'
                }).attr('disabled', 'ture');
                $('#rewardNum').text('0');
            }
        },
        error: function () {

        },
    });
}

//进入上传图片
$('.ensure').click(function () {
    getUpPicIndex();
    //console.log(commintimageitem);
});

//图片放大效果
function OpenPic(index) {
    $("#picTemplate_show").on("click", "#imgTest" + index, function () {
        $('.show-big' + index).show().on('touchmove', function (event) {
            event.preventDefault();
        }, false);
        $('.mask').show().on('touchmove', function (event) {
            event.preventDefault();
        }, false);
        $('.imgBig' + index).css('left', ($(window).width() - $('.imgBig' + index).width()) / 2);
    $('.imgBig' + index).css('top', ($(window).height() - $('.imgBig' + index).height()) / 2);
    });
}
//点击后隐藏遮罩层
function HidethisPic() {
    $('.ImgZoomInImage').hide();
    $('.mask').hide();
}

function addArray(index, array, obj) {
    array.splice(index, 1, obj);
    return array;
}

//首次进行图片上传
function previewImage(file, index) {
    var _indexs = ($('#upPic' + index).attr("data-index")) * 1;
    console.log(_indexs);
    if (_indexs === 5) {
        $('.mask').show();
        $('.warn-alert').show();
        _indexs++;
        $('#upPic' + index).attr("data-index", _indexs);
    }
    $('#upPic' + index).attr('disabled', 'true');
    var reader = new FileReader();
    reader.readAsDataURL(file.files[0]);
    reader.onload = function (evt) {
        var picObj = {};
        var img = new Image,
            width = 750,
            height = 750,
            quality = 1,
            canvas = document.createElement("canvas"),
            context = canvas.getContext("2d");
        img.src = evt.target.result;
        img.onload = function () {
            canvas.width = height * (img.height / img.width);
            canvas.height = width * (img.height / img.width);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = canvas.toDataURL("image/jpeg", quality);
            img.onload = null;
            picObj.userimage = img.src;
            picObj.userimageid = $('#upPic' + index).attr("data-id");
            picObj.usertemplateid = $('#upPic' + index).attr("data-templateid");
            $('.warn-box' + index).hide();
            $('.upbox' + index).show().css('background', 'url(' + evt.target.result + ')').css('backgroundSize', 'cover').removeClass('upbox').css('backgroundRepeat', 'no-repeat');
            commintimageitem.splice(index - 1, 1, picObj);
            $('#commit').attr('disabled', 'true');
            $.ajax({
                type: "POST",
                url: httpUrl + "/TaskWebInterface-http/wapapi",
                data: JSON.stringify({
                    userid: userid,
                    token: token,
                    taskid: taskid,
                    commintstatus: '0',
                    Infversion: infversion_1,
                    userimage: picObj.userimage,
                    userimageid: picObj.userimageid,
                    usertemplateid: picObj.usertemplateid,
                    "Method": "CommintXuanShangTaskWap"
                }),
                dataType: "json",
                success: function (obj) {
                    if (obj.data == "") {
                        $('#upPic' + index).attr("data-id", 0);
                    } else {
                        $('#upPic' + index).attr("data-id", obj.data.userimageid);
                    }
                    $('#commit').removeAttr('disabled');
                    $('#upPic' + index).removeAttr('disabled');
                    _indexs++;
                    $('#upPic' + index).attr("data-index", _indexs);

                },
                error: function () {
                    $('#commit').text('第' + index + '图片上传失败').removeAttr('disabled');
                    $('#upPic' + index).removeAttr('disabled');

                },
            });
            return img.src;
        };
    };
}


function changeImage(file, index) {
    var _indexs = ($('#upPic' + index).attr("data-index")) * 1;
    console.log(_indexs);
    if (_indexs === 5) {
        $('.mask').show();
        $('.warn-alert').show();
        _indexs++;
        $('#upPic' + index).attr("data-index", _indexs);
    }
    $('#upPic' + index).attr('disabled', 'true');
    var reader = new FileReader();
    reader.readAsDataURL(file.files[0]);
    reader.onload = function (evt) {
        var picObj = {};
        var img = new Image,
            width = 750,
            height = 750,
            quality = 1,
            canvas = document.createElement("canvas"),
            context = canvas.getContext("2d");
        img.src = evt.target.result;
        img.onload = function () {
            canvas.width = height * (img.height / img.width);
            canvas.height = width * (img.height / img.width);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = canvas.toDataURL("image/jpeg", quality);
            img.onload = null;
            picObj.userimage = img.src;
            picObj.userimageid = $('#upPic' + index).attr("data-userimageid");
            picObj.usertemplateid = $('#upPic' + index).attr("data-usertemplateid");
            $('.warn-box' + index).hide();
            $('.upbox' + index).show().css('background', 'url(' + evt.target.result + ')').css('backgroundSize', 'cover').removeClass('upbox').css('backgroundRepeat', 'no-repeat');
            addArray(index - 1, commintimageitem, picObj);
            $('#commit').attr('disabled', 'true');
            $.ajax({
                type: "POST",
                url: httpUrl + "/TaskWebInterface-http/wapapi",
                data: JSON.stringify({
                    userid: userid,
                    token: token,
                    taskid: taskid,
                    commintstatus: '0',
                    Infversion: infversion_1,
                    userimage: picObj.userimage,
                    userimageid: picObj.userimageid,
                    usertemplateid: picObj.usertemplateid,
                    "Method": "CommintXuanShangTaskWap"
                }),
                dataType: "json",
                success: function (obj) {
                    console.log(obj);
                    $('#commit').text("提交审核").removeAttr('disabled');
                    $('#upPic' + index).removeAttr('disabled');
                    _indexs++;
                    $('#upPic' + index).attr("data-index", _indexs);
                },
                error: function () {
                    $('#commit').text('第' + index + '图片上传失败').removeAttr('disabled');
                    $('#upPic' + index).removeAttr('disabled');
                },
            });
            return img.src;
        };
    };
}


//截取掉数组中的空字符串
function trimSpace(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == "" || typeof (array[i]) == "undefined") {
            array.splice(i, 1);
            i = i - 1;
        }
    }
    return array;
}

// 图片提交
function getCommitPic() {
    $.ajax({
        type: "POST",
        url: httpUrl + "/TaskWebInterface-http/wapapi",
        data: JSON.stringify({
            userid: userid,
            token: token,
            taskid: taskid,
            commintstatus: '1',
            Infversion: infversion_1,
            "Method": "CommintXuanShangTaskWap"
        }),
        dataType: "json",
        success: function (obj) {
            console.log(obj);
            $('.mask').show();
            $('.commit-alert').show();
        },
        error: function () {},
    });
}

//进行提交
var _commitflag = true;
$('#commit').click(function () {
    console.log(commintimageitem);
    console.log(_commitDegree);
    var commitFlag = false;
    for (var i = 0; i < commintimageitem.length; i++) {
        if ((typeof commintimageitem[i]) == 'undefined') {
            $('.mask').show();
            $('.pic-alert').show();
            return false;
        } else {
            commitFlag = true;
        }
    }

    if (commitFlag) {
        $(this).text("提交审核中···").attr('disabled', 'true');
        if (_commitflag) {
            getCommitPic();
            _commitflag = false;
        }
    }
});

// 图片未上传完的弹框显示
$('#inspect-btn').click(function () {
    $('.mask').hide();
    $('.pic-alert').hide();
});

// 图片上传成功的提示框
$('#commit-accept-btn').click(function () {
    $('.mask').hide();
    $('.commit-alert').hide();
    window.location.reload();
});

$('#accept-btn').click(function () {
    $('.mask').hide();
    $('.warn-alert').hide();
})