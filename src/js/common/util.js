define(function() {
	return {
		renderClassify(opt) {
			const {
				data,
				n = 8,
				pageation = '#pageation',
				classifyBox = '#classifyBox',
				type
			} = opt;
			let len = Math.ceil((data.length + 1) / n);
			let html = '';
			let pageStr = '';
			let page = document.querySelector(pageation);
			let classBox = document.querySelector(classifyBox);
			for (let i = 0; i < len; i++) {
				let start = i * n;
				let iconData = data.slice(start, (start + n));
				html +=
					`<div class="mui-slider-item">
							<section class="classify">${this.renderList(iconData,n,i,type)}</section>
						</div>`;
				pageStr += `<div class="mui-indicator ${i==0?'mui-active':''}"></div>`;
			}
			classBox.innerHTML = html;
			page.innerHTML = pageStr;
		},

		renderList(data, n, i,type) {
			let str = data.map((item, index) => {
				return `<dl class="${(i===0 && index=== 0) ? 'active' : ''}" data-index="${i*n+index}">
							<dt class="${item.icon}"></dt>
							${type === 'common'?`<dd>${item.title}</dd>`:''}							
						</dl>`
			}).join('');
			if (data.length < n && type === 'common') {
				str += `<dl class="custom">
							<dt class="mui-icon iconfont icon-jia"></dt>
							<dd>自定义</dd>
						</dl>`
			}
			return str;
		},
		// 格式化数据
		formate(data,key){
			let obj = {};
			data.forEach(item => {
				if (!obj[item[key]]) {
					obj[item[key]] = [];
				}
				obj[item[key]].push(item);
			})
			return obj;
		}
			
	}
})
