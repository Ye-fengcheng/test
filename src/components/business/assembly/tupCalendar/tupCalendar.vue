<template>
  <div class="calendar">
    <div class="header">
      <a data-action="prev-month" href="javascript:void(0)" title="Previous Month"><i></i></a>
      <div class="text" data-render="month-year"></div>
      <a data-action="next-month" href="javascript:void(0)" title="Next Month"><i></i></a>
    </div>
    <div class="months" data-flow="left">
      <div class="month month-a">
        <div class="render render-a"></div>
      </div>
      <div class="month month-b">
        <div class="render render-b"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tupCalendar',
  model: {
    prop: 'value',
    event: 'add'
  },
  props: {
  },
  data(){
    return {
      calendar:null,
      searchForm:{
        year:(new Date).getFullYear(),
        month:(new Date).getMonth()+1
      },
      calendars:[]
    }
  },
  watch:{
    value:function(val){
      
    }
  },
  methods: { 
    changeMonth(CurrentYear,CurrentMonth){
      this.searchForm = {
        year : CurrentYear,
        month : CurrentMonth + 1
      }
      this.loadData()
    },
    loadData(){
      let thiz = this;
      thiz.$tupHttp(thiz,'/system-parameters/holidayDate/listByMonth','POST',thiz.searchForm,{},'',false,'').then(res=>{
        thiz.calendars = thiz.calendars.concat(res.body.models) 
        thiz.calendar.showCurrent()      
      })
    },
    getTag(year,month,day){
      return this.calendars.filter( item => {
        return (item.year == year && item.month == month+1 && item.day ==day)
      })
    },
    init(){
      let thiz = this;
      var Calendar = function(t) {
        this.divId = t.RenderID ? t.RenderID : '[data-render="calendar"]', this.DaysOfWeek = t.DaysOfWeek ? t.DaysOfWeek : ["日", "一", "二", "三", "四", "五", "六"], this.Months = t.Months ? t.Months : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        var e = new Date;
        this.CurrentMonth = e.getMonth(), this.CurrentYear = e.getFullYear();
        var r = t.Format;
        this.f = "string" == typeof r ? r.charAt(0).toUpperCase() : "M"
      };
      Calendar.prototype.nextMonth = function() {
        11 == this.CurrentMonth ? (this.CurrentMonth = 0, this.CurrentYear = this.CurrentYear + 1) : this.CurrentMonth = this.CurrentMonth + 1, this.divId = '[data-active="false"] .render', this.showCurrent()
        thiz.changeMonth(this.CurrentYear,this.CurrentMonth)
      }, Calendar.prototype.prevMonth = function() {
        0 == this.CurrentMonth ? (this.CurrentMonth = 11, this.CurrentYear = this.CurrentYear - 1) : this.CurrentMonth = this.CurrentMonth - 1, this.divId = '[data-active="false"] .render', this.showCurrent()
        thiz.changeMonth(this.CurrentYear,this.CurrentMonth)
      }, Calendar.prototype.previousYear = function() {
        this.CurrentYear = this.CurrentYear - 1, this.showCurrent()
        thiz.changeMonth(this.CurrentYear,this.CurrentMonth)
      }, Calendar.prototype.nextYear = function() {
        this.CurrentYear = this.CurrentYear + 1, this.showCurrent()
        thiz.changeMonth(this.CurrentYear,this.CurrentMonth)
      }, Calendar.prototype.showCurrent = function() {
          this.Calendar(this.CurrentYear, this.CurrentMonth)
      }, Calendar.prototype.checkActive = function() {
          1 == document.querySelector(".months").getAttribute("class").includes("active") ? document.querySelector(".months").setAttribute("class", "months") : document.querySelector(".months").setAttribute("class", "months active"), "true" == document.querySelector(".month-a").getAttribute("data-active") ? (document.querySelector(".month-a").setAttribute("data-active", !1), document.querySelector(".month-b").setAttribute("data-active", !0)) : (document.querySelector(".month-a").setAttribute("data-active", !0), document.querySelector(".month-b").setAttribute("data-active", !1)), setTimeout(function() {
              document.querySelector(".calendar .header").setAttribute("class", "header active")
          }, 200), document.querySelector("body").setAttribute("data-theme", this.Months[document.querySelector('[data-active="true"] .render').getAttribute("data-month")].toLowerCase())
      }, Calendar.prototype.Calendar = function(t, e) {
          "number" == typeof t && (this.CurrentYear = t), "number" == typeof t && (this.CurrentMonth = e);
          var r = (new Date).getDate(),
              n = (new Date).getMonth(),
              a = (new Date).getFullYear(),
              o = new Date(t, e, 1).getDay(),
              i = new Date(t, e + 1, 0).getDate(),
              u = 0 == e ? new Date(t - 1, 11, 0).getDate() : new Date(t, e, 0).getDate(),
              s = "<span>" + t + " - " + this.Months[e] + "</span>",
              d = '<div class="tablecalendar">';
              
          d += '<div class="row head">';
          for (var c = 0; c < 7; c++) d += '<div class="cell">' + this.DaysOfWeek[c] + "</div>";
          d += "</div>";
          for (var h, l = "M" == this.f ? 1 : 0 == o ? -5 : 2 ,dm = "M" == this.f ? 1 : 0 == o ? -5 : 2, v = (c = 0, 0); v < 6; v++) {
              d += '<div class="row">';
              for (var m = 0; m < 7; m++) {
                h = c + dm - o
                let tagTitle = ''
                let financingMonthTitle = ''
                let tag = []
                if (h < 1) {
                  /* let prevMonthDays = new Date(this.CurrentYear, this.CurrentMonth, 0).getDate()
                  tag = thiz.getTag(this.CurrentYear,this.CurrentMonth - 1,h+prevMonthDays)
                  if(tag.length > 0){
                    tagTitle = tag[0].tag ? tag[0].tag:''
                    financingMonthTitle = tag[0].financingMonthType == 1 ? '财务月'+tag[0].financingMonth+'月开始时间' :
                    (tag[0].financingMonthType == 2 ? '财务月'+tag[0].financingMonth+'月结束时间' :"")
                  } */
                  d += '<div class="cell disable ' + ((m ==0 || m==6) ? "border" :"") +'">' + (u - o + l++) + "<span style='color:red'>" + tagTitle + "</span><span style='font-size:8px'>"+financingMonthTitle+"</span></div>";
                }
                else if (h > i) {
                  /* let nextMonthDays = new Date(this.CurrentYear, this.CurrentMonth + 2, 0).getDate()
                  tag = thiz.getTag(this.CurrentYear,this.CurrentMonth+1,h-nextMonthDays)
                  if(tag.length > 0){
                    tagTitle = tag[0].tag ? tag[0].tag:''
                    financingMonthTitle = tag[0].financingMonthType == 1 ? '财务月'+tag[0].financingMonth+'月开始时间' :
                    (tag[0].financingMonthType == 2 ? '财务月'+tag[0].financingMonth+'月结束时间' :"")
                  } */
                  d += '<div class="cell disable ' + ((m ==0 || m==6) ? "border" :"") +'">' + l++ + "<span style='color:red'>" + tagTitle + "</span><span style='font-size:8px'>"+financingMonthTitle+"</span></div>";
                }
                else {
                  tag = thiz.getTag(this.CurrentYear,this.CurrentMonth,h)
                  if(tag.length > 0){
                    tagTitle = tag[0].tag ? tag[0].tag:''
                    financingMonthTitle = tag[0].financingMonthType == 1 ? '财务月'+tag[0].financingMonth+'月开始' :
                    (tag[0].financingMonthType == 2 ? '财务月'+tag[0].financingMonth+'月结束' :"")
                  }
                  d += '<div class="' + ((m ==0 || m==6) ? "border" :"") +' cell ' + (r == h && this.CurrentMonth == n && this.CurrentYear == a ? " active" : "") + '"><span>' + h + "</span><span style='color:red'>" + tagTitle + "</span><span style='font-size:8px'>"+financingMonthTitle+"</span></div>", l = 1
                }
                c % 7 == 6 && h >= i && (v = 10), c++
              }
              d += "</div><div style='height:2px'>&nbsp;</div>"
          }
          d += "</div>", document.querySelector('[data-render="month-year"]').innerHTML = s, document.querySelector(this.divId).innerHTML = d, document.querySelector(this.divId).setAttribute("data-date", this.Months[e] + " - " + t), document.querySelector(this.divId).setAttribute("data-month", e)
      }
      thiz.calendar = new Calendar({
        RenderID: ".render-a",
        Format: "M"
      });
      thiz.calendar.showCurrent(), thiz.calendar.checkActive();
      var e = document.querySelectorAll(".header [data-action]");
      for (let i = 0; i < e.length; i++) e[i].onclick = function() {
          if (document.querySelector(".calendar .header").setAttribute("class", "header"), "true" == document.querySelector(".months").getAttribute("data-loading")) return document.querySelector(".calendar .header").setAttribute("class", "header active"), !1;
          var e;
          document.querySelector(".months").setAttribute("data-loading", "true"), this.getAttribute("data-action").includes("prev") ? (thiz.calendar.prevMonth(), e = "left") : (thiz.calendar.nextMonth(), e = "right"), thiz.calendar.checkActive(), document.querySelector(".months").setAttribute("data-flow", e), document.querySelector('.month[data-active="true"]').addEventListener("webkitTransitionEnd", function() {
              document.querySelector(".months").removeAttribute("data-loading")
          }), document.querySelector('.month[data-active="true"]').addEventListener("transitionend", function() {
              document.querySelector(".months").removeAttribute("data-loading")
          })
      }
    }
  },
  mounted () {
    this.loadData();
    this.init();
    
  },
  computed: {
  }
}
</script>

