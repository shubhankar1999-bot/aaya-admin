import { Component, OnInit, ViewChild } from '@angular/core';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Employee, ServiceService } from '../services/service.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  
  displayedColumns: string[] = ['image','name','phone','salary','isAvailable','isBlocked','attendance','review'];
  employee:Employee[]=[]
  attendance:any[]=[]
  reviews:any[]=[]
  dataSource!: MatTableDataSource<Employee>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(public service:ServiceService,public firestore:Firestore) { }

  ngOnInit(): void {
    this.service.getEmployee().subscribe((res: Employee[]) => {
      this.employee = res;
    this.dataSource = new MatTableDataSource(res);
      console.log(this.employee)
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
  blockUser(id:String,isblock:boolean){
    let block = true
    if(isblock){
      block=false
    }
    const bookDocRef = doc(this.firestore, `employees/${id}`);
  return updateDoc(bookDocRef, { isBlocked: block });
  }
emplo=''

checkAttendance(val:Array<string>,emp:string){
for(let i of val){
  this.attendance.push(i)
}
this.emplo=emp
this.openPopup()
}

checkReview(val:Array<Map<string,string>>,emp:string){
  for(let i of val){
    this.reviews.push(i)
  }
  this.emplo=emp
  this.openPopup2()
  }

displayStyle = "none";
displayStyle2 = "none";

openPopup2(){
  this.displayStyle2="block";
}
closePopup2(){
  this.displayStyle2="none";
  this.reviews=[]
}  

openPopup() {
  this.displayStyle = "block";
}
closePopup() {
  this.displayStyle = "none";
  this.attendance=[]
}
}
