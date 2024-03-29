var maxHeight, maxWidth;

function startIt() {
    getDimensions();
    main()
}

function getDimensions() {
    if (typeof(window.innerWidth) == 'number') {
        maxWidth = window.innerWidth;
        maxHeight = window.innerHeight
    } else {
        maxWidth = document.documentElement.clientWidth;
        maxHeight = document.documentElement.clientHeight
    }
}

function rectangle(name, x, y, width, height, centre_colour, edge_colour) {
    x = Math.floor(x + 0.49);
    y = Math.floor(y + 0.49);
    if (x < 0 || y < 0 || width <= 0 || height <= 0 || width > (maxWidth - 10) || height > (maxHeight - 10)) {
        console.log("rectangle - warning - not on screen")
    }
    var elePosn = document.getElementById(name);
    if (elePosn) {
        if (elePosn.nodeName != "DIV") {
            console.log("rectangle - name already in use for non-rectangle/text");
            return
        }
    } else {
        elePosn = document.createElement("div");
        elePosn.id = name;
        document.body.appendChild(elePosn)
    }
    elePosn.style.position = "absolute";
    elePosn.style.left = x + "px";
    elePosn.style.top = y + "px";
    elePosn.style.width = width + "px";
    elePosn.style.height = height + "px";
    elePosn.style.background = centre_colour;
    if (edge_colour) elePosn.style.border = "medium solid " + edge_colour
}

function text(name, contents, x, y, size, colour, attribute, value, font) {
    x = Math.floor(x + 0.49);
    y = Math.floor(y + 0.49);
    if (x < 0 || y < 0 || x > (maxWidth - 10) || y > (maxHeight - 10)) {
        console.log("text - warning - not on screen")
    }
    var elePosn = document.getElementById(name);
    if (elePosn) {
        if (elePosn.nodeName != "DIV") {
            console.log("text - name already in use for non-rectangle/text");
            return
        }
    } else {
        elePosn = document.createElement("div");
        elePosn.id = name;
        document.body.appendChild(elePosn)
    }
    elePosn.style.position = "absolute";
    elePosn.style.left = x + "px";
    elePosn.style.top = y + "px";
    elePosn.style.color = colour;
    elePosn.style.fontSize = size + "px";
    if (font) elePosn.style.fontFamily = font;
    if (attribute) {
        elePosn.setAttribute(attribute, value)
    }
    elePosn.innerHTML = contents
}

function move(name, x, y) {
    x = Math.floor(x + 0.49);
    y = Math.floor(y + 0.49);
    if (x < 0 || y < 0 || x > (maxWidth - 10) || y > (maxHeight - 10)) {
        console.log("move - warning - not on screen")
    }
    var elePosn = document.getElementById(name);
    if (!elePosn) {
        console.log("move- name " + name + " does not exist");
        return
    }
    elePosn.style.position = "absolute";
    elePosn.style.left = x + "px";
    elePosn.style.top = y + "px"
}

