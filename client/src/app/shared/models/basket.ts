import { v4 as uuidv4 } from 'uuid';

export interface IBasket {
  id: string;
  items: IBasketItem[];

  deliveryMethodId: number;
  shippingPrice: number;

  clientSecert?: string;
  paymentIntentId?: string;
}

export interface IBasketItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  brand: string;
  type: string;
}

export class Basket implements IBasket {
  id = uuidv4();
  items: IBasketItem[] = [];
  
  deliveryMethodId = 0;
  shippingPrice = 0;
}

export interface IBasketTotals {
  shipping: number;
  subtotal: number;
  total: number;
}