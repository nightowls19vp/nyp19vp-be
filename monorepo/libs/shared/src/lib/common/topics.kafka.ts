export const HEALT_CHECK = {
  AUTH: 'HC_AUTH',
  USERS: 'HC_USER',
  PACKAGE_MGMT: 'HC_PACKAGE_MGMT',
  TXN: 'HC_TXN',
};

export const AUTH = {
  VALIDATE_USER: 'validate_user',
  VALIDATE_TOKEN: 'validate_token',
  GOOGLE_AUTH: 'google_auth',
  GOOGLE_AUTH_REDIRECT: 'google_auth_redirect',
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE_ACCOUNT: 'create_account',
  AUTHORIZE: 'authorize',
  CHANGE_PASSWORD: 'changePassword',
  DELETE_ACCOUNT: 'deleteAccount',
  SOCIAL_SIGN_UP: 'social_sign_up',
  SOCIAL_LINK: 'social_link',
  REFRESH: 'refresh',
};

export const USERS = {
  CREATE: 'createUser',
  SEARCH_USER: 'searchFull-textUser',
  GET_INFO_BY_ID: 'getUserInfoById',
  GET_INFO_BY_EMAIL: 'getUserInfoByEmail',
  GET_SETTING_BY_ID: 'getUserSettingById',
  GET_ALL: 'getAllUsers',
  UPDATE_INFO: 'updateUserInfo',
  UPDATE_SETTING: 'updateUserSetting',
  UPDATE_AVATAR: 'updateUserAvatar',
  DELETE_ONE: 'deleteUser',
  UPDATE_CART: 'updateShoppingCart',
  GET_CART: 'getShoppingCart',
  UPDATE_TRX: 'updateTransactionHistory',
  CHECKOUT: 'checkOut',
};

export const PACKAGE_MGMT = {
  CREATE_PKG: 'createPackage',
  GET_ALL_PKGS: 'getAllPackages',
  GET_PKG_BY_ID: 'getPackageById',
  GET_MANY_PKG: 'getManyPackage',
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

export const TXN = {
  CHECKOUT: 'checkOut',
};
