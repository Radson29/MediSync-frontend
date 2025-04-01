import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, map, BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomInventoryService {

  private readonly serverUrl: string = 'http://localhost:8080';
  private dataSubject = new BehaviorSubject<any[]>([]);
  data$: Observable<any[]> = this.dataSubject.asObservable();

  constructor(private httpClient:HttpClient) {}
  loadAllRoomInventory(): Observable<any> {
    return this.httpClient.get<any[]>('http://localhost:8080/api/roominventories')
      .pipe(
        map(response => {
          this.dataSubject.next(response)
          return response
        })
      )
  }

  refreshData() {
    this.loadAllRoomInventory().subscribe();
  }

  postRoomInventory(body:any): Observable<any> {
    return this.httpClient.post<any>(`${this.serverUrl}/api/roominventories`, body);
  }

  putRoomInventory(assetId:string, roomId:string, body:any): Observable<any> {
    return this.httpClient.put<any>(`${this.serverUrl}/api/roominventories/${assetId}/${roomId}`, body);
  }

  deleteRoomInventory(assetId:string, roomId:string): Observable<any> {
    return this.httpClient.delete<any>(`${this.serverUrl}/api/roominventories/${assetId}/${roomId}`);
  }

}
