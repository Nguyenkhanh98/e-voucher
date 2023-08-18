import { HttpStatus } from '@nestjs/common';
import { IAppError } from './app-error.interface';

export const WRONG_EMAIL_OR_PASSWORD: IAppError = {
  errorCode: 'WRONG_EMAIL_OR_PASSWORD',
  errorMessage: 'Wrong email or password',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const USER_NOT_ACTIVE: IAppError = {
  errorCode: 'USER_NOT_ACTIVE',
  errorMessage: 'User not action',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const UN_AUTHORIZED: IAppError = {
  errorCode: 'UN_AUTHORIZED',
  errorMessage: 'UnAuthorized',
  statusCode: HttpStatus.UNAUTHORIZED,
};

export const FORBIDDEN: IAppError = {
  errorCode: 'FORBIDDEN',
  errorMessage: 'User role not permission to access resource',
  statusCode: HttpStatus.FORBIDDEN,
};

export const USER_NOT_FOUND: IAppError = {
  errorCode: 'USER_NOT_FOUND',
  errorMessage: 'User not found',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const CAN_NOT_CREATE_SUPER_ADMIN: IAppError = {
  errorCode: 'CAN_NOT_CREATE_SUPER_ADMIN',
  errorMessage: 'Super admin user can not create',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const USER_EXIST = {
  errorCode: 'USER_EXIST',
  errorMessage: 'User has exist',
  statusCode: HttpStatus.CONFLICT,
};

export const ORDER_ITEM_CAN_NOT_BE_EMPTY = {
  errorCode: 'ORDER_ITEM_CAN_NOT_BE_EMPTY',
  errorMessage: 'Order item can not be empty',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const PRODUCT_ITEM_NOT_FOUND = {
  errorCode: 'PRODUCT_ITEM_NOT_FOUND',
  errorMessage: 'Order item not found',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const ORDER_AMOUNT_INVALID = {
  errorCode: 'ORDER_AMOUNT_INVALID',
  errorMessage: 'Order amount invalid',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const PRODUCT_ITEM_NOT_ACTIVE = {
  errorCode: 'PRODUCT_ITEM_NOT_ACTIVE',
  errorMessage: 'Product item not active',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const PRODUCT_ITEM_INVALID = {
  errorCode: 'PRODUCT_ITEM_INVALID',
  errorMessage: 'Product item invalid',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const INVALID_DATA = {
  errorCode: 'INVALID_DATA',
  errorMessage: 'Invalid data',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const GPAY_REQUEST_ERROR = {
  errorCode: 'GPAY_REQUEST_ERROR',
  errorMessage: 'Gpay request payment error',
  statusCode: HttpStatus.BAD_GATEWAY,
};

export const CUSTOMER_NOT_FOUND = {
  errorCode: 'CUSTOMER_NOT_FOUND',
  errorMessage: 'Customer not found',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const CUSTOMER_HAS_ACTIVED = {
  errorCode: 'CUSTOMER_HAS_ACTIVED',
  errorMessage: 'Customer has actived',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const ORDER_NOT_FOUND = {
  errorCode: 'ORDER_NOT_FOUND',
  errorMessage: 'Order not found',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const ORDER_LOCKED = {
  errorCode: 'ORDER_LOCKED',
  errorMessage: 'Order has locked',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const TRANSACTION_NOT_FOUND = {
  errorCode: 'TRANSACTION_NOT_FOUND',
  errorMessage: 'Transaction not found',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const ROLE_NOT_FOUND = {
  errorCode: 'ROLE_NOT_FOUND',
  errorMessage: 'Role not found',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const CUSTOMER_EXIST = {
  errorCode: 'CUSTOMER_EXIST',
  errorMessage: 'Customer has exist',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const PSS_REQUEST_ERROR = {
  errorCode: 'PSS_REQUEST_ERROR',
  errorMessage: 'Call pss system error',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const VOUCHER_TYPE_NOT_EXIST = {
  errorCode: 'VOUCHER_TYPE_NOT_EXIST',
  errorMessage: 'voucherType not exist',
  statusCode: HttpStatus.BAD_REQUEST,
};
export const CAMPAIGN_EXIST = {
  errorCode: 'CAMPAIGN_EXIST',
  errorMessage: 'Campaign has exist',
  statusCode: HttpStatus.CONFLICT,
};

export const PRODUCT_INVALID = {
  errorCode: 'PRODUCT_INVALID',
  errorMessage: 'Product invalid',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const CAMPAIGN_DISCOUNT_INVALID = {
  errorCode: 'CAMPAIGN_DISCOUNT_INVALID',
  errorMessage:
    'Campaign disscount can not be greater than total amount price products',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const CAMPAIGN_INVALID = {
  errorCode: 'CAMPAIGN_INVALID',
  errorMessage: 'Campaign data invalid',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const CAMPAIGN_NOT_FOUND = {
  errorCode: 'CAMPAIGN_NOT_FOUND',
  errorMessage: 'Campaign not found',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const CAMPAIGN_REMAIN_QUANTITY_NOT_ENOUGH = {
  errorCode: 'CAMPAIGN_REMAIN_QUANTITY_NOT_ENOUGH',
  errorMessage: 'Campaign remaining quantity not enough',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const PRODUCT_NOT_FOUND = {
  errorCode: 'PRODUCT_NOT_FOUND',
  errorMessage: 'Product not found',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const PRODUCT_REMAIN_QUANTITY_NOT_ENOUGH = {
  errorCode: 'PRODUCT_REMAIN_QUANTITY_NOT_ENOUGH',
  errorMessage: 'Product remaining quantity not enough',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const ITTEM_TYPE_NOT_SUPPORT = {
  errorCode: 'ITTEM_TYPE_NOT_SUPPORT',
  errorMessage: 'Order item type not support',
  statusCode: HttpStatus.BAD_REQUEST,
};

export const MISSING_PASSENGER_INFO = {
  errorCode: 'MISSING_PASSENGER_INFO',
  errorMessage: 'Missing passenger info',
  statusCode: HttpStatus.BAD_REQUEST,
};
