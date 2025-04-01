import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrl: '../app.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup<any>({
      'email': new FormControl(null, [Validators.required]),
      'pwd': new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.pwd).subscribe(
      response => {
        this.loginForm.reset();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

}
