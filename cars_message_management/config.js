// 程序配置文件
//	需要注意的一点是,必须开启数据库服务后该程序才能运行

module.exports = {
	domain: 'localhost',
	port: 8089,
	databaseS: 'mongodb://',
	databaseE: '/_db_name' // /后面是MongoDB数据库名字
};
