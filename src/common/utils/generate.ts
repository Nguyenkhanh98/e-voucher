import { createHash } from 'crypto';

export const generateOrderId = () => {
  const hex = '0123456789';
  const model = `${new Date().getTime()}xxxxxxxxxxxxxxxxx`;
  let result = '';
  for (const element of model) {
    const rnd = Math.floor(Math.random() * hex.length);
    result += element == 'x' ? hex[rnd] : element;
  }
  return result;
};

export const generateRequestId = () => {
  const hex = '0123456789abcdef';
  const model = `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`;
  let result = '';
  for (const element of model) {
    const rnd = Math.floor(Math.random() * hex.length);
    result += element == 'x' ? hex[rnd] : element;
  }
  return result;
};

export const generatePaymentKey = () => {
  const hex = '0123456789abcdefABCDEFGH';
  const model = `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`;
  let result = '';
  for (const element of model) {
    const rnd = Math.floor(Math.random() * hex.length);
    result += element == 'x' ? hex[rnd] : element;
  }
  return result;
};

export const generateSignatureGpay = (gpayRequest: object, salt: string) => {
  const jsonStringRequest = JSON.stringify(gpayRequest);
  const hash = createHash('sha256');
  hash.update(jsonStringRequest + salt);
  return hash.digest('hex');
};

export const generateKey = () => {
  const hex = 'abcdefghscvnmbkl';
  const model = `xxx${new Date().getTime().toString().substring(0, 8)}`;
  let result = '';
  for (const element of model) {
    const rnd = Math.floor(Math.random() * hex.length);
    result += element == 'x' ? hex[rnd] : element;
  }
  return result;
};
