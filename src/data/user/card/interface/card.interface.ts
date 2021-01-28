// クレカ情報はdbに保存しないためentityではなくinterfaceで実装
export interface CardInterface {
  brand: string;
  last4: string;
  expYear: string;
  expMonth: string;
}
