function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function calculateSimpleInterest(principle, roi, time) {
	return (principle * roi * time) / 100;
}

function calculateCompoundInterest(principle, roi, time, compoundingFrequency) {
	roi = roi / 100;
	var n = compoundingFrequency;
	var amount = principle * Math.pow(1 + (roi / n), n * time);
	var interest = amount - principle;
	return interest;
}

function gsheetRows2Objects(rowList) {
	var [headers, ...rows] = rowList;
	var dataObjectList = [];
	rows.forEach(function(r) {
		var obj = {};
		r.forEach(function (c, j) {
			obj[headers[j]] = c;
		})
		dataObjectList.push(obj);
	})
	return dataObjectList;
}

function getNewDate() {
	const todayDate = new Date();
	todayDate.setUTCHours(todayDate.getUTCHours() + 5, 30, 0, 0);
	todayDate.setUTCHours(0, 0, 0, 0);
	return todayDate;
}


module.exports = {
	isNumeric,
	calculateSimpleInterest,
	calculateCompoundInterest,
	gsheetRows2Objects,
	getNewDate
};
