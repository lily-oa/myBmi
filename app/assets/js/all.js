const inputHeight = document.querySelector('.height-group input');
const inputWeight = document.querySelector('.weight-group input');
const verifyHeight = document.querySelector('.height-group p'); // input verify info
const verifyWeight = document.querySelector('.weight-group p'); // input verify info

const resultBtn = document.querySelector('.see-result');
const showResult = document.querySelector('#show-result');
const resultNum = document.querySelector('.result-num');
const resultMsg = document.querySelector('.result-msg');
const list = document.querySelector('.list');
const clearAllBtn = document.querySelector('.clear-all-btn');

let data = JSON.parse(localStorage.getItem('BMI Record')) || [];
let level = '';

//---------畫面:li產生列表-------//
function updateData(data){
  let str = '';
  if(data.length > 0){
    clearAllBtn.style.display = 'flex';
    data.forEach(function(item){
      const content = `
      <li class="${item.level}" data-id="${item.time}">
        <h3>${item.msg}</h3>
        <div>
          <small>BMI</small>
          <p>${item.bmi}</p>
        </div>
        <div>
          <small>weight</small>
          <p>${item.weight}</p>
        </div>
        <div>
          <small>height</small>
          <p>${item.height}</p>
        </div>
        <small>${item.date}</small>
        <a href="#" class="delete-btn">
          <i class="material-icons-outlined">height_off</i>
        </a>
      </li>
      `;
      str += content;
    });
  }else{
    clearAllBtn.style.display = 'none';
    str += `<li class="none">這裡還沒有資料，快來計算你的 BMI 吧!</li>`
  }
  list.innerHTML = str;
}