let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let path = require('path');

let app = express();
let config = require('./config');
let db = require('./tools/database');
let find = require('./tools/find');
let update = require('./tools/update');
let _delete = require('./tools/delete');
let tools = require('./tools/rw');

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'tools/all_will_use_scripts')));

app.all('*', (req, res, next) => {
	// res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

//mongoose.Promise = global.Promise;

//连接MongoDB数据库
mongoose.connect(`${config.databaseS}${config.domain}${config.databaseE}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err) => {
		if (err) {
			console.info(`数据库${config.databaseS}${config.domain}${config.databaseE}连接失败`);
		} else {
			console.info(`数据库${config.databaseS}${config.domain}${config.databaseE}连接成功`);
		}
	});

// app.get('/', (req, res) => {
// });

//处理注册请求代码逻辑
app.post('/register', (req, res) => {
	console.info(req.body);
	let fn = () => {
		res.send(
			'<span style="display:block;margin:100px auto;text-align:center;font-size:20px;">请回退到登陆注册页面</span>');
	};
	req.body.username = req.body.username.replace(/\$/g, '');
	if (req.body.username === '' || req.body.password === '' || req.body.address === '' || req.body.phone_num === '') {
		fn();
		return;
	}

	let Users = db.Users;
	find(Users, {
			username: req.body.username
		})
		.then((data) => {
			console.info(data.length, data);
			let flag = false;
			for (let i = 0; i < data.length; i++) { //约束条件下length恒为1
				if (data[i].username === req.body.username) {
					flag = true;
					break;
				}
			}
			return flag ? Promise.reject('当前登陆账号名已存在') : Promise.resolve();
		}, (err) => {
			console.info('查数据失败', err);
		})
		.then(() => {
			const fn = (_boolean) => {
				new Users({
					username: req.body.username,
					password: req.body.password,
					address: req.body.address,
					phone_num: req.body.phone_num,
					primary_account: _boolean,
					cars: [{
						place: '[初始化值]',
						number: '[初始化值]',
						color: '[初始化值]',
						type: '[初始化值]',
						date: '[初始化值]'
					}]
				}).save((err) => {
					if (err) {
						console.info('存数据失败', err);
					} else {
						console.info('存数据成功');
					}
				});
			};
			//	保证只能有一个物业账号
			if (req.body.isMain === 'yes') {
				find(db.Users, {
						primary_account: true
					})
					.then((data) => {
						data.length === 0 ? fn(true) : fn(false);
					}, (err) => {
						console.info('查数据失败', err);
					});
			} else {
				fn(false);
			}
		}, (mes) => {
			console.info(mes);
		});
	fn();
});
//处理登陆请求代码逻辑
//	只有在用户(小区业主账号或者是小区物业账号)登陆后才会展现车辆信息管理的内容
//	否则只能停留在登陆注册页面
app.post('/login', (req, res) => {
	/* console.info(req.body); */
	let fn = (a = ``) => {
		if (a === '') {
			res.send(
				`<span style="display:block;margin:100px auto;text-align:center;font-size:20px;">此账户不存在或密码错误,请回退到登陆注册页面重试</span>`
			);
		} else {
			res.send(
				`<span style="display:block;margin:100px auto;text-align:center;font-size:20px;">${a},请回退到登陆注册页面重试</span>`
			);
		}
	};

	let Users = db.Users;
	find(Users, {
			username: req.body.username
		})
		.then((data) => {
			let flag = false;
			/* console.info(data.length, data); */
			for (let i = 0; i < data.length; i++) { //约束条件下length值永恒为1
				if (data[i].username === req.body.username) {
					if (data[i].password === req.body.password) {
						flag = true;
						break;
					}
				}
			}
			return new Promise((resolve, reject) => {
				if (!flag) {
					reject();
				} else {
					find(Users, {})
						.then((result) => {
							let index = null;
							for (let i = 0; i < result.length; i++) {
								if (result[i].username === req.body.username) {
									/* 
									 *	在浏览器端JS,_id是String类型,无法使用原型链上的toString方法
									 * 	在node环境,_id是Object类型,可以使用该方法
									 */
									/* index = req.body._id.toString(); */
									index = result[i]._id.toString();
									break;
								}
							}
							resolve(index);
						}, (err) => {
							reject(`数据库空`);
						});
				}
			});
		}, (err) => {
			fn();
			console.info('查数据失败', err);
		})
		.then((index) => {
			//进入此作用域则说明账户名及密码正确,渲染登陆后的界面来
			//设置cookie
			res.cookie("index", `${index}`, {
				path: `/login`, //cookie 设置在当前路径下有效果
				httpOnly: false
			});
			tools.pReadFile('/views/content.html')
				.then((content_html) => {
					res.send(content_html);
				})
				.catch((err) => {
					res.send(err);
				});
		}, (mes) => {
			fn(mes);
		});
});


//api接口代码逻辑处理
app.post('/api/users', (req, res) => {
	new Promise((resolve, reject) => {
		req.on('data', (data) => {
			resolve(JSON.parse(data.toString()));
		});
	}).then((data) => {
		/* console.info(data === null, data, typeof data); */
		if (data === null) {
			//客户端发起post请求未携带数据时
			let Users = db.Users;
			find(Users, {})
				.then((data) => {
					for (let i = 0; i < data.length; i++) {
						/* data[i]._id = null; */
						data[i].__v = null;
						data[i].password = `********`;
					}
					res.send(data);
				}, (err) => {
					console.info('查数据失败', err);
				});
		}
	});
});

app.post('/api/changes', (req, res) => {
	new Promise((resolve, reject) => {
		req.on('data', (data) => {
			resolve(JSON.parse(data.toString()));
		});
	}).then((data) => {
		/* console.info(data === null, data, typeof data); */
		let is = false;
		for (let i in data) {
			if (data.hasOwnProperty(i)) {
				if (i.split('$')[1] === 'del') {
					is = true;
				}
				break;
			}
		}
		let _core = (mes, arr) => {
			Promise.all(arr)
				.then((result) => {
					/* console.info(result); */
					let ok = true;
					for (let i = 0; i < result.length; i++) {
						if (result[i].ok !== 1) {
							ok = false;
							break;
						}
					}
					res.send({
						ok
					});
				})
				.catch((err) => {
					console.info(mes, err);
					res.send({
						ok: false
					});
				});
		};

		if (!is) { // phone_num address
			let arr = [];
			for (let i in data) { //逐个更新,后续改进为一次全部更新
				if (data.hasOwnProperty(i)) {
					let a = i.split('$');
					arr.push(
						update(db.Users, {
							username: a[0]
						}, {
							[a[1]]: data[i]
						})
					);
				}
			}
			_core('更新数据失败: ', arr);
		} else { // del 这里是全部都是del的情况
			let arr = [];
			for (let i in data) { //逐个更新,后续改进为一次全部更新
				if (data.hasOwnProperty(i)) {
					let a = i.split('$');
					arr.push(
						_delete(db.Users, {
							username: a[0]
						})
					);
				}
			}
			_core('删除数据失败: ', arr);
		}
	});
});
//车辆信息的ajax接口
app.post('/api/cars', (req, res) => {
	new Promise((resolve, reject) => {
		req.on('data', (data) => {
			resolve(JSON.parse(data.toString()));
		});
	}).then((data) => {
		/* console.info(data === null, data, typeof data); */
		let is = false;
		for (let i in data) {
			if (data.hasOwnProperty(i)) {
				if (i.split('$')[1] === 'is_add') {
					is = true;
				}
				break;
			}
		}
		let _core = (mes, arr) => {
			//arr数组中的数据全部是promise实例对象
			Promise.all(arr)
				.then((result) => {
					/* console.info(result); */
					let ok = true;
					for (let i = 0; i < result.length; i++) {
						if (result[i].ok !== 1) {
							ok = false;
							break;
						}
					}
					res.send({
						ok
					});
				})
				.catch((err) => {
					console.info(mes, err);
					res.send({
						ok: false
					});
				});
		};
		if (is) { //含有is_add
			let arr = [];
			for (let i in data) {
				if (data.hasOwnProperty(i)) {
					let a = i.split('$');
					/* console.info({
						username: a[0]
					}, {
						$push: {
							'cars': {
								place: '[初始化值]',
								number: '[初始化值]',
								color: '[初始化值]',
								type: '[初始化值]',
								date: '[初始化值]'
							}
						}
					}); */
					arr.push(
						update(db.Users, {
							username: a[0]
						}, {
							$push: {
								'cars': {
									place: '[初始化值]',
									number: '[初始化值]',
									color: '[初始化值]',
									type: '[初始化值]',
									date: '[初始化值]'
								}
							}
						})
					);
				}
			}
			_core('新添加车辆数据失败: ', arr);
		} else { //全部不含有is_add
			let arr = [];
			for (let i in data) { //逐个更新,后续改进为一次全部更新
				if (data.hasOwnProperty(i)) {
					let a = i.split('$');
					/* console.info({
						username: a[0],
						'cars._id': a[2]
					}, {
						$set: {
							[`cars.$.${a[1]}`]: data[i]
						}
					}); */
					arr.push(
						update(db.Users, {
							username: a[0],
							'cars._id': a[2]
						}, {
							$set: {
								[`cars.$.${a[1]}`]: data[i]
							}
						})
					);
				}
			}
			_core('更新车辆数据失败: ', arr);
		}
	});
});


app.listen(config.port, '0.0.0.0', () => {
	console.info(`web服务开启,请使用浏览器访问 http://${config.domain}:${config.port}`);
});
