import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { start } from 'src/app/core/states/session.reducers';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading: boolean = false;
  fg!: FormGroup

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    private readonly _store: Store,
    private readonly _router: Router,
    private readonly _messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fg = this._fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  submit() {
    if(this.fg.valid) {
      this.isLoading = true;
      this._authService.login(this.fg.value).subscribe({ 
        next: data => {
          console.log(data);
          
          this._store.dispatch(start({ auth: data }));
          this._messageService.add({ severity: 'info', summary: 'Bienvenue' });
          this._router.navigate(['']);
        }, error: () => {
          this._messageService.add({ severity: 'error', summary: 'Bad credentials' });
          this.isLoading = false;
        }
      });
    }
  }



}
