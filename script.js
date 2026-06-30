// =======================
// CHECK EXAM TIMINGS
// =======================

let questions = [];
let current = 0;
let answers = [];

fetch("https://script.google.com/macros/s/AKfycbyepGGUp8TouZ3-B7uJOiGb5pY4XiqAQLGRfBLuBDuuWJKb3ooJ5z5OFubyJNDauSC4LQ/exec?action=settings")
.then(response => response.json())
.then(data => {

    let now = new Date();
 let start = new Date(data.start.replace(" ", "T"));
let end = new Date(data.end.replace(" ", "T"));

    if (now < start) {

    document.body.innerHTML = `
    <div style="text-align:center;padding:100px;">
        <h1>Pariksha Online Test System</h1>
        <h2>⏳ Test has not started yet.</h2>
        <h3>Exam Starts: ${data.start}</h3>
    </div>`;

    return;
}

if (now > end) {

    document.body.innerHTML = `
    <div style="text-align:center;padding:100px;">
        <h1>Pariksha Online Test System</h1>
        <h2>❌ The test has ended.</h2>
    </div>`;

    return;
}

loadQuestions();

    loadQuestions();

});


// =======================
// LOAD QUESTIONS
// =======================

function loadQuestions() {

    fetch("https://script.google.com/macros/s/AKfycbyepGGUp8TouZ3-B7uJOiGb5pY4XiqAQLGRfBLuBDuuWJKb3ooJ5z5OFubyJNDauSC4LQ/exec?action=questions")
    .then(response => response.json())
    .then(data => {

        questions = data;
    // Randomize question order
        questions.sort(() => Math.random() - 0.5);
        
        questions.forEach(q => {

            if(q.answer === "A") q.answer = 0;
            else if(q.answer === "B") q.answer = 1;
            else if(q.answer === "C") q.answer = 2;
            else if(q.answer === "D") q.answer = 3;

        });

        answers = new Array(questions.length).fill(null);

       // enterFullScreen();
        palette();
        loadQ();

    })
    .catch(error => {

        alert("Failed to load questions");

        console.error(error);

    });

}


// =======================
// DISPLAY QUESTION
// =======================

function loadQ(){

    //water mark
        document.getElementById("studentWatermark").innerHTML =
        document.getElementById("studentName").value;
    // water mark
    
    document.getElementById('qno').innerHTML =
        'Question ' + (current + 1);

    document.getElementById('question').innerHTML =
        questions[current].question;

    let h = '';

    questions[current].options.forEach((o,i)=>{

        h += `
        <div>
            <input type='radio'
                   name='o'
                   ${answers[current] == i ? 'checked' : ''}
                   onclick='answers[current]=${i}; palette();'>

            ${o}
        </div>`;

    });

    document.getElementById('options').innerHTML = h;
}


// =======================
// QUESTION PALETTE
// =======================

function palette(){

    let p='';

    for(let i=0;i<questions.length;i++){

        let color = "#cccccc";

        if(answers[i] !== null){
            color = "#28a745";
        }

        p += `
        <button
            class='palette-btn'
            style='background:${color};
                   color:white;
                   font-weight:bold;'
            onclick='gotoQ(${i})'>

            ${i+1}

        </button>`;
    }

    document.getElementById('palette').innerHTML = p;
}


// =======================
// NAVIGATION
// =======================

function gotoQ(i){

    current = i;
    loadQ();

}

function nextQ(){

    if(current < questions.length - 1){

        current++;
        loadQ();

    }
}

function prevQ(){

    if(current > 0){

        current--;
        loadQ();

    }
}

function clearResponse(){

    answers[current] = null;

    loadQ();
    palette();

}


// =======================
// SUBMIT TEST
// =======================

