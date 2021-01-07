import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasketItem } from '../../models/basket';
import { IOrderItem } from '../../models/order';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {

  @Input() orderItems: IOrderItem[] = [];
  @Input() items: IBasketItem[] = [];
  @Input() isBasket = true;
  @Input() isOrder = false;

  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();

  constructor() { }

  ngOnInit(): void {
    if (this.isOrder) {
      this.convertOrderItems();
    }
  }

  convertOrderItems() {
    if (this.orderItems.length > 0) {
      this.orderItems.forEach(element => {
        this.items.push({
          id: element.productId,
          productName: element.productName,
          pictureUrl: element.pictureUrl,
          quantity: element.quantity,
          price: element.price,
          type: '',
          brand: ''
        })
      });
    }
  }


  incrementItemQuantity(item: IBasketItem) {
    this.increment.emit(item);
  }

  decrementItemQuantity(item: IBasketItem) {
    this.decrement.emit(item);
  }

  removeBaskItem(item: IBasketItem) {
    this.remove.emit(item);
  }

}
