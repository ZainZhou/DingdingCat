
var _url = self.location.href;
if(_url.indexOf("?")>0){
    var openid = _url.substr(_url.indexOf("?")+1,_url.length-_url.indexOf("?"));
}
var pic1 = "";
var pic2 = "";
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
$(function () {
    if(getCookie("flag") == 500){
        time = parseInt(getCookie('time'));
        _this = $('.ApplyBtn');
        _this.html("等待"+time+"秒后重新发送");
        _this.css({"color":"#ccc","text-shadow":"none"});
        var timer = setInterval(function(){
            time--;
            document.cookie = "time = "+time;
            if(time <= 0){
                _this.html("获取验证码");
                _this.css({"color":"#fff","text-shadow":"inset"});
                document.cookie = "flag = true";
                clearInterval(timer);
                return;
            }
            _this.html("等待"+time+"秒后重新发送");
        },1000);

    }
    $('.ApplyBtn').on('tap',function(){
        var _this = $(this);
        if(getCookie("flag") == "true"||!getCookie("flag")){
            document.cookie = "flag = true";
            document.cookie = "time = "+5;
            if($('#phoneNum').val().length != 11){
                alert('请输入正确的手机号！');
                return;
            }
            $.post('./api/index.php?s=/Home/Account/codeSend','phone='+$('.phoneNum').val(),function(data){

            });
            time = parseInt(getCookie('time'));
            document.cookie = "flag = false";
        }
        if(getCookie("flag") == "false"){
            _this.html("等待"+time+"秒后重新发送");
            _this.css({"color":"#ccc","text-shadow":"none"});
            var timer = setInterval(function(){
                time--;
                document.cookie = "time = "+time;
                if(time == 0){
                    _this.html("获取验证码");
                    _this.css({"color":"#fff","text-shadow":"inset"});
                    document.cookie = "flag = true";
                    clearInterval(timer);
                    return;
                }
                _this.html("等待"+time+"秒后重新发送");
            },1000);
            document.cookie = "flag = "+500;
        }
    });
    $('#idCardPic1').change(function (){
        var f = $(this).val();
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = function (e) {
            pic1 = e.target.result;
        }
    });
    $('#idCardPic2').change(function (){
        var f = $(this).val();
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = function (e) {
            pic2 = e.target.result;
        }
    });

    $('.registerBtn').on('tap',function(){
        $.mobile.loading('show');
        $(this).button('option','disabled',true);
        var _data = {};
        _data.name = $('.usrName').val();
        _data.phone = $('.phoneNum').val();
        _data.idCardNo = $('.idCard').val();
        _data.code = $('.ConfirmCode').val();
        _data.trandsportType = $(".transport option:selected").val();
        _data.idCardPic1 = pic1;
        _data.idCardPic2 = pic2;
        $.post('./api/index.php?s=/Home/Order/buyAccept',_data,function(data){
            if (data) {
                var status = data.status;
                if (status != 0) {
                    alert('报名失败，可能是服务器出故障了');
                } else {
                    alert('报名成功，请等待审批');
                }
            } else {
                alert("报名失败!未连接到服务器！");
            }
            $.mobile.loading('hide');
        });
    });
});