import { Component, OnInit, ViewChild } from '@angular/core';

import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Employee, Orders, ServiceService } from '../services/service.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { EmployeeDialogComponent } from "../employee-dialog/employee-dialog.component";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  id='';
  val='';
  displayedColumns: string[] = ['customerName','customerContact','employeeName','paymentMethod','subscriptiondetails','userAddress','user_requirements','addEmployee'];
  orders:Orders[]=[]
  dataSource!: MatTableDataSource<Orders>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public service:ServiceService,public firestore:Firestore,public dialog: MatDialog) { }
  ngOnInit(): void {
    this.service.getOrders().subscribe((res: Orders[]) => {
      this.orders = res;
    this.dataSource = new MatTableDataSource(res);
      console.log(this.orders)
      this.dataSource.paginator = this.paginator;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog(id1:string) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent,{width: '400px',});

    dialogRef.afterClosed().subscribe(result => {
      this.id=result.emp.id;
      this.val=result.emp.name;
      console.log(`Dialog result: ${result.emp}`);
      this.updateEmployee(id1,this.id,this.val,result.emp.contact?result.emp.contact:'',result.emp.image?result.emp.image:'',result.emp.token?result.emp.token:'')
    });
  }
  updateEmployee(id:string,id3:string,value:string,cntc:string,img:string,tkn:string){
    const bookDocRef = doc(this.firestore, `orders/${id}`);
  return updateDoc(bookDocRef, { employeeName:value,employeeId:id3,employeeContact:cntc,employeeImage:img,employeeToken:tkn });
  }
  

}
