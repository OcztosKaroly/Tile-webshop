import { Component } from '@angular/core';
import { Invoice } from '../../shared/models/Invoice';
import { InvoiceService } from '../../shared/services/invoice.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent {
  displayedColumns: string[] = ['date', 'value'];
  dataSource: Invoice[] = [];

  constructor(private invoiceService: InvoiceService, private userService: UserService) {  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if (user !== null) {
      const userSubscription = this.userService.getById(user.uid).subscribe(data => {
        const invoiceSubscription = this.invoiceService.getAllByUserId(user.uid).subscribe((invoices: Invoice[]) => {
          this.dataSource = invoices;
          invoiceSubscription.unsubscribe();
        }, error => {
          console.error('Error fetching invoices:', error);
          invoiceSubscription.unsubscribe();
        });
        userSubscription.unsubscribe();
      }, error => {
        console.error(error);
        userSubscription.unsubscribe();
      });
    }
  }
}