function remove(name) {
    var elePosn = document.getElementById(name);
    if (elePosn) document.body.removeChild(elePosn)
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function button(name, text, x, y, func) {
    x = Math.floor(x + 0.49);
    y = Math.floor(y + 0.49);
    if (x < 0 || y < 0 || x > (maxWidth - 10) || y > (maxHeight - 10)) {
        console.log("button - warning - not on screen")
    }
    var elePosn = document.getElementById(name);
    if (elePosn) {
        if (elePosn.nodeName != "FORM") {
            console.log("button - name already in use for non-button");
            return
        }
    } else {
        elePosn = document.createElement("form");
        elePosn.id = name;
        document.body.appendChild(elePosn)
    }
    elePosn.style.position = "absolute";
    elePosn.style.left = x + "px";
    elePosn.style.top = y + "px";
    elePosn.innerHTML = '<input type="button" value="' + text + '" onClick="' + func + '">'
}

function image(name, fileName, x, y, desc) {
    x = Math.floor(x + 0.49);
    y = Math.floor(y + 0.49);
    if (x < 0 || y < 0 || x > (maxWidth - 10) || y > (maxHeight - 10)) {
        console.log("image - warning - not on screen")
    }
    var elePosn = document.getElementById(name);
    if (elePosn) {
        if (elePosn.nodeName != "IMG") {
            console.log("image- name already in use for non-image");
            return
        }
    } else {
        elePosn = document.createElement("img");
        elePosn.id = name;
        document.body.appendChild(elePosn)
    }
    elePosn.style.position = "absolute";
    elePosn.style.left = x + "px";
    elePosn.style.top = y + "px";
    elePosn.src = fileName;
    elePosn.alt = desc
}

function imageOrder(name, z) {
    var elePosn = document.getElementById(name);
    if (!elePosn) {
        console.log("imageOrder - name " + name + " does not exist");
        return
    }
    elePosn.style.zIndex = z
}

function getMilliseconds() {
    var d = new Date();
    return d.getTime()
}

function delay(ms, fn) {
    var tmp = fn + "(";
    for (var i = 2; i < arguments.length; i++) {
        if (i > 2) tmp += ",";
        tmp += arguments[i]
    }
    tmp += ")";
    return setTimeout(tmp, ms)
}
var chrsToMatch = [];
var dnFnCall = [];
var upFnCall = [];
var chrsDown = [];

function trapKey(chr, fnDn, fnUp) {
    var indx = chrsToMatch.indexOf(chr);
    if (indx == -1) {
        indx = chrsToMatch.push(chr) - 1;
        chrsDown[indx] = 0
    }
    dnFnCall[indx] = fnDn;
    upFnCall[indx] = fnUp
}

function keyDown(e) {
    var x = e.keyCode;
    if (x == 8) {
        var d = e.srcElement || e.target;
        var preventKeyPress;
        switch (d.tagName.toUpperCase()) {
            case 'TEXTAREA':
                preventKeyPress = d.readOnly || d.disabled;
                break;
            case 'INPUT':
                preventKeyPress = d.readOnly || d.disabled || (d.attributes["type"] && $.inArray(d.attributes["type"].value.toLowerCase(), ["radio", "checkbox", "submit", "button"]) >= 0);
                break;
            case 'DIV':
                preventKeyPress = d.readOnly || d.disabled || !(d.attributes["contentEditable"] && d.attributes["contentEditable"].value == "true");
                break;
            default:
                preventKeyPress = true;
                break;
        }
        if (preventKeyPress) e.preventDefault();
    }
    var keychar = String.fromCharCode(x);
    if (x == 27 || x == 9) keychar = x;
    var indx = chrsToMatch.indexOf(keychar);
    if (indx == -1) {} else {
        chrsDown[indx] = 1;
        if (dnFnCall[indx]) window[dnFnCall[indx]](e)
    }
}

function keyUp(e) {
    var x = e.keyCode;
    var keychar = String.fromCharCode(x);
    if (x == 27 || x == 9) keychar = x;
    var indx = chrsToMatch.indexOf(keychar);
    if (indx != -1 && chrsDown[indx] == 1) {
        chrsDown[indx] = 0;
        if (upFnCall[indx]) window[upFnCall[indx]](e)
    }
}
var myTimeout = false;
var myTimeout1 = false;
var myTimeout2 = false;
var accumulator = 0;
var pCounter = 0;
var programText = "";
var programHTML = "";
var programEdit = "";
var codeText = "";
var output1 = "";
var output2 = "";
var outputCount = 0;
var outputCount2 = 0;
var address = [];
var instructionTxt = [];
var speed;
var defaultSpeed = 175;
var inst;
var addr;
var waitingForInput = false;
var modifyingProgram = false;
var s2T = 1;
var stopping;
var runRate;
var valW = 5;
var oneStep;
var assembleOption = 4;
var monospace = '"Courier New Bold",courier,monospace';
var running = false;
var submit;
instructionTxt[0] = "Program HALTED, RESET, LOAD, SELECT or alter memory";
instructionTxt[1] = "ADD to accumulator the contents of RAM address ";
instructionTxt[2] = "SUBTRACT from accumulator the contents of RAM address ";
instructionTxt[3] = "STORE value in accumulator at RAM address ";
instructionTxt[4] = "Bad instruction ";
instructionTxt[5] = "LOAD into accumulator the contents of RAM address ";
instructionTxt[6] = "BRANCH to memory address ";
instructionTxt[7] = "BRANCH (if zero) to memory address ";
instructionTxt[8] = "BRANCH (if zero or positive) to memory address ";
instructionTxt[9] = "INPUT a value into accumulator";
instructionTxt[10] = "OUTPUT value stored in accumulator";
instructionTxt[11] = "OUTPUT accumulator contents as a character";

function main() {
    window.document.title = "Little Man Computer - CPU simulator";
    trapKey(9, "tabKey", null);
    trapKey(27, "escKey", null);
    rectangle("background", 0, 0, 885, 540, "LightBlue", "LightBlue");
    image("layout", "lmcgraphic_plh.gif", 0, 0, "LMC layout");
    image("pcMarker", "pcMarker.png", 479, 46, "PC marker");
    rectangle("program", 9, 42, 172, 432, "white", "");
    rectangle("code", 193, 42, 94, 432, "white", "");
    rectangle("output1", 307, 27, 30, 117, "white", "");
    rectangle("output2", 341, 27, 30, 117, "white", "");
    rectangle("input", 309, 488, 58, 20, "white", "white");
    rectangle("pc", 310, 206, 20, 20, "white", "white");
    rectangle("ir", 320, 248, 10, 20, "white", "white");
    rectangle("ar", 376, 280, 20, 20, "white", "white");
    rectangle("acc", 340, 337, 38, 20, "white", "white");
    rectangle("message", 485, 480, 381, 19, "white", "white");
    button("assemble", "ASSEMBLE INTO RAM", 3, 482, "assemble()");
    button("run", "RUN", 174, 482, "run()");
    button("step", "STEP", 235, 482, "step3()");
    button("reset", "RESET", 3, 505, "reset1()");
    if (window.File && window.FileReader) {
        text("load", loadText, 75, 505, 12, "black")
    } else {
        alert("The File APIs are not supported in this browser.")
    }
    button("help", "HELP", 137, 505, "window.open('help.html')");
    text("ch", menu, 201, 506, 12, "black");
    text("op", options, 470, 513, 12, "black");
    updatePC(0);
    updateACC(0);
    text("program", "", 9, 42, 10, "black", "onclick", "openProgram(this)", monospace);
    message("SELECT or enter a program, LOAD a file or alter memory");
    text("ver", "V1.3", 568, 8, 12, "black");
    delay(1, "main1")
}
var holdI;

function main1() {
    holdI = 0;
    runRate = getMilliseconds();
    main2()
}

function main2() {
    for (var i = 0; i < 5; ++i) {
        rectangle("a" + holdI, 472 + (holdI % 10) * 37, 60 + Math.floor(holdI / 10) * 42, 28, 16, "white", "gray");
        setAddress(holdI, 0);
        ++holdI
    }
    if (holdI >= 100) delay(1, "main3");
    else delay(1, "main2")
}

function main3() {
    runRate = (getMilliseconds() - runRate) / 20;
    console.log("runRate for updates is " + runRate)
}

function escKey(e) {
    if (!waitingForInput) return;
    if (myTimeout || myTimeout1 || myTimeout2) return;
    e.preventDefault();
    waitingForInput = false;
    if (savOpenAddress) {
        var x = parseInt(savOpenAddress.id[1]);
        if (savOpenAddress.id.length == 3) x = x * 10 + parseInt(savOpenAddress.id[2]);
        setAddress(x, address[x]);
        savOpenAddress = false
    } else if (modifyingProgram) {
        modifyingProgram = false;
        textToHtml()
    } else {
        updatePC(pCounter);
        updatePCmarker(pCounter)
    }
    message("ESC pressed to abort input")
}

function tabKey(e) {
    e.preventDefault();
    if (!waitingForInput) return;
    if (myTimeout || myTimeout1 || myTimeout2) return;
    if (savOpenAddress) {
        var x = parseInt(savOpenAddress.id[1]);
        if (savOpenAddress.id.length == 3) x = x * 10 + parseInt(savOpenAddress.id[2]);
        var ok = true;
        var inp = document.getElementById("aForm");
        if (isNaN(inp.value)) ok = false;
        loseAddress(inp);
        if (x < 99) {
            ++x;
            if (ok) message("Modifying memory contents");
            var elePosn = document.getElementById("a" + x);
            elePosn.innerHTML = '<form action="javascript:addressSubmit()"><input id="aForm" type="text" style="padding:0; border:0; width:60px;"></form>';
            document.getElementById("aForm").focus();
            document.getElementById("aForm").setAttribute("onblur", "loseAddress(this)");
            waitingForInput = true;
            savOpenAddress = elePosn
        }
    } else if (modifyingProgram) {
        var textarea = document.getElementById('pForm');
        var s = textarea.selectionStart;
        textarea.value = textarea.value.substring(0, textarea.selectionStart) + "\t" + textarea.value.substring(textarea.selectionEnd);
        textarea.selectionEnd = s + 1
    } else {
        var inp = document.getElementById("PCForm");
        losePC(inp)
    }
}

function openProgram(inp) {
    if (waitingForInput) return;
    if (myTimeout || myTimeout1 || myTimeout2) return;
    submit = true;
    message("Modifying Program Area");
    inp.style.overflow = "initial";
    inp.innerHTML = '<form action="javascript:programSubmit()"><textarea id="pForm" rows="32" cols="25" style="padding:0;border:0;font-size:10px;" spellcheck="false">' + programEdit + '</textarea><input type="submit" value="Submit" style="color:red;font-weight:bold;margin:5px"><input onclick="programCancel()" type="submit" value="Cancel" style="color:red;font-weight:bold;margin:5px"></form>';
    document.getElementById("pForm").focus();
    waitingForInput = true;
    modifyingProgram = true
}

function programSubmit() {
    if (!waitingForInput) {
        alert("Bad input - not waiting for input");
        return false
    }
    var elePosn = document.getElementById("pForm");
    waitingForInput = false;
    modifyingProgram = false;
    if (submit) {
        programText = elePosn.value;
        textToHtml();
        assemble();
    } else {
        text("program", programHTML, 9, 42, (assembleOption == 3) ? 9 : 10, "black", "onclick", "openProgram(this)", monospace);
        document.getElementById("program").style.overflow = "auto";
    }
    return
}

function programCancel() {
    submit = false;
}

function ch2() {
    reset1();
    var ch = document.getElementById("ch1").value;
    if (ch > 0 && ch < 11) {
        programText = program[ch];
        textToHtml();
        assemble()
    } else {
        message("Bad selection")
    }
}

function op2() {
    var op = document.getElementById("op1").value;
    if (op == 1) {
        for (var i = 0; i < 100; ++i) {
            setAddress(i, 0)
        }
        text("op", options, 470, 513, 12, "black")
    } else if (op > 1 && op < 5) {
        reset1();
        assembleOption = op;
        text("program", programHTML, 9, 42, (assembleOption == 3) ? 9 : 10, "black", "onclick", "openProgram(this)", monospace);
        assemble()
    } else if (op > 4 && op < 8) {
        defaultSpeed = 175;
        if (op == 5) defaultSpeed = 1;
        if (op == 7) defaultSpeed = 250;
        if (running) {
            speed = defaultSpeed;
            doSpeed()
        }
    }
}

function read_chg(inp) {
    reset1();
    var fs = inp['files'];
    if (!fs) {
        alert("BAD FILE SELECTION RETURN");
        return
    }
    var fr = new FileReader;
    fr.readAsText(fs[0], 'utf-8');
    fr.onload = function() {
        programText = fr.result;
        textToHtml();
        assemble();
        text("ch", menu, 201, 506, 12, "black");
        text("load", loadText, 75, 505, 12, "black")
    }
}
var program = [];
program[1] = "\tINP\n\tSTA 99\n\tINP\n\tADD 99\n\tOUT\n\tHLT\n// Output the sum of two numbers\n";
program[2] = "\tINP\n\tSTA FIRST\n\tINP\n\tADD FIRST\n\tOUT\n\tINP\n\tSUB FIRST\n\tOUT\n\tHLT\nFIRST\tDAT\n// Input three numbers.\n// Output the sum of the first two\n// and the third minus the first\n";
program[3] = "\tINP\n\tSTA FIRST\n\tINP\n\tSTA SECOND\n\tSUB FIRST\n\tBRP HIGHER\n\tLDA FIRST\n\tBRA DONE\nHIGHER\tLDA SECOND\nDONE\tOUT\n\tHLT\nFIRST\tDAT\nSECOND\tDAT\n// Input two numbers and output the higher\n\t";
program[4] = "\tINP\n\tSTA VALUE\n\tLDA ZERO\n\tSTA TRINUM\n\tSTA N\nLOOP\tLDA TRINUM\n\tSUB VALUE\n\tBRP ENDLOOP\n\tLDA N\n\tADD ONE\n\tSTA N\n\tADD TRINUM\n\tSTA TRINUM\n\tBRA LOOP\nENDLOOP\tLDA VALUE\n\tSUB TRINUM\n\tBRZ EQUAL\n\tLDA ZERO\n\tOUT\n\tBRA DONE\nEQUAL\tLDA N\n\tOUT\nDONE\tHLT\nVALUE\tDAT\nTRINUM\tDAT\nN\tDAT\nZERO\tDAT 000\nONE\tDAT 001\n// Test if input is a triangular number\n// If is sum of 1 to n output n\n// otherwise output zero\n";
program[5] = "\tINP\n\tSTA VALUE\n\tLDA ZERO\n\tSTA SUM\n\tSTA COUNT\nLOOP\tLDA SUM\n\tADD VALUE\n\tSTA SUM\n\tLDA COUNT\n\tADD ONE\n\tSTA COUNT\n\tSUB VALUE\n\tBRP DONE\n\tBRA LOOP\nDONE\tLDA SUM\n\tOUT\n\tHLT\nVALUE\tDAT\n\tSUM DAT\n\COUNT\tDAT\nZERO\tDAT 000\nONE\tDAT 001\n// Output the square of a number input\n";
program[6] = "\tINP\n\tSTA VALUE\n\tLDA ONE\n\tSTA MULT\nOUTER\tLDA ZERO\n\tSTA SUM\n\tSTA TIMES\nINNER\tLDA SUM\n\tADD VALUE\n\tSTA SUM\n\tLDA TIMES\n\tADD ONE\n\tSTA TIMES\n\tSUB MULT\n\tBRZ NEXT\n\tBRA INNER\n\tNEXT LDA SUM\n\tOUT\n\tLDA MULT\n\tADD ONE\n\tSTA MULT\n\tSUB VALUE\n\tBRZ OUTER\n\tBRP DONE\n\tBRA OUTER\nDONE\tHLT\nVALUE\tDAT 0 // Times table for\nMULT\tDAT 0 // one input number\nSUM\tDAT\nTIMES\tDAT\nCOUNT\tDAT\nZERO\tDAT 000\nONE\tDAT 001\n";
program[7] = "LDA lda1\nSTA outputList\nLDA sta1\nSTA store\nLDA zero\nSTA listSize\ninputLoop INP\nBRZ resetLoop\nstore DAT 380\nLDA store\nADD increment\nSTA store\nLDA listSize\nADD increment\nSTA listSize\nBRA inputLoop\nresetLoop LDA lda1\nSTA load1\nADD increment\nSTA load2\nLDA sta1\nSTA store1\nADD increment\nSTA store2\nLDA listSize\nSUB increment\nSTA loopCount\nLDA zero\nSTA isChange\nload1 DAT 580\nSTA buffA\nload2 DAT 581\nSTA buffB\ncmp SUB buffA\nBRP nextItem\nswap LDA buffB\nstore1 DAT 380\nLDA buffA\nstore2 DAT 381\nLDA increment\nSTA isChange\nnextItem LDA store1\nADD increment\nSTA store1\nADD increment\nSTA store2\nLDA load1\nADD increment\nSTA load1\nADD increment\nSTA load2\nLDA loopCount\nSUB increment\nSTA loopCount\nBRZ isFinished\nBRA load1\nisFinished LDA isChange\nBRZ outputList\nbra resetLoop\noutputList DAT 580\nOUT\nLDA outputList\nADD increment\nSTA outputList\nLDA listSize\nSUB increment\nSTA listSize\nBRZ end\nBRA outputList\nend HLT\nzero DAT 0\nbuffA DAT 0\nbuffB DAT 0\nisChange DAT 0\nincrement DAT 1\nlistSize DAT 0\nloopCount DAT 0\nsta1 DAT 380\nlda1 DAT 580\n";
program[8] = "BRA writeLoop\ns1 DAT\ns2 DAT\ns3 DAT\ns4 DAT\ns5 DAT\ns6 DAT\ns7 DAT\ns8 DAT\ns9 DAT\nwriteLoop INP\nBRZ readLoop\nwriteStart DAT 300\nLDA writeStart \nADD one\nSTA writeStart\nLDA count\nADD one\nSTA count\nBRA writeLoop \nreadLoop LDA count\nSUB one\nSTA count\nBRZ done\nreadStart DAT 500\nOUT\nLDA readStart\nADD one\nSTA readStart\nBRA readLoop \ndone HLT\ncount DAT 1\none DAT 1\n";
program[9] = "lda space\nsta char\nloop lda char\notc\nadd one\nsta char\nsub max\nbrz end\nbra loop\nend hlt\nspace dat 32\none dat 1\nmax dat 127\nchar dat\n// output the basic ASCII characters\n";
program[10] = "lda space\nsta char\nloop lda char\nout\nlda space\notc\nlda char\notc\nadd one\nsta char\nsub max\nbrz end\nbra loop\nend hlt\nspace dat 32\none dat 1\nmax dat 97\nchar dat\n// start of ASCII character table\n";
var menu = '<select id="ch1" onchange="ch2()"><option value="0">SELECT</option><option value="1">add</option><option value="2">add/subtr</option><option value="3">max</option><option value="4">is sum 1-n</option><option value="5">square</option><option value="6">times table</option><option value="7">bubble sort</option><option value="8">overwrite</option><option value="9">ascii</option><option value="10">ascii table</option></select>';
var loadText = '<input type="file" id="read-input" onchange="read_chg(this)" autocomplete="off" style="display:none;" ><button onclick="document.getElementById(&#39;read-input&#39;).click()">LOAD</button>';
var inputForm = '<form action="javascript:inputSubmit()"><input id="iForm" type="text" style="padding:0; border:0; width:60px; font-size:16px;"></form>';
var options = '<select id="op1" onchange="op2()"><option value="0">OPTIONS</option><option value="1">clear memory</option><option value="2">show op codes</option><option value="3">show decimal</option><option value="4">hide op codes</option><option value="5">default fast</option><option value="6">default normal</option><option value="7">default slow</option></select>';

function textToHtml() {
    programHTML = "";
    programEdit = "";
    var lines = 0;
    var count = 0;
    var pLength = programText.length;
    if (programText[pLength - 1] != "\n") {
        programText += "\n";
        ++pLength
    }
    for (var n = 0; n < pLength; ++n) {
        var letter = programText[n];
        if (letter == '\t') {
            letter = ' '
        }
        if (letter == ' ' && n + 1 < pLength && programText[n + 1] == ' ') continue;
        if (letter != '\n' && letter < ' ') continue;
        if (count == 0) {
            if (letter == '\n') continue;
            if (letter == ' ') continue;
            if (letter == '/') count = 10;
            if (n + 3 < pLength && instruction((letter + programText[n + 1] + programText[n + 2]).toUpperCase()) < 100 && programText[n + 3] <= ' ') {
                programHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                programEdit += "        ";
                count = 7
            }
        }
        while (count < 7 && letter == ' ' && programText[n + 1] > ' ') {
            programEdit += " ";
            programHTML += "&nbsp;";
            ++count
        }
        if (letter == '\n') {
            if (n + 1 < pLength) programHTML += "<br />";
            programEdit += "\n";
            count = 0;
            ++lines
        } else {
            ++count;
            programHTML += letter;
            programEdit += letter
        }
    }
    text("program", programHTML, 9, 42, (assembleOption == 3) ? 9 : 10, "black", "onclick", "openProgram(this)", monospace);
    document.getElementById("program").style.overflow = "auto"
}

function message(y) {
    text("message", y, 485, 480, 14, "#FF0000")
}

function assemble() {
    if (waitingForInput) return;
    reset1();
    for (var i = 0; i < 100; ++i) {
        setAddress(i, 0)
    }
    var pLength = programText.length;
    if (programText[pLength - 1] != "\n") {
        programText += "\n";
        ++pLength
    }
    var lineCount = 0;
    var wordCount = 0;
    var tempWordText = "";
    var labelText = [];
    var instText = [];
    var offsetText = [];
    for (var n = 0; n < pLength; ++n) {
        var letterText = programText[n];
        if (letterText == '\t') letterText = ' ';
        if (letterText == ' ' || letterText == '\n') {
            if (tempWordText != "") {
                if (wordCount == 0 && instruction(tempWordText.toUpperCase()) < 100) {
                    labelText[lineCount] = 0;
                    ++wordCount
                }
                if (wordCount == 0) labelText[lineCount] = tempWordText;
                else if (wordCount == 1) instText[lineCount] = tempWordText.toUpperCase();
                else if (wordCount == 2) offsetText[lineCount] = tempWordText;
                tempWordText = "";
                ++wordCount
            }
        }
        if (letterText == '\n') {
            if (wordCount > 0) {
                if (wordCount == 1) instText[lineCount] = 0;
                if (wordCount < 3) offsetText[lineCount] = 0;
                if (labelText[lineCount] != "//") {
                    ++lineCount
                }
                wordCount = 0
            }
        }
        if (letterText > ' ') {
            tempWordText += letterText
        }
    }
    if (lineCount > 99) lineCount = 99;
    var r = 0;
    var error = false;
    codeText = "";
    while (r < lineCount) {
        if (r < 10) codeText += '0';
        codeText += r + ' ';
        var inst = instruction(instText[r]);
        if (inst == 100) {
            error = "unknown instruction at line " + r + ' ' + instText[r];
            break
        }
        var addr = 0;
        var cT = instructions[inst];
        if (inst > 0 && inst < 10) {
            if (isNaN(offsetText[r])) {
                var j = 0;
                for (var i = 0; i < lineCount; ++i) {
                    if (offsetText[r] == labelText[i]) break;
                    if (labelText[i] != "//") ++j
                }
                if (i < lineCount) {
                    addr = j
                } else {
                    error = "unknown address label at line " + r;
                    break
                }
            } else {
                addr = +offsetText[r]
            }
            if (assembleOption != 2) {
                cT += ' ';
                if (addr >= 0 && addr < 10) cT += '0' + addr;
                else cT += addr
            }
        }
        var inst2;
        if (inst == 9) inst2 = 0;
        else if (inst == 10) inst2 = 901;
        else if (inst == 11) inst2 = 902;
        else if (inst == 12) inst2 = 922;
        else inst2 = inst * 100;
        inst2 = (+inst2) + (+addr);
        if (assembleOption == 3) {
            if (inst2 >= 0) {
                if (inst2 < 10) codeText += '00';
                else if (inst2 < 100) codeText += '0';
                codeText += inst2 + ' '
            } else {
                if (inst2 > -10) codeText += '-0' + (-inst2) + ' ';
                else codeText += inst2 + ' '
            }
        }
        codeText += cT;
        if (assembleOption == 2) {
            if (inst2 < 0 || inst == 9) {
                codeText += ' ' + inst2
            } else {
                if (inst2 < 10) codeText += ' 0 0' + inst2;
                else if (inst2 < 100) codeText += ' 0 ' + inst;
                else {
                    if (inst2 % 100 < 10) codeText += ' ' + Math.floor(inst2 / 100) + ' 0' + (inst2 % 100);
                    else codeText += ' ' + Math.floor(inst2 / 100) + ' ' + (inst2 % 100)
                }
            }
        }
        codeText += '<br />';
        setAddress(r, inst2);
        ++r
    }
    text("code", codeText, 193, 42, (assembleOption == 3) ? 9 : 10, "black", "", "", monospace);
    document.getElementById("code").style.overflow = "auto";
    if (error) message(error);
    else message("RUN/STEP your program, SELECT, LOAD or edit program")
}

function updatePC(x) {
    pCounter = x;
    if (x < 10) x = '0' + x;
    text("pc", x, 310, 206, 16, "black", "onclick", "openPC(this)")
}

function openPC(inp) {
    if (waitingForInput) return;
    if (myTimeout || myTimeout1 || myTimeout2) return;
    message("Modifying Program Counter contents");
    inp.innerHTML = '<form action="javascript:PCSubmit()"><input id="PCForm" type="text" style="padding:0; border:0; width:20px;"></form>';
    document.getElementById("PCForm").focus();
    document.getElementById("PCForm").setAttribute("onblur", "losePC(this)");
    waitingForInput = true
}

function PCSubmit() {
    if (!waitingForInput) {
        alert("Bad input - not waiting for input");
        return
    }
    var elePosn = document.getElementById("PCForm");
    elePosn.removeAttribute("onblur");
    if (isNaN(elePosn.value) || elePosn.value == "") {
        alert("Bad input - must be a number");
        return
    }
    var value = parseInt(elePosn.value);
    if (isNaN(value) || value > 99 || value < 0) {
        alert("Bad input - number out of range for PC");
        return
    }
    updatePC(value);
    updatePCmarker(value);
    waitingForInput = false;
    if (programText == "") message("SELECT a program, LOAD a file or alter memory or program");
    else message("ASSEMBLE, RUN/STEP or alter memory or program")
}

function losePC(inp) {
    if (!waitingForInput) return;
    if (isNaN(inp.value) || inp.value == "") {
        document.getElementById("PCForm").removeAttribute("onblur");
        updatePC(pCounter);
        waitingForInput = false;
        if (programText == "") message("SELECT a program, LOAD a file or alter memory or program");
        else message("ASSEMBLE, RUN/STEP or alter memory or program")
    } else PCSubmit()
}

function updatePCmarker(x) {
    var ypCounter = Math.floor(x / 10);
    var xpCounter = x - (ypCounter * 10);
    move("pcMarker", 479 + (xpCounter * 37), 46 + (ypCounter * 42))
}

function updateACC(y) {
    while (y > 999) y -= 1999;
    while (y < -999) y = (+y) + 1999;
    accumulator = y;
    if (y >= 0) {
        if (y < 10) y = '&nbsp;00' + y;
        else if (y < 100) y = '&nbsp;0' + y;
        else y = '&nbsp;' + y
    } else {
        if (y > -10) y = '-00' + (-y);
        else if (y > -100) y = '-0' + (-y)
    }
    text("acc", y, 340, 337, 16, "black")
}
var instructions = ["HLT", "ADD", "SUB", "STA", "STO", "LDA", "BRA", "BRZ", "BRP", "DAT", "INP", "OUT", "OTC"];

function instruction(text) {
    for (var k = 0; k < 13; ++k) {
        if (text == instructions[k]) break
    }
    if (k > 12) return 100;
    if (k == 4) return 3;
    return k
}
var savOpenAddress = false;

function openAddress(inp) {
    if (waitingForInput) return;
    if (myTimeout || myTimeout1 || myTimeout2) return;
    message("Modifying memory contents");
    inp.innerHTML = '<form action="javascript:addressSubmit()"><input id="aForm" type="text" style="padding:0; border:0; width:60px;"></form>';
    document.getElementById("aForm").focus();
    document.getElementById("aForm").setAttribute("onblur", "loseAddress(this)");
    waitingForInput = true;
    savOpenAddress = inp
}

function addressSubmit() {
    if (!waitingForInput) {
        alert("Bad input - not waiting for input");
        return
    }
    var elePosn = document.getElementById("aForm");
    if (isNaN(elePosn.value) || elePosn.value == "") {
        alert("Bad input - must be a number");
        return
    }
    var value = parseInt(elePosn.value);
    if (isNaN(value) || value > 999 || value < -999) {
        alert("Bad input - number out of range");
        return
    }
    document.getElementById("aForm").removeAttribute("onblur");
    var x = parseInt(savOpenAddress.id[1]);
    if (savOpenAddress.id.length == 3) x = x * 10 + parseInt(savOpenAddress.id[2]);
    setAddress(x, value);
    waitingForInput = false;
    savOpenAddress = false;
    if (programText == "") message("SELECT a program, LOAD a file or alter memory or program");
    else message("ASSEMBLE, RUN/STEP or alter memory or program")
}

function loseAddress(inp) {
    if (!waitingForInput) return;
    if (isNaN(inp.value) || inp.value == "") {
        document.getElementById("aForm").removeAttribute("onblur");
        var x = parseInt(savOpenAddress.id[1]);
        if (savOpenAddress.id.length == 3) x = x * 10 + parseInt(savOpenAddress.id[2]);
        setAddress(x, address[x]);
        waitingForInput = false;
        savOpenAddress = false;
        message("BAD input ignored")
    } else addressSubmit()
}

function setAddress(x, y) {
    if (isNaN(y)) alert("attempt to store NaN " + y);
    address[x] = y;
    if (y >= 0) {
        if (y < 10) y = '&nbsp;00' + y;
        else if (y < 100) y = '&nbsp;0' + y;
        else y = '&nbsp;' + y
    } else {
        if (y > -10) y = '-00' + (-y);
        else if (y > -100) y = '-0' + (-y)
    }
    text("a" + x, y, 472 + (x % 10) * 37, 60 + Math.floor(x / 10) * 42, 11, "black", "onclick", "openAddress(this)")
}

function step3() {
    oneStep = true;
    run2()
}

function run() {
    oneStep = false;
    run2()
}

function run2() {
    if (waitingForInput) return;
    button("run", "STOP", 169, 482, "stop()");
    button("step", "<<", 225, 482, "slower()");
    button("gt", ">>", 255, 482, "faster()");
    stopping = false;
    speed = defaultSpeed;
    doSpeed();
    runContinue()
}

function slower() {
    if (speed > 225) return;
    if (speed >= 50) speed += 25;
    else if (speed >= 5) speed += 5;
    else ++speed;
    doSpeed()
}

function doSpeed() {
    running = true;
    var indx = (250 - speed) / 25;
    s2T = 3;
    valW = 1;
    if (speed <= 100) {
        text("speed", "SPEED " + indx, 213, 529, 12, "blue");
        return
    }
    text("speed", "SHOW FETCH/EXECUTE &nbsp; SPEED " + indx, 70, 529, 12, "blue");
    if (indx < 5) {
        if (runRate < 4.5) valW = 5;
        else valW = 4
    }
    if (indx == 4) s2T = 2;
    if (indx <= 3) s2T = 1;
    if (indx == 2) valW *= 2;
    if (indx == 1) valW *= 4;
    if (indx == 0) valW *= 8
}

function faster() {
    if (speed <= 100 && step2Busy) return;
    if (speed >= 75) speed -= 25;
    else if (speed >= 10) speed -= 5;
    else if (speed > 1) --speed;
    doSpeed()
}

function runContinuex() {
    if (step2Busy) {
        myTimeout = delay(speed, "runContinuex");
        return
    }
    if (speed < 125 || stopping) runContinue();
    else myTimeout = delay((speed + 200) / s2T, "runContinue")
}

function runContinuey() {
    if (step2Busy) {
        myTimeout = delay(25, "runContinuey");
        return
    }
    button("run", "RUN", 174, 482, "run()");
    button("step", "STEP", 235, 482, "step3()");
    remove("gt");
    remove("speed");
    running = false;
    myTimeout = false
}

function runContinuez() {
    if (waitingForInput) {
        myTimeout = delay(speed, "runContinuez");
    } else {
        myTimeout = delay(speed, "runContinue");
    }
}

function runContinue() {
    myTimeout = false;
    if (stopping) {
        button("run", "RUN", 174, 482, "run()");
        button("step", "STEP", 235, 482, "step3()");
        remove("gt");
        remove("speed");
        running = false;
        if (!oneStep) message("Program stopped. RUN or STEP to continue, RESET to abort.");
        return
    }
    if (oneStep) stopping = true;
    if (speed > 100) {
        var inst = address[pCounter];
        step2();
        if (inst < 100 || (inst >= 400 && inst < 500) || inst == 900 || (inst > 902 && inst < 922) || inst > 922) {
            myTimeout = delay(25, "runContinuey");
            return
        }
        myTimeout = delay(speed, "runContinuex");
        return
    }
    if (address[pCounter] >= 100) {
        if (step1()) {
            button("run", "RUN", 174, 482, "run()");
            button("step", "STEP", 235, 482, "step3()");
            remove("gt");
            remove("speed");
            running = false;
            return
        }
        if (waitingForInput) {
            myTimeout = delay(speed, "runContinuez");
        } else {
            myTimeout = delay(speed, "runContinue")
        }
    } else {
        step1();
        button("run", "RUN", 174, 482, "run()");
        button("step", "STEP", 235, 482, "step3()");
        remove("gt");
        remove("speed");
        running = false
    }
}

function stop() {
    stopping = true;
    if (!step2Busy) return;
    if (s2T) {
        s2T = 0;
        text("speed", "Press STOP again to complete instruction", 60, 529, 12, "red")
    } else {
        doSpeed()
    }
}

function stop2() {
    if (myTimeout) clearTimeout(myTimeout);
    myTimeout = false;
    if (myTimeout1) clearTimeout(myTimeout1);
    myTimeout1 = false;
    if (myTimeout2) clearTimeout(myTimeout2);
    myTimeout2 = false;
    button("run", "RUN", 174, 482, "run()");
    button("step", "STEP", 235, 482, "step3()");
    remove("gt");
    remove("speed");
    running = false;
    remove("au");
    remove("red1");
    remove("red2");
    remove("blue1");
    remove("blue2");
    step2Busy = false
}

function reset1() {
    stop2();
    updatePC(0);
    updatePCmarker(0);
    updateACC(0);
    output1 = "";
    output2 = "";
    text("output1", "", 307, 27, 12, "black");
    text("output2", "", 341, 27, 12, "black");
    outputCount = 0;
    outputCount2 = 0;
    text("ir", "", 320, 248, 20, "black");
    text("ar", "", 376, 280, 20, "black");
    if (savOpenAddress) {
        var x = parseInt(savOpenAddress.id[1]);
        if (savOpenAddress.id.length == 3) x = x * 10 + parseInt(savOpenAddress.id[2]);
        setAddress(x, address[x]);
        waitingForInput = false;
        savOpenAddress = false
    }
    if (modifyingProgram) {
        modifyingProgram = false;
        textToHtml();
        waitingForInput = false
    }
    if (waitingForInput) {
        waitingForInput = false
    }
    text("input", "", 309, 488, 16, "black");
    message("System reset, edit and ASSEMBLE, RUN/STEP or alter memory")
}

function step1() {
    if (waitingForInput) return 0;
    inst = Math.floor(address[pCounter] / 100);
    text("ir", inst, 320, 248, 20, "black");
    if (inst == 9 || inst == 4 || address[pCounter] < 0) {
        if (address[pCounter] == 901) inst = 9;
        else if (address[pCounter] == 902) inst = 10;
        else if (address[pCounter] == 922) inst = 11;
        else {
            message("Bad instruction at PC = " + pCounter);
            return 1
        }
    }
    addr = address[pCounter] % 100;
    if (addr >= 10) {
        text("ar", addr, 376, 280, 20, "black")
    } else {
        text("ar", '0' + addr, 376, 280, 20, "black")
    }
    if (inst == 0 || inst > 8) addr = "";
    message(instructionTxt[inst] + addr);
    updatePC(pCounter + 1);
    updatePCmarker(pCounter);
    switch (inst) {
        case 1:
            updateACC(parseInt(accumulator) + parseInt(address[addr]));
            break;
        case 2:
            updateACC(accumulator - address[addr]);
            break;
        case 3:
            setAddress(addr, accumulator);
            break;
        case 5:
            updateACC(address[addr]);
            break;
        case 6:
            updatePC(addr);
            updatePCmarker(addr);
            break;
        case 7:
            if (accumulator == 0) {
                updatePC(addr);
                updatePCmarker(addr)
            }
            break;
        case 8:
            if (accumulator >= 0) {
                updatePC(addr);
                updatePCmarker(addr)
            }
            break;
        case 9:
            message("INPUT required");
            text("input", inputForm, 309, 488, 12, "black");
            var elePosn = document.getElementById("iForm");
            elePosn.focus();
            waitingForInput = true;
            inst = 0;
            break;
        case 10:
            outputAcc();
            break;
        case 11:
            outputChar();
            break
    }
    return 0
}

function outputAcc() {
    if (outputCount % 8 == 7 && outputCount > 8) {
        output1 = output2;
        output2 = "";
        text("output1", output1, 307, 27, 12, "black", "", "", monospace)
    }
    if (outputCount < 7) {
        if (output1) output1 += "<br />";
        else outputCount = -1;
        output1 += accumulator;
        text("output1", output1, 307, 27, 12, "black", "", "", monospace)
    } else {
        if (output2) output2 += "<br />";
        output2 += accumulator;
        text("output2", output2, 341, 27, 12, "black", "", "", monospace)
    }++outputCount;
    outputCount2 = 1;
    if (accumulator < 0) ++outputCount2;
    if (accumulator < -9 || accumulator > 9) ++outputCount2;
    if (accumulator < -99 || accumulator > 99) ++outputCount2
}

function outputChar() {
    if (accumulator == 10 || outputCount2 >= 4) {
        if (outputCount % 8 == 7 && outputCount > 8) {
            output1 = output2;
            output2 = "";
            text("output1", output1, 307, 27, 12, "black", "", "", monospace)
        }
        if (outputCount < 7) {
            if (output1) output1 += "<br />";
            text("output1", output1, 307, 27, 12, "black", "", "", monospace)
        } else {
            if (output2) output2 += "<br />";
            text("output2", output2, 341, 27, 12, "black", "", "", monospace)
        }++outputCount;
        outputCount2 = 0;
        if (accumulator == 10) return
    }
    if (outputCount < 8) {
        if (accumulator == 32) output1 += '&nbsp;';
        else output1 += String.fromCharCode(accumulator);
        text("output1", output1, 307, 27, 12, "black", "", "", monospace)
    } else {
        if (accumulator == 32) output2 += '&nbsp;';
        else output2 += String.fromCharCode(accumulator);
        text("output2", output2, 341, 27, 12, "black", "", "", monospace)
    }++outputCount2
}
var redX;
var redY;
var blueX;
var blueY;
var blueVal;
var step2Busy = false;

function step2() {
    if (waitingForInput) return;
    if (step2Busy) return;
    step2Busy = true;
    message("FETCH CYCLE - get current instruction and add 1 to PC");
    redX = 310;
    redY = 206;
    image("red1", "red.gif", redX, redY, "PC");
    text("red2", pCounter, redX + 3, redY + 3, 14, "black");
    myTimeout1 = delay(valW, "step2a")
}

function step2a() {
    if (redY < 307) {
        redY += s2T
    } else if (redY < 310) {
        ++redY;
        if (redY == 310) {
            redX += 5;
            blueX = redX + 10;
            blueY = redY;
            blueVal = pCounter;
            image("blue1", "red.gif", blueX, blueY, "PC");
            text("blue2", blueVal, blueX + 3, blueY + 3, 14, "black");
            inst = 0;
            myTimeout2 = delay(valW, "step2e")
        }
    } else if (redY < 408) {
        redY += s2T
    } else {
        move("red1", redX, redY);
        button("au", "+1", 327, 417, "");
        text("red2", "+1", redX + 3, redY + 3, 14, "black");
        myTimeout1 = delay(300 / s2T, "step2b");
        return
    }
    move("red1", redX, redY);
    move("red2", redX + 3, redY + 3);
    myTimeout1 = delay(valW, "step2a")
}

function step2b() {
    image("red1", "blue1.gif", redX, redY, "PC");
    text("red2", pCounter + 1, redX + 3, redY + 3, 14, "black");
    myTimeout1 = delay(valW, "step2c")
}

function step2c() {
    if (redX < 340) {
        redX += s2T;
        if (redX >= 340) remove("au")
    } else if (redY > 206) {
        redY -= s2T
    } else {
        step2d();
        return
    }
    move("red1", redX, redY);
    move("red2", redX + 3, redY + 3);
    myTimeout1 = delay(valW, "step2c")
}

function step2d() {
    if (redX > 309) {
        redX -= s2T;
        move("red1", redX, redY);
        move("red2", redX + 3, redY + 3);
        myTimeout1 = delay(valW, "step2d")
    } else {
        myTimeout1 = false;
        updatePC(pCounter + 1);
        remove("red1");
        remove("red2")
    }
}

function step2e() {
    if (blueX < 405) {
        blueX += s2T
    } else if (blueY < 440) {
        blueY += s2T
    } else if (blueX < 434) {
        blueX += s2T
    } else {
        step2f();
        return
    }
    move("blue1", blueX, blueY);
    move("blue2", blueX + 3, blueY + 3);
    myTimeout2 = delay(valW, "step2e")
}

function step2f() {
    if (blueY > 60 + Math.floor(blueVal / 10) * 42) {
        blueY -= s2T
    } else if (blueX < 476 + (blueVal % 10) * 37) {
        blueX += s2T
    } else {
        image("blue1", "blue.gif", blueX, blueY, "PC");
        text("blue2", address[blueVal], blueX + 3, blueY + 3, 14, "black");
        myTimeout2 = delay(valW * 2, "step2g");
        return
    }
    move("blue1", blueX, blueY);
    move("blue2", blueX + 3, blueY + 3);
    myTimeout2 = delay(valW, "step2f")
}

function step2g() {
    if (blueX > 434) {
        blueX -= s2T
    } else if (blueY < 440) {
        blueY += s2T
    } else if (blueX > 406) {
        blueX -= s2T
    } else {
        if (inst) {
            step2j();
            return
        }
        updatePCmarker(pCounter);
        step2h();
        return
    }
    move("blue1", blueX, blueY);
    move("blue2", blueX + 3, blueY + 3);
    myTimeout2 = delay(valW, "step2g")
}

function step2h() {
    if (blueY > 278) {
        blueY -= s2T
    } else if (blueX > 368) {
        blueX -= s2T
    } else if (blueX > 365) {
        --blueX;
        if (blueX == 365) {
            addr = address[blueVal] % 100;
            if (addr >= 10) {
                text("ar", addr, 376, 280, 20, "black")
            } else {
                text("ar", '0' + addr, 376, 280, 20, "black")
            }
            message("FETCH done, decoding instruction")
        }
    } else if (blueX > 315) {
        blueX -= s2T
    } else if (blueY > 250) {
        blueY -= s2T
    } else {
        inst = Math.floor(address[blueVal] / 100);
        text("ir", inst, 320, 248, 20, "black");
        remove("blue1");
        remove("blue2");
        myTimeout2 = delay(600 / s2T, "step2i");
        return
    }
    move("blue1", blueX, blueY);
    move("blue2", blueX + 3, blueY + 3);
    myTimeout2 = delay(valW, "step2h")
}

function step2i() {
    if (s2T == 0) {
        myTimeout2 = delay(600 / s2T, "step2i");
        return
    }
    if (inst == 9 || address[blueVal] < 0) {
        if (address[blueVal] == 901) inst = 9;
        else if (address[blueVal] == 902) inst = 10;
        else if (address[blueVal] == 922) inst = 11;
        else {
            alert("Bad instruction at address = " + blueVal);
            myTimeout2 = false;
            return
        }
    }
    if (inst == 0 || inst == 4 || inst > 8) addr = "";
    message(instructionTxt[inst] + addr);
    switch (inst) {
        case 1:
        case 2:
        case 5:
            blueVal = addr;
            blueX = 376;
            blueY = 280;
            image("blue1", "red.gif", blueX, blueY, "AR");
            text("blue2", blueVal, blueX + 3, blueY + 3, 14, "black");
            myTimeout2 = delay(valW, "step2e");
            break;
        case 3:
            redX = 376;
            redY = 280;
            image("red1", "red.gif", redX, redY, "AR");
            text("red2", addr, redX + 3, redY + 3, 14, "black");
            blueX = 345;
            blueY = 338;
            image("blue1", "blue.gif", blueX, blueY, "ACC");
            text("blue2", accumulator, blueX + 3, blueY + 3, 14, "black");
            myTimeout2 = delay(valW, "step2n");
            break;
        case 6:
            step2p();
            break;
        case 7:
            if (accumulator == 0) {
                step2p()
            } else {
                myTimeout2 = false;
                step2Busy = false
            }
            break;
        case 8:
            if (accumulator >= 0) {
                step2p()
            } else {
                myTimeout2 = false;
                step2Busy = false
            }
            break;
        case 9:
            message("INPUT required");
            text("input", inputForm, 309, 488, 12, "black");
            var elePosn = document.getElementById("iForm");
            elePosn.focus();
            waitingForInput = true;
            break;
        case 10:
        case 11:
            blueX = 345;
            blueY = 338;
            image("blue1", "blue.gif", blueX, blueY, "ACC");
            text("blue2", accumulator, blueX + 3, blueY + 3, 14, "black");
            myTimeout2 = delay(valW, "step2t");
            break;
        default:
            myTimeout2 = false;
            step2Busy = false
    }
}

function step2j() {
    if (blueY > 340) {
        blueY -= s2T
    } else if (inst != 5) {
        redX = 350;
        redY = 340;
        image("red1", "blue.gif", redX, redY, "ACC");
        text("red2", accumulator, redX + 3, redY + 3, 14, "black");
        step2k();
        return
    } else if (blueX > 345) {
        blueX -= s2T
    } else {
        remove("blue1");
        remove("blue2");
        myTimeout2 = false;
        step2Busy = false;
        updateACC(address[blueVal]);
        return
    }
    move("blue1", blueX, blueY);
    move("blue2", blueX + 3, blueY + 3);
    myTimeout2 = delay(valW, "step2j")
}

function step2k() {
    if (blueX > 340) {
        blueX -= s2T
    } else if (blueY < 400) {
        blueY += s2T
    }
    if (redX > 315) {
        redX -= s2T
    } else if (redY < 400) {
        redY += s2T
    }
    if (redY >= 400 && blueY >= 400) {
        if (inst == 1) {
            button("au", "+", 327, 417, "");
            blueVal = parseInt(accumulator) + parseInt(address[blueVal])
        } else {
            button("au", "-", 327, 417, "");
            blueVal = accumulator - address[blueVal]
        }
        myTimeout2 = delay(600 / s2T, "step2l");
        return
    }
    move("blue1", blueX, blueY);
    move("blue2", blueX + 3, blueY + 3);
    move("red1", redX, redY);
    move("red2", redX + 3, redY + 3);
    myTimeout2 = delay(valW, "step2k")
}

function step2l() {
    if (s2T == 0) {
        myTimeout2 = delay(600 / s2T, "step2l");
        return
    }
    remove("au");
    remove("red1");
    remove("red2");
    text("blue2", blueVal, blueX + 3, blueY + 3, 14, "black");
    myTimeout2 = delay(valW * 2, "step2m")
}

function step2m() {
    if (blueY > 336) {
        blueY -= s2T;
        move("blue1", blueX, blueY);
        move("blue2", blueX + 3, blueY + 3);
        myTimeout2 = delay(valW * 2, "step2m");
        return
    }
    remove("blue1");
    remove("blue2");
    myTimeout2 = false;
    step2Busy = false;
    updateACC(blueVal)
}

function step2n() {
    if (redX < 405) {
        redX += s2T
    } else if (redY < 440) {
        redY += s2T
    } else if (redX < 434) {
        redX += s2T
    } else {
        step2o();
        return
    }
    if (redY > 311) {
        if (blueX < 405) {
            blueX += s2T
        } else if (blueY < 440) {
            blueY += s2T
        } else if (blueX < 434) {
            blueX += s2T
        }
    }
    move("red1", redX, redY);
    move("red2", redX + 3, redY + 3);
    move("blue1", blueX, blueY);
    move("blue2", blueX + 3, blueY + 3);
    myTimeout2 = delay(valW, "step2n")
}

function step2o() {
    if (redY > 60 + Math.floor(addr / 10) * 42) {
        redY -= s2T
    } else if (redX < 476 + (addr % 10) * 37) {
        redX += s2T
    }
    if (blueX < 434) {
        blueX += s2T
    } else if (blueY > 60 + Math.floor(addr / 10) * 42) {
        blueY -= s2T
    } else if (blueX < 476 + (addr % 10) * 37) {
        blueX += s2T
    } else {
        setAddress(addr, accumulator);
        remove("red1");
        remove("red2");
        remove("blue1");
        remove("blue2");
        myTimeout2 = false;
        step2Busy = false;
        return
    }
    move("red1", redX, redY);
    move("red2", redX + 3, redY + 3);
    move("blue1", blueX, blueY);
    move("blue2", blueX + 3, blueY + 3);
    myTimeout2 = delay(valW, "step2o")
}

function step2p() {
    redX = 376;
    redY = 280;
    image("red1", "red.gif", redX, redY, "AR");
    text("red2", addr, redX + 3, redY + 3, 14, "black");
    myTimeout2 = delay(valW, "step2q")
}

function step2q() {
    if (redY > 210) {
        redY -= s2T
    } else if (redX > 310) {
        redX -= s2T
    } else {
        updatePC(addr);
        updatePCmarker(pCounter);
        remove("red1");
        remove("red2");
        myTimeout2 = false;
        step2Busy = false;
        return
    }
    move("red1", redX, redY);
    move("red2", redX + 3, redY + 3);
    myTimeout2 = delay(valW, "step2q")
}

function step2r() {
    if (blueX < 380) {
        blueX += s2T
    } else if (blueY > 338) {
        blueY -= s2T
    } else {
        step2s();
        return
    }
    move("blue1", blueX, blueY);
    move("blue2", blueX + 3, blueY + 3);
    myTimeout2 = delay(valW, "step2r")
}

function step2s() {
    if (blueX > 345) {
        blueX -= s2T;
        move("blue1", blueX, blueY);
        move("blue2", blueX + 3, blueY + 3);
        myTimeout2 = delay(valW, "step2s");
        return
    }
    remove("blue1");
    remove("blue2");
    myTimeout2 = false;
    step2Busy = false;
    updateACC(blueVal)
}

function step2t() {
    if (blueX < 398 && blueY > 65) {
        blueX += s2T
    } else if (blueY > 65) {
        blueY -= s2T
    } else if (blueX > 360) {
        blueX -= s2T
    } else {
        remove("blue1");
        remove("blue2");
        if (inst == 10) outputAcc();
        else outputChar();
        myTimeout2 = false;
        step2Busy = false;
        return
    }
    move("blue1", blueX, blueY);
    move("blue2", blueX + 3, blueY + 3);
    myTimeout2 = delay(valW, "step2t")
}

function inputSubmit() {
    var elePosn = document.getElementById("iForm");
    if (!elePosn) {
        alert("Bad inputSubmit call");
        return
    }
    if (!waitingForInput) {
        alert("Bad input - not waiting for input");
        return
    }
    if (isNaN(elePosn.value) || elePosn.value == "") {
        alert("Bad input - must be a number");
        return
    }
    var value = parseInt(elePosn.value);
    if (value > 999 || value < -999) {
        alert("Bad input - number out of range");
        return
    }
    text("input", value, 309, 488, 18, "black");
    message("INPUT value loaded into accumulator");
    if (inst) {
        blueVal = value;
        blueX = 309;
        blueY = 488;
        image("blue1", "blue.gif", blueX, blueY, "INPUT");
        text("blue2", blueVal, blueX + 3, blueY + 3, 14, "black");
        myTimeout2 = delay(valW, "step2r")
    } else {
        updateACC(value)
    }
    waitingForInput = false
}
