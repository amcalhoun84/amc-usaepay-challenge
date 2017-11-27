import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { TransactComponent} from './transact/transact.component';
import { TransactionService} from './transaction.service';
import { TextMaskModule } from 'angular2-text-mask';
import { HttpModule } from '@angular/http';

const ROUTES = [
  {
    path: '',
    redirectTo: 'transactions',
    pathMatch: 'full'
  },
  {
    path: 'transactions',
    component: TransactComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TransactComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TextMaskModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [TransactionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
