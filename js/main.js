var DefaultStyle = JSON.parse(JSON.stringify(Highcharts.getOptions()));
// DefaultStyle.chart.style = {};
DefaultStyle.chart.backgroundColor = {color: "#ddd"};
// DefaultStyle.chart.style.fontFamily = "var(--font-family)";
DefaultStyle.xAxis = {gridLineColor: "#ccd6eb",labels: {style: {color: '#666'}},lineColor: '#bbb',minorGridLineColor: '#ccd6eb',tickColor: '#ccd6eb',};
DefaultStyle.yAxis = {tickWidth: 1, gridLineColor: "#ccd6eb",labels: {style: {color: '#666'}},lineColor: '#ccd6eb',minorGridLineColor: '#ccd6eb',tickColor: '#ccd6eb',};
DefaultStyle.plotOptions.series = {dataLabels: {color: '#000',style: {fontSize: '13px'}},marker: {lineColor: '#fff'}};
Highcharts.setOptions(DefaultStyle);
Highcharts.setOptions({
    colors: ['#bbb', '#c2c2c2', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655',
'#FFF263', '#6AF9C4']
});
var rankChart = null;
function generateRankGraph(rankData, stTime, edTime, maxCount){
	if(rankChart != null){
		rankChart.destroy();
		rankChart = null;
	}
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});
	$("#highchartsInterface").css("display", "block");
	var chart = {
		type: 'area',
		margin: [0, 0, 0, 0],
		animation: false
	};
	var xAxis = {
		lineWidth: 0,
        tickWidth: 0,
        min: stTime.getTime(),
        max: edTime.getTime(),
		labels: {
			enabled: false
		},
		type: 'datetime',
		dateTimeLabelFormats: {
			millisecond: '%H:%M:%S.%L',
			second: '%H:%M:%S',
			minute: '%H:%M',
			hour: '%H:%M',
			day: '%m-%d',
			week: '%m-%d',
			month: '%Y-%m',
			year: '%Y'
		}
	};
	var yAxis = {
		lineWidth: 0,
		gridLineWidth: 0,
		tickWidth: 0,
		min: 0,
		max: maxCount,
		labels: {
			enabled: false
		},
		title: {
			text: null
		},
		plotLines: [],
		dateTimeLabelFormats: {
			millisecond: '%H:%M:%S.%L',
			second: '%H:%M:%S',
			minute: '%H:%M',
			hour: '%H:%M',
			day: '%Y-%m-%d',
			week: '%m-%d',
			month: '%Y-%m',
			year: '%Y'
		},
	};
	var title = {
		text: null
	};
	var tooltip = {
		borderRadius: 5,
		formatter: function () {
		return `<b>五分钟评测量：` + this.y + '</b>（' +
			Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '）';
		}
	};
	var plotOptions = {
		area: {
			pointStart: 1940,
			marker: {
				enabled: false,
				symbol: 'circle',
				radius: 2,
				states: {
					hover: {
					  enabled: true
					}
				}
			},
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, new Highcharts.getOptions().colors[1]],
					[1, new Highcharts.getOptions().colors[1]]
				]
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 1
				}
			},
			threshold: null
		}
	};
	var legend = {
		enabled: false
	};
	var exporting = {
		enabled: false
	};
	var series= [{
		name: 'rankData',
		data: rankData
	}];
	var credits = {
		enabled: false
	}
	var json = {};
	json.chart = chart; 
	json.title = title;	  
	json.tooltip = tooltip;
	json.xAxis = xAxis;
	json.yAxis = yAxis; 
	json.legend = legend;  
	json.exporting = exporting;	
	json.series = series;
	json.plotOptions = plotOptions;
	json.credits = credits;
	rankChart = Highcharts.chart("highchartsInterface", json);
}

const getColorFromPercent = (x, opa) => {
	let r = 0, g = 0, b = 0;
	let rr = 231, gg = 76, bb = 60;
	let rrr = 82, ggg = 196, bbb = 26;
	// if(x < 0.5){
	// 	r = 255;
	// 	g = one * x;
	// }
	// else{
	// 	r = 255 - ((x - 0.5) * one);
	// 	g = 255;
	// }
	r = rr + (rrr - rr) * x;
	g = gg + (ggg - gg) * x;
	b = bb + (bbb - bb) * x;
	r += (255 - r) * (1 - opa);
	g += (255 - g) * (1 - opa);
	b += (255 - b) * (1 - opa);
	r = Math.floor(r);
	g = Math.floor(g);
	b = Math.floor(b);
	return `rgb(${r}, ${g}, ${b})`;
};

