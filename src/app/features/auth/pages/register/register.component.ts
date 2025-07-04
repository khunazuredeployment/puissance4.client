import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isLoading: boolean = false;
  fg!: FormGroup

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
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
      this._authService.register(this.fg.value).subscribe({ 
        next: () => {
          this._messageService.add({ severity: 'info', summary: 'Enregistrement ok' });
          this.isLoading = false;
        }, error: () => {
          this._messageService.add({ severity: 'error', summary: 'Une erreur est survenue' });
          this.isLoading = false;
        }
      });
    }
  }

}
