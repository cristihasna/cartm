const normalize = (data) => {
	let loginData = data;
	if (!loginData.profileImg) {
		const emailID = data.email.split('@')[0];
		const emailComponents = emailID.split(/[._]/, 2);
		loginData.profileImgReplacement = emailComponents.map((item) => item.slice(0, 1)).join('').toUpperCase();
	}
	if (!loginData.displayName) {
		let emailID = data.email.split('@')[0];
		emailID = emailID.replace(/[0-9]+/, '');
		const emailComponents = emailID.split(/[._]/);
		let name = emailComponents[0].slice(0, 1).toUpperCase() + emailComponents[0].slice(1).toLowerCase();

		if (emailComponents.length > 1)
            name += ' ' + emailComponents[1].slice(0, 1).toUpperCase() + emailComponents[1].slice(1).toLowerCase();
        loginData.displayName = name;
    }
    return loginData;
};

export default normalize;
