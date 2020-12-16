import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product : IProduct;
  constructor(private shopService : ShopService, private activeRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct()
  {
    let id = this.activeRoute.snapshot.paramMap.get('id');
    if(id){
      this.shopService.getProduct(+id).subscribe( response => {
        this.product = response;
      });
    }
   
  }
}
