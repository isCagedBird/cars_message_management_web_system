module.exports = (Users, obj, update) => {
	return new Promise((resolve, reject) => {
		Users.updateOne(obj, update, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};
