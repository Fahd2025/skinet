import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { IDeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-dlivery',
  templateUrl: './checkout-dlivery.component.html',
  styleUrls: ['./checkout-dlivery.component.scss']
})
export class CheckoutDliveryComponent implements OnInit {
  @Input() checkoutForm = new FormGroup({});
  deliveryMehtods: IDeliveryMethod[] = [];

  constructor(private checkoutService: CheckoutService,private basketService : BasketService) { }

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe((dm: IDeliveryMethod[]) => {
      this.deliveryMehtods = dm;
    }, error => {
      console.log(error);
    });
  }

  setShippingPrice(deliveryMehtod: IDeliveryMethod){
    this.basketService.setShippingPrice(deliveryMehtod);
  }
}
