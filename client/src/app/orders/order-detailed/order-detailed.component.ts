import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  order: IOrder | null = null;
  constructor(private orderService: OrdersService, private activedRouter: ActivatedRoute, private bcService: BreadcrumbService) { 
    this.bcService.set('@orderDetailed', ' ');
  }

  ngOnInit(): void {   
    this.getOrder();
  }

  getOrder() {
    const id = this.activedRouter.snapshot.paramMap.get('id');
    if(id){
      this.orderService.getOrderDetailed(+id).subscribe(
        order => {
          this.order = order;
          this.bcService.set('@orderDetailed', `Order# ${order.id} - ${order.status}`);
        }, error => {
          console.log(error);
        }
      );
    }   
  }
}
