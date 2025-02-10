// function to get valueAsNumber from an element by element ID
function getValueAsNumberById(id) {
	// check if there is an element with corresponding ID
	const element = document.getElementById(id);
	if (!element) {
		//if not, inform the user and return NaN
		console.log(`No element matching '${id}' was found`);
		return NaN;
	}
	// remove the border formanting
	element.style.border = "1px solid black";
	// get valueAsNumber property from the element
	const valueAsNumber = element.valueAsNumber;
	// if it is Not a Number, return NaN, highligh element fiels and notify user
	if (isNaN(valueAsNumber)) {
		console.log(`The input for ${id} is not a number.`);
		element.style.border = "2px solid red";
		return NaN;
	}

	/* 
	check that they fit following rules:
	initialInvestment >= 0
	monthlyContribution >= 0
	invetmentPeriod > 0
	*/
	if ((id === "initial-investment" || id === "monthly-contribution") && valueAsNumber < 0) {
		console.log("Investment period or monthly contribution can not be less than 0");
		element.style.border = "2px solid red";
		return NaN;
	}
	if (id === "investment-period" && valueAsNumber < 1) {
		console.log("Investment period can not be less than 1");
		element.style.border = "2px solid red";
		return NaN;
	}
	// return value
	return valueAsNumber;
}

// function to check if all values are valid
function checkValues(val1, val2, val3, val4) {
	if (!isNaN(val1) && !isNaN(val2) && !isNaN(val3) && !isNaN(val4)) {
		return true;
	}
	return false;
}

// a function to format a number
function formatNumber(number) {
	const formatter = new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	return formatter.format(number);
}

// Investment class to handle the investment value calculations
class Investment {
	constructor(initialInvestment, monthlyContribution, investmentPeriod, interestRate) {
		this.initialInvestment = initialInvestment;
		this.monthlyContribution = monthlyContribution;
		this.investmentPeriod = investmentPeriod;
		this.interestRate = interestRate; // in percent
	}

	// calculates the investment value in the end of a given year
	getInvestmentValue(year) {
		const annualContribution = this.monthlyContribution * 12;
		let investmentValue = 0;
		if (this.interestRate === 0) {
			investmentValue = this.initialInvestment + annualContribution * year;
		} else {
			let interestRateDecimal = this.interestRate / 100;
			investmentValue =
				this.initialInvestment * Math.pow(1 + interestRateDecimal, year) +
				(annualContribution * (1 + interestRateDecimal) * (Math.pow(1 + interestRateDecimal, year) - 1)) /
					interestRateDecimal;
		}

		return investmentValue;
	}

	// calculates total contributions up to a provided year
	getTotalContributions(year) {
		return this.initialInvestment + this.monthlyContribution * 12 * year;
	}
}

/* 
function called by press of a button "Calculate Interest"
reads the values from input fields and, if values are valid,
displays a table with Interes calculations over the years
*/
function calculateInterest() {
	// object tags to store the html tags used in the script
	const tags = {
		initialInvestment: "initial-investment",
		monthlyContribution: "monthly-contribution",
		investmentPeriod: "investment-period",
		interestRate: "interest-rate",
		investmentTableDiv: "investment-table",
	};

	// get values from the html page
	let initialInvestment = getValueAsNumberById(tags.initialInvestment);
	let monthlyContribution = getValueAsNumberById(tags.monthlyContribution);
	let investmentPeriod = getValueAsNumberById(tags.investmentPeriod);
	let interestRate = getValueAsNumberById(tags.interestRate);

	// find div with id investment-table
	let tableDiv = document.getElementById(tags.investmentTableDiv);
	//clear the content of this DIV in case of recalculation
	tableDiv.innerHTML = "";

	// if all values are valid create a table with calculations
	if (checkValues(initialInvestment, monthlyContribution, investmentPeriod, interestRate)) {
		// create new object of class Investment
		let investment = new Investment(initialInvestment, monthlyContribution, investmentPeriod, interestRate);

		// create a table element
		let table = document.createElement("table");
		tableDiv.appendChild(table);

		// create and append the header row
		let headerRow = document.createElement("tr");
		table.appendChild(headerRow);
		headerRow.className = "cell second-row";
		// create array to store headers
		let headers = ["Years", `Investment Value (${investment.interestRate}%)`, "Total Contributions"];
		// create td elements and assign them corresponding values from headers array
		for (let i = 0; i < headers.length; i++) {
			const th = document.createElement("th");
			th.textContent = headers[i];
			th.className = "cell";
			headerRow.appendChild(th);
		}

		// fill the table with values according to the provided data
		for (let year = 0; year <= investment.investmentPeriod; year++) {
			// create new row
			let tr = document.createElement("tr");
			if (year % 2 === 1) {
				tr.className = "second-row";
			}
			// year cell
			let td1 = document.createElement("td");
			td1.textContent = `Year ${year}`;
			td1.className = "cell";
			tr.appendChild(td1);

			// investment value cell
			const investmentValue = investment.getInvestmentValue(year);
			let td2 = document.createElement("td");
			td2.className = "cell";
			td2.textContent = formatNumber(investmentValue);
			tr.appendChild(td2);

			// total contributions cell
			const totalContributions = investment.getTotalContributions(year);
			let td3 = document.createElement("td");
			td3.textContent = formatNumber(totalContributions);
			td3.className = "cell";
			tr.appendChild(td3);
			// append the row to the table
			table.appendChild(tr);
		}
	} else {
		// display an error message if not all of the values pass the check
		let errorMessage = document.createElement("p");
		errorMessage.className = "error-message";
		errorMessage.innerText = "Error: Unable to calculate interest. Please verify your input values and try again.";
		tableDiv.appendChild(errorMessage);
	}
}
