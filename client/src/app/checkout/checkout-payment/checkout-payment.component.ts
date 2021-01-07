import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm = new FormGroup({});

  constructor(private checkoutService: CheckoutService, private basketService: BasketService, private toastr: ToastrService,private router:Router) { }

  ngOnInit(): void {
  }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    if (basket) {
      const orderToCreate = this.getOrderToCreate(basket.id);
      this.checkoutService.createOrder(orderToCreate).subscribe(
        order => {
          this.toastr.success("order created successfully");
          this.basketService.deleteLocalBasket();
          console.log(order);
          const navigationExtras : NavigationExtras ={state: order};
          this.router.navigate(['checkout/success'],navigationExtras);
        }, error => {
          this.toastr.error(error.message);
          console.log(error);
        }
      );
    }
  }

  private getOrderToCreate(basketId: string): IOrderToCreate {
    const addressForm = this.checkoutForm.get('addressForm');
    const deliveryForm = this.checkoutForm.get('deliveryForm');
    return {
      basketId: basketId,
      shipToAddress: addressForm?.value,
      deliveryMethodId: +deliveryForm?.get('deliveryMethod')?.value
    };
  }
}
