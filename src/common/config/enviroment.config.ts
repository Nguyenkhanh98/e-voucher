import * as dotenv from 'dotenv';
dotenv.config();

// enviroment

const NODE_ENV: string = process.env.NODE_ENV || 'development';

// application
const PSS = {
  URL: process.env.PSS_URL || '',
  VOUCHER_ENDPOINT: 'vouchers',
  RESERVATION_ENNDPOINT: 'reservations',
  VOUCHER_GENERATE_ENDPOINT: 'vouchers/generate',
  VOUCHER_TYPE_ENDPOINT: 'voucherTypes',
  COMPANY_KEY: process.env.PSS_COMPANY_KEY || '',
  USERNAME: process.env.PSS_USERNAME || '',
  PASSWORD: process.env.PSS_PASSWORD || '',
};

const GPAY = {
  URL: process.env.GPAY_URL || '',
  API_KEY: process.env.GPAY_API_KEY || '',
  SALT: process.env.GPAY_API_SALT || '',
  CREATE_PAYMENT_ENDPOINT: process.env.GPAY_CREATE_PAYMENT_ENDPOINT || '',
};

export { NODE_ENV, PSS, GPAY };
