;
(() => {
	'use strict';
	let timeBar = document.getElementById('time-bar'),
		userBar = document.getElementById('user-bar'),
		carsBtn = document.getElementById('cars-mes'),
		userBtn = document.getElementById('users-mes'),
		mainBtn = document.getElementById('main-mes'),
		change = document.getElementById('change');
	let is = {
			carsBtn: false,
			userBtn: false,
			mainBtn: false,
			timeout: null
		},
		now = null,
		all = null;
	let submit = document.createElement('div');
	submit.setAttribute('class', '_btn');
	submit.setAttribute('style',
		`line-height:16px;padding:3px;margin:0;border-radius:10px;top:22px;right:20px;position:fixed;z-index:1000;`);
	submit.innerHTML = `提交所有内容修改与更新`;
	document.body.appendChild(submit);

	const ajax = (url, methods = 'get', dataString = null) => {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open(methods, url);
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.responseText));
					} else {
						reject();
					}
				}
			};
			methods === 'get' ? xhr.send(null) : dataString === null ? xhr.send('null') : xhr.send(dataString);
		});
	};
	timeBar.innerHTML = ` 登录时间: ${new Date().toLocaleString()}`;

	const getNowAndAll = (callback = null) => {
		ajax(`${window.location.origin}/api/users`, 'post')
			.then((data) => {
				let index = document.cookie.replace('index=', '');
				for (let i = 0; i < data.length; i++) {
					if (data[i]._id === index) {
						now = data[i];
						break;
					}
				}
				if (userBar.innerHTML === ``) { //第一次发起请求
					userBar.innerHTML = `${now.username}`;
					if (now.primary_account) {
						//alert(`您好!该账户是小区物业账号,欢迎登陆`);
						all = data;
					} else {
						//alert(`您好!该账户是小区业主账号,欢迎登陆`);
					}
				} else { //非第一次发起请求
					if (now.primary_account) {
						all = data;
					}
				}
				console.info(now, all instanceof Array, all);
				if (callback !== null) {
					callback();
				}
			}, () => {
				console.info(`响应错误`);
			});
	};
	getNowAndAll();

	//车辆信息管理逻辑处理
	const carsBtnDoCore = () => {
		if (now.primary_account) {
			let str = ``;
			for (let i = 0; i < all.length; i++) {
				for (let j = 0; j < all[i].cars.length; j++) {
					str +=
						`
						<tr>
							<td>${all[i].cars[j].place}<br><input name="${all[i].username}$place$${all[i].cars[j]._id}" class="target_input" placeholder="输入内容修改"/></td>
							<td>${all[i].cars[j].number}<br><input name="${all[i].username}$number$${all[i].cars[j]._id}" class="target_input" placeholder="输入内容修改"/></td>
							<td>${all[i].cars[j].color}<br><input name="${all[i].username}$color$${all[i].cars[j]._id}" class="target_input" placeholder="输入内容修改"/></td>
							<td>${all[i].cars[j].type}<br><input name="${all[i].username}$type$${all[i].cars[j]._id}" class="target_input" placeholder="输入内容修改"/></td>
							<td>${all[i].cars[j].date}<br><input name="${all[i].username}$date$${all[i].cars[j]._id}" class="target_input" placeholder="输入内容修改"/></td>
							<td class="mm">${all[i].username}</td>
							<td class="mm">${all[i].phone_num}</td>
						</tr>
						`;
				}
			}
			change.innerHTML =
				`
				<table>
					<thead>
						<tr>
							<th class="w14">车位号</th>
							<th class="w14">车牌号</th>
							<th class="w14">车辆颜色</th>
							<th class="w14">车辆型号</th>
							<th class="w14">登记日期</th>
							<th class="w14">车主</th>
							<th class="w14">联系号码</th>
						</tr>
					</thead>
					<tbody>
						${str}
					</tbody>
				</table>
				`;
		} else {
			let str = '';
			for (let j = 0; j < now.cars.length; j++) {
				str +=
					`
					<tr>
						<td class="mm">${now.cars[j].place}</td>
						<td>${now.cars[j].number}<br><input name="${now.username}$number$${now.cars[j]._id}" class="target_input" placeholder="输入内容修改"/></td>
						<td>${now.cars[j].color}<br><input name="${now.username}$color$${now.cars[j]._id}" class="target_input" placeholder="输入内容修改"/></td>
						<td>${now.cars[j].type}<br><input name="${now.username}$type$${now.cars[j]._id}" class="target_input" placeholder="输入内容修改"/></td>
						<td>${now.cars[j].date}<br><input name="${now.username}$date$${now.cars[j]._id}" class="target_input" placeholder="输入内容修改"/></td>
					</tr>
					`;
			}
			change.innerHTML =
				`<div class="foot">新增车辆数据时,其它表单内的数据如果存在,默认不提交</div>
				<table>
					<thead>
						<tr>
							<th class="w20">车位号</th>
							<th class="w20">车牌号</th>
							<th class="w20">车辆颜色</th>
							<th class="w20">车辆型号</th>
							<th class="w20">登记日期</th>
						</tr>
					</thead>
					<tfoot><tr><td><input name="${now.username}$is_add" class="target_input_" placeholder="输入'ADD'新增车辆"/></td></tr></tfoot>
					<tbody>
						${str}
					</tbody>
				</table>
				`;
		}
	};
	const carsBtnDo = () => {
		if (!is.carsBtn) {
			is.carsBtn = true;
			carsBtn.style.background = `#FF1493`;
			if (is.userBtn) {
				is.userBtn = false;
				userBtn.style.background = ``;
			}
			if (is.mainBtn) {
				is.mainBtn = false;
				mainBtn.style.background = ``;
			}
			requestAnimationFrame(() => {
				/* 业务逻辑 */
				/* console.info(1); */
				carsBtnDoCore();
			});
		}
	};

	// 车主信息管理逻辑处理
	const userBtnDoCore = () => {
		let common =
			`<table><thead><tr><th class="w25">车主姓名</th><th class="w25">拥有车辆数</th><th class="w25">联系号码</th><th class="w25">小区住址</th></tr></thead>`;
		if (now.primary_account) {
			let str = ``;
			for (let i = 0; i < all.length; i++) {
				str +=
					`<tr>
						<td class="mm">${all[i].username}</td>
						<td class="mm">${all[i].cars.length}</td>
						<td>${all[i].phone_num}<br><input name="${all[i].username}$phone_num" class="target_input" placeholder="输入内容修改"/></td>
						<td>${all[i].address}<br><input name="${all[i].username}$address" class="target_input" placeholder="输入内容修改"/></td>
					</tr>
					`;
			}
			change.innerHTML =
				`${common}
					<tbody>${str}</tbody></table>
				`;
		} else {
			change.innerHTML =
				`${common}<tbody>
						<tr>
							<td class="mm">${now.username}</td>
							<td class="mm">${now.cars.length}</td>
							<td>${now.phone_num}<br><input name="${now.username}$phone_num" class="target_input" placeholder="输入内容修改"/></td>
							<td>${now.address}<br><input name="${now.username}$address" class="target_input" placeholder="输入内容修改"/></td>
						</tr>
					</tbody></table>
				`;
		}
	};
	const userBtnDo = () => {
		if (!is.userBtn) {
			is.userBtn = true;
			userBtn.style.background = `#FF1493`;
			if (is.carsBtn) {
				is.carsBtn = false;
				carsBtn.style.background = ``;
			}
			if (is.mainBtn) {
				is.mainBtn = false;
				mainBtn.style.background = ``;
			}
			requestAnimationFrame(() => {
				/* 业务逻辑 */
				/* console.info(2); */
				userBtnDoCore();
			});
		}
	};

	//管理员管理逻辑处理
	const mainBtnDoCore = () => {
		if (now.primary_account) {
			let str = ``;
			for (let i = 0; i < all.length; i++) {
				if (all[i].primary_account) {
					str +=
						`<tr>
							<td class="mm">${all[i].username}</td>
							<td class="mm">${all[i].password}</td>
						</tr>
						`;
				} else {
					str +=
						`<tr>
							<td>${all[i].username}<br><input name="${all[i].username}$del" class="target_input" placeholder="输入'OK'则删除此账号"/></td>
							<td class="mm">${all[i].password}</td>
						</tr>
						`;
				}
			}
			change.innerHTML =
				`<table><thead><tr><th class="w50">登录账号名</th><th class="w50">该账号登录密码(不明文显示)</th></tr></thead>
					<tbody>${str}</tbody></table>
				`;
		} else {
			change.innerHTML = `<div class="no">您当前账号无此权限</div>`;
		}
	};
	const mainBtnDo = () => {
		if (!is.mainBtn) {
			is.mainBtn = true;
			mainBtn.style.background = `#FF1493`;
			if (is.userBtn) {
				is.userBtn = false;
				userBtn.style.background = ``;
			}
			if (is.carsBtn) {
				is.carsBtn = false;
				carsBtn.style.background = ``;
			}
			requestAnimationFrame(() => {
				/* 业务逻辑 */
				/* console.info(3); */
				mainBtnDoCore();
			});
		}
	};

	//数据提交
	const submitDoCore = (inputs, sign) => {
		let obj = {};
		for (let i = 0; i < inputs.length; i++) {
			if (sign === 'del' || sign === 'is_add') { //del is_add
				if (sign === 'del') {
					if (inputs[i].value === 'OK') {
						obj[inputs[i].name] = '';
					}
				} else {
					if (inputs[i].name.split('$')[1] === 'is_add') {
						if (inputs[i].value === 'ADD') {
							obj[inputs[i].name] = '';
							/* 
							 *	{
							 *		...$is_add$... : '' 
							 *	}
							 */
						}
					} else {
						if (inputs[i].value !== '') {
							obj[inputs[i].name] = inputs[i].value;
						}
					}
				}
			} else { //phone_num address number color type date place
				if (inputs[i].value !== '') {
					obj[inputs[i].name] = inputs[i].value;
				}
			}
		}
		obj = JSON.stringify(obj);
		/* console.info(obj); */
		if (obj === '{}') {
			return;
		}
		let fn = (url, func) => {
			ajax(`${window.location.origin}/api/${url}`, 'post', obj)
				.then((data) => {
					if (data.ok) {
						getNowAndAll(() => {
							func();
							alert('数据更新成功');
						});
					} else {
						//alert('网络问题,请重试');
					}
				}, () => {
					console.info(`响应错误`);
				});
		};

		if (sign !== 'del') {
			if (sign === 'phone_num' || sign === 'address') { //phone_num address
				fn(`changes`, userBtnDoCore);
			} else { //number color type date place is_add
				fn(`cars`, carsBtnDoCore);
			}
		} else { //del
			fn(`changes`, mainBtnDoCore);
		}


	};
	const submitDo = () => {
		if (is.timeout === null) {
			/* 业务逻辑 */
			let inputs = document.querySelectorAll('#change table input');
			/* console.info(4); */
			if (inputs.length === 0) {
				return;
			}
			let sign = inputs[0].name.split('$')[1];
			submitDoCore(inputs, sign);
			submit.style.background = `#FF1493`;
			submit.innerHTML = `向数据库提交...`;

			is.timeout = setTimeout(() => {
				clearTimeout(is.timeout);
				is.timeout = null;
				submit.innerHTML = `提交所有内容修改与更新`;
				submit.style.background = ``;
			}, 5000);
		} else {
			if (submit.innerHTML === `向数据库提交...`) {
				submit.innerHTML = '请等待至少5秒...';
			}
		}
	};

	window.addEventListener('click', (e) => {
		switch (e.target) {
			case carsBtn:
				carsBtnDo();
				break;
			case userBtn:
				userBtnDo();
				break;
			case mainBtn:
				mainBtnDo();
				break;
			case submit:
				submitDo();
				break;
			default:
				;
		}
	}, false);
})();
