import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;

  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals | null>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  createPaymentIntent() {
    const basket = this.getCurrentBasketValue();
    return this.http.post<IBasket>(this.baseUrl + 'payments/' + basket?.id, {})
      .pipe(
        map(basket => {
          this.basketSource.next(basket);         
        })
      );
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      basket.deliveryMethodId = deliveryMethod.id;
      basket.shippingPrice = deliveryMethod.price;
      this.setBasket(basket);
    }
  }

  getBasket(id: string) {
    return this.http.get<IBasket>(this.baseUrl + "basket?id=" + id).pipe(
      map(basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
      })
    );
  }

  setBasket(basket: IBasket) {
    return this.http.post<IBasket>(this.baseUrl + "basket", basket).subscribe(
      response => {
        this.basketSource.next(response);
        this.calculateTotals();
      }, error => {
        console.log(error);
      }
    );
  }

  getCurrentBasketValue() {
    const basket = this.basketSource.value;
    return basket;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  addItemToBasket(item: IProduct, quantity: number = 1) {
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const shipping = basket.shippingPrice;
      const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
      const total = subtotal + shipping;
      this.basketTotalSource.next({ shipping, total, subtotal });
    }
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      const foundItemIndex = basket.items.findIndex(x => x.id == item.id);
      basket.items[foundItemIndex].quantity++;
      this.setBasket(basket);
    }
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue() as IBasket;
    if (basket) {
      const foundItemIndex = basket.items.findIndex(x => x.id == item.id);
      if (basket.items[foundItemIndex].quantity > 1) {
        basket.items[foundItemIndex].quantity--;
        this.setBasket(basket);
      } else {
        this.removeItemFromBasket(item);
      }
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      if (basket.items.some(x => x.id === item.id)) {
        basket.items = basket.items.filter(x => x.id != item.id);
        if (basket.items.length > 0) {
          this.setBasket(basket);
        } else {
          this.deleteBasket(basket);
        }
      }
    }
  }

  deleteBasket(basket: IBasket) {
    this.http.delete(this.baseUrl + "basket?id=" + basket.id).subscribe(
      () => {
        this.deleteLocalBasket();
      },
      error => {
        console.log(error);
      });
  }

  deleteLocalBasket() {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }
}
