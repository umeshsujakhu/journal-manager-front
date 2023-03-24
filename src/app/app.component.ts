import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Journal } from './journal';
import { JournalService } from './journal.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  public journals: Journal[] = [];
  public viewJournal: Journal = {};
  public currentPage: number = 1;
  public paginationInfo:any;
  public filterDate:any;


  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.getJournals();
  }

  private getQueryParams(param:any = {}) {
    const queryParams = {
        params: {...{
            page: this.currentPage,
            date: this.filterDate
        },...param}
    };
    return queryParams;
  }

  private getPaginationInfo(pagination: any) {
    this.paginationInfo = {
      offset: 0,
      limit:10,
      current_page: pagination.current_page,
      total_pages: pagination.last_page,
      total_records: pagination.total,
    };
  }

  public getJournals(params:any = {}): void {
    this.journalService.getJournals(this.getQueryParams(params)).subscribe(
      (response: any) => {
        this.getPaginationInfo(response.metadata.pagination);
        this.journals = response.payload;
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    );
  }

  public searchJournals(key: string): void {
    this.filterDate = key;
    this.getJournals();
  }

  public onOpenModal(journal: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addJournalModal');
    }
    if (mode === 'detail') {
      this.viewJournal = journal;
      button.setAttribute('data-target', '#viewJournalModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public onAddJournal(addForm: NgForm) {
    document.getElementById('add-journal-form')?.click();
    this.journalService.addJournal(addForm.value).subscribe(
      (response: Journal) => {
        this.getJournals();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );

  }


}
