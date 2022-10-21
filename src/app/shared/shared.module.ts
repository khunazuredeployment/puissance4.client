import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    DialogModule,
    TabViewModule,
    TableModule,
    ProgressSpinnerModule,
  ],
  exports: [
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    RadioButtonModule,
    DialogModule,
    TabViewModule,
    TableModule,
    ProgressSpinnerModule,
  ]
})
export class SharedModule { }
