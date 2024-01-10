const calculatorDisplay = document.querySelector(".calculator_display");
const keypadEl = document.querySelector(".calculator_keypad");

let resultBtnPressed = false;

keypadEl.addEventListener("click", (e) => {
  const clickedBtn = e.target;
  const { textContent } = e.target;
  const clickedBtnAttribute = clickedBtn.getAttribute("data-type");

  switch (clickedBtnAttribute) {
    case "numeric":
      addNumber(textContent);
      break;

    case "delete":
      if (
        calculatorDisplay.textContent !== "0" &&
        calculatorDisplay.textContent.length !== 1
      ) {
        calculatorDisplay.textContent = calculatorDisplay.textContent.slice(
          0,
          -1
        );
      } else {
        calculatorDisplay.textContent = "0";
      }
      break;

    case "reset":
      resultBtnPressed = false;
      calculatorDisplay.textContent = 0;
      break;

    case "decimal":
      addDecimal(textContent);
      break;

    case "operator":
      addOperator(textContent);
      break;

    case "result":
      resultBtnPressed = true;

      try {
        calculatorDisplay.textContent = addComma(
          eval(calculatorDisplay.textContent)
        );
      } catch (error) {
        calculatorDisplay.textContent = "math error";
      }

      break;
  }
});

// THEMES
const themeEl = document.querySelector(".theme-toggle");
let theme = null;
const setTheme = (theme) => (document.documentElement.className = theme);

themeEl.addEventListener("change", (e) => {
  const { value } = e.target;
  theme = `theme${value}`;
  localStorage.setItem("theme", theme);
  setTheme(theme, true);
});

function getThemeFromLS() {
  theme = localStorage.getItem("theme");
  if (theme) {
    themeEl.value = theme.charAt(theme.length - 1);
    setTheme(theme);
  } else {
    theme = `theme${themeEl.value}`;
    setTheme(theme, true);
    localStorage.setItem("theme", theme);
  }
}

document.addEventListener("DOMContentLoaded", getThemeFromLS);

function addNumber(digit) {
  if (resultBtnPressed || calculatorDisplay.textContent === "0") {
    calculatorDisplay.textContent = digit;
    resultBtnPressed = false;
  } else {
    calculatorDisplay.textContent += digit;
  }
}

function addDecimal(decimal) {
  if (resultBtnPressed) {
    return (calculatorDisplay.textContent = 0 + decimal);
  }

  const lastChar = calculatorDisplay.textContent.slice(-1);

  const operators = ["+", "-", "/", "*"];

  if (operators.includes(lastChar)) {
    return (calculatorDisplay.textContent += 0 + decimal);
  }

  // A decimal is added if the last index of a decimal point is less than the last index of any of the operators
  const indexOfLastDecimal = calculatorDisplay.textContent.lastIndexOf(decimal);
  const indexOfLastOperator = Math.max(
    calculatorDisplay.textContent.lastIndexOf("+"),
    calculatorDisplay.textContent.lastIndexOf("-"),
    calculatorDisplay.textContent.lastIndexOf("/"),
    calculatorDisplay.textContent.lastIndexOf("*")
  );

  if (indexOfLastDecimal === -1 || indexOfLastDecimal < indexOfLastOperator) {
    calculatorDisplay.textContent += decimal;
  } else {
    return;
  }
}

function addOperator(operator) {
  resultBtnPressed = false;
  const lastChar = calculatorDisplay.textContent.slice(-1);

  if (lastChar === operator) {
    return;
  }

  const secondToLastChar = calculatorDisplay.textContent.charAt(
    calculatorDisplay.textContent.length - 2
  );

  switch (lastChar) {
    case "+":
    case "-":
      if (secondToLastChar === "*" || secondToLastChar === "/") {
        calculatorDisplay.textContent =
          calculatorDisplay.textContent.slice(0, -2) + operator;
      } else {
        calculatorDisplay.textContent =
          calculatorDisplay.textContent.slice(0, -1) + operator;
      }
      break;

    case "*":
    case "/":
      if (operator === "-") {
        calculatorDisplay.textContent += operator;
      } else {
        calculatorDisplay.textContent =
          calculatorDisplay.textContent.slice(0, -1) + operator;
      }
      break;

    default:
      calculatorDisplay.textContent += operator;
      break;
  }
}

function addComma(num) {
  let str = num.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}
