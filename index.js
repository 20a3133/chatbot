//CreateTextBoxが呼び出された回数
var count = 0;
//focusされた要素とspanのid
var focus_id, subfocus_id;
var fontSize, fs_defalt, fontColor, fc_defalt = "black";
var flag = false, change = false;
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d");
//マウスが押されているか判定
var mousedown = false;
var point, stx, sty, x, y, arc;
var red = 255, green = 255, blue = 255;
var mode = "rect", px = 1, rect_color = "black";
//canvasの縦横
var w, h;

//読み込まれた時の処理
window.onload = function(){
    w = document.getElementById("output").clientWidth;
    h = document.getElementById("output").clientHeight;
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    canvas.setAttribute("position", "absolute");
    fs_defalt =  window.getComputedStyle(document.documentElement).getPropertyValue('font-size');
    fontSize = fs_defalt;
    fontColor = fc_defalt;
    document.getElementById("msg-send").focus();
}

//ウィンドウサイズが変わったとき
window.onresize = function(){
    w = document.getElementById("output").clientWidth;
    h = document.getElementById("output").clientHeight;
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
}

//キーイベント
document.addEventListener('keydown', keydownEvent,false);

//テキストボックス置くクラス(output)取得
var text_name = document.getElementById("output");

//描画
document.addEventListener('mousedown', function(event){
    if(change){
        mousedown = true;
        point = event.target.getBoundingClientRect();
        //マウスの座標（始点）をセット
        stx = event.clientX - point.left;
        sty = event.clientY - point.top;
    }
})

document.addEventListener('mousemove', function(event){
    if(mousedown){
        x = event.clientX - point.left;
        y = event.clientY - point.top;
        //パスの開始
        context.beginPath();
        //線の色セット
        context.strokeStyle = rect_color;
        //線の太さセット
        context.lineWidth = px;
        //線端の形状セット
        //context.lineCap = "round";
    }
})

document.addEventListener('mouseup', function(){
    if (mousedown){
        if(mode == "rect"){
            var whigh = x - stx;
            var wwidth = y - sty;
            context.strokeRect(stx,sty,whigh,wwidth);
        }else if(mode == "line"){
            context.moveTo(stx,sty);
            context.lineTo(x,y);
            context.stroke();
        }else if(mode == "erace"){
            var whigh = x - stx;
            var wwidth = y - sty;
            context.clearRect(stx,sty,whigh,wwidth);
        }else if(mode == "circle"){
            context.beginPath();
            //線の色セット
            context.strokeStyle = rect_color;
            //塗りつぶしセット
            //var r = red, g = green, b = blue;
            //context.fillStyle = 'rgb(' + r + ','+ g + ',' + b + ')';
            //線の太さセット
            context.lineWidth = px;
            context.arc(stx, sty, arc, 0, 2*Math.PI, true);
            context.stroke();
        }
        
        //マウスボタンが離された
        stx = null, sty = null, x = null, y = null;
        mousedown = false;
    }
})

//文字数可変テキストボックス
text_name.addEventListener('input', function(){
    focus_id = document.activeElement.id;
    subfocus_id = "span" + String(focus_id).replace(/[^0-9]/g, '');
    inputWidthAdjust(document.getElementById(focus_id), document.getElementById(subfocus_id));
},false);

function inputWidthAdjust(textBox, dummyTextBox){
    dummyTextBox.textContent = textBox.value;
    textBox.style.width = dummyTextBox.clientWidth + 'px';
}

function fcsFunc(){
    getItem();
}

function blurFunc(){
    focus_id = "";
    subfocus_id = "";
    flag = false;
}

