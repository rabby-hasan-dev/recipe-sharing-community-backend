/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import config from '../../config';
import { join } from 'path';
import ejs from 'ejs';

export const initialPayment = async (paymentData: any) => {
  const data = {
    store_id: process.env.STORE_ID,
    signature_key: process.env.SIGNATURE_KEY,
    tran_id: paymentData.transactionId,
    success_url: `${config.server_url_link}/api/v1/premium-membership/confirm?transactionId=${paymentData?.transactionId}&status=success`,
    fail_url: `${config.server_url_link}/api/v1/premium-membership/confirm?status=fail`,
    cancel_url: `${config.client_url_link}`,
    amount: paymentData.totalPrice,
    currency: 'BDT',
    desc: 'Merchant Registration Payment',
    cus_name: paymentData.customerName,
    cus_email: paymentData.customerEmail,
    cus_add1: paymentData.customerAddress,
    cus_add2: 'N/A',
    cus_city: 'N/A',
    cus_state: 'N/A',
    cus_postcode: 'N/A',
    cus_country: 'N/A',
    cus_phone: paymentData.customerPhone,
    type: 'json',
  };

  try {
    const response = await axios.post(config.payment_url as string, data);
    return response.data;
  } catch (err) {
    throw new Error('Payment initiation failed!');
  }
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(config.payment_verify_url!, {
      params: {
        store_id: config.store_id,
        signature_key: config.signature_key,
        type: 'json',
        request_id: tnxId,
      },
    });

    return response.data;
  } catch (err) {
    throw new Error('Payment validation failed!');
  }
};


export const renderPaymentSuccessTemplate = async (paymentData: any) => {
  const filePathSuccess = join(process.cwd(), 'views', 'paymentSuccess.ejs');
  return await ejs.renderFile(filePathSuccess, paymentData);
};

export const renderPaymentFailureTemplate = async () => {
  const filePathFail = join(process.cwd(), 'views', 'paymentFail.ejs');
  return await ejs.renderFile(filePathFail, {});
};
