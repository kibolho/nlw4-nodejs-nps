'use strict';
const nodemailer = jest.createMockFromModule<{
  createTestAccount: any;
  createTransport: any;
  getTestMessageUrl: any;
}>('nodemailer');

const createTestAccountMock = async () =>
  Promise.resolve({
    smtp: { host: '', port: '', secure: '' },
    user: '',
    pass: '',
  });

const sendMailMock = async () => Promise.resolve({ messageId: '' });
const createTransportMock = () => ({ sendMail: sendMailMock });
const getTestMessageUrlMock = () => 'https://nodemailer.com/example';

nodemailer.createTestAccount = createTestAccountMock;
nodemailer.createTransport = createTransportMock;
nodemailer.getTestMessageUrl = getTestMessageUrlMock;
module.exports = nodemailer;
