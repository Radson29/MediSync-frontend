import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, map, BehaviorSubject, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PreOpAssessmentService {

  private readonly serverUrl: string = 'http://localhost:8080';
  private dataSubject = new BehaviorSubject<any[]>([]);
  data$: Observable<any[]> = this.dataSubject.asObservable();

  constructor(private httpClient:HttpClient) {}
  loadAllPreOpAssessment(): Observable<any> {
    return this.httpClient.get<any[]>('http://localhost:8080/api/preoperativeassessments')
      .pipe(
        map(response => {
          const sortedData = response.sort((a, b) => a.name - b.name);
          this.dataSubject.next(sortedData)
          return sortedData
        })
      )
  }

  refreshData() {
    this.loadAllPreOpAssessment().subscribe();
  }

}
