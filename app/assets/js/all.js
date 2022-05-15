
const inputHeight = document.querySelector(".height-group input");
const inputWeight = document.querySelector(".weight-group input");
const verifyHeight = document.querySelector(".height-group p"); //input verify info
const verifyWeight = document.querySelector(".weight-group p"); //input verify info

const resultBtn = document.querySelector("see-result");
const showResult = document.querySelector("#show-result");
const resultNum = document.querySelector(".result-num");
const resultMsg = document.querySelector(".result-msg");
const resetBtn = document.querySelector(".reset-btn");
const list = document.querySelector(".list");
const clearAllBtn = document.querySelector(".clear-all-btn");

let data = JSON.parse(localStorage.getItem('BMI Record')) || [] ;
let level ='';

//---------畫面:li產生列表-------//
function updateData(data){
  let str ='';

  if(data.length > 0){
    clearAllBtn.style.display = 'flex';
    data.forEach(item => {
      const content = `
        <li class="${item.level} d-block d-md-none ps-0 ms-0" data-id="${item.time}">
          <div class="row d-flex flex-column justify-content-between align-items-center">
            <div class="col-11 d-flex flex-row justify-content-between mb-2">
                <h3 class="ps-1">${item.msg}</h3>
                <div class="ps-1">
                  <small class='fs-9'>BMI</small>
                  <span>${item.bmi}</span>
                </div>
                <div class="ps-1">
                  <small class='fs-9'>weight</small>
                  <span>${item.weight}</span>
                </div>
                <div class='ps-1'>
                  <small class='fs-9'>height</small>
                  <span>${item.height}</span>
                </div>
            </div>
            <div class="col-11 d-flex flex-row align-items-center justify-content-center">
              <small class="d-flex flex-sm-wrap pe-1">${item.date}</small>
              <a href="#" class="delete-btn pe-2 lh-1">
                <i class="material-icons-outlined"> highlight_off </i>
              </a>
            </div>
          </div>
        </li>

        <li class="${item.level} d-none d-md-block" data-id="${item.time}">
          <div class="d-flex flex-md-row align-items-md-center justify-content-around">
              <h3>${item.msg}</h3>
              <div>
                <small class='fs-9'>BMI</small>
                <span>${item.bmi}</span>
              </div>
              <div>
                <small class='fs-9'>weight</small>
                <span>${item.weight}</span>
              </div>
              <div>
                <small class='fs-9'>height</small>
                <span>${item.height}</span>
              </div>
              <small>${item.date}</small>
              <a href="#" class="delete-btn lh-1">
                <i class="material-icons-outlined"> highlight_off</i>
              </a>
            </div>
        </li>
        `
        ;
        str += content;
    });  

  }else{
    clearAllBtn.style.display = 'none';
    str += `<li class="none">這裡還沒有資料，快來計算你的 BMI 吧！</li>`;
  }

  list.innerHTML = str ;

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
  const year = now.getFullYear();
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
      msg: '標準體重',
      level: 'ideal',
      color: 'result-ideal',  //已先在css寫好
    },
    thin: {
      msg: '體重過輕',
      level: 'thin',
      color: 'result-thin',
    },
    heavy: {
      msg: '體重過重',
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
  };


  const filterStatus = function (value) {
    let color = changeBtn(statusGroup[value]);
    resultNum.textContent = data;
    resultMsg.textContent = statusGroup[value].msg;
    level = statusGroup[value].level;
    let msg = statusGroup[value].msg;
    return {
      color,
      level,
      msg
    }
  };

  if (data <= 18.5) {
    filterStatus('thin');
  } else if (data <= 25) {
    filterStatus('ideal');
  } else if (data <= 30) {
    filterStatus('heavy');
  } else if (data <= 35) {
    filterStatus('slightlyObese');
  } else if (data <= 40) {
    filterStatus('mediumObese');
  } else {
    filterStatus('severeObese');
  }

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
  localStorage.setItem('BMI Record', JSON.stringify(data));  //轉成字串的方式存入
}

//---------ALL: 單一刪除按鈕-------//

function deleteBtn(e){
  if(!e.target.classList.contains('material-icons-outlined')){  //檢查是否含有icon
    return;
  };

  e.preventDefault();
  const id = parseInt(e.target.closest('LI').dataset.id); //返回第一個LI的自訂屬性以整數呈現

  let deleteData = data.findIndex(function(item){
    item.time === id;
  });

  data.splice(deleteData,1);

  updateLocalStorage(data);
  updateData(data);
}

//---------ALL: 全部刪除按鈕-------//
function deleteAllData(e){
  e.preventDefault();
  if(e.target.closest('.clear-all-btn').nodeName !== 'BUTTON'){
    return; 
  }
  const total = data.length;
  data.splice(0, total);

  updateLocalStorage(data);
  updateData(data);
  resetAll();
}

//---------keyup 監聽-------//
function inputByKey(e){
  if(e.key === 'Enter'){
    if(resultBtn.style.display === 'block'){
      newStatus();
    }else{
      resetAll();
    };
  }else{
    return;
  };
}

// 初始值
function init(){
  updateData(data);

  inputHeight.addEventListener('keyup', inputByKey, false);
  inputWeight.addEventListener('keyup', inputByKey, false);

  resultBtn.addEventListener('click', newStatus, false);
  resetBtn.addEventListener('click', resetAll, false);
  list.addEventListener('click', deleteBtn, false);
  clearAllBtn.addEventListener('click', deleteAllData, false);
}

init();