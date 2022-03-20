import { Component, OnInit, ViewChild,Output,Input,  
  EventEmitter } from '@angular/core';

import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Employee, Orders, ServiceService } from '../services/service.service';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.css']
})
export class EmployeeDialogComponent implements OnInit {
  employee:Employee[]=[];
  orders:Orders[]=[];
  @ViewChild('shoes') Selected:any;
  
  constructor(public service:ServiceService,public firestore:Firestore,public dialogRef: MatDialogRef<EmployeeDialogComponent>) { }

  ngOnInit(): void {
    this.service.getEmployee().subscribe((res: Employee[]) => {
      this.employee = res;
    })
    this.service.getOrders().subscribe((res: Orders[]) => {
      this.orders = res;
    })
  }

  doAction(){
    this.dialogRef.close({emp:this.Selected.selectedOptions.selected[0]?.value});
    console.log(this.Selected.selectedOptions.selected[0].value)
  }



}
