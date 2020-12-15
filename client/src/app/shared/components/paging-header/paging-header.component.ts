import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paging-header',
  templateUrl: './paging-header.component.html',
  styleUrls: ['./paging-header.component.scss']
})
export class PagingHeaderComponent implements OnInit {
  @Input() pageNumber = 0;
  @Input() pageSize = 0;
  @Input() totalCount = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
