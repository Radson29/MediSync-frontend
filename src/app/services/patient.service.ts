import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, map, BehaviorSubject, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly serverUrl: string = 'http://localhost:8080';
  private dataSubject = new BehaviorSubject<any[]>([]);
  data$: Observable<any[]> = this.dataSubject.asObservable();

  constructor(private httpClient:HttpClient) {}
  loadAllPatients(): Observable<any> {
    return this.httpClient.get<any[]>('http://localhost:8080/api/patients')
      .pipe(
        map(response => {
          const sortedData = response.sort((a, b) => a.id - b.id);
          this.dataSubject.next(sortedData)
          return sortedData
        })
      )
  }

  refreshData() {
    this.loadAllPatients().subscribe();
  }

  postPatient(body:any): Observable<any> {
    return this.httpClient.post<any>(`${this.serverUrl}/api/patients`, body);
  }

  putPatient(id:string, body:any): Observable<any> {
    return this.httpClient.put<any>(`${this.serverUrl}/api/patients/${id}`, body);
  }

  deletePatient(id:string): Observable<any> {
    return this.httpClient.delete<any>(`${this.serverUrl}/api/patients/${id}`);
  }

}
