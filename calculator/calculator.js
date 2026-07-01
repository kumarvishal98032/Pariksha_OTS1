/* ======================================
   PARIKSHA Scientific Calculator
====================================== */

const calculatorButtons = [

    "C","⌫","(",")","%",

    "sin","cos","tan","√","π",

    "log","ln","x²","xʸ","e",

    "7","8","9","÷","1/x",

    "4","5","6","×","±",

    "1","2","3","-","",

    "0",".","=","+",""

];

const buttonContainer = document.getElementById("calcButtons");

calculatorButtons.forEach(text=>{

    const btn=document.createElement("button");

    btn.className="calcBtn";

    btn.innerText=text;

    if(text===""){

        btn.style.visibility="hidden";

    }

    buttonContainer.appendChild(btn);

});