function keydownEvent(event){
    if(event.shiftKey){
        //要素の削除
        if(flag && event.key === 'Backspace'){
            var text = document.getElementById(focus_id);
            var sub_text;
            if(!String(focus_id).indexOf("txt")){
                sub_text = document.getElementById(subfocus_id);
            }

            sub_text.remove();
            text.remove();
            document.activeElement.blur();
            if(change){
                CanvasClear();
            }
        }
    }

    if(event.ctrlKey){
        //コマンドの送信
        if(event.key === 'Enter'){
            sendCommand();
        }
    }

    //入力部移動
    if(event.altKey && event.code === 'Slash'){
        movefooter();
    }

    if(event.altKey && event.code === 'KeyS'){
        focus_id = "";
        subfocus_id = "";
        flag = false;
    }

    //モードチェンジ
    if(event.altKey && event.code === 'KeyC'){

        //canvasモードに変更
        if(change) {
            change = false;
            var inputItem = document.getElementById("output").getElementsByTagName("input");
 
            for(var i=0; i<inputItem.length; i++){
                inputItem[i].disabled = false;
            }
        }
        else{
            change = true;
            var inputItem = document.getElementById("output").getElementsByTagName("input");
 
            for(var i=0; i<inputItem.length; i++){
                inputItem[i].disabled = true;
            }
        }
    }

    //指定テキストボックスを上下左右移動
    if(flag){
        const step = 2;
        var text = document.getElementById(focus_id);
        var sub_text = document.getElementById(subfocus_id);
        if(event.key === "ArrowUp"){
            text.style.top = parseInt(text.style.top) - step + "px";
        }else if(event.key === "ArrowDown"){
            text.style.top = parseInt(text.style.top) + step + "px";
        }else if(event.key === "ArrowLeft"){
            text.style.left = parseInt(text.style.left) - step + "px";
        }else if(event.key === "ArrowRight"){
            text.style.left = parseInt(text.style.left) + step + "px";
        }
    }
}

function getItem(){
    focus_id = document.activeElement.id;
    if(!String(focus_id).indexOf("txt")){
        subfocus_id = "span" + focus_id.replace(/[^0-9]/g, '');
    }
    flag = true;
}
//コマンド入力部に移動
function movefooter(){
    document.getElementById("msg-send").focus();
    document.getElementById("msg-send").value = "";
}

//コマンド解析
function sendCommand(){
    //入力された文字の取得
    var input = document.getElementById("msg-send").value;
    
    //文字の分解
    var result = input.split(/\s/);
    var command = result[0];

    //コマンド
    var x = 0, y = 0, fs = fontSize, fc = fontColor;
    //テキストボックス作成
    if(command=="crtxt") {
        if(result[1] == null) CreateTextBox(x, y, fontSize, fontColor);
        else{
            if(result[1] == "fs"){
                //crtxt fs~ のとき
                fs = result[2];
                if(result[3] == null){
                    x = 0;
                    y = 0;
                    fc = fontColor;
                }else if(result[3] == "fc"){
                    fc = result[4];
                    if(result[5] != null){
                        x = result[5];
                        y = result[6];
                    }
                }else if(result[3] != "fc"){
                    x = result[3];
                    y = result[4];
                    if(result[5] != null){
                        fc = result[6];
                    } 
                }
            }else if(result[1] == "fc"){
                //crtxt fc ~
                fc = result[2];
                if(result[3] == null){
                    x = 0;
                    y = 0;
                    fs = fontSize;
                }
                else if(result[3] == "fs"){
                    fs = result[4];
                    if(result[5] != null){
                        x = result[5];
                        y = result[6];
                    }
                }else if(result[3] != "fs"){
                    x = result[3];
                    y = result[4];
                    if(result[5] != null){
                        fs = result[6];
                    }
                }
            }else{
                //crtxt x y ~
                x = result[1];
                y = result[2];
                if(result[3] == "fs"){
                    fs = result[4];
                    if(result[5] != null){
                        fc = result[6];
                    }
                }else if(result[3] == "fc"){
                    fc = result[4];
                    if(result[5] != null){
                        fs = result[6];
                    }
                }else{
                    fc = fontColor;
                    fs = fontSize;
                }
            }
            CreateTextBox(x, y, fs, fc);
        }
    }else if(command == "fs"){
        //フォントサイズ一括指定
        fontSize = result[1];
        movefooter();
    }else if(command == "defalt"){
        if(result[1] == "fs"){
            //フォントサイズ初期に戻す
            fontSize = fs_defalt;
        }else if(result[1] == "fc"){
            //フォントの色初期に戻す
            fontColor = fc_defalt;
        }
        movefooter();
    }else if(command == "fc"){
        fontColor = result[1];
        movefooter();
    }
    //座標指定でテキストボックス移動
    else if(flag && command=="mvtxt") MoveTextBox(result[1], result[2]);
    else if(change){
        if(command == "px") px = result[1]; //線の太さ一括設定
        else if(command == "color") rect_color = result[1]; //線の色一括設定
        else if(command == "rect"){
            //四角
            if(result[1] != null) px = result[1];
            mode = "rect";
        }else if(command == "line"){
            //線
            if(result[1] != null) px = result[1];
            mode = "line";
        }else if(command == "circle"){
            //枠内の削除
            mode = "circle";
            arc = result[1];
            red = 255;
            green = 255;
            blue = 255;
            if(result[2] != null && result[3] != null && result[4] != null) {
                red = result[2];
                green = result[3];
                blue = result[4];
            }else if(result[2] === null || result[3] === null || result[4] === null){
                red = 255;
                green = 255;
                blue = 255;
            }
        }else if(command == "erace"){
            //枠内の削除
            mode = "erace";
        }else if(command == "clear"){
            CanvasClear();
        }
    }
    else{
        alert("無効なコマンドです");
        movefooter();
    }
}

