export const HEALT_CHECK = {
  AUTH: 'HC_AUTH',
  USERS: 'HC_USER',
  PACKAGE_MGMT: 'HC_PACKAGE_MGMT',
};

export const AUTH = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
};

export const USERS = {
  CREATE: 'createUser',
  GET_INFO_BY_ID: 'getUserInfoById',
  GET_SETTING_BY_ID: 'getUserSettingById',
  GET_ALL: 'getAllUsers',
  UPDATE_INFO: 'updateUserInfo',
  UPDATE_SETTING: 'updateUserSetting',
  UPDATE_AVATAR: 'updateUserAvatar',
  DELETE_ONE: 'deleteUser',
  UPDATE_CART: 'updateShoppingCart',
  GET_CART: 'getShoppingCart',
  UPDATE_TRX: 'updateTransactionHistory',
};

export const PACKAGE_MGMT = {
  CREATE_PKG: 'createPackage',
  GET_ALL_PKGS: 'getAllPackages',
  GET_PKG_BY_ID: 'getPackageById',
  UPDATE_PKG: 'updatePackage',
  DELETE_PKG: 'deletePackage',
  CREATE_GR: 'createGroup',
  GET_ALL_GRS: 'getAllGroups',
  GET_GR_BY_ID: 'getGroupById',
  UPDATE_GR: 'updateGroupName',
  DELETE_GR: 'deleteGroup',
  ADD_GR_MEMB: 'addMemberToGroup',
  RM_GR_MEMB: 'removeMemberFromGroup',
  ADD_GR_PKG: 'addPackageToGroup',
  RM_GR_PKG: 'removePackageFromGroup',
};
