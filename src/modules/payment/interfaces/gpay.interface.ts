export interface IGpayRequestData {
  apiOperation: string;
  orderID: string;
  orderAmount: number;
  orderCurrency: string;
  orderDateTime: number;
  orderDescription: string;
  language: string;
  successURL: string;
  failureURL: string;
  cancelURL: string;
}

export interface IGpayRequest {
  requestID: string;
  requestDateTime: number;
  requestData: IGpayRequestData;
}

export interface IGpayResponseData {
  transactionID: string;
  endpoint: string;
}

export interface IGpayResponse {
  requestID: string;
  responseDateTime: number;
  responseCode: string;
  responseMessage: string;
  responseData: IGpayResponseData;
}
