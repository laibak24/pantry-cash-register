const inputEl = document.getElementById('cash');
const outputEl = document.getElementById('change-due');
const buttonEl = document.getElementById('purchase-btn');
const priceEl = document.getElementById('price');
const totalFund = document.getElementById('drawer-value');

let cid = [
  ["PENNY", 0.5],
  ["NICKEL", 0],
  ["DIME", 0],
  ["QUARTER", 0],
  ["ONE", 0],
  ["FIVE", 0],
  ["TEN", 0],
  ["TWENTY", 0],
  ["ONE HUNDRED", 0]
];

let price = 19.5; 

// Display initial drawer values
function displayDrawerValues() {
  totalFund.innerText = cid.map(([denom, amount]) => `${denom}: $${amount.toFixed(2)}`).join("\n");
  priceEl.innerText = 'Total: $' + price.toFixed(2);
}

displayDrawerValues();

function calculateTotalFunds() {
  return cid.reduce((total, [, amount]) => total + amount, 0);
}

function calculateChange() {
  const cash = parseFloat(inputEl.value);

  if (isNaN(cash) || cash <= 0) {
    alert('Please enter a valid cash amount.');
    return;
  }

  // Case 1: price > cash
  if (price > cash) {
    alert('Customer does not have enough money to purchase the item');
    return;
  }

  // Case 2: price = cash
  if (price === cash) {
    outputEl.innerText = 'No change due - customer paid with exact cash';
    return;
  }

  let changeToReturn = cash - price;

  // Case 3: insufficient funds in drawer
  if (changeToReturn > calculateTotalFunds()) {
    outputEl.innerText = 'Status: INSUFFICIENT_FUNDS';
    return;
  }

  // Convert the cid array to an object for easier manipulation
  let changeDict = {};
  cid.forEach(([denom, amount]) => {
    changeDict[denom] = amount;
  });

  // Sort denominations from highest to lowest value
  let denominations = [
    ['ONE HUNDRED', 100],
    ['TWENTY', 20],
    ['TEN', 10],
    ['FIVE', 5],
    ['ONE', 1],
    ['QUARTER', 0.25],
    ['DIME', 0.10],
    ['NICKEL', 0.05],
    ['PENNY', 0.01]
  ];

  let change = [];

  // Determine the amount of change to return
  for (let [denom, denomValue] of denominations) {
    let denomTotal = changeDict[denom];
    let denomCount = Math.floor(changeToReturn / denomValue);
    let returned = 0;

    if (denomCount > 0) {
      returned = Math.min(denomCount, Math.floor(denomTotal / denomValue));
      changeToReturn -= returned * denomValue;
      changeToReturn = Math.round(changeToReturn * 100) / 100; // Round to avoid floating point issues

      if (returned > 0) {
        change.push([denom, returned * denomValue]);
      }
    }
  }

  // Check if we managed to return the full change
  if (changeToReturn > 0) {
    outputEl.innerText = 'Status: INSUFFICIENT_FUNDS';
  } else {
    // Sort change from highest to lowest
    change.sort((a, b) => b[1] - a[1]);
    
    // Format the output
    let changeStr = change.map(([denom, amt]) => `${denom}: $${amt.toFixed(2)}`).join('<br>');

    if (calculateTotalFunds() === cash - price) {
      outputEl.innerHTML = `Status: CLOSED<br>${changeStr}`;
    } else {
      outputEl.innerHTML = `Status: OPEN<br>${changeStr}`;
    }
    updateDrawer(change);
  }
}

function updateDrawer(change) {
  change.forEach(([denom, amt]) => {
    const idx = cid.findIndex(([d]) => d === denom);
    cid[idx][1] -= amt;
  });
  displayDrawerValues();
}

buttonEl.addEventListener('click', calculateChange);
