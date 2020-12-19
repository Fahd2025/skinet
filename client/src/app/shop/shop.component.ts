import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  
  @ViewChild('search',{static: false}) searchTrem : ElementRef | undefined;
  loadCompleted = false;
  products : IProduct[] = [];
  brands : IBrand[] = [];
  types : IType[] = [];

  shopParams = new ShopParams();
  totalCount = 0;

  sortOptions = [
    {name:"Alphabetical", value:"name"},
    {name:"Price Low to High", value:"priceAsc"},
    {name:"Price High to Low", value:"priceDesc"}
  ];

  constructor(private shopService : ShopService) { }

  ngOnInit(): void {   
    this.getBrands();
    this.getTypes();
    this.getProducts();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe(response => {
      this.products = [];
      if(response)
      {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;

        this.loadCompleted = true;
      }
    }, error => { 
       console.log(error);
    });
  }

  getBrands(){
    this.shopService.getBrands().subscribe(response => {
      this.brands = [{id:0, name:"All"}, ...response];
    }, error => { 
       console.log(error);
    });
  }

  getTypes(){
    this.shopService.getTypes().subscribe(response => {
      this.types = [{id:0, name:"All"}, ...response];
    }, error => { 
       console.log(error);
    });
  }

  onBrandSelected(brandId: number){
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(event: EventTarget | null)
  {
    if(event){
      this.shopParams.sort = (<HTMLSelectElement>event).value;
      this.getProducts();
    }  
  }

  onPageChanged(event:any){
    if (this.shopParams.pageNumber != event.page) {
      this.shopParams.pageNumber = event.page;
      this.getProducts();
    }    
  }

  onSearch(){
    if (this.searchTrem) {
      this.shopParams.search = this.searchTrem.nativeElement.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }   
  }

  onReset(){
    if (this.searchTrem) {
      this.searchTrem.nativeElement.value = "";
    }    
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
