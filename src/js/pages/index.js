define(['mui', 'echarts', 'util', 'picker'], (mui, echarts,util) => {
	let picker = null;
	let dtPicker = null;
	let timeType = document.getElementById('timeType');
	let timeVal = document.getElementById('timeVal');
	let billM = document.getElementById('billM');
	let billY = document.getElementById('billY');
	let now = new Date();
	let time = {
		y: now.getFullYear(),
		m: now.getMonth() + 1,
		d: now.getDate()
	}
	// 本地存储取用户ID
	let uID = localStorage.getItem('uID');
	if (!uID) {
		localStorage.setItem('uID', '5c9330ee5bfcda73b5b90d68');
	}

	function init() {
		mui.init();
		addEvent();
		// 初始化日期时间
		timeVal.children[0].innerText = time.y + '-' + time.m;
		// 初始化日期类型
		picker = new mui.PopPicker();
		picker.setData([{
			value: 'y',
			text: '月'
		}, {
			value: 'm',
			text: '年'
		}]);
		// 初始化日期选择器
		dtPicker = new mui.DtPicker({
			type: 'month',
			endDate: new Date()
		});
		// tab切换账单，图表
		tab();
		// 初始化scroll控件
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005
		});
		// 查询账单
		getBill();
		// 点击显示侧栏
		let menuIcon = document.querySelector('#menuIcon');
		menuIcon.addEventListener('tap',function(){
			mui('.mui-off-canvas-wrap').offCanvas('show');
		})
		// 禁止侧栏滑动
		let offCanvasInner = document.querySelector('.mui-inner-wrap');  
		offCanvasInner.addEventListener('drag', function(event) {  
			event.stopPropagation();  
		}); 
		// 查询侧导航分类
		getClassifyMenu();
		// 侧导航分类绑定事件
		mui('#menuBox').on('tap','span',sTag);
		// 侧栏确定按钮绑定事件
		let confirm = document.getElementById('confirm');
		confirm.addEventListener('tap',confirmFn);
	}
	// 侧栏确定按钮绑定事件
	function confirmFn(){
		// 隐藏侧栏
		mui('.mui-off-canvas-wrap').offCanvas('close');
		let title = [...document.querySelectorAll('#menuBox .active:not([data-id])')].map(item => {
			return item.innerHTML;
		});
		mui.ajax('/bill/getBill',{
			type: 'post',
			data: {
				common: localStorage.getItem('uID'),
				time: timeVal.children[0].innerHTML,
				title: JSON.stringify(title)
			},
			success(rs){
				// console.log(rs);
				if(rs.code){
					renderBillMonth(formateData(rs.data, 'm'));
				}
			}
		})
	}
	// 侧导航分类绑定事件
	function sTag(){
		let menuBox = document.getElementById('menuBox');
		this.classList.toggle('active');
		let spanId = this.getAttribute('data-id');
		if(spanId){
			[...menuBox.querySelector('div[data-id="'+spanId+'"]').children].forEach(item => {
				item.classList.toggle('active');
			})
		}
		let divId = this.parentNode.getAttribute('data-id');
		let flag;
		if(divId){
			flag = [...this.parentNode.children].every(item => {
				return item.className == 'active';
			})
			console.log(flag);
			if(flag){
				menuBox.querySelector('span[data-id="'+divId+'"]').classList.add('active');
			}else{
				menuBox.querySelector('span[data-id="'+divId+'"]').classList.remove('active');
			}
		}			
	}
	// 查询侧导航分类
	function getClassifyMenu(){
		mui.ajax('/classify/getClassify',{
			success(rs){
				console.log(rs);
				if(rs.code){
					let menuOut = document.getElementById('menuOut');
					let menuIn = document.getElementById('menuIn');
					// 格式化数据
					let data = util.formate(rs.data,'type');
					for(let k in data){
						let box = k === '支出' ? menuOut : menuIn;
						renderMenu(data[k], box);
					}
				}
			}
		})
	}
	// 渲染侧导航
	function renderMenu(data, box){
		box.innerHTML = data.map(item => {
			return `<span>${item.title}</span>`;
		}).join('');
	}
	function addEvent() {
		timeType.addEventListener("tap", () => {
			picker.show(function(selectItems) {
				timeType.children[0].innerText = selectItems[0].text;
				if (timeType.children[0].innerText === '年') {
					timeVal.children[0].innerText = time.y;
					billM.classList.add('hide');
					billY.classList.remove('hide');
				} else {
					timeVal.children[0].innerText = time.y + '-' + time.m;
					billY.classList.add('hide');
					billM.classList.remove('hide');
				}

			})
		})

		timeVal.addEventListener("tap", () => {
			let monthList = document.querySelector('div[data-id="picker-m"]');
			let yearList = document.querySelector('div[data-id="picker-y"]');
			let monthTitle = document.querySelector('h5[data-id="title-m"]');
			let yearTitle = document.querySelector('h5[data-id="title-y"]');

			if (timeType.children[0].innerText === '年') {
				changeTime('none', '100%');
			} else {
				changeTime('inline-block', '50%');
			}
			dtPicker.show(function(selectItems) {
				console.log(selectItems.y); //{text: "2016",value: 2016} 
				console.log(selectItems.m); //{text: "05",value: "05"} 
				if (timeType.children[0].innerText === '年') {
					timeVal.children[0].innerText = selectItems.y.text;
				} else {
					timeVal.children[0].innerText = selectItems.text;
				}
			})

			function changeTime(d, w) {
				monthList.style.display = d;
				monthTitle.style.display = d;
				yearList.style.width = w;
				yearTitle.style.width = w;
			}
		})

	}

	function tab() {
		let idx = 0;
		let tabs = document.querySelectorAll('#tabMenu>span');
		let cons = document.querySelectorAll('.bill-scroll>div');
		mui('#tabMenu').on('tap', 'span', function() {
			tabs[idx].classList.remove('active');
			cons[idx].classList.add('hide');
			idx = this.getAttribute("data-index");
			this.classList.add('active');
			cons[idx].classList.remove('hide');
		})
	}
	// 查询账单
	function getBill() {
		mui.ajax('/bill/getBill', {
			type: 'post',
			data: {
				common: localStorage.getItem('uID'),
				time: timeVal.children[0].innerHTML
			},
			success(rs) {
				// 渲染月账单
				renderBillMonth(formateData(rs.data, 'm'));
				// 创建echarts图表
				echartsFn(rs.data);
			}
		})
	}
	// 格式化数据
	function formateData(data, type) {
		let obj = {};
		data.forEach(item => {
			let key = type === "y" ? item.time.match(/-(\d{1,2})-/)[1] : item.time;
			if (!obj[key]) {
				obj[key] = [];
			}
			obj[key].push(item);
		})
		return obj;
	}
	// 渲染月账单
	function renderBillMonth(data) {
		let str = '';
		let times = '';
		for (let k in data) {
			let sum = 0;
			let liStr = data[k].map(item => {
				if (item.type === "支出") {
					sum += item.money * 1;
				}
				times = item.time.slice(5).replace('-', '月') + '日';
				return `<li class="mui-table-view-cell list_m_box">
							<div class="mui-slider-right mui-disabled">
								<a class="mui-btn mui-btn-red">删除</a>
							</div>
							<div class="mui-slider-handle list_m">
								<div><i class="${item.icon}"></i>${item.title}</div>								
								<span class="price ${item.type === '收入'?'green':''}">${item.money}</span>
							</div>
						</li>`;
			}).join('');
			str +=
				`<h3>
						<p><i></i>${times}</p>
						<p>总消费 <span>${sum}</span></p>
					</h3>
					<ul class="mui-table-view">${liStr}</ul>`;
		};
		billM.innerHTML = str;
	}

	function echartsFn(chartData) {
		console.log(chartData);
		let arr = [];
		chartData.forEach(item => {
			let obj = {};
			obj.value = item.money;
			obj.name = item.title;
			arr.push(obj);
		})
		let main = document.getElementById('main');
		main.style.width = document.documentElement.clientWidth-10 + 'px';
		let myChart = echarts.init(main);	
		let option = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			series: [{
					name:'访问来源',
					type: 'pie',
					selectedMode: 'single',
					radius: '20%',

					label: {
						normal: {
							position: 'inner'
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: [{
						value: 335,
						name: '直达'
					}]
				},
				{
					name: '访问来源',
					type: 'pie',
					radius: ['30%', '42%'],
					label: {
						normal: {
							formatter: '{b|{b}：}{per|{d}%}  ',
							rich: {
								b: {
									fontSize: 12,
									lineHeight: 34
								}
							}
						}
					},
					data: arr
				}
			]
		};
		myChart.setOption(option);
	}

	init();
})
