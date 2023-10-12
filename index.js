document.addEventListener('keydown', keydownEvent,false);
//CreateTextBoxが呼び出された回数
var count = 0;

window.onload = function(){document.getElementById("msg-send").focus()};

function keydownEvent(event){
    if(event.shiftKey && event.key === 'Enter') {
        sendCommand();
    }

    if(event.altKey && event.code === 'Slash'){
        document.getElementById("msg-send").focus();
    }
}

function sendCommand(){
    //alert('click');
    //input = document.getElementById("msg-send").value;
    //target = document.getElementById("output");
    //target.innerHTML += input+"<br>";

    //入力された文字の取得
    var input = document.getElementById("msg-send").value;
    
    //文字の分解
    var result = input.split(/\s/);
    var command = result[0];
    //コマンド
    if(command=="crtxt") CreateTextBox();
    if(command=="ertxt") EraceTextBox();
}

//テキストボックスの作成
function CreateTextBox(){
    //alert('click');
    count += 1;
    const cftdiv = document.getElementById("output");
    const ipt = document.createElement("input");

    //idを指定
    ipt.setAttribute("id", "txt"+count);
    // typeを指定
    ipt.setAttribute("type", "text");
    // maxlengthを指定
    //ipt.setAttribute("maxlength", "30");
    // sizeを指定
    ipt.setAttribute("size", "50");
    // placeholderを指定
    ipt.setAttribute("placeholder","テキストボックス"+count);
    // valueを設定
    ipt.setAttribute("value", "");
    //　name を指定
    ipt.setAttribute("name", "username");

    /*親ノードの子ノードリストの末尾にノードを追加*/
    cftdiv.appendChild(ipt);
    document.getElementById("txt"+count).focus();
}

//テキストボックスの削除
function EraceTextBox(){
    var id = document.activeElement.id;
    const cftdiv = document.getElementById(id);
    if(cftdiv.hasChildNodes()){
        ftdiv.removeChild(cftdiv.firstChild);
    }
}