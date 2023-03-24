import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginate',
  templateUrl: './paginate.component.html',
  styleUrls: ['./paginate.component.css'],
})
export class PaginateComponent implements OnInit, OnChanges {
  pageSizes: number[] = [10, 15, 20, 25, 50, 100, 250, 500];
  pageSize: number = 10;
  upperBoundPage: number;
  lowerBoundPage: number;
  itemsTo: number = 0;
  itemsFrom: number = 0;
  prePages: number[];
  postPages: number[];
  pageNumbers: number[] = [];
  @Input() eachSide: number = 3;
  @Input() noOfPrePostPages: number = 2;
  @Input() pagination = {
    offset: 0,
    limit: 10,
    current_page: 0,
    total_pages: 0,
    total_records: 0,
  };

  @Output() change = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.setPrePostPages();
    this.generatePageLinks();
    this.pageSize = this.pagination.limit;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination'] && changes['pagination'].currentValue) {
      this.pagination = changes['pagination'].currentValue;
      this.setPrePostPages();
      this.generatePageLinks();
      this.pageSize = this.pagination.limit;
    }
  }


  generatePageLinks() {
    this.setPrePostPages();
    this.resetCounters();
    this.setLowerBoundPage();
    this.setUpperBoundPage();
    for (let i: number = this.lowerBoundPage; i <= this.upperBoundPage; i++) {
      this.pageNumbers.push(i);
    }
    /**
     * prepage last page is less than page numbers lowest page number
     * then introduce ... button in the pagination
     */
    if (this.prePages[this.noOfPrePostPages - 1] + 1 < this.pageNumbers[0]) {
      this.pageNumbers.splice(0, 0, -1);
      this.pageNumbers = this.prePages.concat(this.pageNumbers);
    } else {
      const pagesToBePrefixed = Math.abs(this.pageNumbers[0] - 1);
      const noOfPagesToBePostFixed = this.noOfPrePostPages - pagesToBePrefixed;
      for (let prePage: number = pagesToBePrefixed; prePage >= 1; prePage--) {
        if (this.pageNumbers.indexOf(prePage) === -1) {
          this.pageNumbers.splice(0, 0, prePage);
        }
      }

      if (this.eachSide * 2 + 1 <= this.pagination.total_pages) {
        for (let postPage = 1; postPage <= noOfPagesToBePostFixed; postPage++) {
          if (this.upperBoundPage + postPage <= this.pagination.total_pages) {
            this.pageNumbers.push(this.upperBoundPage + postPage);
          }
        }
      }
    }
    /**
     * postpage's firts page is greather than page numbers largest page number
     * then introduce ... button in the pagination
     */
    if (this.postPages[0] > this.pageNumbers[this.pageNumbers.length - 1] + 1) {
      this.pageNumbers.push(-1);
      this.pageNumbers = this.pageNumbers.concat(this.postPages);
    } else {
      const toBePostFixed =
        this.pagination.total_pages -
        this.pageNumbers[this.pageNumbers.length - 1];
      const pagesToBePrefixed = this.noOfPrePostPages - toBePostFixed;
      for (let postPage: number = 1; postPage <= toBePostFixed; postPage++) {
        this.pageNumbers.push(
          this.pageNumbers[this.pageNumbers.length - 1] + 1
        );
      }
      const index =
        this.pageNumbers.length - (this.eachSide * 2 + 1) - toBePostFixed;
      const pageNumberBefore = this.pageNumbers[index];
      if (
        this.pageNumbers.length > this.eachSide * 2 + 1 &&
        pageNumberBefore > this.noOfPrePostPages
      ) {
        for (let p: number = 1; p <= pagesToBePrefixed; p++) {
          if (pageNumberBefore - p <= this.noOfPrePostPages) {
            break;
          }
          if (this.pageNumbers.indexOf(pageNumberBefore - p) === -1) {
            this.pageNumbers.splice(index, 0, pageNumberBefore - p);
          }
        }
      }
    }

    this.setItemsInfo();
  }

  setLowerBoundPage() {
    this.lowerBoundPage = this.pagination.current_page - this.eachSide;
    if (this.lowerBoundPage <= 0) {
      this.adjustUpperBoundExceedsInLowerBound(
        Math.abs(this.lowerBoundPage - 1)
      );
      this.lowerBoundPage = 1;
    }
  }

  adjustLowerBoundExceedsInUpperBound(exceeds:any) {
    this.lowerBoundPage -= exceeds;
    if (this.lowerBoundPage <= 0) {
      this.lowerBoundPage = 1;
    }
  }

  setUpperBoundPage() {
    if (typeof this.upperBoundPage === 'undefined') {
      this.upperBoundPage = 0;
    }
    this.upperBoundPage += this.pagination.current_page + this.eachSide;
    if (this.pagination.total_pages < this.upperBoundPage) {
      this.adjustLowerBoundExceedsInUpperBound(
        this.upperBoundPage - this.pagination.total_pages
      );
      this.upperBoundPage = this.pagination.total_pages;
    }
  }

  adjustUpperBoundExceedsInLowerBound(exceeds: number) {
    this.upperBoundPage = exceeds;
  }

  changePage(pageNumber: number) {
    this.pagination.current_page = pageNumber;
    this.setPrePostPages();
    this.generatePageLinks();
    this.changeInPagination();
  }

  changePageSize() {
    this.pagination.limit = this.pageSize;
    this.pagination.current_page = 1;
    this.setPrePostPages();
    this.generatePageLinks();
    this.changeInPagination();
  }

  changeInPagination() {
    const paginationInfo = {
      page_size: this.pagination.limit,
      page: this.pagination.current_page,
    };
    this.change.emit(paginationInfo);
  }

  resetCounters() {
    this.pageNumbers = [];
    this.upperBoundPage = 0;
    this.lowerBoundPage = 0;
  }

  setPrePostPages() {
    this.prePages = [];
    this.postPages = [];
    for (let page: number = 1; page <= this.noOfPrePostPages; page++) {
      this.prePages.push(page);
    }
    for (let page: number = this.noOfPrePostPages; page >= 1; page--) {
      this.postPages.push(this.pagination.total_pages + 1 - page);
    }
  }

  increasePageNumber() {
    if (this.pagination.current_page < this.pagination.total_pages) {
      this.pagination.current_page++;
      this.changeInPagination();
    }
  }

  decreasePageNumber() {
    if (this.pagination.current_page > 1) {
      this.pagination.current_page--;
      this.changeInPagination();
    }
  }

  setItemsInfo() {
    this.pageNumbers.forEach((item, index) => {
      if (
        item === -1 &&
        this.pageNumbers[index - 1] + 1 === this.pageNumbers[index + 1]
      ) {
        this.pageNumbers.splice(index, 1);
      }
    });
    this.itemsTo = this.pagination.current_page * this.pagination.limit;
    if (this.itemsTo > this.pagination.total_records) {
      this.itemsTo = this.pagination.total_records;
    }
    if (this.pagination.current_page >= 1) {
      this.itemsFrom =
        (this.pagination.current_page - 1) * this.pagination.limit + 1;
    }
  }
}
