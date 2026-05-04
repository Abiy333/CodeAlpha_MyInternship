let current = "0";
let stored = null;
let op = null;
let fresh = false;

const displayEl = document.getElementById("display");
const exprEl = document.getElementById("expr");

function fmt(n) {
  if (!isFinite(n) || isNaN(n)) return null;
  let s = parseFloat(n.toPrecision(10)).toString();
  if (s.length > 12) s = parseFloat(n.toPrecision(6)).toString();
  return s;
}

function evaluate() {
  const a = stored;
  const b = parseFloat(current);
  if (op === "÷" && b === 0) return null;
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "x") return a * b;
  if (op === "÷") return a / b;
  return b;
}

function updateDisplay(val, isError = false) {
  displayEl.textContent = val;
  displayEl.classList.toggle("error", isError);
}

function calc(v) {
  if (v === "AC") {
    current = "0";
    stored = null;
    op = null;
    fresh = false;
    exprEl.textContent = "";
    updateDisplay("0");
    return;
  }

  if (v === "±") {
    current = fmt(parseFloat(current) * -1) || "0";
    updateDisplay(current);
    return;
  }

  if (v === "%") {
    current = fmt(parseFloat(current) / 100) || "0";
    updateDisplay(current);
    return;
  }

  if (["+", "-", "x", "÷"].includes(v)) {
    if (stored !== null && !fresh) {
      const res = evaluate();
      if (res === null) return;
      current = fmt(res) || "0";
    }
    stored = parseFloat(current);
    op = v;
    fresh = true;
    exprEl.textContent = current + " " + v;
    updateDisplay(current);
    return;
  }

  if (v === "=") {
    if (stored === null || op === null) return;
    exprEl.textContent = stored + " " + op + " " + current + " =";
    const res = evaluate();
    if (res === null) {
      updateDisplay("Error", true);
      return;
    }
    current = fmt(res) || "0";
    updateDisplay(current);
    stored = null;
    op = null;
    fresh = false;
    return;
  }

  if (v === ".") {
    if (fresh) {
      current = "0";
      fresh = false;
    }
    if (!current.includes(".")) current += ".";
    updateDisplay(current);
    return;
  }

  if (fresh) {
    current = "";
    fresh = false;
  }
  if (current === "0" && v !== ".") current = "";
  if (current.replace("-", "").replace(".", "").length >= 12) return;
  current += v;
  updateDisplay(current);
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => calc(btn.dataset.val));
});

const keyMap = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  ".": ".",
  "+": "+",
  "-": "-",
  "*": "x",
  "/": "÷",
  Enter: "=",
  "=": "=",
  Escape: "AC",
  Backspace: "AC",
  Delete: "AC",
  "%": "%",
};

document.addEventListener("keydown", (e) => {
  const v = keyMap[e.key];
  if (v) {
    e.preventDefault();
    calc(v);
    const btn = document.querySelector(`[data-val="${v}"]`);
    if (btn) {
      btn.style.transform = "scale(0.91)";
      btn.style.filter = "brightness(0.85)";
      setTimeout(() => {
        btn.style.transform = "";
        btn.style.filter = "";
      }, 100);
    }
  }
});
