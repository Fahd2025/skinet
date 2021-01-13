import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {

  @Input() totalCount = 0;
  @Input() pageSize = 0;
  @Input() pageNumber = 1;
  @Output() pagerChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  onPagerChange(event : any){
    this.pagerChange.emit(event);
  }
}