//canvas全画面削除
function CanvasClear(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//テキストボックスの作成
function CreateTextBox(x, y, fontsize, fontcolor){
    count += 1;
    const cftdiv = document.getElementById("output");
    const ipt = document.createElement("input");
    const dummyipt = document.createElement("span");
    
    //テキストボックス
    //idを指定
    ipt.setAttribute("id", "txt"+count);
    // typeを指定
    ipt.setAttribute("type", "text");
    // valueを設定
    ipt.setAttribute("value", "テキスト");
    // name を指定
    ipt.setAttribute("name", "username");
    // classを設定
    ipt.setAttribute("class", "sentence");

    // 要素へonFocus属性を設定する
    ipt.setAttribute('onFocus', `fcsFunc()`);
    // 要素へonBlur属性を設定する
    ipt.setAttribute("onBlur", `blurFunc()`);

    //span
    //idを指定
    dummyipt.setAttribute("id", "span"+count);
    //aria-hiddenを指定
    dummyipt.setAttribute("aria-hidden", "true");

    // テキストボックスの位置を指定
    ipt.style.left = x +"px";
    ipt.style.top = y +"px";
    dummyipt.style.left = x +"px";
    dummyipt.style.top = y +"px";

    //フォントサイズの設定(入力しないと変化しない)
    if(fontsize == 0){
        fontsize = fs_defalt;
    }
    ipt.style.fontSize = fontsize+"px";
    dummyipt.style.fontSize = fontsize+"px";

    //フォントカラーの設定(入力しないと黒)
    ipt.style.color = fontcolor;
    dummyipt.style.color = fontcolor;
    //親ノードの子ノードリストの末尾にノードを追加
    cftdiv.appendChild(ipt);
    cftdiv.appendChild(dummyipt);
    //テキストボックスの幅調整
    inputWidthAdjust(document.getElementById("txt"+count), document.getElementById("span"+count));
    document.getElementById("txt"+count).focus();
    getItem();
}

//要素の移動
function MoveTextBox(x, y){
    const ipt = document.getElementById(focus_id);
    const dummyipt = document.getElementById(subfocus_id);

    ipt.style.left = x +"px";
    ipt.style.top = y +"px";
    dummyipt.style.left = x +"px";
    dummyipt.style.top = y +"px";
}