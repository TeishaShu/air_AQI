var all_data = [];  // 全部資料
var now_data = [];  // 目前頁面資料
var menu_data = [];  // menu資料
var check_data = [];  // checkbox have checked
var tit_data = [];  // 標題
var counties = {};   //menu1 show
var filterData = [];  //menu filter data

// 載資料
// var cors = 'https://cors-anywhere.herokuapp.com/';
// var aqi = 'http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=1000&format=json';
var inAQI = 'aqi.json';
fetch(inAQI).then(res => {
  return res.json();
}).then(jsonData => {
  jsonData.forEach(e => {
    all_data.push(e);

    //預設
    now_data.push(e);
  });

  // 預設
  // 整理資料、show menu
  menu();

  // show checkbox
  checkboxName();

  //page
  page(now_data);

})


// 整理資料-改
function menu() {
  //去重
  all_data.forEach(item => {
    if(Object.keys(counties).indexOf(item.County) == -1){
      counties[item.County]=[];
    }
    counties[item.County].push(item.SiteName)
  });
  
  //掛上去畫面
  let menu1 = '';
  Object.keys(counties).forEach(e => {
    menu1 += `<li class="down2" data-name ="${e}">${e}
                <ul>`;
    counties[e].forEach(k => {
      menu1 += `<li data-name="${k}">${k}</li>`;
    });
    menu1 +=  `</ul>
              </li>`;
  });
  $('#menu_county').html(menu1);
  $('#menu_county2').html(menu1);

  //click
  let menuLi = document.querySelectorAll('#menu_county li');
  sameClick(menuLi);
  let menuLi2 = document.querySelectorAll('#menu_county2 li');
  sameClick(menuLi2);

}
function sameClick(menuLi){
  menuLi.forEach(el => {
    el.addEventListener('click',clickMenu);
    function clickMenu(e){
      e.stopPropagation();
      filterData = all_data.filter(k => {
        return k.County === el.dataset.name || k.SiteName === el.dataset.name;
      });
      
      page(filterData);
      console.log(el);
      $('#tit1').text(el.dataset.name);
      $('#tit2').text('全區域');
    }
  });
}

// for (const key in object) {
//   if (object.hasOwnProperty(key)) {
//     const element = object[key];

//   }
// }

// checkbox name
function checkboxName() {
  let nameAry = Object.keys(all_data[0]);  // 4.Rem-Object.keys()
  let input_html = '';
  nameAry.forEach(function (e, index) {
    input_html += `<div><input type="checkbox" onclick="checkbox('${e}',$(this))">${e}</div>`;
    tit_data.push(e);
  });
  $('.checkbox').html(input_html);
}

// checkbox data
function checkbox(name, input) {
  if (input[0].checked === true) {
    check_data.push(name);
  } else {
    check_data.splice(check_data.indexOf(name), 1);  // 5.Rem-splice、indexOf--第二次
  }
  //刷table
  page(now_data);
}

// page
function page(data) {
  let per_page = 10;
  let lenInfo = data.length;
  let pageNum = Math.ceil(lenInfo / per_page);  // 6.Rem-Math.ceil、replace
  let page_html = '<div>+</div>';
  let page_htmlAdd = '';
  page_htmlAdd += `<div id="previous">上一頁</div>`;
  for (let i = 0; i < pageNum; i++) {
    page_htmlAdd += page_html.replace('+', i + 1);
  }
  page_htmlAdd += `<div id="next">下一頁</div>`;
  $('.page').html(page_htmlAdd);
  $('.page div').removeClass("active-page");
  $('.page div:nth-child(2)').addClass("active-page");  // 7.Rem-active

  // 整理page資料   // 8.Rem-整理資料時突然有點卡****
  let page_data = [];  // page整理的資料
  for (let a = 0; a < pageNum; a++) {
    let ten = [];
    for (let k = a * 10; k < (a + 1) * 10; k++) {
      if (data[k] !== undefined) {
        ten.push(data[k]);
      }
    }
    page_data.push(ten);
  }

  // 預設畫面
  table(page_data[0]);

  // 點擊畫面
  $('.page div').on('click', function () {  // 9.Rem-on
    let nowNum = parseInt($('.active-page')[0].innerText);
    let len = $('.page div').length;
    if (this.id === 'previous') {
      let preNum = nowNum - 1;
      if (preNum === 0) { } else {
        $('.page div').removeClass("active-page");
        $(`.page div:nth-child(${preNum + 1})`).addClass("active-page");

        table(page_data[preNum - 1]);
      }
    } else if (this.id === 'next') {
      let nextNum = nowNum + 1;
      if (len - 1 === nextNum) { } else {
        $('.page div').removeClass("active-page");
        $(`.page div:nth-child(${nextNum + 1})`).addClass("active-page");

        table(page_data[nextNum - 1]);
      }

    } else {
      let num = parseInt($(this).text());
      $('.page div').removeClass("active-page");
      $(`.page div:nth-child(${num + 1})`).addClass("active-page");

      table(page_data[num - 1]);
    }
  });
}