<style>
  .pull-left{float:left}
  .pull-right{float:right}
  .clearfix:after,.clearfix:before{content:'';display:table}
  .clearfix:after{clear:both;display:block}

  .calendar{width:700px;font-size:100%;margin:0px auto 0;-webkit-perspective:1000px;perspective:1000px;cursor:default;position:relative}
  .calendar .header{height:100px;position:relative;color:#fff}
  .calendar .header .text{position:absolute;top:0;left:0;right:0;bottom:0;background-color:#308ff0;padding:15px;-webkit-transform:rotateX(90deg);transform:rotateX(90deg);-webkit-transform-origin:bottom;transform-origin:bottom;-webkit-backface-visibility:hidden;backface-visibility:hidden;transition:.4s ease-in-out 0s;box-shadow:0 6px 20px 0 rgba(0,0,0,.19), 0 8px 17px 0 rgba(0,0,0,.2);opacity:0}
  .calendar .header .text>span{text-align:center;padding:26px;display:block}
  .calendar .header.active .text{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}
  .months{width:100%;_height:450px;min-height:560px ;position:relative}
  .months .hr{height:1px;margin:15px 0;background:#ccc}
  .month{padding:15px;width:inherit;height:inherit;background:#fff;position:absolute;-webkit-backface-visibility:hidden;backface-visibility:hidden;transition:all .4s ease-in-out 0s;box-shadow:0 6px 20px 0 rgba(0,0,0,.19),0 8px 17px 0 rgba(0,0,0,.2)}
  .months[data-flow="left"] .month{-webkit-transform:rotateY(-180deg);transform:rotateY(-180deg)}
  .months[data-flow="right"] .month{-webkit-transform:rotateY(180deg);transform:rotateY(180deg)}
  .tablecalendar {width:100%;font-size:10px;font-weight:400;display:table}
  .tablecalendar .row{display:table-row;}
  .tablecalendar .row.head{color:#308ff0;text-transform:uppercase}
  .tablecalendar .row .cell{width:14.28%;padding:5px;text-align:center;display:table-cell;}
  .tablecalendar .row .cell.disable{color:#ccc}
  .tablecalendar .row .cell.border{border: #ccc 1px dashed}
  .tablecalendar .row .cell span{display:block;height:15px;line-height:12px;transition:color,background .4s ease-in-out 0s}
  .tablecalendar .row .cell.active span{color:#fff;background-color:#308ff0}
  .months .month[data-active="true"]{-webkit-transform:rotateY(0);transform:rotateY(0)}
  .header [data-action]{color:inherit;position:absolute;top:50%;margin-top:-20px;width:40px;height:40px;z-index:1;opacity:0;transition:all .4s ease-in-out 0s}
  .header [data-action]>i{width:20px;height:20px;display:block;position:absolute;left:50%;top:50%;margin-top:-10px;margin-left:-10px}
  .header [data-action]>i:before,.header [data-action]>i:after{top:50%;margin-top:-1px;content:'';position:absolute;height:2px;width:20px;border-top:2px solid;border-radius:2px}
  .header [data-action*="prev"]{left:15px}
  .header [data-action*="next"]{right:15px}
  .header [data-action*="prev"]>i:before,.header [data-action*="prev"]>i:after{left:0}
  .header [data-action*="prev"]>i:before{top:3px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}
  .header [data-action*="prev"]>i:after{top:auto;bottom:3px;-webkit-transform:rotate(45deg);transform:rotate(45deg)}
  .header [data-action*="next"]>i:before,.header [data-action*="next"]>i:after{right:0}
  .header [data-action*="next"]>i:before{top:auto;bottom:3px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}
  .header [data-action*="next"]>i:after{top:3px;-webkit-transform:rotate(45deg);transform:rotate(45deg)}
  .header.active [data-action]{opacity:1}

  [data-theme="01"] .row.head{color:#ff8d33}
  [data-theme="01"] .header .text,
  [data-theme="01"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  [data-theme="02"] .row.head{color:#ff8d33}
  [data-theme="02"] .header .text,
  [data-theme="02"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  [data-theme="03"] .row.head{color:#ff8d33}
  [data-theme="03"] .header .text,
  [data-theme="03"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  [data-theme="04"] .row.head{color:#ff8d33}
  [data-theme="04"] .header .text,
  [data-theme="04"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  [data-theme="05"] .row.head{color:#ff8d33}
  [data-theme="05"] .header .text,
  [data-theme="05"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  [data-theme="06"] .row.head{color:#ff8d33}
  [data-theme="06"] .header .text,
  [data-theme="06"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  [data-theme="07"] .row.head{color:#ff8d33}
  [data-theme="07"] .header .text,
  [data-theme="07"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  [data-theme="08"] .row.head{color:#ff8d33}
  [data-theme="08"] .header .text,
  [data-theme="08"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  [data-theme="09"] .row.head{color:#ff8d33}
  [data-theme="09"] .header .text,
  [data-theme="09"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  [data-theme="10"] .row.head{color:#ff8d33}
  [data-theme="10"] .header .text,
  [data-theme="10"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  [data-theme="11"] .row.head{color:#ff8d33}
  [data-theme="11"] .header .text,
  [data-theme="11"] .tablecalendar .row .cell.active span{background-color:#ff8d33}

  /* [data-theme="dec"]{background-color:#B0BEC5} */
  [data-theme="12"] .row.head{color:#ff8d33}
  [data-theme="12"] .header .text,
  [data-theme="12"] .tablecalendar .row .cell.active span{background-color:#ff8d33}
</style>

