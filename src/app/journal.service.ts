import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Journal } from "./journal";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { ListParameters } from "./list-parameters";
import { Helper } from "./utilities/Helper";

@Injectable({
  providedIn: 'root'
})

export class JournalService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getJournals(queryParams: ListParameters): Observable<any> {
    const filteredParams = Helper.deleteUnusedProperties(queryParams);
    return this.http.get<Journal[]>(`${this.apiServerUrl}/journals`, filteredParams);
  }

  public addJournal(journal: Journal): Observable<Journal> {
    return this.http.post<Journal>(`${this.apiServerUrl}/journals`, journal);
  }
}
