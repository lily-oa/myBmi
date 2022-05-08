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

//---------資料 : 計算BMI 資料-------//
function BMIcalc(){
  const weight =inputWeight.value;
  const height =inputHeight.value / 100;
  const bmi = Math.round((weight / Math.pow(height, 2)) * 100) / 100;  //四捨五入到第二位

  BMIstatus(bmi);

  let bmiData = {
    bmi: bmi,
    weight: inputWeight.value,
    height: inputHeight.value,
    date: currentDate().date,
    time: currentDate().time,
    msg: resultMsg.textContent,
    level: level
  };

  inputHeight.value = "";
  inputWeight.value = "";

  data.unshift(bmiData);  //陣列的最前端新增一個值
  updateLocalStorage(data);

}

//---------資料 : 抓取日期-------//
function currentDate() {
  const now = new Date();
  const year = new getFullYear();
  const month = (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1); //十位數 + 個位數(含補 0方式)
  const date = (now.getDate() <10 ? '0' : '') + now.getDate(); //(含補 0方式)
  const time = now.getTime();
  let value = `${year}-${month}-${date}`;
  return {
    date: value,
    time: time
  }
}

//---------資料+畫面:判斷 BMI狀態 + 改按鈕狀態-------//
function BMIstatus(data) {
  const statusGroup = {
    ideal: {
      msg: '標準',
      level: 'ideal',
      color: 'result-ideal',  //已先在css寫好
    },
    thin: {
      msg: '過輕',
      level: 'thin',
      color: 'result-thin',
    },
    heavy: {
      msg: '過重',
      level: 'heavy',
      color: 'result-heavy',
    },
    slightlyObese: {
      msg: '輕度肥胖',
      level: 'slightlyObese',
      color: 'result-slightlyObese',
    },
    mediumObese: {
      msg: '中度肥胖',
      level: 'mediumObese',
      color: 'result-mediumObese',
    },
    severeObese: {
      msg: '重度肥胖',
      level: 'severeObese',
      color: 'result-severeObese',
    },
  }
};

const filterStatus = function (value){
  let color = changeBtn(statusGroup[value]);
  resultNum.textContent = date;  // 日期寫入result-num
  resultMsg.textContent = statusGroup[value].msg; //寫入result-msg
  level = statusGroup[value].level;
  let msg = statusGroup[value].msg;
  return {
    color,
    level,
    msg
  }
};

if(data <= 18.5){
  filterStatus('thin');
} else if (data <= 25){
  filterStatus('ideal');
} else if (data <= 30){
  filterStatus('heavy');
} else if (data <= 35){
  filterStatus('slightlyObese');
} else if (data <= 40){
  filterStatus('mediumObese');
} else {
  filterStatus('severeObese');
}

//---------畫面 : 按鈕轉換顏色-------//
function changeBtn(input){
  let color = input.color;
  resultBtn.style.display = 'none';
  showResult.style.display = 'block';
  showResult.classList.add(color);  // 增加輸入值color到showResult上

  return color;
}

//---------互動 + 畫面 : 點擊按鈕新增狀態 + 產生畫面-------//
function newStatus(){
  
  if(inputVerify() === 'true'){
    return;
  };

  BMIcalc();
  updateData(data);
}

//---------互動 + 畫面 : 表單驗證-------//
function inputVerify(){
  if(inputHeight.value.trim() == '' || inputWeight.value.trim() == ''){
    let alertMsg;

    if(inputHeight.value.trim() == ''){
      verifyHeight.textContent = '*請在此輸入身高 XXX cm';
      verifyHeight.classList.add('visible');
      inputHeight.classList.add('warning');
      alertMsg = 'true';
    };
    if(inputWeight.value.trim() == ''){
      verifyWeight.textContent = '*請在此輸入體重 XX kg';
      verifyWeight.classList.add('visible');
      inputWeight.classList.add('warning');
      alertMsg = 'true';
    };

    return alertMsg; 
  };

  verifyHeight.classList.remove('visible');
  verifyWeight.classList.remove('visible');
  inputHeight.classList.remove('warning');
  inputWeight.classList.remove('warning');
}

//---------互動 + 畫面 : 清空表單、按鈕 or 繼續計算-------//
function resetAll(){
  if(inputVerify()==='true'){
    resultBtn.style.display = 'block';
    showResult.style.display = 'none';
    showResult.setAttribute('class', '');
  }else{
    newStatus();
  }
}

//---------資料:更新 localStorage -------//
function updateLocalStorage(data){
  localStorage.setItem('BMI Record', JSON.stringify(data));
}