let transactions = [];
const btn = document.getElementById("getTransactions");
const rawText = document.getElementById("text");
const rawAmount = document.getElementById("amount");

function title(str) {
  return str
    .trim()
    .split(" ")
    .map((word) =>
      word.charAt(0).toUpperCase().concat(word.slice(1).toLowerCase()),
    )
    .join(" ");
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  const transactionText = title(rawText.value.trim());
  const amountValue = Number(rawAmount.value.trim());
  if (!transactionText || !amountValue) {
    alert("Please provide all transaction details!");
  } else {
    transactions.push({
      id: generateUniqueId(),
      text: transactionText,
      amount: amountValue,
      type: amountValue > 0 ? "income" : "expense",
    });
    localStorage.setItem("myExpenseTracker", JSON.stringify(transactions));
    rawText.value = "";
    rawAmount.value = "";
    updateDashboard(transactions);
    updateTransactionList(transactions);
  }
});

const transactionSearch = document.getElementById("search-input");
const searchList = document.querySelector("#search-list");
let debounceTimer;
transactionSearch.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    filterTransaction();
    // const cleanText = transactionSearch.value.toLowerCase().trim();
    // let mySearch = transactions.filter((item) =>
    //   item.text.toLowerCase().trim().includes(cleanText) && (typeFilter.value === "all" || item.type === typeFilter.value)
    // );
    // if (cleanText === "" && typeFilter.value === "all") {
    //   updateTransactionList(transactions);
    //   return;
    // } else {
    //   updateTransactionList(mySearch);
    // }
  }, 500);
});

const typeFilter = document.getElementById("type-filter");
typeFilter.addEventListener("change", () => {
  filterTransaction();
});

function filterTransaction() {
  const selectedText = typeFilter.value.toLowerCase().trim();
  const cleanText = transactionSearch.value.toLowerCase().trim();

  const filtered = transactions.filter((item) => {
    return (
      item.text.toLowerCase().trim().includes(cleanText) &&
      (typeFilter.value === "all" || item.type === typeFilter.value)
    );
  });

  updateTransactionList(filtered);
}

function updateDashboard(trans) {
  const totalBalance = document.getElementById("total-balance");
  const balance = trans.reduce((total, amount) => {
    return total + amount.amount;
  }, 0);
  totalBalance.innerText =
    balance >= 0
      ? `+₹${balance.toLocaleString()}`
      : `-₹${balance.toLocaleString().replace("-", "")}`;

  const incomeElement = document.getElementById("total-income");
  const totalIncome = trans
    .filter((item) => item.type === "income")
    .reduce((total, amount) => {
      return total + amount.amount;
    }, 0);
  incomeElement.innerText = totalIncome
    ? `+₹${totalIncome.toLocaleString()}`
    : `+₹0.00`;

  const expenseElement = document.getElementById("total-expense");
  const totalExpense = trans
    .filter((item) => item.type === "expense")
    .reduce((total, amount) => {
      return total + amount.amount;
    }, 0);
  expenseElement.innerText = totalExpense
    ? `-₹${totalExpense.toLocaleString().replace("-", "")}`
    : `-₹0.00`;
}

const transList = document.querySelector("#transaction-list");
transList.addEventListener("click", (e) => {
  if (
    e.target.tagName === "BUTTON" &&
    e.target.classList.contains("deleteIncome")
  ) {
    let clickedId = Number(e.target.dataset.id);
    const removeIndex = transactions.findIndex((item) => item.id === clickedId);
    console.log(removeIndex);
    if (removeIndex !== -1) {
      transactions.splice(removeIndex, 1);
      localStorage.setItem("myExpenseTracker", JSON.stringify(transactions));
      updateDashboard(transactions);
      // updateTransactionList(transactions);
      transactionSearch.value = "";
      filterTransaction();
    }
  }
  if (
    e.target.tagName === "BUTTON" &&
    e.target.classList.contains("deleteExpense")
  ) {
    let clickedId = Number(e.target.dataset.id);
    const removeIndex = transactions.findIndex((item) => item.id === clickedId);
    console.log(removeIndex);
    if (removeIndex !== -1) {
      transactions.splice(removeIndex, 1);
      localStorage.setItem("myExpenseTracker", JSON.stringify(transactions));
      updateDashboard(transactions);
      // updateTransactionList(transactions);
      transactionSearch.value = "";
      filterTransaction();
      // localStorage.setItem("myExpenseTracker",JSON.stringify(transactions));
    }
  }
});

function updateTransactionList(arr) {
  transList.innerHTML = "";
  if (arr.length > 0) {
    arr.forEach((item) => {
      if (item.type === "income") {
        const li = document.createElement("li");
        li.setAttribute("class", "income");
        transList.appendChild(li);

        const span1 = document.createElement("span");
        const text1 = document.createTextNode(`${item.text}`);
        span1.appendChild(text1);

        const span2 = document.createElement("span");
        const text2 = document.createTextNode(
          `₹${item.amount.toLocaleString()}`,
        );
        span2.appendChild(text2);

        const incomeDelBtn = document.createElement("button");
        incomeDelBtn.setAttribute("class", "deleteIncome");
        incomeDelBtn.setAttribute("data-id", `${item.id}`);

        li.appendChild(span1);
        li.appendChild(span2);
        li.appendChild(incomeDelBtn);
      }
      if (item.type === "expense") {
        const li = document.createElement("li");
        li.setAttribute("class", "expense");
        transList.appendChild(li);

        const span1 = document.createElement("span");
        const text1 = document.createTextNode(`${item.text}`);
        span1.appendChild(text1);

        const span2 = document.createElement("span");
        const text2 = document.createTextNode(
          `-₹${item.amount.toLocaleString().replace("-", "")}`,
        );
        span2.appendChild(text2);

        const expenseDelBtn = document.createElement("button");
        expenseDelBtn.setAttribute("class", "deleteExpense");
        expenseDelBtn.setAttribute("data-id", `${item.id}`);

        li.appendChild(span1);
        li.appendChild(span2);
        li.appendChild(expenseDelBtn);
      }
    });
  } else {
    transList.innerHTML = "<h3 margin: 20px;>No Record Found!</h3>";
  }
}

function generateUniqueId() {
  let id = Math.floor(Math.random() * 10000000000 + 1);
  return !transactions.some((item) => item.id === id) ? id : generateUniqueId();
}

// localStorage.removeItem("myExpenseTracker");
const savedData = localStorage.getItem("myExpenseTracker");
if (savedData) {
  transactions = JSON.parse(savedData);
}
updateDashboard(transactions);
updateTransactionList(transactions);
