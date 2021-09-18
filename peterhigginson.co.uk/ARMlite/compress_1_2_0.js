var maxHeight, maxWidth;
var lastKey = 0;
var noKeyEffects = false;

function startIt() {
    getDimensions();
    main()
}

function getDimensions() {
    if (typeof(window.innerWidth) == "number") {
        maxWidth = window.innerWidth;
        maxHeight = window.innerHeight
    } else {
        maxWidth = document.documentElement.clientWidth;
        maxHeight = document.documentElement.clientHeight
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getMilliseconds() {
    var d = new Date();
    return d.getTime()
}

function delay(ms, fn) {
    var tmp = fn + "(";
    for (var i = 2; i < arguments.length; i++) {
        if (i > 2) {
            tmp += ","
        }
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
            case "TEXTAREA":
                preventKeyPress = d.readOnly || d.disabled;
                break;
            case "INPUT":
                preventKeyPress = d.readOnly || d.disabled || (d.attributes.type && ["radio", "checkbox", "submit", "button"].indexOf(d.attributes.type.value.toLowerCase()) >= 0);
                break;
            case "DIV":
                preventKeyPress = d.readOnly || d.disabled || !(d.attributes.contentEditable && d.attributes.contentEditable.value == "true");
                break;
            default:
                preventKeyPress = true;
                break
        }
        if (preventKeyPress) {
            e.preventDefault()
        }
    }
    var keychar = String.fromCharCode(x);
    if (x == 27 || x == 9) {
        keychar = x
    }
    var indx = chrsToMatch.indexOf(keychar);
    if (indx == -1) {
        if (noKeyEffects) {
            if ((keyboardMask & 4) == 0) {
                if (x > 90) {
                    return
                }
                if ((keyboardMask & 2) == 0) {
                    if (x < 48) {
                        return
                    }
                } else {
                    if (x < 37 || (x > 40 && x < 48)) {
                        return
                    }
                }
            }
            lastKey = x;
            testKeyInterrupt();
            e.preventDefault()
        }
    } else {
        chrsDown[indx] = 1;
        if (dnFnCall[indx]) {
            window[dnFnCall[indx]](e)
        }
    }
}

function keyUp(e) {
    var x = e.keyCode;
    var keychar = String.fromCharCode(x);
    if (x == 27 || x == 9) {
        keychar = x
    }
    var indx = chrsToMatch.indexOf(keychar);
    if (indx != -1 && chrsDown[indx] == 1) {
        chrsDown[indx] = 0;
        if (upFnCall[indx]) {
            window[upFnCall[indx]](e)
        }
    }
}
var myTimeout = false;
var scrollTimeout = false;
var register = [];
var flags = 0;
var pCounter = 0;
var programText = "";
var programHTML = "";
var programEdit = "";
var programSave = "";
var output1 = "";
var fileRead = "";
var fileResult = -1;
var address = [];
var v1address = [];
var v2address = [];
var instructionTxt = [];
var addrToLine = [];
var lineToByteAddress = [];
var speed;
var slowSpeed = 40;
var delayTime = 4;
var comment_align = 24;
var dynamicProgramWidth = false;
var fileWriteBuffer = [];
var inst;
var addr;
var waitingForInput = false;
var registerToInput = 0;
var modifyingProgram = false;
var stopping;
var oneStep;
var running = false;
var lastCodeHighlight = -1;
var lastMemHighlight = -1;
var breakpointAddr = -1;
var errorLineNum = -1;
var memOpt = 2;
var maxUsableMem = 1048576;
var overlay = 0;
var lastPixelClick = -1;
var waitingForOverlay = false;
var byteCount = 0;
var instructionCount = 0;
var measureSpeed = 0;
var breakPoint = -1;
var runTimer;
var hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
var debug = 0;
var xTime = 0;
var interruptCnt = 0;
var dotDataAddress = 0;
var firstDataDefn = 0;
var dontDisplay = 0;
var binarySize = 100;
var lastMessage = "";
var oldPCMarker = -1;
var stepTxt = "";
var lineNo;
var step1Code = 0;
var halted = "Program HALTED. STOP, LOAD or EDIT";
var IOBase = 4294967040;
var fakeBig = 4294963968;
var charMax = 512;
var charBase = 4294963424;
var pixelBase = 4294914048;
var vaddressBase = pixelBase;
var pixelAreaSize = 3072;
var IOVectorBase = 4294967168;
var IOVectors = [-1, -1, -1, -1, -1];
var interruptMask = 0;
var keyboardMask = 0;
var pinMask = 0;
var clockIntFreq = 0;
var pixelMask = 0;
var interruptRequest = 0;
var canSave = false;
var haveSaved = false;
var saveSeq = 0;
var dotLabelNames = [".WriteSignedNum", ".WriteUnsignedNum", ".WriteHex", ".WriteChar", ".WriteString", ".InputNum", ".LastKey", ".LastKeyAndReset", ".Random", ".InstructionCount", ".Time", ".PinISR", ".SysISR", ".KeyboardISR", ".ClockISR", ".InterruptRegister", ".PinMask", ".KeyboardMask", ".ClockInterruptFrequency", ".CodeLimit", ".PixelScreen", ".CharScreen", ".OpenFile", ".FileLength", ".ReadFileChar", ".ReadString", ".InputFP", ".WriteFP", ".PixelAreaSize", ".WriteFileChar", ".WriteFile", ".ClearScreen", ".ReadSecret", ".PixelISR", ".LastPixelClicked", ".LastPixelAndReset", ".PixelMask", ".Resolution"];
var dotLabelValues = [IOBase + 16, IOBase + 20, IOBase + 24, IOBase + 28, IOBase + 32, IOBase + 8, IOBase + 16, IOBase + 20, IOBase + 32, IOBase + 64, IOBase + 68, IOVectorBase + 4, IOVectorBase, IOVectorBase + 8, IOVectorBase + 12, IOBase + 72, IOBase + 76, IOBase + 52, IOBase + 56, IOBase + 80, pixelBase, charBase, IOBase + 84, IOBase + 88, IOBase + 92, IOBase + 96, IOBase + 100, IOBase + 104, IOBase + 108, IOBase + 112, IOBase + 116, IOBase + 108, IOBase + 36, IOVectorBase + 16, IOBase + 40, IOBase + 44, IOBase + 48, IOBase + 60];
var dotLabelMode = [1, 1, 1, 3, 1, 4, 12, 12, 4, 4, 4, 5, 16 + 5, 5, 5, 5, 5, 5, 5, 4, 31, 31, 4, 4, 12, 1, 4, 1, 4, 3, 1, 1, 1, 5, 4, 4, 5, 5];

function matchDotLabel(label) {
    var i;
    for (i = 0; i < dotLabelNames.length; ++i) {
        if (label == dotLabelNames[i]) {
            return i
        }
    }
    if (label.length > 6 && label.startsWith(".Pixel")) {
        var a = parseIntGen(label.substring(6));
        if (isNaN(a) || a < 0 || a > 767) {
            return -1
        }
        return fakeBig + a * 4
    }
    return -1
}

function matchIOAddress(value) {
    var i;
    for (i = 0; i < dotLabelValues.length; ++i) {
        if (value == dotLabelValues[i]) {
            return i
        }
    }
    return -1
}

function main() {
    var url = new URL(location);
    var foo = url.searchParams.get("slow_delay");
    if (foo) {
        var tmp = parseInt(foo);
        if (tmp > 1 && tmp < 1000) {
            slowSpeed = tmp
        }
    }
    foo = url.searchParams.get("fast_delay");
    if (foo) {
        var tmp = parseInt(foo);
        if (tmp > 0 && tmp < 251) {
            delayTime = tmp
        }
    }
    foo = url.searchParams.get("data");
    if (foo) {
        foo = foo.toLowerCase();
        if (foo.startsWith("sig")) {
            memOpt = 0
        }
        if (foo.startsWith("dec")) {
            memOpt = 0
        }
        if (foo.startsWith("uns")) {
            memOpt = 1
        }
        if (foo.startsWith("hex")) {
            memOpt = 2
        }
        if (foo.startsWith("bin")) {
            memOpt = 3;
            addClass("xxbody", "binary")
        }
    }
    foo = url.searchParams.get("mem_k");
    if (foo) {
        var tmp = parseInt(foo);
        if (tmp >= 1 && tmp <= 1024) {
            maxUsableMem = tmp * 1024
        }
    }
    foo = url.searchParams.get("debug");
    if (foo) {
        var tmp = parseInt(foo);
        debug = tmp
    }
    foo = url.searchParams.get("profile");
    if (foo) {
        addClass("xxbody", "profile-" + foo)
    } else {
        dynamicProgramWidth = true;
        var newWidth = maxWidth - 826;
        foo = url.searchParams.get("progw");
        if (foo) {
            var tmp = parseInt(foo);
            if (tmp >= 300 && tmp <= 3000) {
                newWidth = tmp;
                dynamicProgramWidth = false
            }
        }
        setProgramWidth(newWidth)
    }
    foo = url.searchParams.get("alcom");
    if (foo) {
        var tmp = parseInt(foo);
        if (tmp > 5 && tmp < 301) {
            comment_align = tmp
        }
    }
    if (navigator.platform.indexOf("Win32") > -1) {
        binarySize = 100;
    } else {
        binarySize = 92;
    }
    foo = url.searchParams.get("binsiz");
    if (foo) {
        var tmp = parseInt(foo);
        if (tmp > 79 && tmp < 101) {
            binarySize = tmp
        }
    }
    window.document.title = "ARMlite Assembly Language Simulator by Peter Higginson";
    trapKey(9, "tabKey", null);
    trapKey(27, "escKey", null);
    setupDivs();
    updateR(0, 0);
    updateR(1, 0);
    updateR(2, 0);
    updateR(3, 0);
    updateR(4, 0);
    updateR(5, 0);
    updateR(6, 0);
    updateR(7, 0);
    updateR(8, 0);
    updateR(9, 0);
    updateR(10, 0);
    updateR(11, 0);
    updateR(12, 0);
    updateR(13, maxUsableMem);
    updateR(14, 0);
    updateFlags(0);
    updatePC(0);
    clearIR();
    output1 = "System Messages";
    message("LOAD, EDIT a program or modify memory");
    removeClass("program", "edit");
    setStateReady();
    for (var i = 0; i < maxUsableMem; i += 4) {
        setAddress(i, 0)
    }
}

function escKey(e) {
    if (!waitingForInput) {
        return
    }
    if (myTimeout || myMaybe) {
        return
    }
    e.preventDefault();
    waitingForInput = false;
    setStateReady();
    if (savOpenAddress) {
        var x = parseInt(savOpenAddress.id[1]);
        if (savOpenAddress.id.length >= 3) {
            x = x * 10 + parseInt(savOpenAddress.id[2])
        }
        if (savOpenAddress.id.length >= 4) {
            x = x * 10 + parseInt(savOpenAddress.id[3])
        }
        if (savOpenAddress.id.length == 5) {
            x = x * 10 + parseInt(savOpenAddress.id[4])
        }
        x += overlay * 64;
        setAddress(x * 4, address[x]);
        savOpenAddress = false
    } else {
        if (modifyingProgram) {
            modifyingProgram = false;
            textToHtml()
        }
    }
    message("ESC pressed to abort input")
}

function tabKey(e) {
    e.preventDefault();
    if (!waitingForInput) {
        return
    }
    if (myTimeout || myMaybe) {
        return
    }
    if (savOpenAddress) {
        var x = parseInt(savOpenAddress.id[1]);
        if (savOpenAddress.id.length >= 3) {
            x = x * 10 + parseInt(savOpenAddress.id[2])
        }
        if (savOpenAddress.id.length >= 4) {
            x = x * 10 + parseInt(savOpenAddress.id[3])
        }
        if (savOpenAddress.id.length == 5) {
            x = x * 10 + parseInt(savOpenAddress.id[4])
        }
        var inp = document.getElementById("aForm");
        var ok = checkInput(inp.value);
        loseAddress(inp);
        if (x < 127) {
            ++x;
            if (ok) {
                message("Modifying memory contents")
            }
            savOpenAddress = openNextMem(x);
            waitingForInput = true;
            setStateEdit()
        } else {
            waitingForInput = false;
            setStateReady()
        }
    } else {
        if (modifyingProgram) {
            insertTabInProgramArea()
        }
    }
}

function openProgram() {
    if (waitingForInput) {
        return
    }
    if (myTimeout || myMaybe) {
        return
    }
    _paq.push(["trackEvent", "Button", "Edit"]);
    message("Modifying Program Area");
    var source = document.getElementById("source");
    var top = Math.floor(source.scrollTop);
    setStateEdit();
    openProgramArea(programEdit);
    waitingForInput = true;
    modifyingProgram = true;
    if (top) {
        document.getElementById("pForm").scrollTop = top
    }
}

function programSubmit() {
    if (!waitingForInput) {
        if (debug) {
            alert("Bad - Submit when not waiting for input")
        }
        return false
    }
    programSubmit2(true)
}

function programSubmit2(key) {
    waitingForInput = false;
    modifyingProgram = false;
    removeClass("program", "edit");
    programText = getProgramArea();
    if (key && programText.length < 10) {
        var foo = programText.toLowerCase();
        if (foo.startsWith("demo")) {
            _paq.push(["trackEvent", "Button", "Demo"]);
            demoSetup();
            textToHtml();
            assemble();
            delay(100, "run()");
            return
        }
    }
    if (key) {
        _paq.push(["trackEvent", "Button", "Submit"])
    } else {
        _paq.push(["trackEvent", "Button", "SaveSubmit"])
    }
    textToHtml();
    assemble()
}

function demoSetup() {
    programText = "MOV R11,#.black// Constant\nMOV R12,#.white// Constant\nMOV R1,#screen2 \nADD R3,R1,#12288// End\nclearPixel:\nSTR R12,[R1]// set everything white\nADD R1,R1,#4\nCMP R1,R3\nBLT clearPixel\n// Initialise 2nd screen with random pattern\nMOV R2,#screen2// 1st pixel\nADD R3,R2,#12288// End\nrandLoop:LDR R0,.Random\nAND R0,R0,#3// start with 25% set only\nCMP R0,#0\nBNE skip// only need to set blacks\nSTR R11,[R2]// set black\nskip:\nADD R2,R2,#4\nCMP R2,R3\nBLT randLoop\ncopyScreen2to1:\nMOV R1,#.PixelScreen\nMOV R2,#screen2\nADD R3,R1,#12288\ncopyLoop:\nLDR R0,[R2]\nSTR R0,[R1]\nADD R1,R1,#4\nADD R2,R2,#4\nCMP R1,R3\nBLT copyLoop\n// Next generation\nMOV R3,#0// R3 is cell offset,0 to 12288 (incr by 4)\nnextGenLoop:\nBL countBlock// count neighbours in R6\n// Now decide fate of cell\nMOV R2,#screen2\nADD R2,R2,R3\nCMP R6,#4\nBLT .+3 \nSTR R12,[R2]// Cell dies (or remains empty) if 4 or more neighbours\nB continue\nCMP R6,#3\nBLT .+3 \nSTR R11,[R2]// Cell born (or remains) if 3 or 4 neighbours\nB continue\nCMP R6,#2\nBEQ continue// Cell remains in present state if 2 neighbours\nSTR R12,[R2]// Cell dies (or remains empty) if < 2 neighbours\ncontinue:\nADD R3,R3,#4\nCMP R3,#12288\nBLT nextGenLoop\nB copyScreen2to1\n\n// R3 is pixel index,R6 return count\n// R11,R12 do not change,R5 used by countIfLive()\n// we use R1,R4 and R10 (as temp for LR!!!!)\ncountBlock:\nMOV R10,LR\nMOV R6,#0// Reset live count\nMOV R1,#.PixelScreen\nADD R1,R1,R3\nAND R4,R3,#255// index in row\nCMP R3,#256\nBLT topRow// remove all the special cases\nCMP R3,#12032\nBEQ leftBot// because BGE not in AQA set\nBGT botRow// and #12028 is > 8 bits\nCMP R4,#0\nBEQ leftCol\nCMP R4,#252\nBEQ rightCol\n// now can do original count neighbours\nSUB R1,R1,#256// North \nBL countIfLive\nADD R1,R1,#4// Northeast\nBL countIfLive\nADD R1,R1,#256// East\nBL countIfLive\nADD R1,R1,#256// Southeast\nBL countIfLive\nSUB R1,R1,#4// South\nBL countIfLive\nSUB R1,R1,#4// Southwest\nBL countIfLive\nSUB R1,R1,#256// West\nBL countIfLive\nSUB R1,R1,#256// Northwest\nBL countIfLive\nMOV PC,R10// RET\nrightCol:// but not top or bottom\nSUB R1,R1,#256// North \nBL countIfLive\nSUB R1,R1,#252// Northeast\nBL countIfLive\nADD R1,R1,#256// East\nBL countIfLive\nADD R1,R1,#256// Southeast\nBL countIfLive\nADD R1,R1,#252// South\nBL countIfLive\nSUB R1,R1,#4// Southwest\nBL countIfLive\nSUB R1,R1,#256// West\nBL countIfLive\nSUB R1,R1,#256// Northwest\nBL countIfLive\nMOV PC,R10// RET\nleftCol:// but not top or bottom\nSUB R1,R1,#256// North \nBL countIfLive\nADD R1,R1,#4// Northeast\nBL countIfLive\nADD R1,R1,#256// East\nBL countIfLive\nADD R1,R1,#256// Southeast\nBL countIfLive\nSUB R1,R1,#4// South\nBL countIfLive\nADD R1,R1,#252// Southwest\nBL countIfLive\nSUB R1,R1,#256// West\nBL countIfLive\nSUB R1,R1,#256// Northwest\nBL countIfLive\nMOV PC,R10// RET\ntopRow:\nCMP R4,#0// note R3=R4\nBEQ leftTop\nCMP R4,#252\nBEQ rightTop\n// now top but not sides\nADD R1,R1,#12032// North \nBL countIfLive\nADD R1,R1,#4// Northeast\nBL countIfLive\nSUB R1,R1,#12032// East\nBL countIfLive\nADD R1,R1,#256// Southeast\nBL countIfLive\nSUB R1,R1,#4// South\nBL countIfLive\nSUB R1,R1,#4// Southwest\nBL countIfLive\nSUB R1,R1,#256// West\nBL countIfLive\nADD R1,R1,#12032// Northwest\nBL countIfLive\nMOV PC,R10// RET\nbotRow:// removed leftBot already\nCMP R4,#252\nBEQ rightBot\nSUB R1,R1,#256// North \nBL countIfLive\nADD R1,R1,#4// Northeast\nBL countIfLive\nADD R1,R1,#256// East\nBL countIfLive\nSUB R1,R1,#12032// Southeast\nBL countIfLive\nSUB R1,R1,#4// South\nBL countIfLive\nSUB R1,R1,#4// Southwest\nBL countIfLive\nADD R1,R1,#12032// West\nBL countIfLive\nSUB R1,R1,#256// Northwest\nBL countIfLive\nMOV PC,R10// RET\n// There must be a way to improve this but I'm not short of space! \nleftTop:\nADD R1,R1,#12032// North \nBL countIfLive\nADD R1,R1,#4// Northeast\nBL countIfLive\nSUB R1,R1,#12032// East\nBL countIfLive\nADD R1,R1,#256// Southeast\nBL countIfLive\nSUB R1,R1,#4// South\nBL countIfLive\nADD R1,R1,#252// Southwest\nBL countIfLive\nSUB R1,R1,#256// West\nBL countIfLive\nADD R1,R1,#12032// Northwest\nBL countIfLive\nMOV PC,R10// RET\nrightTop:\nADD R1,R1,#12032// North \nBL countIfLive\nSUB R1,R1,#252// Northeast\nBL countIfLive\nMOV R1,#.PixelScreen// East (SUB is > 8 bits)\nBL countIfLive\nADD R1,R1,#256// Southeast\nBL countIfLive\nADD R1,R1,#252// South\nBL countIfLive\nSUB R1,R1,#4// Southwest\nBL countIfLive\nSUB R1,R1,#256// West\nBL countIfLive\nADD R1,R1,#12032// Northwest\nBL countIfLive\nMOV PC,R10// RET\nleftBot:\nSUB R1,R1,#256// North \nBL countIfLive\nADD R1,R1,#4// Northeast\nBL countIfLive\nADD R1,R1,#256// East\nBL countIfLive\nSUB R1,R1,#12032// Southeast\nBL countIfLive\nSUB R1,R1,#4// South (=#.PixelScreen)\nBL countIfLive\nADD R1,R1,#252// Southwest\nBL countIfLive\nADD R1,R1,#12032// West\nBL countIfLive\nSUB R1,R1,#256// Northwest\nBL countIfLive\nMOV PC,R10// RET\nrightBot:\nSUB R1,R1,#256// North \nBL countIfLive\nSUB R1,R1,#252// Northeast\nBL countIfLive\nADD R1,R1,#256// East\nBL countIfLive\nSUB R1,R1,#12032// Southeast (=#.PixelScreen)\nBL countIfLive\nADD R1,R1,#252// South\nBL countIfLive \nSUB R1,R1,#4// Southwest\nBL countIfLive\nADD R1,R1,#12032// West\nBL countIfLive\nSUB R1,R1,#256// Northwest\nBL countIfLive\nMOV PC,R10// RET\n// Subroutines\ncountIfLive:LDR R5,[R1]// Sub\nCMP R5,R12\nBEQ .+2\nADD R6,R6,#1\nRET\nHALT\n.ALIGN 1024\nscreen2:.DATA\n"
}

function programCancel() {
    if (!waitingForInput) {
        if (debug) {
            alert("Bad - Cancel when not waiting for input")
        }
        return false
    }
    _paq.push(["trackEvent", "Button", "Revert"]);
    waitingForInput = false;
    modifyingProgram = false;
    if (programText == "") {
        message("LOAD or EDIT a program")
    } else {
        message("RUN/STEP your program or LOAD/EDIT a program")
    }
    removeClass("program", "edit");
    resetProgramArea(programHTML);
    setStateReady()
}

function saveProgram() {
    _paq.push(["trackEvent", "Button", "Save"]);
    if (modifyingProgram == true) {
        programSubmit2(false)
    }
    saveFile(programSave, "myprog.txt");
    message("Saving File")
}

function iclick() {
    if ((pinMask & 1) != 0 && IOVectors[1] >= 0) {
        interruptRequest |= 1;
        intButtonGrey()
    } else {
        if ((pinMask & 2) != 0) {
            pinMask |= 4;
            intButtonGrey()
        } else {
            if (debug) {
                alert("clicked but not enabled")
            }
        }
    }
}

function checkClickColour() {
    if ((pinMask & 6) == 2) {
        intButtonShow()
    } else {
        if ((pinMask & 1) == 1 && IOVectors[1] >= 0 && (IOVectors[1] & 3) == 0 && IOVectors[1] < maxUsableMem) {
            if ((interruptMask & 1) != 0) {
                intButtonShow()
            } else {
                intButtonSetup()
            }
        } else {
            if (IOVectors[1] >= 0 || (pinMask & 2) != 0) {
                intButtonSetup();
                intButtonGrey()
            } else {
                intButtonReset()
            }
        }
    }
}

function testKeyInterrupt() {
    if ((keyboardMask & 1) == 1 && IOVectors[2] >= 0 && (IOVectors[2] & 3) == 0 && IOVectors[2] < maxUsableMem) {
        interruptRequest |= 2
    }
}

function checkClockEnabled() {
    if (xTime != 0) {
        return
    }
    if (clockIntFreq == 0) {
        return
    }
    if ((interruptMask & 1) == 0) {
        return
    }
    if (IOVectors[3] >= 0 && (IOVectors[3] & 3) == 0 && IOVectors[3] < maxUsableMem) {
        xTime = Date.now() + clockIntFreq
    }
}

function clearMem() {
    _paq.push(["trackEvent", "Button", "Clear"]);
    reset2();
    overlay = 0;
    rewriteSide();
    for (var i = 0; i < maxUsableMem; i += 4) {
        setAddress(i, 0)
    }
    byteCount = 0;
    programText = "";
    textToHtml();
    message("System Cleared")
}

function op2() {
    var op = document.getElementById("data").value;
    _paq.push(["trackEvent", "Button", "Data", op]);
    if (memOpt == 3) {
        if (op == "bin") {
            return
        }
        removeClass("xxbody", "binary");
        setMemBinary(false)
    }
    switch (op) {
        case "sig":
            memOpt = 0;
            break;
        case "uns":
            memOpt = 1;
            break;
        case "bin":
            memOpt = 3;
            addClass("xxbody", "binary");
            setMemBinary(true);
            break;
        default:
            memOpt = 2;
            break
    }
    var savDD = dontDisplay;
    dontDisplay = 0;
    rewriteMemoryAndRegs(false);
    dontDisplay = savDD
}

function rewriteMemoryAndRegs(noregs) {
    updateFlags(flags);
    var base = overlay * 64;
    for (var i = 0; i < 128; ++i) {
        setAddress((i + base) * 4, address[i + base])
    }
    if (noregs) {
        return
    }
    for (var i = 0; i < 15; ++i) {
        updateR(i, register[i])
    }
    updatePC(pCounter)
}

function read_chg(inp) {
    _paq.push(["trackEvent", "Button", "Load"]);
    if (modifyingProgram == true) {
        programCancel()
    }
    reset2();
    var fs = inp.files;
    if (!fs) {
        message("BAD FILE SELECTION RETURN");
        return
    }
    var fr = new FileReader;
    fr.readAsText(fs[0], "utf-8");
    fr.onload =
        function() {
            programText = fr.result;
            textToHtml();
            assemble();
            resetLoadButton()
        }
}

function read_file(inp) {
    var fs = inp.files;
    consoleReset();
    if (!fs) {
        message("BAD FILE SELECTION RETURN");
        if (fileResult >= 0) {
            updateR(fileResult, 4294967295)
        }
        fileResult = -1;
        waitingForInput = false;
        return
    }
    var fr = new FileReader;
    fr.onload =
        function() {
            fileRead = fr.result;
            if (fileResult >= 0) {
                updateR(fileResult, fileRead.length)
            }
            waitingForInput = false;
            fileResult = -1
        };
    fr.readAsText(fs[0], "utf-8")
}

function do_count(line) {
    var tt = 0;
    var cnt = 0;
    while (tt < line.length) {
        if (line[tt] == "\t") {
            cnt = (cnt + 4) & 1048572
        } else {
            ++cnt
        }++tt
    }
    return cnt
}

function textToHtml() {
    programHTML = "";
    programEdit = "";
    programSave = "";
    var lines = 1;
    var lines2 = 1;
    var count = 0;
    var lineHTML = "";
    var lineEdit = "";
    var comment = false;
    var asciiStart = "";
    var asciiChar = "";
    var removedNum = false;
    var pLength = programText.length;
    if (programText[pLength - 1] != "\n") {
        programText += "\n";
        ++pLength
    }
    for (var n = 0; n < pLength; ++n) {
        var letter = programText[n];
        if (letter == "\t") {
            if (comment) {
                var tmp3 = 4 - (do_count(lineEdit) & 3);
                while (tmp3 > 0) {
                    lineHTML += "&nbsp;";
                    --tmp3
                }
                lineEdit += "\t";
                continue
            }
            letter = " "
        }
        if (letter < " " && letter != "\n") {
            continue
        }
        if (removedNum == false) {
            removedNum = true;
            var i;
            for (i = n; i < pLength; ++i) {
                if (programText[i] == "|") {
                    n = i;
                    break
                }
                if (programText[i] != " " && programText[i] != "\t" && (programText[i] < "0" || programText[i] > "9")) {
                    i = -1;
                    break
                }
            }
            if (n == i) {
                continue
            }
        }
        if (asciiStart) {
            lineEdit += letter;
            if (letter == " ") {
                lineHTML += "&nbsp;"
            } else {
                if (letter == "&") {
                    lineHTML += "&amp;"
                } else {
                    if (letter == "<") {
                        lineHTML += "&lt;"
                    } else {
                        if (letter == ">") {
                            lineHTML += "&gt;"
                        } else {
                            lineHTML += letter
                        }
                    }
                }
            }
            if (asciiChar == "\\") {
                asciiChar = "";
                continue
            }
            asciiChar = letter;
            if (asciiStart == letter) {
                asciiStart = "";
                continue
            }
            if (letter != "\n") {
                continue
            }
            asciiStart = ""
        }
        if (!comment && (letter == '"' || letter == "'")) {
            asciiStart = letter;
            lineEdit += letter;
            lineHTML += letter;
            continue
        }
        if (letter == " " && (n + 1) < pLength && (programText[n + 1] == " " || programText[n + 1] == "\t")) {
            if (comment) {
                lineHTML += "&nbsp;";
                lineEdit += " "
            }
            continue
        }
        if (count == 0) {
            if (letter == "\n") {
                removedNum = false;
                continue
            }
            if (letter == " ") {
                continue
            }
            if (letter == "/" || letter == ";") {
                count = 11;
                comment = true;
                lineHTML += '<span class="comment">';
                lineHTML += letter;
                lineEdit += letter;
                continue
            }
            var label = "" + letter;
            var i = 1;
            while (n + i < pLength && programText[n + i] > " ") {
                label += programText[n + i];
                if (programText[n + i] == ":") {
                    break
                }++i
            }
            if (programText[n + i] != ":") {
                lineHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                lineEdit += "      ";
                count = 5
            }
        }
        while (count < 5 && letter == " " && programText[n + 1] > " ") {
            lineEdit += " ";
            lineHTML += "&nbsp;";
            ++count
        }
        if (letter == "\n") {
            programHTML += '<div id="lin' + lines2 + '" class="selectable"><span class="line">';
            ++lines2;
            if (lines < 10) {
                programHTML += "&nbsp;";
                programEdit += " "
            }
            if (lines < 100) {
                programHTML += "&nbsp;";
                programEdit += " "
            }
            programHTML += lines + "|</span>" + lineHTML;
            if (comment) {
                programHTML += "</span>"
            }
            programEdit += lines + "|";
            ++lines;
            programHTML += "</div>";
            lineHTML = "";
            programEdit += lineEdit + "\n";
            programSave += lineEdit + "\r\n";
            lineEdit = "";
            count = 0;
            comment = false;
            removedNum = false
        } else {
            ++count;
            if (!comment && (letter == "/" || letter == ";")) {
                comment = true;
                var last_char = programText[n - 1];
                if (last_char == " " || last_char == "\t") {
                    if (lineHTML[lineHTML.length - 1] == ";") {
                        lineHTML = lineHTML.slice(0, -6)
                    } else {
                        lineHTML = lineHTML.slice(0, -1)
                    }
                    lineEdit = lineEdit.slice(0, -1)
                }
                var tmp3 = do_count(lineEdit);
                if (tmp3 >= comment_align) {
                    lineEdit += " ";
                    lineHTML += "&nbsp;"
                } else {
                    while (tmp3 < comment_align) {
                        lineHTML += "&nbsp;";
                        lineEdit += " ";
                        ++tmp3
                    }
                }
                lineHTML += '<span class="comment">'
            }
            if (letter == "&") {
                lineHTML += "&amp;"
            } else {
                if (letter == "<") {
                    lineHTML += "&lt;"
                } else {
                    if (letter == ">") {
                        lineHTML += "&gt;"
                    } else {
                        lineHTML += letter
                    }
                }
            }
            lineEdit += letter
        }
    }
    resetProgramArea(programHTML)
}

function assemble() {
    if (waitingForInput) {
        return
    }
    reset2();
    for (var i = 0; i < maxUsableMem; i += 4) {
        setAddress(i, 0)
    }
    var indexToLine = [];

    function convert(n, inst) {
        if (inst == ".WORD") {
            inst = ""
        }
        if (inst !== "") {
            inst = " " + inst
        }
        return indexToLine[n] + inst
    }
    var pLength = programText.length;
    if (programText[pLength - 1] != "\n") {
        programText += "\n";
        ++pLength
    }
    var lineCount = 0;
    byteCount = 0;
    dotDataAddress = -1;
    firstDataDefn = -1;
    var wordCount = 0;
    var tempWordText = "";
    var lastChar = "";
    var labelText = [];
    var instText = [];
    var offsetText = [];
    var comment = false;
    var comma = false;
    var label = false;
    var justSeenLabel = false;
    var ascii = false;
    var blankLabels = 1;
    addrToLine = [];
    lineToByteAddress = [];
    var removedNum = false;
    for (var n = 0; n < pLength; ++n) {
        var letterText = programText[n];
        if (letterText == "\r") {
            continue
        }
        if (removedNum == false) {
            removedNum = true;
            var i;
            for (i = n; i < pLength; ++i) {
                if (programText[i] == "|") {
                    n = i;
                    break
                }
                if (programText[i] != " " && programText[i] != "\t" && (programText[i] < "0" || programText[i] > "9")) {
                    i = -1;
                    break
                }
            }
            if (n == i) {
                continue
            }
        }
        if (comment && letterText != "\n") {
            continue
        }
        if (letterText == "\t") {
            letterText = " "
        }
        if (ascii) {
            if (letterText == "\n") {
                message("Closing quotes missing at line " + (lineCount + blankLabels));
                showError(lineCount + blankLabels);
                return
            }
            if (lastChar == "\\") {
                tempWordText += letterText;
                lastChar = "";
                continue
            }
            tempWordText += letterText;
            lastChar = letterText;
            if (letterText != tempWordText[0]) {
                continue
            }
            offsetText[lineCount] = tempWordText;
            tempWordText = "";
            ++wordCount;
            ascii = false;
            continue
        }
        if (letterText == "/" || letterText == ";") {
            comment = true;
            continue
        }
        if (letterText == ",") {
            comma = true
        } else {
            if (comma) {
                if (letterText == " ") {
                    continue
                }
                comma = false
            }
        }
        if (letterText == ":") {
            if (wordCount != 0) {
                if (labelText[lineCount]) {
                    message("cannot have two labels at one address at line " + (lineCount + blankLabels))
                } else {
                    message("label must be first item at line " + (lineCount + blankLabels))
                }
                showError(lineCount + blankLabels);
                return
            }
            var rs = RegExp("^(r([0-9]|1[0-5])|pc|lr|sp)$");
            var tg = rs.test(tempWordText.toLowerCase());
            if (tg) {
                message("cannot use a register as a label  at line " + (lineCount + blankLabels));
                showError(lineCount + blankLabels);
                return
            }
            rs = RegExp("^(ret|rfe|halt|hlt|svc)$");
            tg = rs.test(tempWordText.toLowerCase());
            if (tg) {
                message("cannot use " + tempWordText + " as a label at line " + (lineCount + blankLabels));
                showError(lineCount + blankLabels);
                return
            }
            var ms = RegExp("^[a-zA-Z_][0-9a-zA-Z_]*$");
            var tf = ms.test(tempWordText);
            if (!tf) {
                message("bad character in label at line " + (lineCount + blankLabels));
                showError(lineCount + blankLabels);
                return
            }
            var a;
            for (a = 0; a < lineCount; ++a) {
                if (tempWordText == labelText[a]) {
                    break
                }
            }
            if (a < lineCount) {
                message("duplicate label at lines " + indexToLine[a] + " and " + (lineCount + blankLabels) + " &nbsp;" + tempWordText);
                showError(lineCount + blankLabels);
                return
            }
            if (matchDotLabel(tempWordText) != -1) {
                message("invalid label at line " + (lineCount + blankLabels) + " &nbsp;" + tempWordText);
                showError(lineCount + blankLabels);
                return
            }
            labelText[lineCount] = tempWordText;
            label = true;
            justSeenLabel = true;
            tempWordText = "";
            ++wordCount;
            continue
        }
        if (label) {
            if (letterText == " ") {
                continue
            }
            if (letterText == "\n") {
                if (justSeenLabel || comment) {
                    ++blankLabels;
                    justSeenLabel = false
                }
                comment = false;
                removedNum = false;
                continue
            }
            if (letterText == "." && n < (pLength - 5)) {
                if (programText.substring(n, n + 5).toUpperCase() == ".DATA") {
                    dotDataAddress = byteCount;
                    comment = true;
                    n += 4;
                    justSeenLabel = false;
                    continue
                }
            }
            label = false;
            justSeenLabel = false
        }
        if (letterText == " " || letterText == "\n") {
            if (tempWordText.toUpperCase() == ".DATA") {
                if (dotDataAddress != -1) {
                    message("cannot have more than one .data");
                    showError(lineCount + blankLabels);
                    return
                }
                dotDataAddress = byteCount;
                tempWordText = "";
                if (letterText == "\n") {
                    ++blankLabels;
                    removedNum = false
                } else {
                    comment = true
                }
                continue
            }
            if (tempWordText != "") {
                if (wordCount == 0) {
                    labelText[lineCount] = 0;
                    ++wordCount
                }
                if (wordCount == 1) {
                    if (instruction(tempWordText.toUpperCase()) < 200) {
                        instText[lineCount] = tempWordText.toUpperCase()
                    } else {
                        instText[lineCount] = ".WORD";
                        ++wordCount
                    }
                }
                if (wordCount == 2) {
                    offsetText[lineCount] = tempWordText
                } else {
                    if (wordCount > 2) {
                        offsetText[lineCount] += tempWordText
                    }
                }
                tempWordText = "";
                ++wordCount
            }
        }
        if (wordCount == 2 && tempWordText == "" && (letterText == '"' || letterText == "'")) {
            tempWordText = letterText;
            ascii = true;
            continue
        }
        if (letterText == "\n") {
            if (wordCount > 0) {
                if (wordCount == 1) {
                    instText[lineCount] = 0
                }
                if (wordCount < 3) {
                    offsetText[lineCount] = 0
                }
                wordCount = 0;
                var len = getLen(instText[lineCount], offsetText[lineCount], byteCount);
                if (len == -2) {
                    message("bad ascii string at line " + (lineCount + blankLabels));
                    showError(lineCount + blankLabels);
                    return
                }
                if (len < -1) {
                    message("bad .block or .align count at line " + (lineCount + blankLabels));
                    showError(lineCount + blankLabels);
                    return
                }
                if (len < 0 && (byteCount & 3) != 0) {
                    byteCount = (byteCount & 268435452) + 4
                }
                if ((byteCount & 3) == 0) {
                    addrToLine[byteCount / 4] = lineCount + blankLabels
                }
                indexToLine[lineCount] = lineCount + blankLabels;
                lineToByteAddress[lineCount] = byteCount;
                ++lineCount;
                if (len >= 0) {
                    byteCount += len
                } else {
                    byteCount += 4
                }
            } else {
                if (comment) {
                    ++blankLabels
                }
            }
            comment = false;
            removedNum = false
        }
        if (letterText > " ") {
            tempWordText += letterText
        }
    }
    if (wordCount) {
        if (wordCount != 1) {
            if (debug) {
                alert("Simulator bug - wordCount = " + wordCount)
            }
        } else {
            instText[lineCount] = ".WORD";
            offsetText[lineCount] = 0;
            indexToLine[lineCount] = lineCount + blankLabels - 1;
            lineToByteAddress[lineCount] = byteCount;
            ++lineCount
        }
    }
    if (byteCount >= maxUsableMem) {
        message("program too long - found " + Math.floor((byteCount + 3) / 4) + " words. Max is " + maxUsableMem);
        showError(lineCount + blankLabels);
        return
    }
    if (dotDataAddress == -1) {
        dotDataAddress = (firstDataDefn == -1) ? byteCount : firstDataDefn
    }
    var r = 0;
    var error = false;
    while (r < lineCount) {
        var inst = instruction(instText[r]);
        if (inst == 200) {
            error = "unknown instruction at line " + convert(r, instText[r]);
            break
        }
        var decode = instKey[inst];
        var I1 = inst1[inst];
        if (!offsetText[r]) {
            if ((decode & 1) == 0) {
                error = "parameters needed at line " + convert(r, instText[r]);
                break
            }
        } else {
            if (offsetText[r][0] == '"' || offsetText[r][0] == "'") {
                if ((decode & 4096) == 0) {
                    error = "syntax error at line " + convert(r, instText[r]);
                    break
                }
                var i = 1;
                var cnt = 0;
                while (i < offsetText[r].length && offsetText[r][i] != offsetText[r][0]) {
                    var curChar = offsetText[r].charCodeAt(i);
                    if (offsetText[r][i] == "\\") {
                        ++i;
                        if (offsetText[r][i] == "n") {
                            curChar = 10
                        } else {
                            if (offsetText[r][i] == "r") {
                                curChar = 13
                            } else {
                                if (offsetText[r][i] == "t") {
                                    curChar = 8
                                } else {
                                    curChar = offsetText[r].charCodeAt(i)
                                }
                            }
                        }
                    }
                    setAddressByte(lineToByteAddress[r] + cnt, curChar);
                    ++i;
                    ++cnt
                }
                if (offsetText[r][i] != offsetText[r][0]) {
                    error = "bad string at line " + convert(r, instText[r]);
                    break
                }
                if (offsetText[r].length > (i + 1)) {
                    error = "syntax error at line " + convert(r, instText[r]);
                    break
                }
                if (inst == 29) {
                    setAddressByte(lineToByteAddress[r] + cnt, 0)
                } else {
                    --cnt
                }
                setData(indexToLine[r], "0x" + padHex(lineToByteAddress[r], 5) + "-0x" + padHex(lineToByteAddress[r] + cnt, 5));
                ++r;
                continue
            } else {
                if (offsetText[r][0] == "{") {
                    if (inst != 22 && inst != 23) {
                        error = "syntax error at line " + convert(r, instText[r]);
                        break
                    }
                    for (var i = 1; i < offsetText[r].length; ++i) {
                        if (offsetText[r][i] == "}") {
                            if (offsetText[r].length > (i + 1)) {
                                error = "syntax error at line " + convert(r, instText[r])
                            }
                            break
                        }
                        if (offsetText[r][i] == " ") {
                            continue
                        }
                        if (offsetText[r][i] == ",") {
                            continue
                        }
                        var rlen = 2;
                        if (offsetText[r][i + 2] >= "0" && offsetText[r][i + 2] <= "9") {
                            ++rlen
                        }
                        var reg1 = regDecode(offsetText[r].substring(i, i + rlen));
                        if (i > (offsetText[r].length - rlen) || reg1 > 15 || (offsetText[r][i + rlen] != "-" && offsetText[r][i + rlen] != "," && offsetText[r][i + rlen] != " " && offsetText[r][i + rlen] != "}")) {
                            error = "syntax error at line " + convert(r, instText[r]);
                            break
                        }
                        if (offsetText[r][i + rlen] != "-") {
                            i += rlen - 1;
                            I1 |= (1 << reg1)
                        } else {
                            i += rlen + 1;
                            rlen = 2;
                            if (offsetText[r][i + 2] >= "0" && offsetText[r][i + 2] <= "9") {
                                ++rlen
                            }
                            var reg2 = regDecode(offsetText[r].substring(i, i + rlen));
                            if (i > (offsetText[r].length - rlen) || reg2 > 15 || (offsetText[r][i + rlen] != "," && offsetText[r][i + rlen] != " " && offsetText[r][i + rlen] != "}") || reg1 > reg2) {
                                error = "syntax error at line " + convert(r, instText[r]);
                                break
                            }
                            i += rlen - 1;
                            while (reg1 <= reg2) {
                                I1 |= (1 << reg1);
                                ++reg1
                            }
                        }
                    }
                    if (error) {
                        break
                    }
                } else {
                    var pos1 = offsetText[r].indexOf(",", 0);
                    var a = 0;
                    if (pos1 == -1) {
                        var reg = regDecode(offsetText[r]);
                        if (reg == 21) {
                            if ((decode & 1024) == 0 || isNaN(a = parseIntGen(offsetText[r])) || a > 4294967295 || a < -4294967296) {
                                error = "syntax error at line " + convert(r, instText[r]);
                                break
                            }
                            if (inst == 27) {
                                if (a > 255 || a < 0) {
                                    error = "illegal byte value at line " + convert(r, "");
                                    break
                                }
                                setAddressByte(lineToByteAddress[r], a);
                                setData(indexToLine[r], "0x" + padHex(lineToByteAddress[r], 5));
                                ++r;
                                continue
                            }
                            if (inst == 19) {
                                if (a <= 0 || (a + lineToByteAddress[r]) > maxUsableMem) {
                                    error = "illegal .block count " + convert(r, "");
                                    break
                                }
                                for (var i = 0; i < a; ++i) {
                                    setAddressByte(lineToByteAddress[r] + i, 0)
                                }
                                setData(indexToLine[r], "0x" + padHex(lineToByteAddress[r], 5) + "-0x" + padHex(lineToByteAddress[r] + a - 1, 5));
                                ++r;
                                continue
                            }
                            if (inst == 35) {
                                ++r;
                                continue
                            }
                            I1 += a
                        } else {
                            if (reg == 20) {
                                var nxt = offsetText[r].substring(0, 1);
                                if ((decode & 128) == 0 || nxt == "#") {
                                    error = "syntax error at line " + convert(r, instText[r]);
                                    break
                                }
                                if (nxt == ".") {
                                    var dotLabelIndex = matchDotLabel(offsetText[r]);
                                    if (dotLabelIndex != -1 && I1 == 0) {
                                        if (dotLabelIndex & 2147483648) {
                                            I1 = dotLabelIndex
                                        } else {
                                            I1 = dotLabelValues[dotLabelIndex]
                                        }
                                    } else {
                                        if ((dotLabelIndex = getColourVal(offsetText[r])) != -1 && I1 == 0) {
                                            I1 = dotLabelIndex
                                        } else {
                                            if (offsetText[r].length == 1) {
                                                a = 0
                                            } else {
                                                nxt = offsetText[r].substring(1, 2);
                                                var nxt1 = offsetText[r].substring(2, 3);
                                                a = parseIntGen(offsetText[r].substring(2));
                                                if ((nxt != "+" && nxt != "-") || nxt1 < "0" || nxt1 > "9" || isNaN(a)) {
                                                    error = "bad address offset at line " + convert(r, "");
                                                    break
                                                }
                                                if (nxt == "-") {
                                                    a = -a
                                                }
                                            }
                                            var b = (lineToByteAddress[r] >> 2) + a;
                                            if (b < 0 || b >= (maxUsableMem / 4)) {
                                                error = "bad address offset at line " + convert(r, "");
                                                break
                                            }
                                            if (I1 == 0) {
                                                I1 = b * 4
                                            } else {
                                                var a1 = a - 2;
                                                if (a1 < -8388607 || a1 > 8388607) {
                                                    error = "bad address offset at line " + convert(r, "");
                                                    break
                                                }
                                                I1 += a1 & 16777215
                                            }
                                        }
                                    }
                                } else {
                                    for (a = 0; a < lineCount; ++a) {
                                        if (offsetText[r] == labelText[a]) {
                                            break
                                        }
                                    }
                                    if (a >= lineCount) {
                                        error = "unknown address label at line " + convert(r, "");
                                        break
                                    }
                                    if (I1 == 0) {
                                        I1 = lineToByteAddress[a]
                                    } else {
                                        if ((lineToByteAddress[a] & 3) != 0) {
                                            error = "unaligned address at line " + convert(r, instText[r]);
                                            break
                                        }
                                        var b = ((lineToByteAddress[a] >> 2) - (lineToByteAddress[r] >> 2) - 2);
                                        if (b < -8388607 || b > 8388607) {
                                            error = "address out of range at line " + convert(r, "");
                                            break
                                        }
                                        I1 += b & 16777215
                                    }
                                }
                            } else {
                                error = "syntax error at line " + convert(r, instText[r]);
                                break
                            }
                        }
                    } else {
                        var pos2 = offsetText[r].indexOf(",", pos1 + 1);
                        var reg1 = regDecode(offsetText[r].substring(0, pos1));
                        if (offsetText[r].substring(pos1 + 1, pos1 + 2) == "[") {
                            pos2 = -1
                        }
                        if (pos2 == -1) {
                            var reg2 = regDecode(offsetText[r].substring(pos1 + 1));
                            if (reg1 > 15) {
                                error = "syntax error at line " + convert(r, instText[r]);
                                break
                            }
                            if (reg2 < 16) {
                                if ((decode & 2) == 0) {
                                    error = "syntax error at line " + convert(r, instText[r]);
                                    break
                                }
                                if (inst == 2) {
                                    reg1 *= 16
                                }
                                I1 += (reg1 << 12) + reg2
                            } else {
                                if (reg2 == 21) {
                                    a = parseIntGen(offsetText[r].substring(pos1 + 1));
                                    if (!isNaN(a) && a >= 2147483648) {
                                        a -= 4294967296
                                    }
                                    if ((decode & 16) != 0 && !isNaN(a) && a < maxUsableMem) {
                                        if ((a & 3) != 0 && (inst == 14 || inst == 15)) {
                                            error = "Unaligned access at line " + convert(r, instText[r]);
                                            break
                                        }
                                        a -= lineToByteAddress[r] + 8;
                                        if (a > 4095 || a < -4095) {
                                            error = "range error at line " + convert(r, instText[r]);
                                            break
                                        }
                                        if (a >= 0) {
                                            I1 += 8388608 + a
                                        } else {
                                            I1 += (-a)
                                        }
                                        I1 += reg1 << 12
                                    } else {
                                        error = "syntax error at line " + convert(r, instText[r]);
                                        break
                                    }
                                } else {
                                    if (reg2 == 20) {
                                        var nxt = offsetText[r].substring(pos1 + 1, pos1 + 2);
                                        if (nxt == "#") {
                                            if ((decode & 4) == 0) {
                                                error = "syntax error at line " + convert(r, instText[r]);
                                                break
                                            }
                                            nxt = offsetText[r].substring(pos1 + 2, pos1 + 3);
                                            if ((nxt >= "0" && nxt <= "9") || nxt == "+" || nxt == "-") {
                                                a = checkImm(offsetText[r].substring(pos1 + 2));
                                                if (a == -2 && inst == 3) {
                                                    a = parseIntGen(offsetText[r].substring(pos1 + 2));
                                                    if (isNaN(a)) {
                                                        error = "syntax error at line " + convert(r, instText[r]);
                                                        break
                                                    }
                                                    if (a > 2147483648) {
                                                        a -= 4294967296
                                                    }
                                                    if (a < 0 && a >= -65535) {
                                                        a = -a;
                                                        I1 = (reg1 << 12) + 3810525184 + (a & 4095) + ((a << 4) & 983040)
                                                    } else {
                                                        if (a >= 0 && a <= 65535) {
                                                            I1 = (reg1 << 12) + 3808428032 + (a & 4095) + ((a << 4) & 983040)
                                                        } else {
                                                            if (a < -33554432 || a > 33554431 || (reg1 >= 13 && a < 0)) {
                                                                error = "immediate out of range at line " + convert(r, instText[r]);
                                                                break
                                                            } else {
                                                                I1 = (reg1 << 28) + 201326592 + (a & 67108863)
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    if (a < 0) {
                                                        error = "syntax error at line " + convert(r, instText[r]);
                                                        break
                                                    }
                                                    if (inst == 2) {
                                                        reg1 *= 16
                                                    }
                                                    I1 += (reg1 << 12) + a + 33554432
                                                }
                                            } else {
                                                var b;
                                                var label = offsetText[r].substring(pos1 + 2);
                                                if (label.substring(0, 1) == ".") {
                                                    var dotLabelIndex = matchDotLabel(label);
                                                    if (dotLabelIndex != -1) {
                                                        if (dotLabelIndex & 2147483648) {
                                                            b = dotLabelIndex
                                                        } else {
                                                            b = dotLabelValues[dotLabelIndex]
                                                        }
                                                    } else {
                                                        if ((b = getColourVal(label)) == -1) {
                                                            error = "unknown dot label at line " + convert(r, "");
                                                            break
                                                        }
                                                    }
                                                } else {
                                                    for (a = 0; a < lineCount; ++a) {
                                                        if (label == labelText[a]) {
                                                            break
                                                        }
                                                    }
                                                    if (a >= lineCount || (decode & 4) == 0) {
                                                        error = "unknown address label at line " + convert(r, "");
                                                        break
                                                    }
                                                    b = lineToByteAddress[a]
                                                }
                                                a = checkImm("" + b);
                                                if (a == -2 && inst == 3) {
                                                    if (b > 2147483648) {
                                                        b -= 4294967296
                                                    }
                                                    if (b < 0 && b >= -65535) {
                                                        b = -b;
                                                        I1 = (reg1 << 12) + 3810525184 + (b & 4095) + ((b << 4) & 983040)
                                                    } else {
                                                        if (b >= 0 && b <= 65535) {
                                                            I1 = (reg1 << 12) + 3808428032 + (b & 4095) + ((b << 4) & 983040)
                                                        } else {
                                                            if (b < -33554432 || b > 33554431 || (reg1 >= 13 && b < 0)) {
                                                                error = "too many bits in address at line " + convert(r, instText[r]);
                                                                break
                                                            } else {
                                                                I1 = (reg1 << 28) + 201326592 + (b & 67108863)
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    if (a < 0) {
                                                        error = "too many bits in address at line " + convert(r, instText[r]);
                                                        break
                                                    }
                                                    if (inst == 2) {
                                                        reg1 *= 16
                                                    }
                                                    I1 += (reg1 << 12) + a + 33554432
                                                }
                                            }
                                        } else {
                                            if (nxt == "[") {
                                                var pos3 = offsetText[r].indexOf("]", pos1 + 1);
                                                var pos4 = offsetText[r].indexOf("+", pos1 + 1);
                                                var pos6 = offsetText[r].indexOf("-", pos1 + 1);
                                                if (pos3 == -1 || (decode & 512) == 0 || (pos4 != -1 && pos6 != -1) || offsetText[r].length > (pos3 + 1)) {
                                                    error = "syntax error at line " + convert(r, instText[r]);
                                                    break
                                                }
                                                var sign = 1;
                                                if (pos6 != -1) {
                                                    pos4 = pos6;
                                                    sign = -1
                                                }
                                                var pos5 = offsetText[r].indexOf(",", pos1 + 1);
                                                if (pos5 != -1 && (pos4 == -1 || pos5 < pos4)) {
                                                    pos4 = pos5
                                                }
                                                if (pos4 != -1 && pos4 > pos3) {
                                                    pos4 = -1
                                                }
                                                if (pos4 == -1) {
                                                    reg2 = regDecode(offsetText[r].substring(pos1 + 2, pos3));
                                                    a = 0
                                                } else {
                                                    reg2 = regDecode(offsetText[r].substring(pos1 + 2, pos4));
                                                    nxt = offsetText[r].substring(pos4 + 1, pos4 + 2);
                                                    if (nxt == "#") {
                                                        ++pos4;
                                                        nxt = offsetText[r].substring(pos4 + 1, pos4 + 2);
                                                        if (nxt == "+" || nxt == "-") {
                                                            ++pos4;
                                                            nxt = offsetText[r].substring(pos4 + 1, pos4 + 2)
                                                        }
                                                    } else {
                                                        if (nxt == "-") {
                                                            ++pos4
                                                        }
                                                    }
                                                    var reg3 = regDecode(offsetText[r].substring(pos4 + 1, pos3));
                                                    if (reg3 == 21) {
                                                        a = parseIntGen(offsetText[r].substring(pos4 + 1, pos3));
                                                        if (isNaN(a) || a < 0 || a > 4095) {
                                                            error = "syntax error at line " + convert(r, instText[r]);
                                                            break
                                                        }
                                                    } else {
                                                        if (reg3 == 20) {
                                                            var label = offsetText[r].substring(pos4 + 1, pos3);
                                                            var dotLabelIndex = matchDotLabel(label);
                                                            if (dotLabelIndex != -1) {
                                                                if (dotLabelIndex & 2147483648) {
                                                                    a = dotLabelIndex
                                                                } else {
                                                                    a = dotLabelValues[dotLabelIndex]
                                                                }
                                                            } else {
                                                                for (a = 0; a < lineCount; ++a) {
                                                                    if (label == labelText[a]) {
                                                                        break
                                                                    }
                                                                }
                                                                if (a >= lineCount) {
                                                                    error = "unknown address label at line " + convert(r, "");
                                                                    break
                                                                }
                                                                a = lineToByteAddress[a]
                                                            }
                                                            if (sign == -1) {
                                                                error = "cannot subtract a label at line " + convert(r, "");
                                                                break
                                                            }
                                                            if (a > 4294963200) {
                                                                sign = -1;
                                                                a = 4294967296 - a
                                                            }
                                                            if (isNaN(a) || a < 0 || a > 4095) {
                                                                error = "label out of range at line " + convert(r, instText[r]);
                                                                break
                                                            }
                                                        } else {
                                                            if (reg3 > 15 || reg3 < 0) {
                                                                error = "unknown 2nd indirect register at line " + convert(r, "");
                                                                break
                                                            }
                                                            a = reg3;
                                                            I1 += 33554432
                                                        }
                                                    }
                                                }
                                                if (reg2 > 15) {
                                                    error = "unknown indirect register at line " + convert(r, "");
                                                    break
                                                }
                                                if (a > 4095 || a < 0) {
                                                    error = "problem with offset calculation at line " + convert(r, "");
                                                    break
                                                }
                                                I1 = (I1 & 4293918720) + (reg2 << 16) + (reg1 << 12) + a;
                                                if (sign > 0) {
                                                    I1 += 8388608
                                                }
                                            } else {
                                                var nxt = offsetText[r].substring(pos1 + 1, pos1 + 2);
                                                if ((decode & 16) == 0 || nxt == "#") {
                                                    error = "syntax error at line " + convert(r, instText[r]);
                                                    break
                                                }
                                                var label = offsetText[r].substring(pos1 + 1);
                                                var dotLabelIndex = matchDotLabel(label);
                                                if (dotLabelIndex != -1) {
                                                    if (dotLabelIndex & 2147483648) {
                                                        a = dotLabelIndex;
                                                        if (inst != 14 && inst != 15) {
                                                            error = "bad I/O address for operation at line " + convert(r, "");
                                                            break
                                                        }
                                                    } else {
                                                        a = dotLabelValues[dotLabelIndex];
                                                        var code = dotLabelMode[dotLabelIndex];
                                                        if (inst == 14) {
                                                            code &= 4
                                                        } else {
                                                            if (inst == 15) {
                                                                code &= 1
                                                            } else {
                                                                if (inst == 25) {
                                                                    code &= 8
                                                                } else {
                                                                    if (inst == 26) {
                                                                        code &= 2
                                                                    } else {
                                                                        code = 0
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        if (code == 0) {
                                                            error = "bad I/O address for operation at line " + convert(r, "");
                                                            break
                                                        }
                                                    }
                                                    if (a > 2147483648) {
                                                        a -= 4294967296
                                                    }
                                                } else {
                                                    for (a = 0; a < lineCount; ++a) {
                                                        if (label == labelText[a]) {
                                                            break
                                                        }
                                                    }
                                                    if (a >= lineCount) {
                                                        error = "unknown address label at line " + convert(r, "");
                                                        break
                                                    }
                                                    a = lineToByteAddress[a];
                                                    if (isNaN(a) || a < 0 || a >= maxUsableMem) {
                                                        error = "label out of range at line " + convert(r, instText[r]);
                                                        break
                                                    }
                                                }
                                                if ((I1 & 4194304) == 0 && (a & 3) != 0) {
                                                    error = "label not word aligned at line " + convert(r, instText[r]);
                                                    break
                                                }
                                                a -= lineToByteAddress[r] + 8;
                                                if (a < -4095 || a > 4095) {
                                                    error = "label out of range at line " + convert(r, instText[r]);
                                                    break
                                                }
                                                if (a >= 0) {
                                                    I1 += 8388608 + a
                                                } else {
                                                    I1 += (-a)
                                                }
                                                I1 += reg1 << 12
                                            }
                                        }
                                    } else {
                                        error = "unknown problem at line " + convert(r, "");
                                        break
                                    }
                                }
                            }
                        } else {
                            var reg2 = regDecode(offsetText[r].substring(pos1 + 1, pos2));
                            var reg3 = regDecode(offsetText[r].substring(pos2 + 1));
                            if (reg2 > 15) {
                                error = "2nd parameter not a valid register at line " + convert(r, "");
                                break
                            }
                            if (reg3 < 16) {
                                if ((decode & 256) == 0) {
                                    error = "syntax error at line " + convert(r, instText[r]);
                                    break
                                }
                                I1 += reg1 << 12;
                                if ((I1 & 266338304) == 27262976) {
                                    I1 += (reg3 << 8) + 16 + reg2
                                } else {
                                    I1 += (reg2 << 16) + reg3
                                }
                            } else {
                                if (reg3 == 20 && offsetText[r].substring(pos2 + 1, pos2 + 2) == "#") {
                                    if ((decode & (8 + 2048)) == 0) {
                                        error = "syntax error at line " + convert(r, instText[r]);
                                        break
                                    }
                                    nxt = offsetText[r].substring(pos2 + 2, pos2 + 3);
                                    if (nxt >= "0" && nxt <= "9") {
                                        a = checkImm(offsetText[r].substring(pos2 + 2))
                                    } else {
                                        for (a = 0; a < lineCount; ++a) {
                                            if (offsetText[r].substring(pos2 + 2) == labelText[a]) {
                                                break
                                            }
                                        }
                                        if (a >= lineCount) {
                                            error = "unknown address label at line " + convert(r, "");
                                            break
                                        }
                                        if ((a = checkImm("" + lineToByteAddress[a])) == -1) {
                                            error = "too many bits in address at line " + convert(r, instText[r]);
                                            break
                                        }
                                    }
                                    if (a == -1) {
                                        error = "syntax error at line " + convert(r, instText[r]);
                                        break
                                    }
                                    if ((decode & 8) == 0) {
                                        if ((I1 & 96) == 0 || (I1 & 96) == 96) {
                                            if (a == 0 || a > 31) {
                                                error = "immediate must be 1-31 at line " + convert(r, instText[r]);
                                                break
                                            }
                                        } else {
                                            if (a == 0 || a > 32) {
                                                error = "immediate must be 1-32 at line " + convert(r, instText[r]);
                                                break
                                            }
                                            if (a == 32) {
                                                a = 0
                                            }
                                        }
                                    }
                                    if (a < 0) {
                                        error = "immediate more than 8 bits at line " + convert(r, instText[r]);
                                        break
                                    }
                                    I1 += reg1 << 12;
                                    if ((I1 & 266338304) == 27262976) {
                                        I1 += (a << 7) + reg2
                                    } else {
                                        I1 += (reg2 << 16) + a + 33554432
                                    }
                                } else {
                                    error = "syntax error at line " + convert(r, instText[r]);
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
        if ((lineToByteAddress[r] & 3) != 0) {
            if (debug) {
                alert("issue: line " + r + " badly aligned " + lineToByteAddress[r])
            }
        }
        setAddress(lineToByteAddress[r], I1);
        setCode(indexToLine[r], "0x" + padHex(lineToByteAddress[r], 5));
        ++r
    }
    if (error) {
        var max = Math.floor((byteCount + 3) / 4);
        for (var i = 0; i <= max; ++i) {
            setAddress(i * 4, 0)
        }
        byteCount = 0;
        message(error);
        showError(indexToLine[r])
    } else {
        updateR(13, maxUsableMem);
        message("Program assembled. Run or Step to execute")
    }
}

function convert2(n) {
    if (n * 4 >= byteCount) {
        return "unknown (PC=0x" + padHex((n * 4), 5) + ")"
    }
    return addrToLine[n]
}

function regDecode(text) {
    if (text == "PC" || text == "pc") {
        return 15
    }
    if (text == "SP" || text == "sp") {
        return 13
    }
    if (text == "LR" || text == "lr") {
        return 14
    }
    if (text.length == 2 && (text[0] == "R" || text[0] == "r")) {
        var x = text[1] - "0";
        if (x >= 0 && x < 10) {
            return x
        }
    }
    if (text.length == 3 && (text[0] == "R" || text[0] == "r") && text[1] == "1") {
        var x = text[2] - "0";
        if (x >= 0 && x < 6) {
            return x + 10
        }
    }
    if (isNaN(text)) {
        return 20
    }
    return 21
}

function checkImm(s) {
    var a = parseIntGen(s);
    if (isNaN(a)) {
        return -1
    }
    if (a < 0) {
        a += 4294967296;
        if (a < 0) {
            return -2
        }
    }
    if ((a & 4294967040) == 0) {
        return a & 255
    }
    var sh = 0;
    while (++sh < 16) {
        var t = (a >> 30) & 3;
        a <<= 2;
        a |= t;
        if ((a & 4294967040) == 0) {
            return (a & 255) + (sh << 8)
        }
    }
    return -2
}

function parseIntGen(s) {
    var sign = 1;
    var radix = 10;
    if (s.length == 0) {
        return NaN
    }
    if (s[0] == "-") {
        sign = -1;
        s = s.substring(1)
    } else {
        if (s[0] == "+") {
            s = s.substring(1)
        }
    }
    if (s.length == 0) {
        return NaN
    }
    if (s[0] < "0" || s[0] > "9") {
        return NaN
    }
    if (s.length > 2 && s[0] == "0") {
        s = s.substring(1)
    }
    if (s[0] == "b" || s[0] == "B") {
        radix = 2;
        s = s.substring(1)
    } else {
        if (s[0] == "x" || s[0] == "X") {
            radix = 16;
            s = s.substring(1)
        }
    }
    if (s.length == 0) {
        return NaN
    }
    var i = 0;
    while (i < s.length) {
        if (s[i] < "0") {
            return NaN
        }
        if (radix == 2) {
            if (s[i] > "1") {
                return NaN
            }
        } else {
            if (radix == 10) {
                if (s[i] > "9") {
                    return NaN
                }
            } else {
                if ((s[i] > "9" && s[i] < "A") || (s[i] > "F" && s[i] < "a") || s[i] > "f") {
                    return NaN
                }
            }
        }++i
    }
    return sign * parseInt(s, radix)
}

function decodeImm(s) {
    var sh = (s >> 8) & 15;
    s &= 255;
    while (sh > 0) {
        var t = s & 3;
        s = (s >> 2) & 1073741823;
        s |= t << 30;
        --sh
    }
    return s
}

function updatePC(y) {
    while (y < 0) {
        y += 4294967296
    }
    while (y >= maxUsableMem) {
        y -= maxUsableMem
    }
    pCounter = y;
    if (dontDisplay == 0) {
        updateRDisplay(15, y)
    }
}

function updateR(r, y) {
    if (r == 15) {
        updatePC(y);
        return
    }
    if (r >= 0 && r < 15) {
        while (y < 0) {
            y += 4294967296
        }
        while (y > 4294967295) {
            y -= 4294967296
        }
        register[r] = y;
        if (dontDisplay == 0) {
            updateRDisplay(r, y)
        }
    }
}
var instructions = ["ADD", "SUB", "CMP", "MOV", "AND", "ORR", "EOR", "LSR", "LSL", "B", "BEQ", "BNE", "BLT", "BGT", "LDR", "STR", "HALT", "MVN", "RFE", ".BLOCK", ".WORD", "BL", "PUSH", "POP", "RET", "LDRB", "STRB", ".BYTE", ".ASCII", ".ASCIZ", "ADDS", "SUBS", "BCS", "BVS", "BMI", ".ALIGN", "SVC", "ASR", "ROR", "RRX", "LSRS", "LSLS", "ASRS", "RORS", "RRXS", "BIS", "XOR", "OR", "JMS", "HLT", "ASL", "ASLS"];
var instKey = [8 + 256, 8 + 256, 6, 6, 8 + 256, 8 + 256, 8 + 256, 256 + 2048, 256 + 2048, 128, 128, 128, 128, 128, 16 + 512, 16 + 512, 1, 6, 1, 1024, 1 + 128 + 1024, 128, 64, 64, 1, 16 + 512, 16 + 512, 1024, 4096, 4096, 8 + 256, 8 + 256, 128, 128, 128, 1024, 1025, 256 + 2048, 256 + 2048, 2, 256 + 2048, 256 + 2048, 256 + 2048, 256 + 2048, 2];
var inst1 = [3766484992, 3762290688, 3780116480, 3785359360, 3758096384, 3783262208, 3759144960, 3785359392, 3785359360, 3925868544, 167772160, 436207616, 3120562176, 3388997632, 3844014080, 3842965504, 3774873712, 3789553664, 4173138432, 0, 0, 3942645760, 3912040448, 3904700416, 3785420814, 3848208384, 3847159808, 0, 0, 0, 3767533568, 3763339264, 704643072, 1778384896, 1241513984, 0, 4009754624, 3785359424, 3785359456, 3785359456, 3786407968, 3786407936, 3786408000, 3786408032, 3786408032];

function instruction(text) {
    for (var k = 0; k < 52; ++k) {
        if (text == instructions[k]) {
            break
        }
    }
    if (k < 45) {
        return k
    }
    if (k == 45) {
        return 5
    }
    if (k == 46) {
        return 6
    }
    if (k == 47) {
        return 5
    }
    if (k == 48) {
        return 21
    }
    if (k == 49) {
        return 16
    }
    if (k == 50) {
        return 8
    }
    if (k == 51) {
        return 41
    }
    return 200
}

function getLen(instStr, offset, bCnt) {
    var inst = instruction(instStr);
    if (inst == 19) {
        if (firstDataDefn == -1) {
            firstDataDefn = bCnt
        }
        var a = parseIntGen(offset);
        if (isNaN(a) || a <= 0 || (a + bCnt) > maxUsableMem) {
            return -3
        }
        return a
    }
    if (inst == 35) {
        var a = parseIntGen(offset);
        if (isNaN(a) || a <= 0 || a > 268435455) {
            return -3
        }
        var b = bCnt % a;
        if (b == 0) {
            a = bCnt
        } else {
            a += bCnt - bCnt % a
        }
        if (a > maxUsableMem) {
            return -3
        }
        return (a - bCnt)
    }
    if (inst < 27 || inst > 29) {
        if (inst == 20 && firstDataDefn == -1) {
            firstDataDefn = bCnt
        }
        return -1
    }
    if (inst == 27) {
        if (firstDataDefn == -1) {
            firstDataDefn = bCnt
        }
        return 1
    }
    if (offset[0] != '"' && offset[0] != "'") {
        if (debug) {
            alert("Bad call to getLen, offset = " + offset)
        }
        return -2
    }
    var i = 1;
    var cnt = 0;
    while (i < offset.length && offset[i] != offset[0]) {
        if (offset[i] == "\\") {
            ++i
        }++i;
        ++cnt
    }
    if (offset[i] != offset[0]) {
        if (debug) {
            alert("Bad call to getLen, offset = " + offset)
        }
        return -2
    }
    if (inst == 28) {
        return cnt
    }
    if (inst == 29) {
        return cnt + 1
    }
    if (debug) {
        alert("Bad call to getLen, inst = " + inst + " i = " + i)
    }
    return -1
}
var savOpenAddress = false;

function openAddress(inp) {
    if (waitingForInput) {
        return
    }
    if (myTimeout || myMaybe) {
        return
    }
    _paq.push(["trackEvent", "Button", "Address", inp.id]);
    message("Modifying memory contents");
    openAddressToEdit(inp);
    waitingForInput = true;
    savOpenAddress = inp;
    setStateEdit()
}

function pixelInt(inp) {
    if (inp.id[0] != "p") {
        if (debug) {
            alert("Bad pixel click decode")
        }
        return
    }
    if ((pixelMask & 1) != 0 && IOVectors[4] >= 0) {
        interruptRequest |= 4
    } else {
        if ((pixelMask & 2) != 0) {
            pixelMask |= 4
        } else {
            lastPixelClick = parseInt(inp.id.substring(1));
            if (debug) {
                alert("Pixel click when not enabled " + lastPixelClick)
            }
            return
        }
    }
    lastPixelClick = parseInt(inp.id.substring(1))
}

function checkInput(iValue) {
    if (!waitingForInput) {
        return false
    }
    if (memOpt == 3) {
        iValue = iValue.replace(" ", "")
    }
    if (iValue == "") {
        return false
    }
    var value = parseIntGen(iValue);
    if (isNaN(value) || value > 4294967295 || value < -2147483648) {
        return false
    }
    return true
}

function addressSubmit() {
    if (!waitingForInput) {
        if (debug) {
            alert("Bad input - not waiting for input")
        }
        return
    }
    var epvalue = getAddressValue();
    if (epvalue == "") {
        message("Bad input - must be a number");
        return
    }
    var value = parseIntGen(epvalue);
    if (isNaN(value) || value > 4294967295 || value < -2147483648) {
        message("Bad number format or value");
        return
    }
    document.getElementById("aForm").removeAttribute("onblur");
    var x = parseInt(savOpenAddress.id[1]);
    if (savOpenAddress.id.length >= 3) {
        x = x * 10 + parseInt(savOpenAddress.id[2])
    }
    if (savOpenAddress.id.length >= 4) {
        x = x * 10 + parseInt(savOpenAddress.id[3])
    }
    if (savOpenAddress.id.length == 5) {
        x = x * 10 + parseInt(savOpenAddress.id[4])
    }
    x += overlay * 64;
    setAddress(x * 4, value);
    waitingForInput = false;
    setStateReady();
    savOpenAddress = false;
    if (programText == "") {
        message("LOAD or EDIT a program")
    } else {
        message("RUN/STEP your program or LOAD/EDIT a program")
    }
}

function loseAddress(inp) {
    if (!waitingForInput) {
        return
    }
    if (checkInput(inp.value)) {
        addressSubmit()
    } else {
        resetAddressInput();
        var x = parseInt(savOpenAddress.id[1]);
        if (savOpenAddress.id.length >= 3) {
            x = x * 10 + parseInt(savOpenAddress.id[2])
        }
        if (savOpenAddress.id.length >= 4) {
            x = x * 10 + parseInt(savOpenAddress.id[3])
        }
        if (savOpenAddress.id.length == 5) {
            x = x * 10 + parseInt(savOpenAddress.id[4])
        }
        x += overlay * 64;
        setAddress(x * 4, address[x]);
        waitingForInput = false;
        setStateReady();
        savOpenAddress = false;
        message("BAD input ignored")
    }
}

function setAddressByte(x, y) {
    var yy = 255 << ((x & 3) * 8);
    var xx = (y << ((x & 3) * 8)) & yy;
    var zz = address[Math.floor(x / 4)] & (4294967295 ^ yy);
    setAddress(x & 268435452, xx | zz)
}

function setAddress(x, y) {
    if (isNaN(y)) {
        if (debug) {
            alert("attempt to store NaN at " + x)
        }
        return
    }
    if (x < 0 || x >= maxUsableMem) {
        if (debug) {
            alert("store at bad address " + x)
        }
        return
    }
    if ((x & 3) != 0) {
        if (debug) {
            alert("store at unaligned address " + x + " caller should trap this")
        }
        return
    }
    x = x / 4;
    while (y < 0) {
        y += 4294967296
    }
    while (y > 4294967295) {
        y -= 4294967296
    }
    address[x] = y;
    if (dontDisplay == 1) {
        return
    }
    var base = overlay * 64;
    if (x < base) {
        return
    }
    x -= base;
    if (x >= 128) {
        return
    }
    updateDisplayedMemory(x, y)
}

function step3() {
    _paq.push(["trackEvent", "Button", "Step"]);
    oneStep = true;
    speed = 11;
    if (dontDisplay == 1) {
        if (myMaybe) {
            clearTimeout(myMaybe)
        }
        myMaybe = false;
        dontDisplay = 0;
        rewriteMemoryAndRegs(false)
    } else {
        if (myTimeout) {
            clearTimeout(myTimeout)
        }
        myTimeout = false
    }
    run2();
    setValue("counter", "" + instructionCount)
}

function runSlow() {
    if (myTimeout) {
        speed = Math.floor((speed + 2) / 2);
        return
    }
    if (pCounter == 0 && address[0] == 0) {
        message("No program to run");
        return
    }
    _paq.push(["trackEvent", "Button", "Slow"]);
    oneStep = false;
    speed = slowSpeed;
    setStateSlow();
    if (dontDisplay == 1) {
        if (myMaybe) {
            clearTimeout(myMaybe)
        }
        myMaybe = false;
        dontDisplay = 0;
        rewriteMemoryAndRegs(false);
        if (!waitingForInput) {
            myTimeout = delay(speed, "runContinue")
        }
    } else {
        run2()
    }
}

function run() {
    if (waitingForInput || myMaybe) {
        return
    }
    if (myTimeout) {
        clearTimeout(myTimeout);
        myTimeout = false
    }
    _paq.push(["trackEvent", "Button", "Run"]);
    if (pCounter == 0 && address[0] == 0) {
        message("No program to run");
        return
    }
    oneStep = false;
    measureSpeed = instructionCount;
    setValue("counter", "0");
    runTimer = getMilliseconds();
    speed = 1;
    setStateRunning();
    message("");
    dontDisplay = 1;
    removeCodeHighlight();
    removeMemHighlight();
    clearIR();
    myMaybe = delay(delayTime, "maybeRunContinue");
    run2()
}

function run2() {
    if (waitingForInput) {
        return
    }
    stopping = false;
    noKeyEffects = true;
    IEKeyEnable();
    runContinue()
}

function runContinuey() {
    if (dontDisplay == 1) {
        if (myMaybe) {
            clearTimeout(myMaybe)
        }
        myMaybe = false;
        dontDisplay = 0;
        rewriteMemoryAndRegs(false)
    }
    running = false;
    setStatePaused();
    noKeyEffects = false;
    message(halted);
    myTimeout = false
}

function runContinuez() {
    if (waitingForInput) {
        myTimeout = delay(speed, "runContinuez");
        if (fileResult >= 20) {
            fileResult -= 20;
            var elePosn = document.getElementById("read-file");
            elePosn.click()
        }
    } else {
        lastKey = 0;
        if (breakpointAddr == pCounter) {
            if (myMaybe) {
                alert("BUG - myMaybe")
            }
            if (dontDisplay) {
                dontDisplay = 0;
                rewriteMemoryAndRegs(false);
                message(lastMessage);
                if (lineNo * 4 < byteCount) {
                    showExecuteStop(addrToLine[lineNo])
                }
                setMemHighlight(lineNo * 4);
                setValue("counter", "" + instructionCount)
            }
            message("Breakpoint detect at PC = 0x" + padHex(pCounter, 5));
            running = false;
            setStatePaused();
            noKeyEffects = false;
            return
        }
        message(stepTxt);
        if (speed == 1 && oneStep == false) {
            message("");
            dontDisplay = 1;
            clearIR();
            maybeWaiting = 0;
            myMaybe = delay(delayTime, "maybeRunContinue");
            runContinue()
        } else {
            myTimeout = delay(speed, "runContinue")
        }
    }
}

function badStack() {
    var addr = (register[13] & 4294967292) - 4;
    if (addr >= maxUsableMem || addr < 0) {
        if (dontDisplay == 1) {
            if (myMaybe) {
                clearTimeout(myMaybe)
            }
            myMaybe = false;
            dontDisplay = 0;
            rewriteMemoryAndRegs(false)
        }
        message("Bad SP value on interrupt");
        running = false;
        setStatePaused();
        noKeyEffects = false;
        return true
    }
    return false
}

function doClockInt() {
    xTime = 0;
    if (clockIntFreq == 0 || IOVectors[3] < 0 || (IOVectors[3] & 3) != 0 || IOVectors[3] >= maxUsableMem) {
        return
    }
    interruptMask &= 4294967294;
    var addr = (register[13] & 4294967292) - 4;
    setAddress(addr, (flags << 28) | 1);
    addr -= 4;
    setAddress(addr, pCounter);
    updateR(13, addr);
    updatePC(IOVectors[3]);
    message("Accepted interrupt from the timer")
}

function doInterrupt() {
    if ((++interruptCnt) & 1 != 0 || xTime == 0 || xTime >= Date.now()) {
        var addr = (register[13] & 4294967292) - 4;
        if ((interruptRequest & 1) != 0 && (pinMask & 1) != 0 && IOVectors[1] >= 0 && (IOVectors[1] & 3) == 0 && IOVectors[1] < maxUsableMem) {
            interruptMask &= 4294967294;
            interruptRequest &= 4294967294;
            setAddress(addr, (flags << 28) | 1);
            addr -= 4;
            setAddress(addr, pCounter);
            updateR(13, addr);
            updatePC(IOVectors[1]);
            message("Accepted interrupt from the push button");
            return
        }
        if ((interruptRequest & 2) != 0 && (keyboardMask & 1) != 0 && IOVectors[2] >= 0 && (IOVectors[2] & 3) == 0 && IOVectors[2] < maxUsableMem) {
            interruptMask &= 4294967294;
            interruptRequest &= 4294967293;
            setAddress(addr, (flags << 28) | 1);
            addr -= 4;
            setAddress(addr, pCounter);
            updateR(13, addr);
            updatePC(IOVectors[2]);
            message("Accepted interrupt from the keyboard");
            return
        }
        if ((interruptRequest & 4) != 0 && (pixelMask & 1) != 0 && IOVectors[4] >= 0 && (IOVectors[4] & 3) == 0 && IOVectors[4] < maxUsableMem) {
            interruptMask &= 4294967294;
            interruptRequest &= 4294967291;
            setAddress(addr, (flags << 28) | 1);
            addr -= 4;
            setAddress(addr, pCounter);
            updateR(13, addr);
            updatePC(IOVectors[4]);
            message("Accepted interrupt from the pixel click");
            return
        }
    }
    if (xTime && (xTime < Date.now())) {
        doClockInt()
    }
}
var myMaybe = 0;
var maybeWaiting = 0;

function maybeRunContinue() {
    if (myMaybe == 0) {
        if (debug) {
            alert("myMaybe == 0 should not happen")
        }
    }
    if (maybeWaiting == 0) {
        myMaybe = 0;
        return
    }
    maybeWaiting = 0;
    myMaybe = delay(delayTime, "maybeRunContinue");
    runContinue()
}
var DC = [4000, 750, 750, 300, 100, 40, 20, 10, 5, 2, 1];

function runContinue() {
    myTimeout = false;
    if (stopping) {
        if (dontDisplay == 1) {
            if (myMaybe) {
                clearTimeout(myMaybe)
            }
            myMaybe = false;
            dontDisplay = 0;
            rewriteMemoryAndRegs(false);
            if (lineNo * 4 < byteCount) {
                showExecuteStop(addrToLine[lineNo])
            }
            setMemHighlight(lineNo * 4);
            setValue("counter", "" + instructionCount);
            measureSpeed = instructionCount - measureSpeed;
            runTimer = getMilliseconds() - runTimer;
            var tmp1 = Math.floor((measureSpeed / runTimer) / 10);
            var tmp2 = Math.floor(runTimer / 100);
            if (step1Code != 2) {
                message("Program paused. " + measureSpeed + " ins in " + tmp2 / 10 + " secs, " + tmp1 / 100 + "M ins/sec")
            }
        } else {
            if (!oneStep) {
                if (step1Code != 2) {
                    message("Program paused. RUN or STEP to continue, STOP to abort.")
                }
            } else {
                if (step1Code != 2) {
                    message(stepTxt)
                }
            }
        }
        running = false;
        setStatePaused();
        noKeyEffects = false;
        return
    }
    if (oneStep) {
        stopping = true
    }
    if ((interruptMask & 1) != 0 && (interruptRequest != 0 || (xTime && (xTime < Date.now())))) {
        if (badStack()) {
            return
        }
        doInterrupt()
    }
    step1Code = 0;
    if (dontDisplay == 0) {
        var pc = Math.floor(pCounter / 4);
        if (pc * 4 < byteCount) {
            showExecuteStop(addrToLine[pc])
        }
        setMemHighlight(pCounter);
        if (!step1(1) && breakpointAddr != pCounter) {
            message(stepTxt);
            setValue("counter", "" + instructionCount);
            myTimeout = delay((speed - 10) * 4, "runContinue");
            return
        }
        setValue("counter", "" + instructionCount);
        if (waitingForInput) {
            myTimeout = delay(speed, "runContinuez");
            return
        }
        if (breakpointAddr == pCounter) {
            message("Breakpoint detect at PC = 0x" + padHex(pCounter, 5))
        }
        running = false;
        setStatePaused();
        noKeyEffects = false;
        return
    }
    if (step1(751)) {
        if (breakpointAddr == pCounter && step1Code == 5) {
            step1Code = 2
        }
        if (step1Code < 3) {
            if (myMaybe) {
                clearTimeout(myMaybe)
            }
            myMaybe = false;
            dontDisplay = 0;
            rewriteMemoryAndRegs(false);
            message(lastMessage);
            if (step1Code == 2) {
                message("Stopped on Breakpoint at PC = 0x" + padHex(pCounter, 5))
            }
            if (lineNo * 4 < byteCount) {
                showExecuteStop(addrToLine[lineNo])
            }
            setMemHighlight(lineNo * 4);
            setValue("counter", "" + instructionCount);
            running = false;
            setStatePaused();
            noKeyEffects = false;
            return
        }
        if (waitingForInput) {
            if (myMaybe) {
                clearTimeout(myMaybe)
            }
            myMaybe = false;
            dontDisplay = 0;
            rewriteMemoryAndRegs(false);
            message(lastMessage);
            setValue("counter", "" + instructionCount);
            myTimeout = delay(speed, "runContinuez");
            return
        }
    }
    maybeWaiting = 1;
    if (myMaybe == 0) {
        if (debug) {
            alert("myMaybe == 0 - interlock went wrong")
        }
    }
    setValue("counter", "" + instructionCount);
    if (speed == 1) {
        return
    }
    dontDisplay = 0;
    rewriteMemoryAndRegs(false);
    dontDisplay = 1;
    return
}

function stop() {
    _paq.push(["trackEvent", "Button", "Pause"]);
    stopping = true
}

function stop2() {
    if (myMaybe) {
        clearTimeout(myMaybe)
    }
    myMaybe = false;
    if (myTimeout) {
        clearTimeout(myTimeout)
    }
    myTimeout = false;
    running = false;
    noKeyEffects = false;
    fileResult = -1;
    consoleReset();
    removeCodeHighlight();
    removeMemHighlight();
    removeError()
}

function reset1() {
    _paq.push(["trackEvent", "Button", "Stop"]);
    reset2();
    message("Stop done, edit &amp; Submit, RUN/STEP or alter memory")
}

function reset2() {
    dontDisplay = 0;
    stop2();
    updateR(0, 0);
    updateR(1, 0);
    updateR(2, 0);
    updateR(3, 0);
    updateR(4, 0);
    updateR(5, 0);
    updateR(6, 0);
    updateR(7, 0);
    updateR(8, 0);
    updateR(9, 0);
    updateR(10, 0);
    updateR(11, 0);
    updateR(12, 0);
    updateR(13, maxUsableMem);
    updateR(14, 0);
    updatePC(0);
    updateFlags(0);
    output1 = "";
    clearIR();
    lastKey = 0;
    if (savOpenAddress) {
        var x = parseInt(savOpenAddress.id[1]);
        if (savOpenAddress.id.length >= 3) {
            x = x * 10 + parseInt(savOpenAddress.id[2])
        }
        if (savOpenAddress.id.length >= 4) {
            x = x * 10 + parseInt(savOpenAddress.id[3])
        }
        if (savOpenAddress.id.length == 5) {
            x = x * 10 + parseInt(savOpenAddress.id[4])
        }
        x += overlay * 64;
        setAddress(x * 4, address[x]);
        waitingForInput = false;
        savOpenAddress = false
    }
    if (modifyingProgram) {
        modifyingProgram = false;
        textToHtml();
        waitingForInput = false;
        removeClass("program", "edit")
    }
    if (waitingForInput) {
        waitingForInput = false
    }
    clearInputArea();
    interruptRequest = 0;
    interruptMask = 0;
    keyboardMask = 0;
    pinMask = 0;
    clockIntFreq = 0;
    pixelMask = 0;
    IOVectors[0] = -1;
    IOVectors[1] = -1;
    IOVectors[2] = -1;
    IOVectors[3] = -1;
    IOVectors[4] = -1;
    pixelAreaSize = 3072;
    clearPixelArea();
    lastPixelClick = -1;
    instructionCount = 0;
    setValue("counter", "0");
    rewriteMemoryAndRegs(false);
    intButtonReset();
    setStateReady()
}

function clearPixelArea() {
    setPixelAreaSize(pixelAreaSize);
    var cnt = pixelAreaSize;
    for (var i = 0; i < cnt; ++i) {
        v1address[i] = 16777215
    }
    cnt = charMax / 4;
    var i = 0;
    while (i < cnt) {
        v2address[i] = 0;
        ++i
    }
    clearCharMap();
    cnt = (IOBase - charBase) / 4;
    while (i < cnt) {
        v2address[i] = 16777215;
        ++i
    }
}
var startFm = [0, 6, 0, 13, 40, 19, 40, 23, 27, 29, 30, 38, 40, 40, 40, 39];
var newIValue = [3766484992, 3762290688, 3758096384, 3759144960, 3767533568, 3763339264, 3785359360, 3785359392, 3785359360, 3785359424, 3785359456, 3785359456, 3774873712, 3783262208, 3785359360, 3789553664, 3780116480, 3810525184, 3808428032, 3843031040, 3841982464, 3847225344, 3846176768, 3876585472, 3875536896, 3880779776, 3879731200, 3904700416, 4173138432, 3912040448, 3925868544, 167772160, 436207616, 3120562176, 3388997632, 704643072, 1778384896, 1241513984, 3942645760, 4009754624, 201326592, 0];
var newIMask = [4260364288, 4260364288, 4260364288, 4260364288, 4260364288, 4260364288, 4294905840, 4293853280, 4293853280, 4293853280, 4293857264, 4293853280, 4294967295, 4260364288, 4261347328, 4261347328, 4260425728, 4293918720, 4293918720, 4285530112, 4285530112, 4285530112, 4285530112, 4285530112, 4285530112, 4285530112, 4285530112, 4294901760, 4294967295, 4294901760, 4278190080, 4278190080, 4278190080, 4278190080, 4278190080, 4278190080, 4278190080, 4278190080, 4278190080, 4278190080, 201326592, 0];
var newINmame = ["ADD", "SUB", "AND", "EOR", "ADDS", "SUBS", "MOV", "LSR", "LSL", "ASR", "RRX", "ROR", "HALT", "ORR", "MOV", "MVN", "CMP", "MOV", "MOV", "LDR", "STR", "LDRB", "STRB", "LDR", "STR", "LDRB", "STRB", "POP", "RFE", "PUSH", "B", "BEQ", "BNE", "BLT", "BGT", "BCS", "BVS", "BMI", "BL", "SVC", "MOV", "ILLEGAL"];
var newIDecode = [7, 7, 7, 7, 7, 7, 3, 5, 5, 5, 5, 5, 0, 7, 3, 3, 4, 8, 8, 2, 2, 2, 2, 1, 1, 1, 1, 9, 0, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 10, 0];

function step1(lim) {
    var newFormat;
    var iy;
    var iz;
    var dreg;
    var nreg;
    var opr2;
    var addr;
    var error = "";
    var lowLim;
    var result;
    var tmp;
    var flgs;
    var tres;
    var t1;
    var t2;
    if (waitingForInput) {
        return 0
    }
    setStateForceRunning();
    for (var ii = 0; ii < lim; ++ii) {
        for (var jj = 0; jj < 201; ++jj) {
            lineNo = Math.floor(pCounter / 4);
            inst = address[lineNo];
            if (dontDisplay == 0) {
                setIR(padHex(inst, 8));
                updatePC(pCounter + 4)
            } else {
                pCounter += 4;
                if (pCounter >= maxUsableMem) {
                    pCounter = 0
                }
            }++instructionCount;
            newFormat = startFm[(inst >> 24) & 15];
            for (; newFormat < 38; ++newFormat) {
                if ((inst & newIMask[newFormat]) == (newIValue[newFormat] & 4294967295)) {
                    break
                }
            }
            iy = newINmame[newFormat];
            iz = "";
            dreg = 100;
            nreg = 100;
            opr2 = NaN;
            addr = 10000;
            switch (newIDecode[newFormat]) {
                case 0:
                    break;
                default:
                    if (debug) {
                        alert("step1() fault on decode " + newIDecode[newFormat] + " " + newFormat)
                    }
                    error = "emulator fault";
                case 1:
                    dreg = (inst >> 12) & 15;
                    nreg = (inst >> 16) & 15;
                    addr = (nreg < 15) ? register[nreg] : pCounter + 4;
                    var ti = inst & 15;
                    ti = (ti < 15) ? register[ti] : pCounter + 4;
                    if ((inst & 8388608) != 0) {
                        addr += ti;
                        iz = "&nbsp;Rd,[Rn+Rm]"
                    } else {
                        addr -= ti;
                        iz = "&nbsp;Rd,[Rn-Rm]"
                    }
                    if (addr > 2147483648) {
                        addr -= 4294967296
                    }
                    lowLim = vaddressBase - 4294967296;
                    if (addr < lowLim || addr >= maxUsableMem) {
                        error = "bad address"
                    }
                    break;
                case 2:
                    addr = inst & 4095;
                    dreg = (inst >> 12) & 15;
                    nreg = (inst >> 16) & 15;
                    if (nreg == 15) {
                        iz = " Rd,addr";
                        if ((inst & 8388608) != 0) {
                            addr += (pCounter & 268435452) + 4
                        } else {
                            addr = (pCounter & 268435452) + 4 - addr
                        }
                    } else {
                        iz = "&nbsp;Rd,[Rn+nn]";
                        if ((inst & 8388608) != 0) {
                            addr += register[nreg]
                        } else {
                            addr = (register[nreg]) - addr
                        }
                    }
                    if (addr > 2147483648) {
                        addr -= 4294967296
                    }
                    lowLim = vaddressBase - 4294967296;
                    if (addr < lowLim || addr >= maxUsableMem) {
                        error = "bad address"
                    }
                    break;
                case 3:
                    dreg = (inst >> 12) & 15;
                    if ((inst & 33554432) != 0) {
                        iz = " Rd,#im";
                        opr2 = decodeImm(inst & 4095)
                    } else {
                        iz = " Rd,Rm";
                        if ((inst & 15) < 15) {
                            opr2 = register[inst & 15]
                        } else {
                            opr2 = pCounter + 4
                        }
                    }
                    break;
                case 4:
                    nreg = (inst >> 16) & 15;
                    if ((inst & 33554432) != 0) {
                        iz = " Rn,#im";
                        opr2 = decodeImm(inst & 4095)
                    } else {
                        iz = " Rn,Rm";
                        if ((inst & 15) < 15) {
                            opr2 = register[inst & 15]
                        } else {
                            opr2 = pCounter + 4
                        }
                    }
                    break;
                case 5:
                    dreg = (inst >> 12) & 15;
                    nreg = inst & 15;
                    if ((inst & 1048576) != 0) {
                        iy += "S"
                    }
                    if ((inst & 16) != 0) {
                        iz = " Rd,Rn,Rm";
                        if (((inst >> 8) & 15) < 15) {
                            opr2 = register[(inst >> 8) & 15]
                        } else {
                            opr2 = pCounter + 4
                        }
                        opr2 &= 255;
                        if (opr2 > 32) {
                            opr2 = 32
                        }
                    } else {
                        iz = " Rd,Rn,#im";
                        opr2 = (inst >> 7) & 31;
                        if (opr2 == 0) {
                            if ((inst & 96) != 0) {
                                opr2 = 32
                            }
                            if ((inst & 96) == 96) {
                                iz = " Rd,Rn"
                            }
                        }
                    }
                    break;
                case 6:
                    iz = " addr";
                    addr = inst & 16777215;
                    if ((addr & 8388608) != 0) {
                        addr -= 16777216
                    }
                    addr = (addr * 4) + pCounter + 4;
                    if (addr < 0 || addr > maxUsableMem) {
                        error = "bad address"
                    }
                    break;
                case 7:
                    dreg = (inst >> 12) & 15;
                    nreg = (inst >> 16) & 15;
                    if ((inst & 33554432) != 0) {
                        iz = " Rd,Rn,#im";
                        opr2 = decodeImm(inst & 4095)
                    } else {
                        iz = " Rd,Rn,Rm";
                        if ((inst & 15) < 15) {
                            opr2 = register[inst & 15]
                        } else {
                            opr2 = pCounter + 4
                        }
                    }
                    break;
                case 8:
                    dreg = (inst >> 12) & 15;
                    iz = " Rd,#im";
                    opr2 = (inst & 4095) + ((inst >> 4) & 61440);
                    break;
                case 9:
                    dreg = (inst >> 16) & 15;
                    opr2 = inst & 65535;
                    iz = " {regs}";
                    break;
                case 10:
                    dreg = (inst >> 28) & 15;
                    iz = " Rd,#im";
                    opr2 = inst & 67108863;
                    if ((inst & 33554432) != 0) {
                        opr2 |= 4227858432
                    }
                    if (dreg >= 13) {
                        if ((opr2 & 3) != 0 || opr2 < 0 || opr2 > maxUsableMem) {
                            error = "bad address"
                        }
                    }
                    break
            }
            if (dontDisplay == 0) {
                addIR(iy + iz)
            }
            if (error != "") {
                message("Error: " + error + " at line " + convert2(lineNo));
                return 1
            }
            switch (newFormat) {
                case 38:
                    updateR(14, pCounter);
                case 30:
                    updatePC(addr);
                    break;
                case 31:
                    if ((flags & 4) != 0) {
                        updatePC(addr)
                    } else {
                        iz += " Branch not taken"
                    }
                    break;
                case 32:
                    if ((flags & 4) == 0) {
                        updatePC(addr)
                    } else {
                        iz += " Branch not taken"
                    }
                    break;
                case 33:
                    if ((flags & 9) == 8 || (flags & 9) == 1) {
                        updatePC(addr)
                    } else {
                        iz += " Branch not taken"
                    }
                    break;
                case 34:
                    if ((flags & 4) == 0 && ((flags & 9) == 9 || (flags & 9) == 0)) {
                        updatePC(addr)
                    } else {
                        iz += " Branch not taken"
                    }
                    break;
                case 7:
                    result = (nreg < 15) ? register[nreg] : pCounter + 4;
                    if (opr2 > 0) {
                        tmp = (result >> 1) & 2147483647;
                        if (opr2 > 1) {
                            tmp = tmp >> (opr2 - 1)
                        }
                    } else {
                        tmp = result
                    }
                    updateR(dreg, tmp);
                    if ((inst & 1048576) != 0) {
                        flgs = flags & 1;
                        if (opr2 == 0) {
                            flgs += flags & 2
                        } else {
                            if ((result & (1 << (opr2 - 1))) != 0) {
                                flgs += 2
                            }
                        }
                        if ((tmp & 4294967295) == 0) {
                            flgs |= 4
                        }
                        if ((tmp & 2147483648) != 0) {
                            flgs |= 8
                        }
                        updateFlags(flgs)
                    }
                    break;
                case 8:
                    result = (nreg < 15) ? register[nreg] : pCounter + 4;
                    if (opr2 > 31) {
                        tmp = 0
                    } else {
                        tmp = result << opr2
                    }
                    updateR(dreg, tmp);
                    if ((inst & 1048576) != 0) {
                        flgs = flags & 1;
                        if (opr2 == 0) {
                            flgs += flags & 2
                        } else {
                            if (((result << (opr2 - 1)) & 2147483648) != 0) {
                                flgs += 2
                            }
                        }
                        if ((tmp & 4294967295) == 0) {
                            flgs |= 4
                        }
                        if ((tmp & 2147483648) != 0) {
                            flgs |= 8
                        }
                        updateFlags(flgs)
                    }
                    break;
                case 9:
                    result = (nreg < 15) ? register[nreg] : pCounter + 4;
                    if (opr2 > 31) {
                        tmp = result >> 31
                    } else {
                        tmp = result >> opr2
                    }
                    updateR(dreg, tmp);
                    if ((inst & 1048576) != 0) {
                        flgs = flags & 1;
                        if (opr2 == 0) {
                            flgs += flags & 2
                        } else {
                            if ((result & (1 << (opr2 - 1))) != 0) {
                                flgs += 2
                            }
                        }
                        if ((tmp & 4294967295) == 0) {
                            flgs |= 4
                        }
                        if ((tmp & 2147483648) != 0) {
                            flgs |= 8
                        }
                        updateFlags(flgs)
                    }
                    break;
                case 10:
                    result = (nreg < 15) ? register[nreg] : pCounter + 4;
                    tmp = (result >> 1) & 2147483647;
                    if ((flags & 2) != 0) {
                        tmp += 2147483648
                    }
                    updateR(dreg, tmp);
                    if ((inst & 1048576) != 0) {
                        flgs = flags & 1;
                        if ((result & 1) != 0) {
                            flgs += 2
                        }
                        if ((tmp & 4294967295) == 0) {
                            flgs |= 4
                        }
                        if ((tmp & 2147483648) != 0) {
                            flgs |= 8
                        }
                        updateFlags(flgs)
                    }
                    break;
                case 11:
                    result = (nreg < 15) ? register[nreg] : pCounter + 4;
                    tmp = opr2;
                    while (opr2 > 31) {
                        opr2 -= 32
                    }
                    while (opr2 > 0) {
                        if ((result & 1) == 0) {
                            result = (result >> 1) & 2147483647
                        } else {
                            result = ((result >> 1) & 2147483647) + 2147483648
                        }--opr2
                    }
                    updateR(dreg, result);
                    if ((inst & 1048576) != 0) {
                        flgs = flags & 1;
                        if (tmp == 0) {
                            flgs += flags & 2
                        } else {
                            if ((result & 2147483648) != 0) {
                                flgs += 2
                            }
                        }
                        if ((result & 4294967295) == 0) {
                            flgs |= 4
                        }
                        if ((result & 2147483648) != 0) {
                            flgs |= 8
                        }
                        updateFlags(flgs)
                    }
                    break;
                case 12:
                    step1Code = 1;
                    message(halted);
                    return 1;
                    break;
                case 28:
                    addr = register[13] & 4294967292;
                    if (addr >= (maxUsableMem - 4) || addr < 0) {
                        message("Bad SP value at line = " + convert2(lineNo));
                        return 1
                    }
                    tmp = address[addr / 4];
                    if (tmp >= maxUsableMem || tmp < 0) {
                        message("Bad return address at line = " + convert2(lineNo));
                        return 1
                    }
                    updatePC(tmp);
                    addr += 4;
                    tmp = address[addr / 4];
                    updateFlags((tmp >> 28) & 15);
                    if ((tmp & 1) != 0) {
                        interruptMask |= 1
                    }
                    updateR(13, addr + 4);
                    checkClickColour();
                    checkClockEnabled();
                    if (dontDisplay) {
                        if ((interruptMask & 1) != 0 && (interruptRequest != 0 || (xTime && (xTime < Date.now())))) {
                            doInterrupt()
                        }
                    }
                    break;
                case 6:
                case 14:
                case 18:
                case 40:
                    updateR(dreg, opr2);
                    if (dontDisplay && inst == 3785359360) {
                        step1Code = 5;
                        return 1
                    }
                    break;
                case 17:
                    updateR(dreg, 4294967296 - opr2);
                    break;
                case 15:
                    updateR(dreg, opr2 ^ 4294967295);
                    break;
                case 16:
                    flgs = 0;
                    result = ((nreg < 15) ? register[nreg] : pCounter + 4) - opr2;
                    if ((result & 4294967295) == 0) {
                        flgs |= 4
                    }
                    tres = (result >> 31) & 1;
                    if (tres != 0) {
                        flgs |= 8
                    }
                    t1 = (((nreg < 15) ? register[nreg] : pCounter + 4) >> 31) & 1;
                    t2 = ((-opr2) >> 31) & 1;
                    if (t1 == 0) {
                        if (t2 == 1 && tres == 0) {
                            flgs |= 2
                        }
                    } else {
                        if (t2 == 1 || tres == 0) {
                            flgs |= 2
                        }
                    }
                    if ((t1 + t2) != 1 && t1 != tres) {
                        flgs |= 1
                    }
                    updateFlags(flgs);
                    break;
                case 23:
                case 19:
                    if ((addr & 3) != 0) {
                        message("Unaligned access on LDR at line " + convert2(lineNo));
                        return 1
                    }
                    if (addr < 0) {
                        addr += 4294967296;
                        if (addr < (pixelBase + 4 * pixelAreaSize) && addr >= pixelBase) {
                            updateR(dreg, v1address[(addr - pixelBase) / 4])
                        } else {
                            if (addr < IOBase && addr >= charBase) {
                                updateR(dreg, v2address[(addr - charBase) / 4])
                            } else {
                                if (addr == dotLabelValues[5]) {
                                    inputNum(dreg, 0);
                                    step1Code = 4;
                                    stepTxt = "Done instruction " + iy + iz + " at line " + convert2(lineNo);
                                    return 1
                                } else {
                                    if (addr == dotLabelValues[26]) {
                                        inputNum(dreg, 1);
                                        step1Code = 4;
                                        stepTxt = "Done instruction " + iy + iz + " at line " + convert2(lineNo);
                                        return 1
                                    } else {
                                        if (addr == dotLabelValues[6]) {
                                            updateR(dreg, lastKey)
                                        } else {
                                            if (addr == dotLabelValues[7]) {
                                                updateR(dreg, lastKey);
                                                lastKey = 0
                                            } else {
                                                if (addr == dotLabelValues[34]) {
                                                    updateR(dreg, lastPixelClick)
                                                } else {
                                                    if (addr == dotLabelValues[35]) {
                                                        updateR(dreg, lastPixelClick);
                                                        pixelMask &= 4294967291;
                                                        lastPixelClick = -1
                                                    } else {
                                                        if (addr == dotLabelValues[8]) {
                                                            updateR(dreg, (Math.random() * 4294967296) & 4294967295)
                                                        } else {
                                                            if (addr == dotLabelValues[9]) {
                                                                updateR(dreg, instructionCount)
                                                            } else {
                                                                if (addr == dotLabelValues[10]) {
                                                                    updateR(dreg, Math.floor(Date.now() / 1000) - 946684800)
                                                                } else {
                                                                    if (addr == dotLabelValues[11]) {
                                                                        updateR(dreg, IOVectors[1])
                                                                    } else {
                                                                        if (addr == dotLabelValues[12]) {
                                                                            updateR(dreg, IOVectors[0])
                                                                        } else {
                                                                            if (addr == dotLabelValues[13]) {
                                                                                updateR(dreg, IOVectors[2])
                                                                            } else {
                                                                                if (addr == dotLabelValues[14]) {
                                                                                    updateR(dreg, IOVectors[3])
                                                                                } else {
                                                                                    if (addr == dotLabelValues[33]) {
                                                                                        updateR(dreg, IOVectors[4])
                                                                                    } else {
                                                                                        if (addr == dotLabelValues[15]) {
                                                                                            updateR(dreg, interruptMask)
                                                                                        } else {
                                                                                            if (addr == dotLabelValues[16]) {
                                                                                                updateR(dreg, pinMask)
                                                                                            } else {
                                                                                                if (addr == dotLabelValues[17]) {
                                                                                                    updateR(dreg, keyboardMask)
                                                                                                } else {
                                                                                                    if (addr == dotLabelValues[18]) {
                                                                                                        updateR(dreg, clockIntFreq)
                                                                                                    } else {
                                                                                                        if (addr == dotLabelValues[36]) {
                                                                                                            updateR(dreg, pixelMask)
                                                                                                        } else {
                                                                                                            if (addr == dotLabelValues[37]) {
                                                                                                                if (pixelAreaSize == 12288) {
                                                                                                                    updateR(dreg, 2)
                                                                                                                } else {
                                                                                                                    if (pixelAreaSize == 3072) {
                                                                                                                        updateR(dreg, 1)
                                                                                                                    } else {
                                                                                                                        updateR(dreg, 0)
                                                                                                                    }
                                                                                                                }
                                                                                                            } else {
                                                                                                                if (addr == dotLabelValues[19]) {
                                                                                                                    updateR(dreg, byteCount)
                                                                                                                } else {
                                                                                                                    if (addr == dotLabelValues[22]) {
                                                                                                                        fileRead = "";
                                                                                                                        fileResult = dreg;
                                                                                                                        fileOpen();
                                                                                                                        waitingForInput = true;
                                                                                                                        inst = 0;
                                                                                                                        step1Code = 4;
                                                                                                                        stepTxt = "Done instruction " + iy + iz + " at line " + convert2(lineNo);
                                                                                                                        return 1
                                                                                                                    } else {
                                                                                                                        if (addr == dotLabelValues[23]) {
                                                                                                                            updateR(dreg, fileRead ? fileRead.length : 0)
                                                                                                                        } else {
                                                                                                                            if (addr == dotLabelValues[24]) {
                                                                                                                                if (fileRead) {
                                                                                                                                    updateR(dreg, fileRead.charCodeAt(0));
                                                                                                                                    fileRead = fileRead.substr(1)
                                                                                                                                } else {
                                                                                                                                    updateR(dreg, 4294967295)
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                if (addr == dotLabelValues[28]) {
                                                                                                                                    updateR(dreg, pixelAreaSize)
                                                                                                                                } else {
                                                                                                                                    message("Bad I/O address for LDR at line " + convert2(lineNo));
                                                                                                                                    return 1
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        updateR(dreg, address[addr / 4])
                    }
                    break;
                case 24:
                case 20:
                    if ((addr & 3) != 0) {
                        message("Unaligned access on STR at line " + convert2(lineNo));
                        return 1
                    }
                    if (addr >= 0 && addr < dotDataAddress) {
                        message("Attempt to STR into the code area at line " + convert2(lineNo));
                        return 1
                    }
                    result = (dreg < 15) ? register[dreg] : pCounter + 4;
                    if (addr < 0) {
                        addr += 4294967296;
                        if (addr < IOBase && addr >= vaddressBase) {
                            var offst = (addr - vaddressBase) / 4;
                            if (offst < pixelAreaSize) {
                                if (v1address[offst] == result) {
                                    break
                                }
                                v1address[offst] = result;
                                videoWrite(offst, result)
                            } else {
                                offst = (addr - charBase) / 4;
                                if (addr > charBase && offst < (charMax / 4)) {
                                    if (v2address[offst] == result) {
                                        break
                                    }
                                    v2address[offst] = result;
                                    addr -= charBase;
                                    showChar(addr, result & 255);
                                    showChar(addr + 1, (result >> 8) & 255);
                                    showChar(addr + 2, (result >> 16) & 255);
                                    showChar(addr + 3, (result >> 24) & 255)
                                } else {
                                    if (addr >= fakeBig) {
                                        v2address[offst] = result;
                                        offst = (addr - fakeBig) / 2;
                                        var same = true;
                                        if (pixelAreaSize == 3072) {
                                            offst += offst & 16777152;
                                            same = videoProc(same, offst, result);
                                            same = videoProc(same, ++offst, result);
                                            offst += 63;
                                            same = videoProc(same, offst, result);
                                            same = videoProc(same, ++offst, result)
                                        } else {
                                            offst *= 2;
                                            offst += (offst & 268435328) * 3;
                                            same = videoProc(same, offst, result);
                                            same = videoProc(same, ++offst, result);
                                            same = videoProc(same, ++offst, result);
                                            same = videoProc(same, ++offst, result);
                                            offst += 125;
                                            same = videoProc(same, offst, result);
                                            same = videoProc(same, ++offst, result);
                                            same = videoProc(same, ++offst, result);
                                            same = videoProc(same, ++offst, result);
                                            offst += 125;
                                            same = videoProc(same, offst, result);
                                            same = videoProc(same, ++offst, result);
                                            same = videoProc(same, ++offst, result);
                                            same = videoProc(same, ++offst, result);
                                            offst += 125;
                                            same = videoProc(same, offst, result);
                                            same = videoProc(same, ++offst, result);
                                            same = videoProc(same, ++offst, result);
                                            same = videoProc(same, ++offst, result)
                                        }
                                        if (same) {
                                            break
                                        }
                                    } else {
                                        message("Bad I/O address for STR at line " + convert2(lineNo));
                                        return 1
                                    }
                                }
                            }
                            jj = 1000
                        } else {
                            if (addr == dotLabelValues[0]) {
                                outputNum(result, 4);
                                jj = 1000
                            } else {
                                if (addr == dotLabelValues[1]) {
                                    outputNum(result, 5);
                                    jj = 1000
                                } else {
                                    if (addr == dotLabelValues[2]) {
                                        outputNum(result, 6);
                                        jj = 1000
                                    } else {
                                        if (addr == dotLabelValues[3]) {
                                            outputNum(result, 7);
                                            jj = 1000
                                        } else {
                                            if (addr == dotLabelValues[4]) {
                                                outputNum(result, 8);
                                                jj = 1000
                                            } else {
                                                if (addr == dotLabelValues[25] || addr == dotLabelValues[32]) {
                                                    if (dreg > 14 || result < 0 || result > (maxUsableMem - 128)) {
                                                        message("Bad address for .ReadString at line " + convert2(lineNo));
                                                        return 1
                                                    }
                                                    if (result < dotDataAddress) {
                                                        message("Attempt to .ReadString into the code area at line " + convert2(lineNo));
                                                        return 1
                                                    }
                                                    if (addr == dotLabelValues[25]) {
                                                        inputNum(dreg, -1)
                                                    } else {
                                                        inputNum(dreg, -2)
                                                    }
                                                    step1Code = 4;
                                                    stepTxt = "Done instruction " + iy + iz + " at line " + convert2(lineNo);
                                                    return 1
                                                } else {
                                                    if (addr == dotLabelValues[27]) {
                                                        outputNum(result, 3);
                                                        jj = 1000
                                                    } else {
                                                        if (addr == dotLabelValues[15]) {
                                                            interruptMask = result;
                                                            checkClickColour();
                                                            checkClockEnabled();
                                                            if (dontDisplay) {
                                                                if ((interruptMask & 1) != 0 && (interruptRequest != 0 || (xTime && (xTime < Date.now())))) {
                                                                    step1Code = 3;
                                                                    return 1
                                                                }
                                                            }
                                                        } else {
                                                            if (addr == dotLabelValues[16]) {
                                                                pinMask = result;
                                                                checkClickColour()
                                                            } else {
                                                                if (addr == dotLabelValues[17]) {
                                                                    keyboardMask = result
                                                                } else {
                                                                    if (addr == dotLabelValues[18]) {
                                                                        clockIntFreq = result;
                                                                        checkClockEnabled()
                                                                    } else {
                                                                        if (addr == dotLabelValues[36]) {
                                                                            var clear = false;
                                                                            if (((pixelMask & 3) == 0 && (result & 3) != 0) || ((pixelMask & 3) != 0 && (result & 3) == 0)) {
                                                                                clear = true
                                                                            }
                                                                            pixelMask = result;
                                                                            if (clear) {
                                                                                clearPixelArea()
                                                                            }
                                                                        } else {
                                                                            if (addr == dotLabelValues[37]) {
                                                                                if (result == 2) {
                                                                                    pixelAreaSize = 12288
                                                                                } else {
                                                                                    pixelAreaSize = 3072
                                                                                }
                                                                                v1address = [];
                                                                                clearPixelArea()
                                                                            } else {
                                                                                if (addr == dotLabelValues[28]) {
                                                                                    clearPixelArea()
                                                                                } else {
                                                                                    if (addr == dotLabelValues[29]) {
                                                                                        fileWriteBuffer += String.fromCharCode(result & 255);
                                                                                        fileWriteBuffer += String.fromCharCode((result >> 8) & 255);
                                                                                        fileWriteBuffer += String.fromCharCode((result >> 16) & 255);
                                                                                        fileWriteBuffer += String.fromCharCode((result >> 24) & 255)
                                                                                    } else {
                                                                                        if (addr == dotLabelValues[30]) {
                                                                                            if (result == -1) {
                                                                                                fileWriteBuffer = []
                                                                                            } else {
                                                                                                if (result < 0 || result >= maxUsableMem) {
                                                                                                    message("Bad I/O data or address for STR at line " + convert2(lineNo));
                                                                                                    return 1
                                                                                                } else {
                                                                                                    var fName = "";
                                                                                                    for (var i = 0; i < 64; ++i) {
                                                                                                        var z = (address[Math.floor(result / 4)] >> ((result & 3) * 8)) & 255;
                                                                                                        if (z < 32 || z > 127) {
                                                                                                            break
                                                                                                        }
                                                                                                        fName += String.fromCharCode(z);
                                                                                                        ++result;
                                                                                                        if (result >= maxUsableMem) {
                                                                                                            break
                                                                                                        }
                                                                                                    }
                                                                                                    saveFile(fileWriteBuffer, fName);
                                                                                                    fileWriteBuffer = [];
                                                                                                    stepTxt = "Done instruction " + iy + iz + " at line " + convert2(lineNo);
                                                                                                    return 0;
                                                                                                    step1Code = 4;
                                                                                                    stepTxt = "Writing File";
                                                                                                    message("Saving File");
                                                                                                    return 1
                                                                                                }
                                                                                            }
                                                                                        } else {
                                                                                            if (result < 0 || result >= maxUsableMem || (result & 3) != 0) {
                                                                                                message("Bad I/O data or address for STR at line " + convert2(lineNo));
                                                                                                return 1
                                                                                            }
                                                                                            if (addr == dotLabelValues[11]) {
                                                                                                IOVectors[1] = result;
                                                                                                checkClickColour()
                                                                                            } else {
                                                                                                if (addr == dotLabelValues[12]) {
                                                                                                    IOVectors[0] = result
                                                                                                } else {
                                                                                                    if (addr == dotLabelValues[13]) {
                                                                                                        IOVectors[2] = result
                                                                                                    } else {
                                                                                                        if (addr == dotLabelValues[14]) {
                                                                                                            IOVectors[3] = result;
                                                                                                            checkClockEnabled()
                                                                                                        } else {
                                                                                                            if (addr == dotLabelValues[33]) {
                                                                                                                IOVectors[4] = result
                                                                                                            } else {
                                                                                                                message("Bad I/O address for STR at line " + convert2(lineNo));
                                                                                                                return 1
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        setAddress(addr, result)
                    }
                    break;
                case 0:
                    updateR(dreg, ((nreg < 15) ? register[nreg] : pCounter + 4) + opr2);
                    break;
                case 1:
                    updateR(dreg, ((nreg < 15) ? register[nreg] : pCounter + 4) - opr2);
                    break;
                case 4:
                    flgs = 0;
                    result = ((nreg < 15) ? register[nreg] : pCounter + 4) + opr2;
                    if ((result & 4294967295) == 0) {
                        flgs |= 4
                    }
                    tres = (result >> 31) & 1;
                    if (tres != 0) {
                        flgs |= 8
                    }
                    t1 = (((nreg < 15) ? register[nreg] : pCounter + 4) >> 31) & 1;
                    t2 = (opr2 >> 31) & 1;
                    if (t1 == 0) {
                        if (t2 == 1 && tres == 0) {
                            flgs |= 2
                        }
                    } else {
                        if (t2 == 1 || tres == 0) {
                            flgs |= 2
                        }
                    }
                    if ((t1 + t2) != 1 && t1 != tres) {
                        flgs |= 1
                    }
                    updateFlags(flgs);
                    updateR(dreg, result);
                    break;
                case 5:
                    flgs = 0;
                    result = ((nreg < 15) ? register[nreg] : pCounter + 4) - opr2;
                    if ((result & 4294967295) == 0) {
                        flgs |= 4
                    }
                    tres = (result >> 31) & 1;
                    if (tres != 0) {
                        flgs |= 8
                    }
                    t1 = (((nreg < 15) ? register[nreg] : pCounter + 4) >> 31) & 1;
                    t2 = ((-opr2) >> 31) & 1;
                    if (t1 == 0) {
                        if (t2 == 1 && tres == 0) {
                            flgs |= 2
                        }
                    } else {
                        if (t2 == 1 || tres == 0) {
                            flgs |= 2
                        }
                    }
                    if ((t1 + t2) != 1 && t1 != tres) {
                        flgs |= 1
                    }
                    updateFlags(flgs);
                    updateR(dreg, result);
                    break;
                case 35:
                    if ((flags & 2) != 0) {
                        updatePC(addr)
                    } else {
                        iz += " Branch not taken"
                    }
                    break;
                case 36:
                    if ((flags & 1) != 0) {
                        updatePC(addr)
                    } else {
                        iz += " Branch not taken"
                    }
                    break;
                case 37:
                    if ((flags & 8) != 0) {
                        updatePC(addr)
                    } else {
                        iz += " Branch not taken"
                    }
                    break;
                case 2:
                    updateR(dreg, ((nreg < 15) ? register[nreg] : pCounter + 4) & opr2);
                    break;
                case 13:
                    updateR(dreg, ((nreg < 15) ? register[nreg] : pCounter + 4) | opr2);
                    break;
                case 3:
                    updateR(dreg, ((nreg < 15) ? register[nreg] : pCounter + 4) ^ opr2);
                    break;
                case 29:
                    addr = register[dreg] & 4294967292;
                    nreg = 15;
                    while (nreg >= 0) {
                        if (opr2 & (1 << nreg)) {
                            if (addr > maxUsableMem || addr < 4) {
                                message("Bad SP value at line = " + convert2(lineNo));
                                return 1
                            }
                            addr -= 4;
                            if (addr < byteCount) {
                                message("Stack overflow error at line = " + convert2(lineNo));
                                return 1
                            }
                            if (nreg == 15) {
                                setAddress(addr, pCounter + 4)
                            } else {
                                setAddress(addr, register[nreg])
                            }
                        }--nreg
                    }
                    updateR(dreg, addr);
                    break;
                case 27:
                    addr = register[dreg] & 4294967292;
                    nreg = 0;
                    while (nreg < 16) {
                        if (opr2 & (1 << nreg)) {
                            if (addr >= maxUsableMem || addr < 0) {
                                message("Bad SP value at line = " + convert2(lineNo));
                                return 1
                            }
                            updateR(nreg, address[addr / 4]);
                            addr += 4
                        }++nreg
                    }
                    updateR(dreg, addr);
                    break;
                case 25:
                case 21:
                    if (addr < 0) {
                        addr += 4294967296;
                        if (addr < (pixelBase + 4 * pixelAreaSize) && addr >= pixelBase) {
                            updateR(dreg, (v1address[Math.floor((addr - pixelBase) / 4)] >> ((addr & 3) * 8)) & 255)
                        } else {
                            if (addr < IOBase && addr >= charBase) {
                                updateR(dreg, (v2address[Math.floor((addr - charBase) / 4)] >> ((addr & 3) * 8)) & 255)
                            } else {
                                if (addr == dotLabelValues[6]) {
                                    updateR(dreg, lastKey & 255)
                                } else {
                                    if (addr == dotLabelValues[7]) {
                                        updateR(dreg, lastKey & 255);
                                        lastKey = 0
                                    } else {
                                        if (addr == dotLabelValues[19]) {
                                            if (fileRead) {
                                                updateR(dreg, (fileRead.charCodeAt(0)) & 255);
                                                fileRead = fileRead.substr(1)
                                            } else {
                                                updateR(dreg, 255)
                                            }
                                        } else {
                                            message("Bad I/O address for LDRB at line " + convert2(lineNo));
                                            return 1
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        updateR(dreg, (address[Math.floor(addr / 4)] >> ((addr & 3) * 8)) & 255)
                    }
                    break;
                case 26:
                case 22:
                    if (addr >= 0 && addr < dotDataAddress) {
                        message("Attempt to STRB into the code area at line " + convert2(lineNo));
                        return 1
                    }
                    result = ((dreg < 15) ? register[dreg] : pCounter + 4) & 255;
                    if (addr < 0) {
                        addr += 4294967296;
                        if (addr < (charBase + charMax) && addr >= charBase) {
                            var yy = 255 << ((addr & 3) * 8);
                            var xx = (result << ((addr & 3) * 8)) & yy;
                            var offset = Math.floor((addr - charBase) / 4);
                            v2address[offset] &= 4294967295 ^ yy;
                            v2address[offset] |= xx;
                            showChar(addr - charBase, result);
                            jj = 1000
                        } else {
                            if (addr == dotLabelValues[3]) {
                                outputNum(result, 7);
                                jj = 1000
                            } else {
                                if (addr == dotLabelValues[29]) {
                                    fileWriteBuffer += String.fromCharCode(result & 255)
                                } else {
                                    message("Bad I/O address for STRB at line " + convert2(lineNo));
                                    return 1
                                }
                            }
                        }
                    } else {
                        setAddressByte(addr, result)
                    }
                    break;
                case 39:
                    addr = (register[13] & 4294967292) - 4;
                    if (addr >= maxUsableMem || addr < 0) {
                        message("Bad SP address for SVC at line " + convert2(lineNo));
                        return 1
                    }
                    if (IOVectors[0] >= 0 && (IOVectors[0] & 3) == 0 && IOVectors[0] < maxUsableMem) {
                        setAddress(addr, (flags << 28) | (interruptMask & 255));
                        addr -= 4;
                        setAddress(addr, pCounter);
                        updateR(13, addr);
                        updatePC(IOVectors[0]);
                        interruptMask &= 4294967294
                    } else {
                        message("Bad vector address for SVC at line " + convert2(lineNo));
                        return 1
                    }
                    break;
                default:
                    message("Bad instruction at line " + convert2(lineNo));
                    return 1;
                    break
            }
            if (breakpointAddr == pCounter) {
                step1Code = 2;
                return 1
            }
            if (dontDisplay) {
                continue
            }
            stepTxt = "Done instruction " + iy + iz + " at line " + convert2(lineNo);
            return 0;
            break
        }
        if (xTime && (xTime < Date.now()) && (interruptMask & 1) != 0) {
            var addr = (register[13] & 4294967292) - 4;
            if (addr >= maxUsableMem || addr < 0) {
                stepTxt = "Done instruction " + iy + iz + " at line " + convert2(lineNo);
                return 0
            }
            doClockInt()
        }
    }
    stepTxt = "Done instruction " + iy + iz + " at line " + convert2(lineNo);
    return 0
}

function videoProc(same, offst, result) {
    if (v1address[offst] == result) {
        return same
    }
    v1address[offst] = result;
    videoWrite(offst, result);
    return false
}

function inputNum(dreg, code) {
    registerToInput = dreg;
    waitingForInput = true;
    inst = code;
    noKeyEffects = false;
    enableInput(code == -2)
}

function outputNum(y, mode) {
    if (mode == 8) {
        var by;
        while (1) {
            if (y < 0 || y >= maxUsableMem) {
                break
            }
            by = (address[Math.floor(y / 4)] >> ((y & 3) * 8)) & 255;
            if (by == 0) {
                break
            }
            var z = String.fromCharCode(by);
            if (by == 10) {
                output1 += "\n"
            } else {
                if (by > 31) {
                    output1 += z
                }
            }++y
        }
        justConsole();
        return
    }
    if (mode != 7 && output1.length > 0 && output1[output1.length - 1] != " " && output1[output1.length - 1] != "\n") {
        output1 += " "
    }
    switch (mode) {
        case 3:
            if ((y & 4294967040) == 0) {
                output1 += "0"
            } else {
                var mantissa = (y & 4294967040) / 2147483648;
                var exponent = y & 255;
                while (exponent > 127) {
                    mantissa /= 2;
                    ++exponent;
                    exponent &= 255
                }
                while (exponent > 0) {
                    mantissa *= 2;
                    --exponent
                }
                y = mantissa.toPrecision(6);
                output1 += y
            }
            break;
        case 4:
            if (y > 2147483647) {
                y = 4294967296 - y;
                output1 += "-" + y + " "
            } else {
                output1 += y + " "
            }
            break;
        case 5:
            output1 += y + " ";
            break;
        case 6:
            output1 += "0x";
            if ((y & 4026531840) != 0) {
                output1 += hex[(y >> 28) & 15]
            }
            if ((y & 4278190080) != 0) {
                output1 += hex[(y >> 24) & 15]
            }
            if ((y & 4293918720) != 0) {
                output1 += hex[(y >> 20) & 15]
            }
            if ((y & 4294901760) != 0) {
                output1 += hex[(y >> 16) & 15]
            }
            if ((y & 4294963200) != 0) {
                output1 += hex[(y >> 12) & 15]
            }
            if ((y & 4294967040) != 0) {
                output1 += hex[(y >> 8) & 15]
            }
            if ((y & 4294967280) != 0) {
                output1 += hex[(y >> 4) & 15]
            }
            output1 += hex[y % 16] + " ";
            break;
        case 7:
            var z = String.fromCharCode(y);
            if (y == 10) {
                output1 += "\n"
            } else {
                if (y > 31) {
                    output1 += z
                }
            }
            break
    }
    justConsole()
}

function clearCharMap() {
    var x;
    for (var i = 0; i < charMax; ++i) {
        showChar(i, 0)
    }
}

function inputSubmit() {
    var val = getInput();
    if (val === false) {
        return
    }
    if (!waitingForInput) {
        if (debug) {
            alert("Bad input - not waiting for input")
        }
        return
    }
    if (val == "") {
        message("Bad input - must not be empty");
        return
    }
    var value;
    if (inst == 0) {
        value = parseIntGen(val);
        if (isNaN(value) || value > 4294967295 || value < -2147483648) {
            message("Bad number format or value");
            return
        }
    } else {
        if (inst < 0) {
            value = val;
            var len = value.length;
            if (registerToInput > 14 || len == 0) {
                return
            }
            var addr = register[registerToInput];
            if (len > 127) {
                len = 127
            }
            if (addr >= 0 && addr < (maxUsableMem - len)) {
                var i;
                for (i = 0; i < len; ++i) {
                    setAddressByte(addr, value.charCodeAt(i));
                    ++addr
                }
                setAddressByte(addr, 0)
            }
            if (inst == -2) {
                inputRestore("")
            } else {
                inputRestore(val)
            }
            noKeyEffects = true;
            message("String read into memory at " + addr);
            waitingForInput = false;
            return
        } else {
            var mantissa = parseFloat(val);
            if (isNaN(mantissa)) {
                message("Bad input - must be a floating point number");
                return
            }
            var exponent = 0;
            while (mantissa >= 1 || mantissa < -1) {
                mantissa /= 2;
                ++exponent;
                if (exponent > 127) {
                    break
                }
            }
            while (mantissa < 0.5 && mantissa >= -0.5 && mantissa != 0) {
                mantissa *= 2;
                --exponent;
                if (exponent < -128) {
                    break
                }
            }
            if (exponent > 127) {
                message("Bad input - number out of range");
                return
            }
            if (mantissa == 0 || exponent < -128) {
                value = 0
            } else {
                tmp = mantissa * 2147483648;
                value = (tmp & 4294967040) + (exponent & 255)
            }
        }
    }
    inputRestore(val);
    noKeyEffects = true;
    updateR(registerToInput, value);
    waitingForInput = false
}
var coloursNam = [".background", ".aliceblue", ".antiquewhite", ".aqua", ".aquamarine", ".azure", ".beige", ".bisque", ".black", ".blanchedalmond", ".blue", ".blueviolet", ".brown", ".burlywood", ".cadetblue", ".chartreuse", ".chocolate", ".coral", ".cornflowerblue", ".cornsilk", ".crimson", ".cyan", ".darkblue", ".darkcyan", ".darkgoldenrod", ".darkgray", ".darkgreen", ".darkgrey", ".darkkhaki", ".darkmagenta", ".darkolivegreen", ".darkorange", ".darkorchid", ".darkred", ".darksalmon", ".darkseagreen", ".darkslateblue", ".darkslategray", ".darkslategrey", ".darkturquoise", ".darkviolet", ".deeppink", ".deepskyblue", ".dimgray", ".dimgrey", ".dodgerblue", ".firebrick", ".floralwhite", ".forestgreen", ".fuchsia", ".gainsboro", ".ghostwhite", ".gold", ".goldenrod", ".gray", ".green", ".greenyellow", ".grey", ".honeydew", ".hotpink", ".indianred", ".indigo", ".ivory", ".khaki", ".lavender", ".lavenderblush", ".lawngreen", ".lemonchiffon", ".lightblue", ".lightcoral", ".lightcyan", ".lightgoldenrodyellow", ".lightgray", ".lightgreen", ".lightgrey", ".lightpink", ".lightsalmon", ".lightseagreen", ".lightskyblue", ".lightslategray", ".lightslategrey", ".lightsteelblue", ".lightyellow", ".lime", ".limegreen", ".linen", ".magenta", ".maroon", ".mediumaquamarine", ".mediumblue", ".mediumorchid", ".mediumpurple", ".mediumseagreen", ".mediumslateblue", ".mediumspringgreen", ".mediumturquoise", ".mediumvioletred", ".midnightblue", ".mintcream", ".mistyrose", ".moccasin", ".navajowhite", ".navy", ".oldlace", ".olive", ".olivedrab", ".orange", ".orangered", ".orchid", ".palegoldenrod", ".palegreen", ".paleturquoise", ".palevioletred", ".papayawhip", ".peachpuff", ".peru", ".pink", ".plum", ".powderblue", ".purple", ".red", ".rosybrown", ".royalblue", ".saddlebrown", ".salmon", ".sandybrown", ".seagreen", ".seashell", ".sienna", ".silver", ".skyblue", ".slateblue", ".slategray", ".slategrey", ".snow", ".springgreen", ".steelblue", ".tan", ".teal", ".thistle", ".tomato", ".turquoise", ".violet", ".wheat", ".white", ".whitesmoke", ".yellow", ".yellowgreen", ""];
var coloursVal = ["0xffffff", "0xf0f8ff", "0xfaebd7", "0x00ffff", "0x7fffd4", "0xf0ffff", "0xf5f5dc", "0xffe4c4", "0x000000", "0xffebcd", "0x0000ff", "0x8a2be2", "0xa52a2a", "0xdeb887", "0x5f9ea0", "0x7fff00", "0xd2691e", "0xff7f50", "0x6495ed", "0xfff8dc", "0xdc143c", "0x00ffff", "0x00008b", "0x008b8b", "0xb8860b", "0xa9a9a9", "0x006400", "0xa9a9a9", "0xbdb76b", "0x8b008b", "0x556b2f", "0xff8c00", "0x9932cc", "0x8b0000", "0xe9967a", "0x8fbc8f", "0x483d8b", "0x2f4f4f", "0x2f4f4f", "0x00ced1", "0x9400d3", "0xff1493", "0x00bfff", "0x696969", "0x696969", "0x1e90ff", "0xb22222", "0xfffaf0", "0x228b22", "0xff00ff", "0xdcdcdc", "0xf8f8ff", "0xffd700", "0xdaa520", "0x808080", "0x008000", "0xadff2f", "0x808080", "0xf0fff0", "0xff69b4", "0xcd5c5c", "0x4b0082", "0xfffff0", "0xf0e68c", "0xe6e6fa", "0xfff0f5", "0x7cfc00", "0xfffacd", "0xadd8e6", "0xf08080", "0xe0ffff", "0xfafad2", "0xd3d3d3", "0x90ee90", "0xd3d3d3", "0xffb6c1", "0xffa07a", "0x20b2aa", "0x87cefa", "0x778899", "0x778899", "0xb0c4de", "0xffffe0", "0x00ff00", "0x32cd32", "0xfaf0e6", "0xff00ff", "0x800000", "0x66cdaa", "0x0000cd", "0xba55d3", "0x9370db", "0x3cb371", "0x7b68ee", "0x00fa9a", "0x48d1cc", "0xc71585", "0x191970", "0xf5fffa", "0xffe4e1", "0xffe4b5", "0xffdead", "0x000080", "0xfdf5e6", "0x808000", "0x6b8e23", "0xffa500", "0xff4500", "0xda70d6", "0xeee8aa", "0x98fb98", "0xafeeee", "0xdb7093", "0xffefd5", "0xffdab9", "0xcd853f", "0xffc0cb", "0xdda0dd", "0xb0e0e6", "0x800080", "0xff0000", "0xbc8f8f", "0x4169e1", "0x8b4513", "0xfa8072", "0xf4a460", "0x2e8b57", "0xfff5ee", "0xa0522d", "0xc0c0c0", "0x87ceeb", "0x6a5acd", "0x708090", "0x708090", "0xfffafa", "0x00ff7f", "0x4682b4", "0xd2b48c", "0x008080", "0xd8bfd8", "0xff6347", "0x40e0d0", "0xee82ee", "0xf5deb3", "0xffffff", "0xf5f5f5", "0xffff00", "0x9acd32"];

function getColourVal(x) {
    for (i = 0; i < 200; ++i) {
        if (coloursNam[i] == "") {
            return -1
        }
        if (x == coloursNam[i]) {
            return coloursVal[i]
        }
    }
    return -1
}
var editWin = 296;

function setupDivs() {
    resetLoadButton();
    consoleReset();
    var m = "";
    var holdI = 0;
    for (var j = 0; j < 32; ++j) {
        m += '<div class="row"><div class="address" id="meml' + j + '">0x' + padHex(j, 4) + "</div>";
        for (var i = 0; i < 4; ++i) {
            m += '<div class="word" id="a' + holdI + '" onclick="openAddress(this)" >0x0</div>';
            ++holdI
        }
        m += "</div>"
    }
    setValue("memory", m);
    setPixelAreaSize(pixelAreaSize);
    m = "";
    for (var j = 0; j < 512; ++j) {
        m += '<div id="c' + j + '"></div>'
    }
    setValue("chars", m)
}

function setPixelAreaSize(val) {
    var m = "";
    if (val == 12288) {
        pixelAreaSize = 12288;
        removeClass("pixels", "pixels1");
        addClass("pixels", "pixels2")
    } else {
        pixelAreaSize = 3072;
        removeClass("pixels", "pixels2");
        addClass("pixels", "pixels1")
    }
    if ((pixelMask & 5) != 0) {
        document.getElementById("chars").style.display = "none";
        for (var j = 0; j < pixelAreaSize; ++j) {
            m += '<div id="p' + j + '" onclick="pixelInt(this)"></div>'
        }
    } else {
        document.getElementById("chars").style.display = "block";
        for (var j = 0; j < pixelAreaSize; ++j) {
            m += '<div id="p' + j + '"></div>'
        }
    }
    setValue("pixels", m)
}

function padHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof(padding) === "undefined" || padding === null ? padding = 2 : padding;
    while (hex.length < padding) {
        hex = "0" + hex
    }
    return hex
}
var plhtmp;

function message(y) {
    if (dontDisplay == 0) {
        var elePosn = document.getElementById("console");
        if (y) {
            elePosn.innerHTML = output1 + "\n" + y
        } else {
            elePosn.innerHTML = output1
        }
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(scroll_to_max, 10);
            plhtmp = 0
        }
    }
    lastMessage = y
}

function justConsole() {
    var elePosn = document.getElementById("console");
    elePosn.innerHTML = output1;
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(scroll_to_max, 10);
        plhtmp = 0
    }
}

function scroll_to_max() {
    ++plhtmp;
    var elePosn = document.getElementById("console");
    var t = elePosn.scrollTop;
    elePosn.scrollTop = t + 4000;
    if (elePosn.scrollTop != t) {
        scrollTimeout = setTimeout(scroll_to_max, 10)
    } else {
        scrollTimeout = false;
        if (debug && (plhtmp > 100)) {
            alert("Scroll attempts are " + plhtmp)
        }
    }
}

function videoWrite(indx, y) {
    if (indx < 0 || indx >= pixelAreaSize) {
        return
    }
    y &= 16777215;
    document.getElementById("p" + indx).style.background = "#" + padHex(y, 6)
}

function openNextMem(x) {
    var elePosn = document.getElementById("a" + x);
    elePosn.innerHTML = addressInputText(elePosn.innerHTML);
    document.getElementById("aForm").focus();
    document.getElementById("aForm").setAttribute("onblur", "loseAddress(this)");
    return elePosn
}

function insertTabInProgramArea() {
    var textarea = document.getElementById("pForm");
    var s = textarea.selectionStart;
    textarea.value = textarea.value.substring(0, textarea.selectionStart) + "\t" + textarea.value.substring(textarea.selectionEnd);
    textarea.selectionEnd = s + 1
}

function openProgramArea(text) {
    addClass("program", "edit");
    var elePosn = document.getElementById("source");
    elePosn.style.overflow = "initial";
    elePosn.style.whiteSpace = "normal";
    elePosn.innerHTML = '<form action="javascript:programSubmit()"><textarea id="pForm" rows="36" cols="36"  spellcheck="false" >' + text.replace(/&/g, "&amp;"); + "</textarea></form>";
    elePosn = document.getElementById("pForm");
    elePosn.style.width = editWin + "px";
    elePosn.focus()
}

function getProgramArea() {
    var elePosn = document.getElementById("pForm");
    return elePosn.value
}

function resetProgramArea(newText) {
    setValue("source", newText);
    var src = document.getElementById("source");
    src.style.overflow = "auto";
    src.style.whiteSpace = "nowrap";
    src.scrollTop = 0;
    lastCodeHighlight = -1;
    breakpointAddr = -1;
    errorLineNum = -1
}
var lastState = 0;

function setStateReady() {
    changeState(1)
}

function setStateEdit() {
    changeState(2)
}

function setStateRunning() {
    changeState(4)
}

function setStateForceRunning() {
    if (lastState == 5) {
        return
    }
    changeState(4)
}

function setStateSlow() {
    changeState(5)
}

function setStatePaused() {
    changeState(6)
}
var plhComCnt = 0;

function changeState(val) {
    function xVal(va) {
        if (va == 1) {
            return "ready"
        }
        if (va == 2) {
            return "edit"
        }
        if (va == 4) {
            return "running"
        }
        if (va == 5) {
            return "running+slow"
        }
        if (va == 6) {
            return "running+paused"
        }
        return va
    }
    if (lastState == val) {
        ++plhComCnt;
        if (debug == 2) {
            setValue("credits", "New state " + xVal(val) + " == Old state " + xVal(lastState) + " == Dup " + plhComCnt)
        }
        return
    }
    plhComCnt = 0;
    if (debug == 2) {
        setValue("credits", "New state " + xVal(val) + " == Old state " + xVal(lastState))
    }
    if (lastState != 0) {
        if (lastState == 6) {
            removeClass("xxbody", "paused");
            lastState = 4
        }
        if (lastState == 5) {
            removeClass("xxbody", "slow");
            lastState = 4
        }
        if (lastState == val) {
            return
        }
        if (lastState == 4 && val >= 4) {
            lastState = val;
            if (val == 4) {
                return
            }
            if (val == 5) {
                addClass("xxbody", "slow")
            }
            if (val == 6) {
                addClass("xxbody", "paused")
            }
            return
        }
        if (lastState == 4) {
            removeClass("xxbody", "running")
        }
        if (lastState == 2) {
            removeClass("xxbody", "edit")
        }
        if (lastState == 1) {
            removeClass("xxbody", "ready")
        }
    }
    lastState = val;
    if (val >= 4) {
        addClass("xxbody", "running");
        if (val == 5) {
            addClass("xxbody", "slow")
        }
        if (val == 6) {
            addClass("xxbody", "paused")
        }
        return
    }
    if (lastState == 2) {
        addClass("xxbody", "edit")
    }
    if (lastState == 1) {
        addClass("xxbody", "ready")
    }
}

function intButtonReset() {
    removeClass("irq", "enabled");
    removeClass("irq", "active")
}

function intButtonSetup() {
    addClass("irq", "enabled")
}

function intButtonGrey() {
    removeClass("irq", "active")
}

function intButtonShow() {
    addClass("irq", "enabled");
    addClass("irq", "active")
}

function rewriteSide() {
    var base = overlay * 16;
    for (var i = 0; i < 32; ++i) {
        setValue("meml" + i, "0x" + padHex(base + i, 4))
    }
    setValue("page", padHex(overlay, 3))
}

function changePage() {
    if (myMaybe || myTimeout) {
        return false
    }
    message("Modifying memory overlay");
    setValue("page", overlayForm);
    var elePosn = document.getElementById("oForm");
    elePosn.focus();
    waitingForOverlay = true
}
var overlayForm = '<form action="javascript:pageSubmit()"><input id="oForm" type="text"></form>';

function pageSubmit() {
    var elePosn = document.getElementById("oForm");
    if (!elePosn || !waitingForOverlay) {
        if (debug) {
            alert("Bad pageSubmit call")
        }
        return false
    }
    waitingForOverlay = false;
    var val = parseInt(elePosn.value, 16);
    if (isNaN(val) || (val * 256) >= maxUsableMem) {
        setValue("page", padHex(overlay, 3));
        message("Bad page value");
        return
    }
    if ((val * 256) == (maxUsableMem - 256)) {
        --val
    }
    _paq.push(["trackEvent", "Button", "Page", padHex(val, 3)]);
    var tmp = lastMemHighlight;
    removeMemHighlight();
    overlay = val;
    var savDD = dontDisplay;
    dontDisplay = 0;
    rewriteSide();
    rewriteMemoryAndRegs(true);
    if (tmp >= 0) {
        setMemHighlight(tmp)
    }
    dontDisplay = savDD;
    message("Page value set")
}

function resetLoadButton() {
    setValue("program-controls", loadText)
}
var loadText = '<input type="file" id="read-input" onchange="read_chg(this)" autocomplete="off"><button id="load" onclick="document.getElementById(&#39;read-input&#39;).click()">Load</button><button  id="save" onclick="saveProgram()">Save</button><button  id="edit" onclick="openProgram()">Edit</button><button  id="submit" onclick="programSubmit()">Submit</button><button  id="revert" onclick="programCancel()">Revert</button>';

function setLabel(r) {
    var elePosn = document.getElementById("lin" + r);
    if (elePosn) {
        elePosn.classList.add("label")
    } else {
        if (debug) {
            alert("could not find line " + r + " to set label class")
        }
    }
}

function setCode(r, mem) {
    var elePosn = document.getElementById("lin" + r);
    if (elePosn) {
        elePosn.classList.add("selectable");
        elePosn.title = mem;
        elePosn.setAttribute("onclick", "javascript:setBreakpoint(this);")
    } else {
        if (debug) {
            alert("could not find line " + r + " to set code options")
        }
    }
}

function setData(r, mem) {
    var elePosn = document.getElementById("lin" + r);
    if (elePosn) {
        elePosn.title = mem
    } else {
        if (debug) {
            alert("could not find line " + r + " to set data options")
        }
    }
}

function setBreakpoint(inp) {
    if (waitingForInput) {
        return
    }
    if (myTimeout || myMaybe) {
        return
    }
    var lin = parseInt(inp.id.substring(3));
    var tit = parseInt(inp.title);
    if (isNaN(lin) || isNaN(tit)) {
        if (debug) {
            alert("could not parse breakpoint id " + inp.id + " title " + tit)
        }
        return
    }
    if (tit == breakpointAddr) {
        inp.classList.remove(breakpoint);
        breakpointAddr = -1;
        message("Breakpoint removed at line " + lin + " address 0x" + padHex(tit, 5))
    } else {
        if (breakpointAddr >= 0) {
            removeClassFromLineNumber(addrToLine[breakpointAddr / 4], breakpoint)
        }
        breakpointAddr = tit;
        inp.classList.add(breakpoint);
        message("Breakpoint set at line " + lin + " address 0x" + padHex(tit, 5))
    }
}

function updateRDisplay(r, y) {
    if (Math.floor(y) != y) {
        if (debug) {
            alert("Attempt to put non-integer value into register " + y)
        }
        y = Math.floor(y)
    }
    var uns = "" + y;
    var sig = uns;
    if (y > 2147483647) {
        sig = "-" + (4294967296 - y)
    }
    var bin = "0b";
    for (var i = 0; i < 32; ++i) {
        bin += ((y << i) & 2147483648) ? "1" : "0"
    }
    var hex = "0x" + padHex(y, 8);
    var tip = "";
    if (memOpt == 0) {
        y = sig;
        if (uns == sig) {
            tip = hex + " " + bin
        } else {
            tip = "(" + uns + ") " + hex + " " + bin
        }
    } else {
        if (memOpt == 1) {
            y = uns;
            if (uns == sig) {
                tip = hex + " " + bin
            } else {
                tip = sig + " " + hex + " " + bin
            }
        } else {
            if (memOpt == 3) {
                y = bin;
                if (uns == sig) {
                    tip = sig + " " + hex
                } else {
                    tip = sig + " (" + uns + ") " + hex
                }
            } else {
                y = hex;
                if (uns == sig) {
                    tip = sig + " " + bin
                } else {
                    tip = sig + " (" + uns + ") " + bin
                }
            }
        }
    }
    var elePosn = document.getElementById("R" + r);
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find R" + r + " to set new contents " + y)
        }
    } else {
        elePosn.innerHTML = y;
        elePosn.title = tip
    }
}

function updateFlags(y) {
    flags = y & 15;
    if (dontDisplay == 1) {
        return
    }
    var txt = (y & 8) != 0 ? "1" : "0";
    txt += ((y & 4) != 0 ? "1" : "0");
    txt += ((y & 2) != 0 ? "1" : "0");
    txt += ((y & 1) != 0 ? "1" : "0");
    setValue("flags", txt)
}

function addressInputText(val) {
    if (val == "0" || val == "0x00000000" || val == "0b00000000000000000000000000000000") {
        val = ""
    }
    var widthX = (memOpt == 3) ? "252" : "75";
    return '<form action="javascript:addressSubmit()"><input id="aForm" type="text" style="padding:0; border:0; font-family: monospace; width:' + widthX + 'px;height:14px;font-size:13.4px;" value="' + val + '"></form>'
}

function openAddressToEdit(inp) {
    inp.innerHTML = addressInputText(inp.innerHTML);
    document.getElementById("aForm").focus();
    document.getElementById("aForm").setAttribute("onblur", "loseAddress(this)")
}

function getAddressValue() {
    var elePosn = document.getElementById("aForm");
    return elePosn.value
}

function resetAddressInput() {
    document.getElementById("aForm").removeAttribute("onblur")
}
var breakpoint = "breakpoint";
var current = "current";
var error = "error";

function updateDisplayedMemory(x, y) {
    var uns = "" + y;
    var sig = uns;
    if (y > 2147483647) {
        sig = "-" + (4294967296 - y)
    }
    var bin = "0b";
    for (var i = 0; i < 32; ++i) {
        bin += ((y << i) & 2147483648) ? "1" : "0"
    }
    var hex = "0x" + padHex(y, 8);
    var tip = "";
    if (memOpt == 0) {
        y = sig;
        if (uns == sig) {
            tip = hex + " " + bin
        } else {
            tip = "(" + uns + ") " + hex + " " + bin
        }
    } else {
        if (memOpt == 1) {
            y = uns;
            if (uns == sig) {
                tip = hex + " " + bin
            } else {
                tip = sig + " " + hex + " " + bin
            }
        } else {
            if (memOpt == 3) {
                y = bin;
                if (uns == sig) {
                    tip = sig + " " + hex
                } else {
                    tip = sig + " (" + uns + ") " + hex
                }
            } else {
                y = hex;
                if (uns == sig) {
                    tip = sig + " " + bin
                } else {
                    tip = sig + " (" + uns + ") " + bin
                }
            }
        }
    }
    var elePosn = document.getElementById("a" + x);
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find a" + x + " to set new contents " + y)
        }
    } else {
        elePosn.innerHTML = y;
        elePosn.title = tip
    }
}

function removeCodeHighlight() {
    if (lastCodeHighlight >= 0) {
        var line = document.getElementById("lin" + lastCodeHighlight);
        line.classList.remove(current);
        lastCodeHighlight = -1
    }
}

function showExecute(r) {
    removeCodeHighlight();
    addClassToLineNumber(r, current);
    lastCodeHighlight = r
}

function showExecuteStop(r) {
    removeCodeHighlight();
    addClassToLineNumber(r, current);
    lastCodeHighlight = r;
    var pos = (r - 18) * 15.2395;
    if (r < 30) {
        pos = 0
    }
    document.getElementById("source").scrollTop = pos
}

function showError(r) {
    addClassToLineNumber(r, error);
    byteCount = 0;
    errorLineNum = r;
    var pos = (r - 18) * 15.2395;
    if (r < 30) {
        pos = 0
    }
    document.getElementById("source").scrollTop = pos
}

function removeError() {
    if (errorLineNum >= 0) {
        removeClassFromLineNumber(errorLineNum, error);
        errorLineNum = -1
    }
}

function addClassToLineNumber(r, classToAdd) {
    if (r < 0) {
        return
    }
    var elePosn = document.getElementById("lin" + r);
    if (elePosn) {
        elePosn.classList.add(classToAdd)
    } else {
        if (debug) {
            alert("could not find line " + r + " to add class " + classToAdd)
        }
    }
}

function removeClassFromLineNumber(r, classToRemove) {
    if (r < 0) {
        return
    }
    var elePosn = document.getElementById("lin" + r);
    if (elePosn) {
        elePosn.classList.remove(classToRemove)
    } else {
        if (debug) {
            alert("could not find line " + r + " to remove class " + classToRemove)
        }
    }
}

function removeMemHighlight() {
    if (lastMemHighlight >= 0) {
        var x = overlay * 256;
        if (lastMemHighlight >= x && lastMemHighlight < (x + 512)) {
            x = Math.floor((lastMemHighlight - x) / 4);
            document.getElementById("a" + x).classList.remove(current)
        }
        lastMemHighlight = -1
    }
}

function setMemHighlight(r) {
    removeMemHighlight();
    if (r < 0) {
        return
    }
    var x = overlay * 256;
    if (r >= x && r < (x + 512)) {
        x = Math.floor((r - x) / 4);
        document.getElementById("a" + x).classList.add(current)
    }
    lastMemHighlight = r
}

function IEKeyEnable() {
    document.getElementById("xxbody").focus()
}

function clearInputArea() {
    setValue("input", "&nbsp;")
}

function enableInput(secret) {
    if (secret) {
        setValue("input", inputFormSecret)
    } else {
        setValue("input", inputForm)
    }
    var elePosn = document.getElementById("iForm");
    elePosn.focus()
}
var inputForm = '<form action="javascript:inputSubmit()"><input id="iForm" type="text" placeholder="Input expected"></form>';
var inputFormSecret = '<form action="javascript:inputSubmit()"><input id="iForm" type="password" placeholder="Input expected"></form>';

function showChar(i, x) {
    if (i < 0 || i >= 512) {
        if (debug) {
            alert("Bad index for showChar() " + i)
        }
        return
    }
    var cList = "";
    if (x > 32 && x < 128) {
        if (x == "<") {
            cList = "&lt;"
        } else {
            if (x == ">") {
                cList = "&gt;"
            } else {
                if (x == "&") {
                    cList = "&amp;"
                } else {
                    cList = String.fromCharCode(x)
                }
            }
        }
    }
    setValue("c" + i, cList)
}

function getInput() {
    var elePosn = document.getElementById("iForm");
    if (!elePosn) {
        if (debug) {
            alert("Bad getInput call")
        }
        return false
    }
    return elePosn.value
}

function inputRestore(val) {
    setValue("input", val)
}

function clearIR() {
    setValue("ir", "&nbsp;");
    setValue("ur", "&nbsp;")
}

function setIR(y) {
    setValue("ir", y)
}

function addIR(y) {
    setValue("ur", y)
}

function fileOpen() {
    setValue("outer_console", '<textarea class="console" id="console" readonly>' + output1 + "\n</textarea>" + fileText);
    var elePosn = document.getElementById("read-file");
    elePosn.click()
}
var fileText = '<input type="file" id="read-file" onchange="read_file(this)" autocomplete="off"><button onclick="document.getElementById(&#39;read-file&#39;).click()">File Open required</button>';

function consoleReset() {
    setValue("outer_console", '<textarea class="console" id="console" readonly>' + output1 + "\n</textarea>")
}

function saveFile(text, name) {
    var textToSaveAsBlob = new Blob([text], {
        type: "text/plain"
    });
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = "myprog.txt";
    var downloadLink = document.createElement("a");
    downloadLink.download = name;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click()
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target)
}

function setValue(id, y) {
    var elePosn = document.getElementById(id);
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find " + id + " to set new contents " + y)
        }
    } else {
        elePosn.innerHTML = y
    }
}

function setClass(id, newClass) {
    var elePosn = document.getElementById(id);
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find " + id + " to set new class " + newClass)
        } else {
            elePosn.className = newClass
        }
    }
}

function addClass(id, newClass) {
    var elePosn = document.getElementById(id);
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find " + id + " to add class " + newClass)
        }
    } else {
        elePosn.classList.add(newClass)
    }
}

function removeClass(id, oldClass) {
    var elePosn = document.getElementById(id);
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find " + id + " to remove class " + newClass)
        }
    } else {
        elePosn.classList.remove(oldClass)
    }
}

function setProgramWidth(width) {
    editWin = width - 4;
    var mid = width + 50;
    var memPosn = width + 400;
    if (memOpt == 3) {
        memPosn += 170
    }
    var elePosn = document.getElementById("mxx");
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find mxx to set left " + memPosn)
        }
    } else {
        elePosn.style.left = memPosn + "px"
    }
    var elePosn = document.getElementById("processor");
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find processor to set left " + mid)
        }
    } else {
        elePosn.style.left = mid + "px"
    }
    var elePosn = document.getElementById("io");
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find io to set left " + mid)
        }
    } else {
        elePosn.style.left = mid + "px"
    }
    var elePosn = document.getElementById("program");
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find program to set width " + width)
        }
    } else {
        elePosn.style.width = width + "px"
    }
    if (modifyingProgram) {
        elePosn = document.getElementById("pForm");
        elePosn.style.width = editWin + "px"
    }
}

function setMemBinary(flag) {
    var memPosn = editWin + 404;
    if (flag) {
        memPosn += 170
    }
    var elePosn = document.getElementById("mxx");
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find mxx to set left " + memPosn)
        }
    } else {
        elePosn.style.left = memPosn + "px";
        if (flag) {
            elePosn.style.fontSize = binarySize + "%"
        } else {
            elePosn.style.fontSize = "100%"
        }
    }
    elePosn = document.getElementById("registers");
    if (!elePosn) {
        if (debug) {
            alert("Simulator bug - cannot find registers to set fontSize")
        }
    } else {
        if (flag) {
            elePosn.style.fontSize = binarySize + "%"
        } else {
            elePosn.style.fontSize = "100%"
        }
    }
}

function changeDimensions() {
    getDimensions();
    if (dynamicProgramWidth) {
        var tmp = maxWidth - 826;
        if (tmp < 300) {
            tmp = 300
        }
        if (tmp > 3000) {
            tmp = 3000
        }
        setProgramWidth(tmp)
    }
};