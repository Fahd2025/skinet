import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketItem } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  @Input() appStepper: CdkStepper | null = null;
  items: IBasketItem[] = [];

  constructor(private basketService: BasketService, private toastr: ToastrService) { }

  ngOnInit(): void {
    const basket = this.basketService.getCurrentBasketValue();
    if (basket) {
      this.items = basket.items;
    }
  }

  createPaymentIntent() {
    return this.basketService.createPaymentIntent().subscribe(
      () => {
        if(this.appStepper){
          this.appStepper.next();
        }
      }, error => {
        console.log(error);
      }
    );
  }

}