$(".contestTitle").css("background", getColorFromPercent(0, 0.25));

// const getQueryString = (name) => {
//     let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
//     let r = window.location.search.substr(1).match(reg);
//     if (r != null)
//         return decodeURIComponent(r[2]);
//     return null;
// };

Date.prototype.pattern = function(format) {
	var date = {
		"y+": this.getYear(),
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1
			  ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
};
const remainCount = (x) => {
	x = Math.floor(x / 1000);
	var ret = "";
	ret = "" + Math.floor(x % 60 / 10) + (x % 10) + ret;
	x = Math.floor(x / 60);
	ret = ":" + ret;
	ret = "" + Math.floor(x % 60 / 10) + (x % 10) + ret;
	x = Math.floor(x / 60);
	ret = ":" + ret;
	ret = "" + Math.floor(x % 24 / 10) + (x % 24 % 10) + ret;
	x = Math.floor(x / 24);
	if(x != 0)
		ret = "" + x + "天 " + ret;
	return ret;
};
const remainCount2 = (x) => {
	x = Math.floor(x / 60);
	var ret = "";
	ret = "" + Math.floor(x % 60 / 10) + (x % 10) + ret;
	x = Math.floor(x / 60);
	ret = ":" + ret;
	ret = "" + Math.floor(x % 24 / 10) + (x % 24 % 10) + ret;
	x = Math.floor(x / 24);
	if(x != 0)
		ret = "" + x + "d " + ret;
	return ret;
};
const runTime = (x) => {
	if(x <= 1000)
		return x + "ms";
	return (x / 1000).toFixed(2) + "s";
};
let contestId = "";
nw.Window.get().maximize();
do{
	contestId = prompt("请输入洛谷比赛 ID");
}while((contestId == null || !/^\d+$/.test(contestId)));
// main body
nw.Window.open("https://www.luogu.com.cn/auth/login", {}, function(x){

x.setAlwaysOnTop(true);
x.setAlwaysOnTop(false);
x.focus();


x.on('closed', function(){

$.ajax({
	url: `https://www.luogu.com.cn/contest/${contestId}`,
	headers: {
	    "x-luogu-type": "content-only"
	},
	type: "GET",
	success: (json) => {
		if(json.code != 200)
			alert("比赛未公开！");
		else{
			json = json.currentData;
			let contestType = json.contest.ruleType;
			let startTime = new Date(json.contest.startTime * 1000);
			let endTime = new Date(json.contest.endTime * 1000);
			let problemCount = "";
			let problemScore = {};
			let problemsetInfo = [];
			let previousRank = {};
			let userStorage = {};
			if(json.contestProblems != null){
				problemCount = json.contestProblems.length;
				problemScore = {};
				problemsetInfo = json.contestProblems;
				for(let i=0; i<problemCount; i++)
					problemScore[json.contestProblems[i].problem.pid] = json.contestProblems[i].score;
			}
			function setIntervalImmediately(func, milis, chk = false){
				func();
				if(chk == 2 && (new Date()).getTime() > startTime.getTime())
					return null;
				if(chk == true && (new Date()).getTime() > endTime.getTime())
					return null;
				return setInterval(func, milis);
			}
			var fbWAitingList = {};
			function getFbUsername(uid){
				if(userStorage[uid] != undefined)
					return `<div class="contestFbUsername user${userStorage[uid].color}">${userStorage[uid].name}</div>`;
				if(fbWAitingList[uid] == undefined)
					$.ajax({
						url: `https://www.luogu.com.cn/user/${uid}`,
						type: "GET",
						headers: {
						    "x-luogu-type": "content-only"
						},
						success: (json) => {
							if(json.code == 200){
								json = json.currentData.user;
								userStorage[json.uid] = json;
								$(`[unk-uid=${uid}]`).prop("outerHTML", `<div class="contestFbUsername user${json.color}">${json.name}</div>`);
							}
						}
					});
				fbWAitingList[uid] = true;
				return `<div class="contestFbUsername userGray" unk-uid="${uid}">User #${uid}</div>`;
			}
			$(".contestTitleName > span").html(json.contest.name);
			$(".contestTitleTimes > div").eq(0).html(`${startTime.pattern("yyyy/MM/dd hh:mm")} <i class='fas fa-angle-right'></i> ${endTime.pattern("yyyy/MM/dd hh:mm")}`);
			var timeInteval = setIntervalImmediately(() => {
				var curTime = (new Date()).getTime();
				var stTime = startTime.getTime();
				var edTime = endTime.getTime();
				var p = curTime - stTime;
				var dur = edTime - stTime;
				p = Math.max(0, Math.min(dur, p));
				p /= dur;
				$(".contestProgress").css("width", `${p * 100}%`).css("background", getColorFromPercent(p, 1));
				$(".contestTitle").css("background", getColorFromPercent(p, 0.25));
				if(curTime <= stTime)
					$(".contestTitleTimes > div").eq(1).html(`距开始还有 ${remainCount(stTime - curTime)}`);
				else if(curTime <= edTime)
					$(".contestTitleTimes > div").eq(1).html(`距结束还有 ${remainCount(edTime - curTime)}`);
				else{
					$(".contestTitleTimes > div").eq(1).html(`比赛已经结束`);
					clearInterval(timeInteval);
				}
			}, 1000);
			const flushMainPage = (fbU, json) => {
				$("thead tr").html("");
				$("thead tr").append(`<td class="rankDiff"></td><td class="rankInfo">排名</td><td class="nameList">用户名</td><td class="overallScore">总分</td>`);
				for(var i=0; i<problemCount; i++)
					$("thead tr").append(`<td class="scoreCell">${String.fromCharCode(i + 65)}</td>`);
				$("tbody").html("");
				var firstCalc = false;
				if(Object.keys(previousRank).length == 0)
					firstCalc = true;
				var newRankInfo = {};
				for(var i=0; i<json.length; i++){
					var t = json[i];
					userStorage[t.user.uid] = t.user;
					newRankInfo[t.user.uid] = i + 1;
					var q = $("<tr></tr>");
					var curRnk = i + 1;
					if(firstCalc){
						q.append("<td></td>");
					}
					else{
						if(previousRank[t.user.uid] == undefined)
							q.append("<td><span class='green'><i class='fas fa-arrow-trend-up'></i></span></td>");
						else{
							var las = previousRank[t.user.uid];
							if(las == curRnk)
								q.append("<td><span><i class='fas fa-minus'></i></span></td>");
							else if(las > curRnk)
								q.append(`<td><span class='green'><i class='fas fa-caret-up'></i> ${las - curRnk}</span></td>`);
							else
								q.append(`<td><span class='red'><i class='fas fa-caret-down'></i> ${curRnk - las}</span></td>`);
						}
					}
					q.append(`<td>#${curRnk}</td>`);
					q.append(`<td><span class='user${t.user.color}'>${t.user.name}</span></td>`);
					q.append(`<td class="scoreCell"><span style="line-height: 1.2em">${t.score}</span><br/><span style="line-height: 1em; font-size: 14px; color: grey">(${contestType == 2 ? remainCount2(t.runningTime) : runTime(t.runningTime)})</span></td>`);
					for(var j=0; j<problemCount; j++){
						var pinfo = problemsetInfo[j].problem.pid;
						var sco = problemScore[pinfo];
						var pfb = (fbU != null && fbU[pinfo] == t.user.uid);
						pinfo = t.details[pinfo];
						if(pinfo == undefined)
							q.append("<td class='scoreCell'></td>");
						else{
							var firstInfo = "";
							if(contestType == 2){
								if(pinfo.score < 0)
									firstInfo = `<div class="acmScoreCell dangerColor">${-pinfo.score}</div>`;
								else
									firstInfo = `<div class="acmScoreCell successColor">${pinfo.score == 0 ? "&nbsp;" : pinfo.score}</div>`;
							}
							else{
								var col = pinfo.score / sco;
								firstInfo = `<span style="font-weight: bold; color: ${getColorFromPercent(col, 1)}">${pinfo.score}</span>`;
							}
							if(pinfo.runningTime == undefined)
								q.append(`<td class='scoreCell ${pfb ? "firstBlood" : ""}'><span style="line-height: 1.2em">${firstInfo}</span></td>`);
							else
								q.append(`<td class='scoreCell ${pfb ? "firstBlood" : ""}'><span style="line-height: 1.2em">${firstInfo}</span><br/><span style="line-height: 1em; font-size: 14px; color: grey">(${contestType == 2 ? remainCount2(pinfo.runningTime) : runTime(pinfo.runningTime)})</span></td>`);
						}
					}
					$("tbody").append(q);
				}
				previousRank = newRankInfo;
				$(".contestFb").html(`<div class="contestFbTitle">一血记录</div>`);
				for(var i=0; i<problemCount; i+=3){
					var r = Math.min(problemCount - 1, i + 2);
					var lis = $("<div class='contestFbList'></div>");
					for(var j=i; j<=r; j++){
						var t = undefined;
						if(fbU != null)
							t = fbU[problemsetInfo[j].problem.pid];
						if(t == null)
							t = undefined;
						let q = $(`<div class='contestFbContent'>
							<div class="contestFbProblemId ${t == undefined ? "loadingColor" : "successColor"}"><i class='fas fa-${String.fromCharCode(j + 97)}'></i></div>
							${t == undefined ? `<div class='contestFbUsername userGray'>N/A</div>` : getFbUsername(t)}
							</div>`);
						lis.append(q);
					}
					$(".contestFb").append(lis);
				}
				setTimeout(() => {
					var leng = $("table").height() - $(".contestContent").height();
					if(leng >= 0){
						setTimeout(() => {
							$(".contestContent").animate({
								scrollTop: leng / 5 * (0+1)
							}, 500);
						}, 0 * 3000);
						setTimeout(() => {
							$(".contestContent").animate({
								scrollTop: leng / 5 * (1+1)
							}, 500);
						}, 1 * 3000);
						setTimeout(() => {
							$(".contestContent").animate({
								scrollTop: leng / 5 * (2+1)
							}, 500);
						}, 2 * 3000);
						setTimeout(() => {
							$(".contestContent").animate({
								scrollTop: leng / 5 * (3+1)
							}, 500);
						}, 3 * 3000);
						setTimeout(() => {
							$(".contestContent").animate({
								scrollTop: leng / 5 * (4+1)
							}, 500);
						}, 4 * 3000);
						setTimeout(() => {
							$(".contestContent").animate({
								scrollTop: leng / 5 * 0
							}, 500);
						}, 5 * 3000);
					}
				}, 3000);
			};
			var startContestInterval = setIntervalImmediately(() => {
				var curTime = (new Date()).getTime();
				var stTime = startTime.getTime();
				var clrInt = false;
				if(curTime > stTime){
					clearInterval(startContestInterval);
					clearInterval(flushContestInfoInterval);
					var reloadStandingsInterval = setIntervalImmediately(() => {
						if(clrInt){
							clearInterval(reloadStandingsInterval);
							return;
						}
						var curTime = (new Date()).getTime();
						var edTime = endTime.getTime();
						if(curTime > edTime){
							clrInt = true;
							// clearInterval(reloadStandingsInterval);
						}
						$.ajax({
							url: `https://www.luogu.com.cn/contest/${contestId}`,
							headers: {
							    "x-luogu-type": "content-only"
							},
							type: "GET",
							success: function(json){
								if(json.code != 200)
									return;
								json = json.currentData;
								contestType = json.contest.ruleType;
								startTime = new Date(json.contest.startTime * 1000);
								endTime = new Date(json.contest.endTime * 1000);
								if(json.contestProblems != null){
									problemCount = json.contestProblems.length;
									problemScore = {};
									problemsetInfo = json.contestProblems;
									for(let i=0; i<problemCount; i++)
										problemScore[json.contestProblems[i].problem.pid] = json.contestProblems[i].score;
								}
								$(".contestTitleName > span").html(json.contest.name);
								$(".contestTitleTimes > div").eq(0).html(`${startTime.pattern("yyyy/MM/dd hh:mm")} <i class='fas fa-angle-right'></i> ${endTime.pattern("yyyy/MM/dd hh:mm")}`);
								$.ajax({
									url: `https://www.luogu.com.cn/fe/api/contest/scoreboard/${contestId}`,
									headers: {
									    "x-luogu-type": "content-only"
									},
									success: (json) => {
										let fbU = json.firstBloodUID;
										json = json.scoreboard;
										if(json == undefined)
											return;
										json = json.result;
										flushMainPage(fbU, json);
									},
									error: () => {
										alert("无法获取排行榜！");
									}
								})
							},
							error: () => {}
						})
					}, 30000, true);
				}
			}, 1000, 2);
			var flushContestInfoInterval = setIntervalImmediately(() => {
				$.ajax({
					url: `https://www.luogu.com.cn/contest/${contestId}`,
					headers: {
					    "x-luogu-type": "content-only"
					},
					type: "GET",
					success: function(json){
						if(json.code != 200)
							return;
						json = json.currentData;
						contestType = json.contest.ruleType;
						startTime = new Date(json.contest.startTime * 1000);
						endTime = new Date(json.contest.endTime * 1000);
						if(json.contestProblems != null){
							problemCount = json.contestProblems.length;
							problemScore = {};
							for(let i=0; i<problemCount; i++)
								problemScore[json.contestProblems[i].problem.pid] = json.contestProblems[i].score;
						}
						$(".contestTitleName > span").html(json.contest.name);
						$(".contestTitleTimes > div").eq(0).html(`${startTime.pattern("yyyy/MM/dd hh:mm")} <i class='fas fa-angle-right'></i> ${endTime.pattern("yyyy/MM/dd hh:mm")}`);
					},
					error: () => {}
				})
				var curTime = (new Date()).getTime();
				var edTime = endTime.getTime();
				if(curTime > startTime){
					clearInterval(flushContestInfoInterval);
					return;
				}
			}, 60000);
			const compileInfoCount = 300 * 1000 / 15000;
			var compileTaskList = [];
			for(var i=0; i<compileInfoCount; i++)
				compileTaskList.push(0);
			var maxCompileTaskCount = 0, maxCompileTaskTime = new Date();
			var lastCompileId = -1;
			var plotMax = 0;
			var chartInfo = [];
			const reloadCompileTasks = (x) => {
				for(var i=1; i<compileInfoCount; i++)
					compileTaskList[i-1] = compileTaskList[i];
				compileTaskList[compileInfoCount - 1] = x;
				var ret = 0;
				for(var i=0; i<compileInfoCount; i++)
					ret += compileTaskList[i];
				if(ret > maxCompileTaskCount)
					maxCompileTaskCount = ret, maxCompileTaskTime = new Date();
				var t = new Date();
				if(t.getTime() >= startTime.getTime() && t.getTime() <= endTime.getTime()){
					chartInfo.push([t.getTime(), ret]);
					plotMax = Math.max(plotMax, ret);
					generateRankGraph(chartInfo, startTime, endTime, plotMax);
				}
				return ret;
			}
			var flushCompileInfoInterval = setIntervalImmediately(() => {
				$.ajax({
					url: `https://www.luogu.com.cn/record/list`,
					headers: {
					    "x-luogu-type": "content-only"
					},
					type: "GET",
					success: function(json){
						if(json.code != 200)
							return;
						json = json.currentData;
						if(json.hack == true){
							$(".contestCompileInfo").html("没有评测量获取权限");
						}
						else{
							json = json.records;
							var cnt = 0;
							if(lastCompileId != -1)
								cnt = Number(json.count) - lastCompileId;
							lastCompileId = Number(json.count);
							var ret = reloadCompileTasks(cnt);
							$(".contestCompileInfo").html(`<b>五分钟评测量：</b>当前 - ${ret} 最高 - ${maxCompileTaskCount}（${maxCompileTaskTime.pattern("yyyy/MM/dd hh:mm:ss")}）`);
						}
					},
					error: () => {
						lastCompileId = -1;
						var ret = reloadCompileTasks(0);
						$(".contestCompileInfo").html(`<b>五分钟评测量：</b>当前 - 网络错误 最高 - ${maxCompileTaskCount}（${maxCompileTaskTime.pattern("yyyy/MM/dd hh:mm:ss")}）`);
					}
				})
			}, 15000);
		}
	},
	error: (e) => {
		alert("无法获取比赛信息。");
	}
})

})

})
