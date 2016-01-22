services.factory("RoleType", function() {
  var Type = {};

  var classifications = {
    identity: [
      "免费用户",
      "付费用户",
      "内部员工"
    ],
    role: [
      "试用期用户",
      "已过试用期用户",
      "购买基础版本用户",
      "购买私募基金数据用户",
      "购买咨询版本用户",
      "购买研究报告分析用户",
      "购买大数据分析用户",
      "产品设计人员",
      "开发人员",
      "测试人员"
    ],
    occupation: [
      "产品经理",
      "金融研究员",
      "经纪人",
      "开发工程师",
      "职业炒股人",
      "自由职业者"
    ],
    managerRole: [
      "产品经理",
      "产品设计师",
      "需求人员",
      "开发人员",
      "测试人员",
      "管理层"
    ]
  };


  Type.getType = function() {
    return classifications;
  };

  return Type;
});