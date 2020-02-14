export const UrlConfig = {
  serverUrl: "http://192.168.218.186:8080"
}

export const OPTION_TYPE = [{
		value: '0',
		label: '发布中'
	}, {
		value: '1',
		label: '请求租赁中'
	}, {
		value: '2',
		label: '租赁中'
	}, {
		value: '3',
		label: '完成租赁'
	}, {
		value: '4',
		label: '取消租赁'
	}, {
		value: '5',
		label: '毁约审核中' 
	}, {
		value: '6',
		label: '已毁约' 
	}
];

export const APPROVE_STATUS = {
	0: "未授权",
	1: "已授权",
	2: "拒绝授权"
}

export const COMMENT_REMARK = {
	0: 'R1',
	1: 'R2',
	2: 'R3',
	3: 'R4',
	4: 'R5'
}

export const SIGN_STATUS = {
	0: "等待租户签约",
	1: "合同签约完成",
	2: "合同已生效",
	3: "租赁到期",
	4: "取消租赁",
	5: "毁约审核中",
	6: "已毁约",
	7: "房东已评论",
	8: "租户已评论",
	9: "拒绝毁约"
}

export const RELATION_TYPE = [{
		value: '1',
		label: '我是租户'
	}, {
		value: '2',
		label: '我是房东'
	}]

export const TOKEN_TYPE = [{
		value: '1',
		label: 'Eth'
	}, {
		value: '2',
		label: 'RentToken'
	}
];