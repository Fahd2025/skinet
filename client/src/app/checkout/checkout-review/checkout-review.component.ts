import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket, IBasketItem } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  items: IBasketItem[] = [];

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    const basket = this.basketService.getCurrentBasketValue();
    if(basket){
      this.items = basket.items;
    }
  }

}
