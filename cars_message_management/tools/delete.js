module.exports = (Users, obj) => {
	return new Promise((resolve, reject) => {
		Users.deleteOne(obj, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};
