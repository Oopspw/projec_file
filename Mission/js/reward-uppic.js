/* 
 *2017-12-14 增加app返回键函数调用的操作

 */
$('.B-mask').hide();
//点击图片放大
$.fn.ImgZoomIn = function () {
    bgstr = '<div id="ImgZoomInBG" style=" background:#000000; filter:Alpha(Opacity=70); opacity:0.7; position:fixed; left:0; top:0; z-index:10000; width:100%; height:100%; display:none;"><iframe src="about:blank" frameborder="5px" scrolling="yes" style="width:100%; height:100%;"></iframe></div>';
    imgstr = '<img id="ImgZoomInImage" src="' + $(this).attr('src') + '" onclick=$(\'#ImgZoomInImage\').hide();$(\'#ImgZoomInBG\').hide(); style="cursor:pointer; display:none; position:absolute; z-index:10001;width:7rem;"/>';
    if ($('#ImgZoomInBG').length < 1) {
        $('body').append(bgstr);
    }
    if ($('#ImgZoomInImage').length < 1) {
        $('body').append(imgstr);
    } else {
        $('#ImgZoomInImage').attr('src', $(this).attr('src'));
    }
    $('#ImgZoomInImage').css('left', $(window).scrollLeft() + ($(window).width() - $('#ImgZoomInImage').width()) / 2);
    $('#ImgZoomInImage').css('top', $(window).scrollTop() + ($(window).height() - $('#ImgZoomInImage').height()) / 2);
    $('#ImgZoomInBG').show();
    $('#ImgZoomInImage').show();
};

$(document).ready(function () {
    $("#imgTest1").bind("click", function () {
        $(this).ImgZoomIn();
    });
    $("#imgTest2").bind("click", function () {
        $(this).ImgZoomIn();
    });
    $("#imgTest3").bind("click", function () {
        $(this).ImgZoomIn();
    });
    $("#imgTest4").bind("click", function () {
        $(this).ImgZoomIn();
    });
});
//图片上传
var arrPic = [];
var mlength = 3;
for (var i = 0; i < mlength; i++) {
    arrPic.push(0);
};
console.log(arrPic);
// var myObj = {};

function previewImage(file) {
    var fileid = file.id;
    if (file.size > 2097152) {
        alert("上传图片请小于2M");
        return false;
    }
    for (var i = 0; i < file.files.length; i++) {
        if (file.files && file.files[i]) {
            var reader = new FileReader();
            reader.onload = function (evt) {
                var filePic = evt.target.result;
                if (fileid == '1') {
                    $('.warn-box1').hide();
                    $('.upbox1').show().css('background', 'url(' + evt.target.result + ')').css('backgroundSize', 'cover').removeClass('upbox').css('backgroundRepeat', 'no-repeat');
                    arrPic.splice(0, 1, filePic);
                    // myObj.file1 = filePic;
                    // console.log(myObj);
                } else if (fileid == '2') {
                    $('.warn-box2').hide();
                    $('.upbox2').show().css('background', 'url(' + evt.target.result + ')').css('backgroundSize', 'cover').removeClass('upbox').css('backgroundRepeat', 'no-repeat');
                    arrPic.splice(1, 1, filePic);
                    // myObj.file3 = filePic;
                    // console.log(myObj);
                } else if (fileid == '3') {
                    $('.warn-box3').hide();
                    $('.upbox3').show().css('background', 'url(' + evt.target.result + ')').css('backgroundSize', 'cover').removeClass('upbox').css('backgroundRepeat', 'no-repeat');
                    arrPic.splice(2, 1, filePic);
                    // myObj.file2 = filePic;
                    // console.log(myObj);
                }
                console.log(arrPic);
            };
            reader.readAsDataURL(file.files[i]);
            console.log(file.files[i]);
        }
    }
}


//点击提交的操作
$('#commit').click(function () {
    var commitFlag = false;
    for (var i = 0; i < arrPic.length; i++) {
        if (arrPic[i] == 0) {
            commitFlag = false;
        } else if (arrPic[0] != 0 && arrPic[1] != 0 && arrPic[2] != 0 && arrPic[3] != 0 && arrPic[4] != 0) {
            commitFlag = true;
        }
    }
    if (!commitFlag) {
        $('.mask').show();
        $('.pic-alert').show();
    } else {
        $(this).text("图片上传中···").attr('disabled', 'true');
        console.log(arrPic);
        $('.mask').show();
        $('.commit-alert').show();
    }
});

$('#inspect-btn').click(function () {
    $('.mask').hide();
    $('.pic-alert').hide();
});

$('#commit-accept-btn').click(function () {
    $('.mask').hide();
    $('.commit-alert').hide();
    location.href = "reward.html";
});


/* app返回键触发 */
function popupWindow() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        returnkeyToIos('no', 'yes');
        refreshWindow('yes');
    } else if (/(Android)/i.test(navigator.userAgent)) {
        returnkeyToAndroid('no', '');
    }
}