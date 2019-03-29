define(['mui','util'],function(mui,util){
	let curIcon = document.getElementById('curIcon');
	function init(){
		mui.init();
		// 获取自定义图标
		getCustom();
		bindEvent();
	}
	function getCustom(){
		mui.ajax('/classify/getCustom',{
			success(rs){
				console.log(rs);
				if(!rs.code){
					return;
				}
				util.renderClassify({
					data: rs.data,
					n:15,
					type:'custon'
				});
				// 初始化轮播
				mui('.mui-slider').slider();
			}
		})
	}
	function bindEvent(){
		mui('#classifyBox').on('tap','dl',iconBtnFn);
	}
	function iconBtnFn(){
		curIcon.className = this.children[0].className;
	}
	init();
})