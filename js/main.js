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

const getQueryString = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
};

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

if(getQueryString("contestId") == null || !/^\d+$/.test(getQueryString("contestId")))
	alert("参数错误！");
else{
// main body
let contestId = Number(getQueryString("contestId"));
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
			let problemCount = json.contest.contestProblems.length;
			let problemScore = {};
			for(let i=0; i<problemCount; i++)
				problemScore[json.contest.contestProblems[i].problem.pid] = json.contest.contestProblems[i].score;
			$(".contestTitleName > span").html(json.contest.name);
			$(".contestTitleTimes > div").eq(0).html(`${startTime.pattern("yyyy/MM/dd hh:mm")} <i class='fas fa-angle-right'></i> ${endTime.pattern("yyyy/MM/dd hh:mm")}`);
			var timeInteval = setInterval(() => {
				var curTime = (new Date()).getTime();
				var stTime = startTime.getTime();
				var edTime = endTime.getTime();
				var p = curTime - stTime;
				var dur = edTime - stTime;
				p = Math.max(0, Math.min(dur, p));
				p /= dur;
				$(".contestProgress").css("width", `${p * 100}%`).css("background", getColorFromPercent(p, 1));
				if(curTime <= stTime)
					$(".contestTitleTimes > div").eq(1).html(`比赛距开始还有 ${remainCount(stTime - curTime)}`);
				else if(curTime <= edTime)
					$(".contestTitleTimes > div").eq(1).html(`比赛距结束还有 ${remainCount(stTime - curTime)}`);
				else{
					$(".contestTitleTimes > div").eq(1).html(`比赛已经结束`)
					clearInterval(timeInteval);
				}
			}, 1000);
			var startContestInterval = setInterval(() => {
				var curTime = (new Date()).getTime();
				var stTime = startTime.getTime();
				if(curTime > stTime){
					clearInterval(startContestInterval);
					var reloadStandingsInterval = setInterval(() => {
						var curTime = (new Date()).getTime();
						var edTime = endTime.getTime();
						if(curTime > edTime)
							clearInterval(reloadStandingsInterval);
						$.ajax({
							url: `https://www.luogu.com.cn/contest/${contestId}`,
							headers: {
							    "x-luogu-type": "content-only"
							},
							success: (json) => {
								json = json.scoreboard;
								if(json == undefined)
									return;
							},
							error: () => {}
						})
					}, 30000);
				}
			}, 1000);
			var flushContestInfoInterval = setInterval(() => {
				var curTime = (new Date()).getTime();
				var edTime = endTime.getTime();
				if(curTime > edTime)
					clearInterval(flushContestInfoInterval);
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
						problemCount = json.contest.contestProblems.length;
						problemScore = {};
						for(let i=0; i<problemCount; i++)
							problemScore[json.contest.contestProblems[i].problem.pid] = json.contest.contestProblems[i].score;
						$(".contestTitleName > span").html(json.contest.name);
						$(".contestTitleTimes > div").eq(0).html(`${startTime.pattern("yyyy/MM/dd hh:mm")} <i class='fas fa-angle-right'></i> ${endTime.pattern("yyyy/MM/dd hh:mm")}`);
					},
					error: () => {}
				})
			}, 180000);
		}
	},
	error: (e) => {
		alert("无法获取比赛信息。");
	}
})

}