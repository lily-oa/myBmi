"use strict";

var inputHeight = document.querySelector('.height-group input');
var inputWeight = document.querySelector('.weight-group input');
var verifyHeight = document.querySelector('.height-group p'); // input verify info

var verifyWeight = document.querySelector('.weight-group p'); // input verify info

var resultBtn = document.querySelector('.see-result');
var showResult = document.querySelector('#show-result');
var resultNum = document.querySelector('.result-num');
var resultMsg = document.querySelector('.result-msg');
var list = document.querySelector('.list');
var clearAllBtn = document.querySelector('.clear-all-btn');
var data = JSON.parse(localStorage.getItem('BMI Record')) || [];
var level = ''; //---------畫面:li產生列表-------//

function updateData(data) {
  var str = '';

  if (data.length > 0) {
    clearAllBtn.style.display = 'flex';
    data.forEach(function (item) {
      var content = "\n      <li class=\"".concat(item.level, "\" data-id=\"").concat(item.time, "\">\n        <h3>").concat(item.msg, "</h3>\n        <div>\n          <small>BMI</small>\n          <p>").concat(item.bmi, "</p>\n        </div>\n        <div>\n          <small>weight</small>\n          <p>").concat(item.weight, "</p>\n        </div>\n        <div>\n          <small>height</small>\n          <p>").concat(item.height, "</p>\n        </div>\n        <small>").concat(item.date, "</small>\n        <a href=\"#\" class=\"delete-btn\">\n          <i class=\"material-icons-outlined\">height_off</i>\n        </a>\n      </li>\n      ");
      str += content;
    });
  } else {
    clearAllBtn.style.display = 'none';
    str += "<li class=\"none\">\u9019\u88E1\u9084\u6C92\u6709\u8CC7\u6599\uFF0C\u5FEB\u4F86\u8A08\u7B97\u4F60\u7684 BMI \u5427!</li>";
  }

  list.innerHTML = str;
}
//# sourceMappingURL=all.js.map
