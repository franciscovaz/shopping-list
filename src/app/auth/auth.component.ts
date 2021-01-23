import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form :NgForm) {
    if(!form.valid) {
      return;
    }

    const { email, password } = form.value;

    this.isLoading = true;

    if(this.isLoginMode) {
      //...
    } else {
      this.authService.signUp(email, password).subscribe(
        respData => {
          console.log(respData);
          this.isLoading = false;
        }, error => {
          this.error = 'An error occurred!';
          this.isLoading = false;
        }
      )

    }

    form.reset();
  }

}
