export const UrlConfig = {
  serverUrl: "http://192.168.218.169:8080"
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
		label: '解除租赁' 
	}, {
		value: '5',
		label: '取消租赁'
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
	2: "合同已生效"
}