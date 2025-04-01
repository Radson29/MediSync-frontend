import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, map, BehaviorSubject, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OperationRoomService {

  private readonly serverUrl: string = 'http://localhost:8080';
  private dataSubject = new BehaviorSubject<any[]>([]);
  data$: Observable<any[]> = this.dataSubject.asObservable();

  constructor(private httpClient:HttpClient) {}
  loadAllOperationRooms(): Observable<any> {
    return this.httpClient.get<any[]>('http://localhost:8080/api/operationrooms')
      .pipe(
        map(response => {
          const sortedData = response.sort((a, b) => a.id - b.id);
          this.dataSubject.next(sortedData)
          return sortedData
        })
      )
  }

  refreshData() {
    this.loadAllOperationRooms().subscribe();
  }

  postOperationRoom(body:any): Observable<any> {
    return this.httpClient.post<any>(`${this.serverUrl}/api/operationrooms`, body);
  }

  putOperationRoom(id:string, body:any): Observable<any> {
    return this.httpClient.put<any>(`${this.serverUrl}/api/operationrooms/${id}`, body);
  }

  deleteOperationRoom(id:string): Observable<any> {
    return this.httpClient.delete<any>(`${this.serverUrl}/api/operationrooms/${id}`);
  }

}
