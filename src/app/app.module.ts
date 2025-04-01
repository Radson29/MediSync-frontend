import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes} from "@angular/router";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {canActivate} from "./services/auth-guard.service";
import {JwtInterceptor} from "./interceptors/jwt.interceptor";
import { PatientsComponent } from './patients/patients.component';
import { TeammemberComponent } from './teammember/teammember.component';
import { OperationtypeComponent } from './operationtype/operationtype.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { RoominventoryComponent } from './roominventory/roominventory.component';
import { OperationroomComponent } from './operationroom/operationroom.component';
import { OperationComponent } from './operation/operation.component';
import { OperationreportComponent } from './operationreport/operationreport.component';

const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'patients', component: PatientsComponent, canActivate: [canActivate]},
  {path: 'operations', component: OperationComponent, canActivate: [canActivate]},
  {path: 'teammembers', component: TeammemberComponent, canActivate: [canActivate]},
  {path: 'operationtypes', component: OperationtypeComponent, canActivate: [canActivate]},
  {path: 'assessments', component: AssessmentComponent, canActivate: [canActivate]},
  {path: 'roominventories', component: RoominventoryComponent, canActivate: [canActivate]},
  {path: 'operationrooms', component: OperationroomComponent, canActivate: [canActivate]},
  {path: 'operationreports', component: OperationreportComponent, canActivate: [canActivate]}
]


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    PatientsComponent,
    TeammemberComponent,
    OperationtypeComponent,
    AssessmentComponent,
    RoominventoryComponent,
    OperationroomComponent,
    OperationComponent,
    OperationreportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
