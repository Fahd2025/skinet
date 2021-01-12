import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { IBasketTotals } from '../shared/models/basket';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm = new FormGroup({});
  basketTotal$ = new Observable<IBasketTotals | null>();
  constructor(private fb: FormBuilder, private accountService: AccountService, private basketService: BasketService) { }
  ngOnInit(): void {
    this.basketTotal$ = this.basketService.basketTotal$;
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.getDeliveryFormValues();
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipcode: [null, Validators.required]
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    });
  }

  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe(address => {
      if (address) {
        const addressForm = this.checkoutForm.get('addressForm');
        if (addressForm) {
          addressForm.patchValue(address);
        }
      }
    }, error => {
      console.log(error);
    });
  }

  getDeliveryFormValues() {
    const basket = this.basketService.getCurrentBasketValue();
    if (basket) {
      const deliveryMethodId = basket.deliveryMethodId;
      const deliveryForm = this.checkoutForm.get('deliveryForm');
      if (deliveryForm && deliveryMethodId > 0) {
        const deliveryMethod = deliveryForm.get('deliveryMethod');
        if (deliveryMethod) {
          deliveryMethod.patchValue(deliveryMethodId.toString());
        }
      }
    }
  }
}
