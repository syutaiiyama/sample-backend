export class CreateCustomerDto {
  // NOTE: 顧客名
  name: string;
  // NOTE: メールアドレス
  email: string;
}

export class CreatePaymentIntentDto {
  // NOTE: 支払金額
  amount: number;
  // NOTE: 顧客Id
  customerId: string;
  // NOTE: 支払方法Id
  paymentMethodId: string;
}