function submitTest(){

    let score = 0;
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    let report = "";

    for(let i=0;i<questions.length;i++){

        if(answers[i] === null){

            unattempted++;

            report += `
            <div style="border:1px solid #ddd;
                        padding:15px;
                        margin:10px 0;
                        border-radius:8px;
                        background:#fff8f8;">

                <h3>Question ${i+1}</h3>

                <p><b>${questions[i].question}</b></p>

                <p>A. ${questions[i].options[0]}</p>
                <p>B. ${questions[i].options[1]}</p>
                <p>C. ${questions[i].options[2]}</p>
                <p>D. ${questions[i].options[3]}</p>

                <hr>

                <p style="color:orange;">
                ⚪ Your Answer: Not Attempted
                </p>

                <p style="color:green;">
                ✅ Correct Answer:
                ${questions[i].options[questions[i].answer]}
                </p>

            </div>`;
        }

        else if(answers[i] === questions[i].answer){

            correct++;
            score += 4;
        }

        else{

            wrong++;
            score -= 1;

            report += `
            <div style="border:1px solid #ddd;
                        padding:15px;
                        margin:10px 0;
                        border-radius:8px;
                        background:#fff8f8;">

                <h3>Question ${i+1}</h3>

                <p><b>${questions[i].question}</b></p>

                <p>A. ${questions[i].options[0]}</p>
                <p>B. ${questions[i].options[1]}</p>
                <p>C. ${questions[i].options[2]}</p>
                <p>D. ${questions[i].options[3]}</p>

                <hr>

                <p style="color:red;">
                ❌ Your Answer:
                ${questions[i].options[answers[i]]}
                </p>

                <p style="color:green;">
                ✅ Correct Answer:
                ${questions[i].options[questions[i].answer]}
                </p>

            </div>`;
        }
    }

    let accuracy = 0;

    if((correct + wrong) > 0){

        accuracy =
            ((correct/(correct+wrong))*100).toFixed(2);

    }

    let name =
        document.getElementById("studentName").value;


    // SAVE RESULT

    fetch("https://script.google.com/macros/s/AKfycbyepGGUp8TouZ3-B7uJOiGb5pY4XiqAQLGRfBLuBDuuWJKb3ooJ5z5OFubyJNDauSC4LQ/exec",{

        method:"POST",
        mode:"no-cors",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            name:name,
            score:score,
            correct:correct,
            wrong:wrong,
            unattempted:unattempted

        })

    });


    // SHOW RESULT

    document.body.innerHTML = `

    <div style="font-family:Arial;
                padding:30px;
                max-width:900px;
                margin:auto;">

        <h1>Test Result</h1>

        <hr>

        <h2>Student Information</h2>

        <p><b>Name:</b> ${name}</p>

        <hr>

        <h2>Summary</h2>

        <p><b>Total Questions:</b> ${questions.length}</p>
        <p><b>Correct Answers:</b> ${correct}</p>
        <p><b>Wrong Answers:</b> ${wrong}</p>
        <p><b>Unattempted:</b> ${unattempted}</p>
        <p><b>Accuracy:</b> ${accuracy}%</p>

        <hr>

        <h2>Final Score</h2>

        <h1>${score} Marks</h1>

        <h2>Performance</h2>

        <h3>
        ${
            score >= 180 ? "Outstanding ⭐" :
            score >= 160 ? "Excellent ✅" :
            score >= 140 ? "Good 👍" :
            score >= 120 ? "Average 📘" :
            "Needs Improvement 📚"
        }
        </h3>

        <button onclick="window.print()">
        📄 Download / Print PDF
        </button>

        <hr>

        <h2>Wrong / Unattempted Questions</h2>

        ${report}

    </div>`;
}


// =======================
// TIMER
// =======================

let t = 3600;

setInterval(()=>{

    let m = Math.floor(t/60);
    let s = t%60;

    let el = document.getElementById('timer');

    if(el){

        el.innerHTML =
            String(m).padStart(2,'0') + ':' +
            String(s).padStart(2,'0');
    }

    t--;

    if(t < 0){

        submitTest();

    }

},1000);


// ===== ANTI-CHEATING =====

let violationCount = 0;

