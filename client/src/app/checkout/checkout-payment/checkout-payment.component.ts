import { AfterContentInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

declare var Stripe: any;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterContentInit, OnDestroy {
  @Input() checkoutForm = new FormGroup({});
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef | null = null;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef | null = null;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef | null = null;

  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);

  loading = false;

  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;

  constructor(private checkoutService: CheckoutService, private basketService: BasketService, private toastr: ToastrService, private router: Router) { }

  ngAfterContentInit(): void {
    this.stripe = Stripe('pk_test_51I7NpfCPG1onbr701oN8sODyZtWkEmM3RjH0kLwOVVgbqAlHlduysHGKWOJzDbqWvFaIeUmQr02VswSKVLsbu7sW00AGhNPMXU');

    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement?.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement?.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  onChange(event: any) {
    if (event.error) {
      this.cardErrors = event.error.message;
    }
    else {
      this.cardErrors = null;
    }

    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
    }
  }

  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    if (basket) {
      try {
        const createdOrder = await this.createOrder(basket);
        const paymentResult = await this.confirmPaymentWithStripe(basket);
        if (paymentResult.paymentIntent) {
          this.basketService.deleteBasket(basket);
          const navigationExtras: NavigationExtras = { state: createdOrder };
          this.router.navigate(['checkout/success'], navigationExtras);
        }
        else if (paymentResult.error) {
          this.toastr.error(paymentResult.error.message);
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    }
  }

  private async createOrder(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket.id);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }

  private async confirmPaymentWithStripe(basket: IBasket) {
    return this.stripe.confirmCardPayment(basket.clientSecert, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.value
        }
      }
    });
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
