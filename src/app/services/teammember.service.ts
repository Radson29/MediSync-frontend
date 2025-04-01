import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, map, BehaviorSubject, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {

  private readonly serverUrl: string = 'http://localhost:8080';
  private dataSubject = new BehaviorSubject<any[]>([]);
  data$: Observable<any[]> = this.dataSubject.asObservable();

  constructor(private httpClient:HttpClient) {}
  loadAllTeamMembers(): Observable<any> {
    return this.httpClient.get<any[]>('http://localhost:8080/api/teammembers')
      .pipe(
        map(response => {
          const sortedData = response.sort((a, b) => a.id - b.id);
          this.dataSubject.next(sortedData)
          return sortedData
        })
      )
  }

  refreshData() {
    this.loadAllTeamMembers().subscribe();
  }

  postTeamMember(body:any): Observable<any> {
    return this.httpClient.post<any>(`${this.serverUrl}/api/teammembers`, body);
  }

  putTeamMember(id:string, body:any): Observable<any> {
    return this.httpClient.put<any>(`${this.serverUrl}/api/teammembers/${id}`, body);
  }

  deleteTeamMember(id:string): Observable<any> {
    return this.httpClient.delete<any>(`${this.serverUrl}/api/teammembers/${id}`);
  }

}
