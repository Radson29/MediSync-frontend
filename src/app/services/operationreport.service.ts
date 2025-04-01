import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, map, BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OperationReportService {

  private readonly serverUrl: string = 'http://localhost:8080';
  private dataSubject = new BehaviorSubject<any[]>([]);
  data$: Observable<any[]> = this.dataSubject.asObservable();

  constructor(private httpClient:HttpClient) {}
  loadAllOperationReport(): Observable<any> {
    return this.httpClient.get<any[]>('http://localhost:8080/api/operationreports')
      .pipe(
        map(response => {
          this.dataSubject.next(response)
          return response
        })
      )
  }

  refreshData() {
    this.loadAllOperationReport().subscribe();
  }

  postOperationReport(body:any): Observable<any> {
    return this.httpClient.post<any>(`${this.serverUrl}/api/operationreports`, body);
  }

  putOperationReport(teamMemberId:string, operationId:string, body:any): Observable<any> {
    return this.httpClient.put<any>(`${this.serverUrl}/api/operationreports/${teamMemberId}/${operationId}`, body);
  }

  deleteOperationReport(teamMemberId:string, operationId:string): Observable<any> {
    return this.httpClient.delete<any>(`${this.serverUrl}/api/operationreports/${teamMemberId}/${operationId}`);
  }

}
