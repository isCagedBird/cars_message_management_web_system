;
(() => {
	'use strict';
	let contain = document.getElementById('contain'),
		login = document.getElementById('login'),
		register = document.getElementById('register');
	let flag = true;
	login.style.background = 'palevioletred';

	window.addEventListener('click', (e) => {
		if (e.target === register) {
			if (flag) {
				contain.innerHTML =
					`
					<form action="/register" method="post">
						<div class="lite">
							<label>是否设为小区物业账号(主账号)?</label><br>
							<input name="isMain" type="radio" checked value="no">否
							<input name="isMain" type="radio" value="yes">是
						</div>
						<div class="lite">请滚动以获得更多内容</div>
						<input class="common" type="text" name="username" placeholder="登录账号(必填)" />
						<p>账号名中不能含有 $ 字符</p>
						<p>若存在,默认会被空字符串替代</p>
						<input class="middle common" type="text" name="password" placeholder="登录密码(必填)" />
						<input class="middle common" type="text" name="address" placeholder="小区住址(必填)" />
						<input class="middle common" type="text" name="phone_num" placeholder="联系号码(必填)" />
						<input class="common" type="submit" value="点击注册" />
					</form>
					`;
				register.style.background = 'palevioletred';
				login.style.background = '';
				flag = false;
			} else {
				alert('已经在注册页了');
			}
		} else if (e.target === login) {
			if (flag) {
				alert('已经在登录页了');
			} else {
				contain.innerHTML =
					`
					<form action="/login" method="post">
						<input class="common" type="text" name="username" placeholder="登录账号" />
						<input class="middle common" type="text" name="password" placeholder="登录密码" />
						<input class="common" type="submit" value="点击登录" />
					</form>
				`;
				login.style.background = 'palevioletred';
				register.style.background = '';
				flag = true;
			}
		}
	}, false);

})();
