var app = new Vue({
  el: '#app',
  data: {
    status: [
      { range: "0 ~ 50", name: "良好", color:"level1", icon: "fa-laugh-beam" },
      { range: "51 ~ 100", name: "普通", color:"level2", icon: "fa-smile" },
      { range: "101 ~ 150", name: "對敏感族群不健康", color:"level3", icon: "fa-meh" },
      { range: "151 ~ 200", name: "對所有族群不健康", color:"level4", icon: "fa-meh-rolling-eyes" },
      { range: "201 ~ 300", name: "非常不健康", color:"level5", icon: "fa-angry" },
      { range: "301 ~ 400", name: "危害", color:"level6", icon: "fa-sad-tear" },
    ],
    allData:[],
    nowData:[],
    tableData:[],
    tableTitleAry:[],//table title
    checkboxTitleAry:[],//checkbox title
    page:{
      per_page:10,
      totalPage:1,
      nowPage:1
    },
    selectAll:false,
    selectTitle:[],
    tableSelectTitle:[],//selectTitle is []  => checkboxTitleAry
    selectToggle:false,
    selectArea:'請選擇地區',
    baseTitle:['SiteName','AQI','Status']
  },
  computed: {
    counties(){
      const filterCounties = [];
      this.allData.forEach(el => {
        if(filterCounties.indexOf(el.County) <0){
          filterCounties.push(el.County)
        }
      })
      return filterCounties
    },
  },
  methods: {
    async api(){
      const cors = 'https://cors-anywhere.herokuapp.com/';
      const aqi1 = 'http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=1000&format=json';
      const url = 'aqi.json';
      // const url = "`${cors}${aqi1}`";
      await fetch(url).then(res => {
        return res.json();
      }).then(res => {
        this.allData = res;
        this.nowData = res;
        this.filterTitle();
        this.selectTableTitle();
        this.sortPage(res);
        // console.log(res)
      }).catch(err => {
        console.log(err)
      });
    },
    filterTitle(){
      const origin = Object.keys(this.allData[0]);
      const filterTitle = Object.assign([],origin);
      const deleteAry = ['County','SiteId','SiteName','AQI','Status','PublishTime','Longitude','Latitude'];
      
      deleteAry.forEach(el => {
        filterTitle.splice(filterTitle.indexOf(el),1)
      });

      this.tableTitleAry = this.baseTitle.concat(filterTitle);
      this.checkboxTitleAry = filterTitle;
    },
    selectTableTitle(){
      if(this.selectTitle.length === 0){
        this.tableSelectTitle = this.checkboxTitleAry;
      }else{
        this.tableSelectTitle = this.selectTitle;
      }
    },
    selectFunction(item){
      // all place
      if(item === 'all'){
        this.nowData = this.allData;
        this.selectArea = '台灣全區域';
        this.selectToggle = false;
        this.sortPage(this.nowData);
        return null;
      }

      // filter select area's data
      const nowSelectArea = [];
      this.allData.forEach(el => {
        if(el.County === item){
          nowSelectArea.push(el);
        }
      })
      this.nowData = nowSelectArea;
      this.selectArea = item;
      this.selectToggle = false;
      this.sortPage(this.nowData);
    },
    selectAllFun(){
      //change all select toggle
      this.selectAll = !this.selectAll;

      this.selectTitle = [];
      if(this.selectAll){
        this.selectTitle = Object.assign([],this.checkboxTitleAry);
      }else{
        this.selectTitle = [];
      }
      this.selectTableTitle();
    },
    clickCheckbox(title){
      if(this.selectTitle.indexOf(title)<0){
        this.selectTitle.push(title);
      }else{
        this.selectTitle.splice(this.selectTitle.indexOf(title),1)
      }
      this.selectTableTitle();
    },
    sortPage(dataItem){ //ten item in one page
      // page count
      const per_page = this.page.per_page;
      const len = dataItem.length;
      this.page.totalPage = Math.ceil(len / per_page);

      // table data sort
      let page_data = []; 
      for (let a = 0; a < this.page.totalPage; a++) {
        let ten = [];
        for (let k = a * per_page; k < (a + 1) * per_page; k++) {
          if (dataItem[k] !== undefined) {
            ten.push(dataItem[k]);
          }
        }
        page_data.push(ten);
      }
      this.tableData = page_data;
    },
    changePage(num,status){
      // if click is number not toggle button 
      if(status === "setNumber"){
        return this.page.nowPage = num;
      }

      // click toggle button
      const page = this.page.nowPage;
      if(page === 1 && num === -1){
        this.page.nowPage = 1;
      } else if(page === this.page.totalPage && num === 1){
        this.page.nowPage = this.page.totalPage;
      }else{
        this.page.nowPage = page + num;
      }
    }
  },
  created() {
    this.api()
  },
})