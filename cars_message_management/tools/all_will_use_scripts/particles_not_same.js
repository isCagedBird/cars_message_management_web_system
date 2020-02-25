/* 
	zhangyunlong 2020-7
*/
;
(function() {
	let navigatorStr = navigator.userAgent.toLowerCase();
	if (!window['*!*']) {
		window['*!*'] = {};
	}
	if (navigatorStr.indexOf('windows') === -1 && navigatorStr.indexOf('mobile') !== -1) {
		/* 移动端 */
		window['*!*'].isLine = false;
	} else {
		/* 桌面端 */
		window['*!*'].isLine = true;
	}
})();
(function() {
	'use strict';

	const U = (function() {
		/*    闭包作用域公用数据    */
		let Data = {
			b: { //连线粒子相关
				cv: null,
				ctx: null,
				request: true, //是否开启粒子特效状态标志,状态标志都设为true
				animationFrame: true, //高频事件触发节流函数状态标志
				array: [], //连线粒子数组
				move: null, //鼠标焦点粒子
				num: 30, //连线粒子个数	30 + 1
				min_speed: 1, //连线粒子速度下区间
				add_speed: 1, //连线粒子速度增加量
				min_radius: 2, //连线粒子半径下区间
				add_radius: 6, //连线粒子半径增加量
				min: 200 //连线粒子之间连线最小距离	200
			},
			animationFrame: true //resize事件触发节流函数状态标志
		};
		// if (!window['*!*']) {
		// 	window['*!*'] = {};
		// }
		//window['*!*'].isLine = true;/* 默认是桌面端 */
		/* 加入canvas */
		(function() {
			/* canvas 构造函数 */
			function buildCanvas() {
				let nObj = arguments[0];
				let cv = document.createElement('canvas');
				cv.setAttribute('style', nObj.style);
				cv.width = nObj.w;
				cv.height = nObj.h;
				document.body.appendChild(cv);
				return cv;
			}
			Data.b.cv = buildCanvas({
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight,
				style: `pointer-events:none!important;z-index:-99999!important;margin:0!important;padding:0!important;left:0!important;top:0!important;position:fixed!important;display:block!important;`
			});
			Data.b.ctx = Data.b.cv.getContext('2d');
		})();
		/*    初始化结束    */
		function getR() {
			/*
			 *    0个数->颜色值
			 *    2个数->区间
			 */
			let argu = arguments;
			if (argu.length === 0) {
				return Math.round(Math.random() * 256);
			} else if (argu.length === 2) {
				let min = argu[0],
					max = argu[1];
				if (min > max) {
					[min, max] = [argu[1], argu[0]];
				}
				return Math.round(Math.random() * (max - min) + min);
			} else {
				return null;
			}
		}
		/* 绘圆形核心函数 */
		function _draw_(ctx, x, y, r, _style) {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = _style;
			ctx.arc(x, y, r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();
		}
		/*	连线粒子构造器	*/
		function ParticlesB({
			x,
			y,
			c,
			radius
		}) {
			let obj = arguments[0];
			this.x = obj.x;
			this.y = obj.y;
			this.c = obj.c;
			this.radius = obj.radius;
		}
		ParticlesB.prototype.draw = function() {
			_draw_(Data.b.ctx, this.x, this.y, this.radius, this.c);
		};
		/* 改变速度核心函数 */
		function _change_v_(o) {
			let speed = Data.b.min_speed + Data.b.add_speed * Math.random();
			let angle = getR(0, 360) * (Math.PI / 180);
			o.v = {
				x: speed * Math.cos(angle),
				y: speed * Math.sin(angle)
			};
		}

		function getDistance(one, two) {
			return Math.sqrt(Math.pow(one.x - two.x, 2) + Math.pow(one.y - two.y, 2));
		}
		/* 连线粒子循环函数 */
		function updateB() {
			Data.b.ctx.clearRect(0, 0, Data.b.cv.width, Data.b.cv.height);
			let a = Data.b.array;
			let l = a.length;
			/* console.info(Data.b.num === l - 1);//true */
			for (let i = 0; i < l; i++) {
				if (i !== Data.b.num) {
					if (a[i].x > Data.b.cv.width || a[i].x < 0) {
						a[i].v.x *= -1;
					}
					if (a[i].y > Data.b.cv.height || a[i].y < 0) {
						a[i].v.y *= -1;
					}
					a[i].x += a[i].v.x;
					a[i].y += a[i].v.y;
				}
				a[i].draw();
				/* 时间复杂度是O(n^2),因为要遍历每个连线粒子
				从而确定他们之间连线
				是否要绘制出来 */
				for (let j = 0; j < l; j++) {
					if (i !== j) {
						let distance = getDistance(a[i], a[j]);
						let a_in_rgba = 1 - distance / Data.b.min;
						/* 粒子数组连线的透明度，当两个粒子的连线的距离越小于Data.b.min时，连线越亮 */
						/* console.info(a_in_rgba); */
						if (window['*!*'].isLine && a_in_rgba) {
							Data.b.ctx.save();
							Data.b.ctx.lineWidth = 1;
							Data.b.ctx.strokeStyle = `rgba(${0},${255},${0},${a_in_rgba})`;
							Data.b.ctx.beginPath();
							Data.b.ctx.moveTo(a[i].x, a[i].y);
							Data.b.ctx.lineTo(a[j].x, a[j].y);
							Data.b.ctx.closePath();
							Data.b.ctx.stroke();
							Data.b.ctx.restore();
						}
					}
				}
			}
		}

		function initB() {
			/* 创建其他粒子数组 */
			for (let i = 0; i < Data.b.num; i++) {
				Data.b.array.push(new ParticlesB({
					x: Math.random() * Data.b.cv.width,
					y: Math.random() * Data.b.cv.height,
					c: `rgb(${getR()},${getR()},${getR()})`,
					radius: Math.round(Data.b.min_radius + Math.random() * Data.b.add_radius)
				}));
				_change_v_(Data.b.array[i]);
			}
			/* 此时创建移动焦点小球 */
			Data.b.move = new ParticlesB({
				x: 0,
				y: 0,
				c: 'rgba(0,255,0,0.8)',
				radius: 12
			});
			Data.b.array.push(Data.b.move);
			/* console.info(Data.b.array[Data.b.num] === Data.b.move);//true */
			if (!Data.b.request) {
				Data.b.request = true;
			}
		}

		function cvB_clear() {
			Data.b.ctx.clearRect(0, 0, Data.b.cv.width, Data.b.cv.height);
			Data.b.request = false;
			/* 连线粒子数组初始化 */
			Data.b.array = [];
			Data.b.move = null;
		}

		function run() {
			initB();
			/*
			 *	run函数里面来写一写桌面端（后续加入移动端事件）的监听器函数
			 *	用来异步处理粒子相关的事件
			 */
			window.addEventListener('resize', function() {
				/* 高频事件，使用事件节流技术优化性能 */
				if (Data.animationFrame) {
					Data.animationFrame = false;
					window.requestAnimationFrame(() => {
						Data.b.cv.width = document.documentElement.clientWidth;
						Data.b.cv.height = document.documentElement.clientHeight;
						Data.animationFrame = true;
					});
				}
			}, false);

			window.addEventListener('keydown', function(e) {
				e = e || window.event;
				/* 无限制全局监听 */
				if (e.shiftKey && e.keyCode === 80) { //按shift键+P键 开关粒子特效
					!Data.b.request ? initB() : cvB_clear();
				}
				//其他部分的监听在结束会自动移除
			}, false);

			window.addEventListener('mousemove', function(e) {
				/*
				 *	该鼠标移动事件监听器回调函数作用域将被高频调用
				 *	需要做函数防抖优化性能，使每次回调函数都要在上一次
				 *	执行完之后再执行，这样每一帧画面只会画一次
				 *	一帧画面多次重复画的画面除了浪费资源就没有任何意义了
				 */
				if (Data.b.request) {
					e = e || window.event;
					if (Data.b.animationFrame) {
						Data.b.animationFrame = false;
						window.requestAnimationFrame(() => {
							/* console.info('1'); */
							/* 改变焦点粒子的xy坐标以及速度 */
							Data.b.move.x = e.clientX;
							Data.b.move.y = e.clientY;
							updateB();
							Data.b.animationFrame = true;
						});
					}
				}
			}, false);

			/* onclick contouchend事件，移动端先触发后者，再触发前者 */
			/* 移动端开关粒子特效 */
			window.addEventListener('touchend', function(e) {
				e = e || window.event;
				//console.info(e.changedTouches[0]);
				let x = e.changedTouches[0].clientX;
				let y = e.changedTouches[0].clientY;
				/*
				点击屏幕上半部分（竖屏的1/20，横屏在1/3到2/3之间），绘制连线粒子
				点击屏幕下半部分（竖屏是1/20，横屏在1/3到2/3之间），不再绘制连线粒子
				 */
				if (y < Data.b.cv.height / 20 && x > Data.b.cv.width / 3 && x < Data.b.cv.width * 2 / 3) {
					if (!Data.b.request) {
						initB();
					}
				}
				if (y > Data.b.cv.height * 19 / 20 && x > Data.b.cv.width / 3 && x < Data.b.cv.width * 2 / 3) {
					if (Data.b.request) {
						cvB_clear();
					}
				}
			}, false);
		}
		/*    返回对外界作用域的接口    */
		return {
			run: run
		};

	})();

	U.run();
})();