// table
function table(data) {
  let tr_html = '';
  let thead = '';
  let check = check_data;
  if (check.length === 0) {
    //thead
    tit_data

    thead += '<tr>';
    tit_data.forEach(function (e, index) {
      thead += `<th>${e}</th>`;
    });
    thead += '</tr>';
    $('thead').html(thead);

    // tbody
    data.forEach(function (e, index) {
      tr_html += '<tr>';
      tit_data.forEach(function (k, num) {
        tr_html += `<td>${e[k]}</td>`;
      });
      tr_html += '</tr>';
    });
    $('tbody').html(tr_html);

  } else {
    //thead
    thead += '<tr>';
    check.forEach(function (e, index) {
      thead += `<th>${e}</th>`;
    });
    thead += '</tr>';
    $('thead').html(thead);

    // tbody
    data.forEach(function (e, index) {
      tr_html += '<tr>';
      check.forEach(function (el, num) {
        tr_html += `<td>${e[el]}</td>`  // 10.物件這邊突然卡一下...
      });
      tr_html += '</tr>';
    });
    $('tbody').html(tr_html);
  }
}

// search
function search(num,e) {
  let text = $('#search').val();
  let text2 = $('#search2').val();
  sameSearch(text,num,e);
  sameSearch(text2,num,e);
}

function sameSearch(text,num,e){
  let search_data = [];
  if(text=="" || text ==" "){
    return ;
  }
  if(num === '13' && e.keyCode ===13){
    all_data.forEach(function (e, index) {
      if ((text === e.SiteName)||(text === e.County)||(text === e.AQI)||(text === e.Pollutant)||(text === e.Status)||(text === e.SO2)||(text === e.CO)||(text === e.CO_8hr)||(text === e.O3)||(text === e.O3_8hr)||(text === e.PM10)||(text === e['PM2.5'])||(text === e.NO2)||(text === e.NOx)||(text === e.NO)||(text === e.WindSpeed)||(text === e.WindDirec)||(text === e.PublishTime)||(text === e['PM2.5_AVG'])||(text === e.PM10_AVG)||(text === e.SO2_AVG)||(text === e.Longitude)||(text === e.Latitude)||(text === e.SiteId)) {
        search_data.push(e);
      }
    });
    page(search_data);
  }else if(num === '2'){
    all_data.forEach(function (e, index) {
      if ((text === e.SiteName)||(text === e.County)||(text === e.AQI)||(text === e.Pollutant)||(text === e.Status)||(text === e.SO2)||(text === e.CO)||(text === e.CO_8hr)||(text === e.O3)||(text === e.O3_8hr)||(text === e.PM10)||(text === e['PM2.5'])||(text === e.NO2)||(text === e.NOx)||(text === e.NO)||(text === e.WindSpeed)||(text === e.WindDirec)||(text === e.PublishTime)||(text === e['PM2.5_AVG'])||(text === e.PM10_AVG)||(text === e.SO2_AVG)||(text === e.Longitude)||(text === e.Latitude)||(text === e.SiteId)) {
        search_data.push(e);
      }
    });
    page(search_data);
  }
}