document.addEventListener("visibilitychange", function () {

    if (document.hidden) {

        violationCount++;

        alert(
            "⚠ Warning!\n\n" +
            "You have left the exam window.\n\n" +
            "Violation Count: " + violationCount
        );

        // Auto submit after 5 violations

        if (violationCount >= 5) {

            alert(
                "You have exceeded the allowed violations.\n\n" +
                "Your test will now be submitted automatically."
            );

            submitTest();
        }
    }
});



function enterFullScreen() {

    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }

}


document.addEventListener("fullscreenchange", function () {

    // If student exits fullscreen
    if (!document.fullscreenElement) {

        violationCount++;

        alert(
            "⚠ Warning!\n\n" +
            "You exited Full Screen Mode.\n\n" +
            "Violation Count: " + violationCount + "/3"
        );

        // Auto submit after 3 violations
        if (violationCount >= 3) {

            alert(
                "Maximum violations reached.\n\n" +
                "Your test will now be submitted."
            );

            submitTest();
        }

        // Re-enter fullscreen after 1 second
        setTimeout(() => {

            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }

        }, 1000);
    }
});


function startExam() {

    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }

    // Hide button after click
    document.getElementById("startBtn").style.display = "none";
}



// Disable Right Click
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
});

// Disable Copy, Paste and Cut
document.addEventListener("copy", function(e){
    e.preventDefault();
});

document.addEventListener("paste", function(e){
    e.preventDefault();
});

document.addEventListener("cut", function(e){
    e.preventDefault();
});

// Disable Keyboard Shortcuts

document.addEventListener("keydown", function(e){

    // F12
    if(e.key === "F12"){
        e.preventDefault();
    }

    // Ctrl+U
    if(e.ctrlKey && e.key.toLowerCase() === "u"){
        e.preventDefault();
    }

    // Ctrl+S
    if(e.ctrlKey && e.key.toLowerCase() === "s"){
        e.preventDefault();
    }

    // Ctrl+P
    if(e.ctrlKey && e.key.toLowerCase() === "p"){
        e.preventDefault();
    }

    // Ctrl+Shift+I/J/C
    if(e.ctrlKey && e.shiftKey &&
       ["I","J","C"].includes(e.key.toUpperCase())){
        e.preventDefault();
    }

});


document.getElementById("examDate").innerHTML =
new Date().toLocaleDateString();

// calculator part start
// Open Calculator
document.getElementById("calculatorBtn").onclick=function(){

    document.getElementById("calculatorWindow").style.display="block";

}

// Close Calculator
document.getElementById("closeCalculator").onclick=function(){

    document.getElementById("calculatorWindow").style.display="none";

}

//calculator part ends


/* ===========================
   DRAGGABLE CALCULATOR
=========================== */

dragElement(document.getElementById("calculatorWindow"));

function dragElement(elmnt) {

    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    document.getElementById("calculatorHeader").onmousedown = dragMouseDown;

    function dragMouseDown(e) {

        e = e || window.event;

        e.preventDefault();

        pos3 = e.clientX;

        pos4 = e.clientY;

        document.onmouseup = closeDragElement;

        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {

        e = e || window.event;

        e.preventDefault();

        pos1 = pos3 - e.clientX;

        pos2 = pos4 - e.clientY;

        pos3 = e.clientX;

        pos4 = e.clientY;

        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

        elmnt.style.right = "auto";

        elmnt.style.bottom = "auto";
    }

    function closeDragElement() {

        document.onmouseup = null;

        document.onmousemove = null;
    }
}
/* ===========================
   DRAGGABLE CALCULATOR ends
=========================== */


const calculatorButtons=[

"sin","cos","tan","log","ln",

"√","x²","xʸ","π","e",

"(",")","C","⌫","/",

"7","8","9","*","%",

"4","5","6","-","1/x",

"1","2","3","+","±",

"0",".","="

];

let html="";

calculatorButtons.forEach(btn=>{

html+=`

<button class="calcBtn">

${btn}

</button>

`;

});

document.getElementById("calcButtons").innerHTML=html;
