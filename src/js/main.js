require.config({
    baseUrl: '/js/',
    paths: {
        'index': 'pages/index',
        'mui': 'libs/mui.min',
        'picker': 'libs/mui.picker.min',
        'addBill': 'pages/addBill',
		'custom': 'pages/custom',
		'util': 'common/util',
		'echarts': 'libs/echarts'
    },
    shim: {
        'picker': {
            deps: ['mui']
        }
    }
})