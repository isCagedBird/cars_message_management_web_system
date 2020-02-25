/* 
	zhangyunlong 2020-11
*/
;
(function(color, radius, isShow) {
	/* 传入初始颜色，初始半径以及是否开启鼠标焦点追踪 */
	'use strict';

	const U = {
		cv: null,
		ctx: null,
		/* 创建鼠标焦点 */
		ring: {
			c: color,
			r: radius,
			isAdd: true
		},
		twoOf: 2 * radius,
		move: {
			c: color,
			r: Math.floor(radius / 2),
			isAdd: true
		},
		speed: 1,
		/* 特效粒子速度 */
		arr: [],
		/* 特效粒子数组 */
		num: 36,
		/* 特效粒子数目 */
		interval: null,
		flag: false,
		flag1: false,
		_changeRadius: function(obj, r, n) {
			if (obj.isAdd) {
				obj.r++;
				if (obj.r >= r) {
					if (obj.r > r) {
						obj.r = r;
					}
					obj.c = U._getColor(n);
					obj.isAdd = false;
				}
			} else {
				obj.r--;
				if (obj.r <= 0) {
					if (obj.r < 0) {
						obj.r = 0;
					}
					obj.isAdd = true;
				}
			}
		},
		_draw: function(obj) {
			U.ctx.save();
			U.ctx.beginPath();
			if (obj === U.move) {
				U.ctx.fillStyle = obj.c;
				U.ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
				U.ctx.fill();
			} else if (obj === U.ring) {
				U.ctx.strokeStyle = obj.c;
				U.ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
				U.ctx.stroke();
			} else {
				U.ctx.fillStyle = U.move.c;
				U.ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
				U.ctx.fill();
			}
			U.ctx.restore();
		},
		_getColor: function(bright) {
			return `rgba(${Math.random()*256},${Math.random()*256},${Math.random()*256},${bright})`;
		},
		_fn: function(e = window.event) {
			/* 高频调用函数 */
			if (U.interval === null) {
				/* 当定时器关闭了才进入此环节执行 */
				if (!U.flag) {
					U.flag = true;
					window.requestAnimationFrame(function() {
						U.ctx.clearRect(0, 0, U.cv.width, U.cv.height);
						let x = e.clientX,
							y = e.clientY;
						U._changeRadius(U.move, radius, 0.5);
						U.move.x = x;
						U.move.y = y;
						U._draw(U.move);
						U.flag = false;
					});
				}
			}
		}
	};

	(function() {
		U.cv = document.createElement('canvas');
		U.cv.width = document.documentElement.clientWidth;
		U.cv.height = document.documentElement.clientHeight;
		U.ctx = U.cv.getContext('2d');
		U.cv.setAttribute('style',
			`pointer-events:none!important;z-index:99999!important;margin:0!important;padding:0!important;left:0!important;top:0!important;position:fixed!important;display:block!important;`
		);
		document.body.appendChild(U.cv);
		/* 创建粒子数组 */
		for (let i = 0; i < U.num; i++) {
			U.arr.push({
				angle: i * 10
			});
		}
	})();

	window.addEventListener('resize', function() {
		/* 高频调用函数简单做一些防抖处理 */
		if (!U.flag1) {
			U.flag1 = true;
			window.requestAnimationFrame(() => {
				U.cv.width = document.documentElement.clientWidth;
				U.cv.height = document.documentElement.clientHeight;
				U.flag1 = false;
			});
		}
	}, false);
	if (isShow) {
		window.addEventListener('mousemove', U._fn, false);
	}

	window.addEventListener('mouseup', function(e) {
		e = e || window.event;
		/* console.info('length', U.arr.length); */
		if (U.interval === null) {
			/* 没有定时器开启才进入 */
			let x = e.clientX,
				y = e.clientY;
			/* 更新一下相关属性 */
			for (let i = 0; i < U.arr.length; i++) {
				U.arr[i].x = x;
				U.arr[i].y = y;
				U.arr[i].r = 10 * Math.random();
			}
			U.arr[0].border = U.arr[0].x + U.twoOf;
			if (!isShow) {
				U.move.c = U._getColor(0.5);
			}

			U.interval = window.setInterval(function() {
				U.ctx.clearRect(0, 0, U.cv.width, U.cv.height);
				/* 边界判断条件 */
				if (U.arr[0].x > U.arr[0].border) {
					window.requestAnimationFrame(function() {
						U.ctx.clearRect(0, 0, U.cv.width, U.cv.height);
					});
					window.clearInterval(U.interval);
					U.interval = null;
				}

				U.ring.x = x;
				U.ring.y = y;
				U._changeRadius(U.ring, U.twoOf, 1);
				U._draw(U.ring);

				for (let i = 0; i < U.arr.length; i++) {
					U.arr[i].x += U.speed * Math.cos(U.arr[i].angle);
					U.arr[i].y += U.speed * Math.sin(U.arr[i].angle);
					U._draw(U.arr[i]);
				}
			}, 1000 / 60);
		} else {
			console.info('no');
		}

	}, false);
	//20
})('cyan', 25, true);
