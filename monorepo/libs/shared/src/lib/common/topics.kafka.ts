export const HEALT_CHECK = {
  AUTH: 'HC_AUTH',
  USERS: 'HC_USER',
  PACKAGE_MGMT: 'HC_PACKAGE_MGMT',
  TXN: 'HC_TXN',
  COMM: 'HC_COMM',
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
  GENERATE_JOIN_GR_TOKEN: 'generate_join_gr_token',
  VALIDATE_JOIN_GR_TOKEN: 'validate_join_gr_token',
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
  UPDATE_AVATAR_BY_FILE: 'updateUserAvatarByFile',
  DELETE_USER: 'deleteUser',
  RESTORE_USER: 'restoreUser',
  UPDATE_CART: 'updateShoppingCart',
  GET_CART: 'getShoppingCart',
  UPDATE_TRX: 'updateTransactionHistory',
  CHECKOUT: 'checkOut',
  RENEW_PKG: 'renewGroupPackage',
};

export const PKG_MGMT = {
  PACKAGE: {
    CREATE: 'createPackage',
    GET: 'getAllPackages',
    GET_BY_ID: 'getPackageById',
    GET_MANY: 'getManyPackage',
    UPDATE: 'updatePackage',
    DELETE: 'deletePackage',
    RESTORE: 'restorePackage',
  },
  GROUP: {
    CREATE: 'createGroup',
    GET: 'getAllGroups',
    GET_BY_USER: 'getGroupsByUserId',
    GET_CHANNEL_BY_USER: 'getGroupChannelsByUserId',
    GET_BY_ID: 'getGroupById',
    UPDATE: 'updateGroupName',
    UPDATE_AVATAR: 'updateGroupAvatar',
    UPDATE_CHANNEL: 'updateGroupChannel',
    DELETE: 'deleteGroup',
    RESTORE: 'restoreGroup',
    ADD_MEMB: 'addMemberToGroup',
    DEL_MEMB: 'removeMemberFromGroup',
    ADD_PKG: 'addPackageToGroup',
    ACTIVATE_PKG: 'activatePackageInGroup',
    DEL_PKG: 'removePackageFromGroup',
    IS_SU: 'isSuperUserOfAGroup',
  },
  EXTENSION: {
    BILL: {
      CREATE: 'createGroupBilling',
      GET: 'getGroupBilling',
      UPDATE: 'updateGroupBilling',
      UPDATE_STT: 'updateGroupBillingStatus',
      DELETE: 'removeGroupBilling',
      RESTORE: 'restoreGroupBilling',
    },
    TODOS: {
      CREATE: 'createGroupTodos',
      GET: 'getGroupTodos',
      UPDATE: 'updateGroupTodos',
      ADD_TODO: 'addGroupTodos',
      DEL_TODO: 'removeGroupTodos',
      DELETE: 'removeGroupTodos',
      RESTORE: 'restoreGroupTodos',
    },
  },
};

export const TXN = {
  ZP_CREATE_ORD: 'zaloPayCreateOrder',
  ZP_GET_STT: 'zaloPayGetStatus',
  ZP_CREATE_TRANS: 'zaloPayCallbackCreateTransaction',
  VNP_CREATE_ORD: 'vnpayCreateOrder',
  VNP_CALLBACK: 'vnpayReturnUrl',
  VNP_IPN: 'vnpayIpnUrl',
};

export const COMM = {
  CREATE_CLIENT: 'createClientSocket',
  GET_CLIENT: 'getClientSocket',
  RM_CLIENT: 'removeClientSocket',
};

export const PROD_MGMT = {
  init: 'prod_mgmt_init', // create group with group id and package id

  products: {
    create: 'prod_mgmt_create_product',
    update: 'prod_mgmt_update_product',
    delete: 'prod_mgmt_delete_product',
    restore: 'prod_mgmt_restore_product',
    getPaginated: 'prod_mgmt_get_paginated_products',
    getByBarcode: 'prod_mgmt_get_product_by_barcode',
    getById: 'prod_mgmt_get_product_by_id',
  },
  groupProducts: {
    create: 'prod_mgmt_create_group_product',
    update: 'prod_mgmt_update_group_product',
    delete: 'prod_mgmt_delete_group_product',
    restore: 'prod_mgmt_restore_group_product',
    getPaginated: 'prod_mgmt_get_paginated_group_products',
    getById: 'prod_mgmt_get_group_by_id',
  },
  storageLocations: {
    create: 'prod_mgmt_create_storage_location',
    update: 'prod_mgmt_update_storage_location',
    delete: 'prod_mgmt_delete_storage_location',
    restore: 'prod_mgmt_restore_storage_location',
    getPaginated: 'prod_mgmt_get_paginated_storage_locations',
    getById: 'prod_mgmt_get_storage_location_by_id',
  },
  purchaseLocations: {
    create: 'prod_mgmt_create_purchase_location',
    update: 'prod_mgmt_update_purchase_location',
    delete: 'prod_mgmt_delete_purchase_location',
    restore: 'prod_mgmt_restore_purchase_location',
    getPaginated: 'prod_mgmt_get_paginated_purchase_locations',
    getById: 'prod_mgmt_get_purchase_location_by_id',
  },
  items: {
    create: 'prod_mgmt_create_item',
    update: 'prod_mgmt_update_item',
    delete: 'prod_mgmt_delete_item',
    restore: 'prod_mgmt_restore_item',
    getPaginated: 'prod_mgmt_get_paginated_items',
    getById: 'prod_mgmt_get_item_by_id',
  },

  provinces: {
    findByCode: 'prod_mgmt_provinces_find_by_code',
    search: 'prod_mgmt_provinces_search',
  },

  districts: {
    findByCode: 'prod_mgmt_districts_find_by_code',
    search: 'prod_mgmt_districts_search',
  },

  wards: {
    findByCode: 'prod_mgmt_wards_find_by_code',
    search: 'prod_mgmt_wards_search',
  },
};
