function calculateInterest() {
	// find elements by ID and read valueAsNumber from them
	let initialInvestment = getValueAsNumberById("initial-investment");
	let monthlyContribution = getValueAsNumberById("monthly-contribution");
	let investmentPeriod = getValueAsNumberById("investment-period");
	let interestRate = getValueAsNumberById("interest-rate");

	// find div with id investment-table
	let tableDiv = document.getElementById("investment-table");

	//clear the content of this DIV in case of recalculation
	tableDiv.innerHTML = "";

	// create a table for the calculations
	let table = document.createElement("table");

	// append Table to corresponding div, tr to table, td to tr
	tableDiv.appendChild(table);
	let headerTR = document.createElement("tr");
	table.appendChild(headerTR);

	// dynamically create name for the Investment value column
	let interestValueHeader = `Investment Value (${interestRate}%)`;

	// array to store headers
	let headers = ["Years", interestValueHeader, "Total Contributions"];

	// create td elements and assign them corresponding values from headers array
	for (let i = 0; i < headers.length; i++) {
		let td = document.createElement("td");
		td.innerHTML = headers[i];
		headerTR.appendChild(td);
	}
	for (let i = 0; i <= investmentPeriod; i++) {
		let year = i;
		let investmentValue = getInvestmentValue(initialInvestment, monthlyContribution, interestRate, year);
		let totalContributions = initialInvestment + monthlyContribution * 12 * year;
		let tr = document.createElement("tr");
		let td1 = document.createElement("td");
		td1.innerHTML = `Year ${year}`;
		let td2 = document.createElement("td");
		td2.innerHTML = investmentValue.toFixed(2);
		let td3 = document.createElement("td");
		td3.innerHTML = totalContributions;
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		table.appendChild(tr);
	}
}

// function to calculate investment value
function getInvestmentValue(initialInvestment, monthlyContribution, interestRate, year) {
	let annualContribution = monthlyContribution * 12;
	let interestRateDecimal = interestRate / 100;
	let investmentValue =
		initialInvestment * Math.pow(1 + interestRateDecimal, year) +
		(annualContribution * (1 + interestRateDecimal) * (Math.pow(1 + interestRateDecimal, year) - 1)) /
			interestRateDecimal;
	return investmentValue;
}

// function to get valueAsNumber from an element by element ID
function getValueAsNumberById(id) {
	// check if there is an element with corresponding ID
	if (!document.getElementById(id)) {
		//if not, inform the user and return NaN
		console.log(`No element matching '${id}' was found`);
		return NaN;
	}
	// get valueAsNumber property from the element
	let valueAsNumber = document.getElementById(id).valueAsNumber;
	// if it is a number return numeric value
	if (!isNaN(valueAsNumber)) {
		return valueAsNumber;
		// if it is not a number, inform the user and return a NaN
	} else {
		console.log(`The input for ${id} is not a number.`);
		return NaN;
	}
}
