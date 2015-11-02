/**
 * Created by truemenhale on 15/9/13.
 */
var billInfoUrl = "./api/index.php?s=/Home/Account/billInfo";
var phone = "";


setTimeout(function(){
	$.ajax({
		type : 'POST',
		url  : billInfoUrl,
		data : 'openid='+openid,
		dataType : 'json',
		error: function (request) {
			alert('获取失败')
		} ,
		success : function (response) {
			var status = response.status;
			var data = response.data;
			if (status != 0) {
				alert("你还没有注册，将自动跳转到注册页面！");
				window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcb5b14c964fadb27&redirect_uri=http%3a%2f%2fwx.tyll.net.cn%2fDingdingCat%2fregister.php&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
			} else {
				document.getElementById('billTotal').innerText=data.total+'元';
				document.getElementById('billUsed').innerText=data.used+'元';
				document.getElementById('billUnUse').innerText=data.unuse+'元';
				phone = data.phone;
			}

		}
	})
},100);

$(function () {
	$('.getAddress').on('tap',function(){
		var _data = {};
		_data.phone = phone;
		_data.money = $('.ApplyNum').val();
		_data.addr  = $('.getAddress').val();
		$.ajax({
			type : 'POST',
			url  : './api/index.php?s=/Home/Account/applyBill',
			data : _data,
			dataType : 'json',
			error : function (request) {
				alert('服务器连接失败');
			},
			success : function (response) {
				var status = response.status;
				if (status >= 0) {
					alert('发票申请成功请等候收件！');
				} else {
					alert('发票申请失败，请正确填写申请金额！');
				}
			}
		});

	})
});