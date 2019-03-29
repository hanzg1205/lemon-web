define(['mui','util'], function(mui,util) {
	let classifyBox = document.getElementById('classifyBox');
	let idx = 0;
	function init() {
		mui.init();
		// 绑定事件
		bindEvent();
		// 获取分类
		getClassify('支出');
	}

	function bindEvent() {
		let keyW = document.querySelector('.keyword');
		// 给所有按键绑定事件
		mui('.keyword').on('tap', 'p', keyWordFn);
		// 给所有类添加事件
		mui('#classifyBox').on('tap','dl',selectIcon);
		// 收入，支出切换
		mui('#navTab').on('tap','span',tab);
	}
	// 键盘
	function keyWordFn() {
		let inpBox = document.getElementById('inpBox');
		if (this.className === 'del') {
			inpBox.innerHTML = inpBox.innerHTML.slice(0, -1);
			if (inpBox.innerHTML === '') {
				inpBox.innerHTML = '0.00';
			}
		} else if (this.className === 'done') {
			// 记账
			// icon, type, money, title, common
			let classify = classifyBox.querySelector('.active').children;
			let icon = classify[0].className;
			let title = classify[1].innerHTML;
			let type = document.querySelector('#navTab .on').innerHTML;
			let money = inpBox.innerHTML;
			let common = localStorage.getItem('uID');
			// console.log(icon, type, money, title, common);
			mui.ajax('/bill/addBill',{
				type: 'post',
				data:{
					icon, type, money, title, common
				},
				success(rs){
					console.log(rs);
					if(rs.code){
						location.href = '../index.html';
					}
				}				
			});
		} else {
			if (inpBox.innerHTML === '0.00') {
				inpBox.innerHTML = this.innerHTML;
			} else {
				let idx = inpBox.innerHTML.indexOf('.');
				if (this.innerHTML === '.') {
					if (idx > -1) {
						return;
					}
				}
				if (idx > -1 && inpBox.innerHTML.slice(idx + 1).length >= 2) {
					return;
				}
				inpBox.innerHTML += this.innerHTML;
			}
		}
	}

	function getClassify(type) {
		mui.ajax('/classify/getClassify', {
			data: {
				type: type,
				common: localStorage.getItem('uID')
			},
			success(rs) {
				console.log(rs);
				// 渲染分类
				util.renderClassify({
					data: rs.data,
					type:'common'
				});
				// 初始化轮播
				mui('.mui-slider').slider();
			}
		})
	}

	function selectIcon(){
		if(this.className === "custom"){
			// console.log('自定义');
			location.href = 'custom.html';
		}else{
			let icon = document.querySelectorAll('#classifyBox dl');
			icon[idx].classList.remove('active');
			this.classList.add('active');
			idx = this.getAttribute('data-index')
		}	
	}
	// 收入，支出切换
	function tab(){
		this.parentNode.querySelector('.on').classList.remove('on');
		this.classList.add('on');
		getClassify(this.innerHTML);
	}
	init();
})
