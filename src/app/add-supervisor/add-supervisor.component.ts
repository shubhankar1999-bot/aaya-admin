import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Employee, Orders, ServiceService } from '../services/service.service';

@Component({
  selector: 'app-add-supervisor',
  templateUrl: './add-supervisor.component.html',
  styleUrls: ['./add-supervisor.component.css']
})
export class AddSupervisorComponent implements OnInit {
  employee:Employee[]=[];
  orders:Orders[]=[];
  @ViewChild('shoes') Selected:any;

  constructor(public service:ServiceService,public dialogRef: MatDialogRef<AddSupervisorComponent>) { }

  ngOnInit(): void {
    this.service.getEmployee().subscribe((res: Employee[]) => {
      this.employee = res;
    })
  }
  doAction(){
    this.dialogRef.close({emp:this.Selected.selectedOptions.selected});
    console.log(this.Selected.selectedOptions.selected)
  }

}
