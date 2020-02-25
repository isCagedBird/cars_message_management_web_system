let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// 数据库
let UsersSchema = new Schema({
	primary_account: {
		type: Boolean,
		required: true
	},
	username: { //小区业主或者物业登录账号名(唯一)
		type: String,
		required: true
	},
	address: { //住址
		type: String,
		required: true
	},
	phone_num: { //联系号码
		type: String,
		required: true
	},
	password: { //账号登陆密码
		type: String,
		required: true
	},
	cars: [{
		place: { //车位
			type: String,
			required: true
		},
		number: { //车牌号(唯一)
			type: String,
			required: true
		},
		color: { //车辆颜色
			type: String,
			required: true
		},
		type: { //车辆型号
			type: String,
			required: true
		},
		date: { //登记日期
			type: String,
			required: true
		}
	}]
}, {
	collection: 'users'
});

module.exports = {
	Users: mongoose.model('users', UsersSchema)
};
