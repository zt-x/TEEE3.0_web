import vue from "@/main";
var count = 1;
function _alert(msg) {
  vue.$toasted.show(msg, {
    theme: "outline",
    position: "top-center",
    duration: 2000,
  });
}
export function unlimit(window, document) {
  count = 1;
  document.onkeydown = null;
  document.oncontextmenu = null;
  console.clear();
}
export function limit(doc) {
  doc.onkeydown = function (e) {
    e = window.event || e;
    var k = e.keyCode;
    //屏蔽ctrl+R，F5键，ctrl+F5键  F3键！验证
    if (
      (e.ctrlKey == true && k == 82) ||
      k == 116 ||
      (e.ctrlKey == true && k == 116) ||
      k == 114
    ) {
      e.keyCode = 0;
      _alert("刷新可能会导致作答丢失哦！😣");
      e.returnValue = false;
      e.cancelBubble = true;
      return false;
    }
    if (k == 8) {
      this._alert("请不要返回或后退！😣");
      e.keyCode = 0;
      e.returnValue = false;
      return false;
    }
    //屏蔽 Ctrl+n   验证可以实现效果
    if (e.ctrlKey && k == 78) {
      e.keyCode = 0;
      e.returnValue = false;
      e.cancelBubble = true;
      return false;
    }
    //屏蔽F11   验证可以实现效果
    if (k == 122) {
      e.keyCode = 0;
      e.returnValue = false;
      e.cancelBubble = true;
      return false;
    }
    // F12
    if (e.keyCode == 123) {
      _alert("👿警告" + count + "次嗷");
      count++;
      return false;
    }

    //屏蔽 shift+F10  验证可以实现效果
    if ((e.shiftKey && k == 121) || (e.ctrlKey && k == 121)) {
      e.keyCode = 0;
      e.returnValue = false;
      e.cancelBubble = true;
      return false;
    }

    //屏蔽Alt+F4
    if (e.altKey && k == 115) {
      e.keyCode = 0;
      e.returnValue = false;
      e.cancelBubble = true;
      return false;
    }
    //屏蔽 Alt+ 方向键 ← ;屏蔽 Alt+ 方向键 → ！验证
    if (e.altKey && (k == 37 || k == 39)) {
      alert("请不要使用ALT+方向键前进或后退网页！😣");
      e.keyCode = 0;
      e.returnValue = false;
      e.cancelBubble = true;
      return false;
    }
  };
  //屏蔽右键菜单，！验证
  doc.oncontextmenu = function (event) {
    if (window.event) {
      event = window.event;
    }
    try {
      var the = event.srcElement;
      if (
        !(
          (the.tagName == "INPUT" && the.type.toLowerCase() == "text") ||
          the.tagName == "TEXTAREA"
        )
      ) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  };
}
