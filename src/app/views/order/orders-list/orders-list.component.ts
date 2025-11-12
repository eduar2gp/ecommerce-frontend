import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../../core/services/orders.service'
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Order } from '../../../model/order.model'

@Component({
  selector: 'app-orders-list.component',
  imports: [CommonModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css',
})
export class OrdersListComponent implements OnInit{
  
  orders$: Observable<Order[]> | undefined;
  constructor(private ordersService: OrdersService) {}
  
  ngOnInit(): void{
    this.orders$ = this.ordersService.getOrders();    
  }

}
