module.exports = (Users, obj) => {
	return new Promise((resolve, reject) => {
		Users.find(obj, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};
