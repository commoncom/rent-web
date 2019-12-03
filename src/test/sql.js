CREATE TABLE `house_addr_map_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addr` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '地址',
  `house_addr` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '地址',
  `huxing` int NOT NULL DEFAULT 0 COMMENT '房屋评级等级',
  `des` text COMMENT '房屋描述',
  `info` text COMMENT '房东介绍',
  `tenancy` int NOT NULL DEFAULT 0 COMMENT '租期',
  `rental` int NOT NULL DEFAULT 0 COMMENT '租金',
  `hope_you` text COMMENT '期待的你',
  `house_state` int NOT NULL DEFAULT 0 COMMENT '房屋状态',
  `tx_hash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '交易Hash',
  `house_hash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '房屋hash',
  `createtime` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '创建时间',
  `updatetime` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;