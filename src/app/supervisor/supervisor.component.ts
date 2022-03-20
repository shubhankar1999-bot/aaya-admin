import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Employee, ServiceService, Supervisor } from '../services/service.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { AddSupervisorComponent } from '../add-supervisor/add-supervisor.component';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css']
})
export class SupervisorComponent implements OnInit {
  id='';
  val:any=[];
  displayedColumns: string[] = ['image','name','phone','employee','isBlocked','addEmployee'];
  supervisor:Supervisor[]=[]
  dataSource!: MatTableDataSource<Supervisor>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(public service:ServiceService,public firestore:Firestore,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.service.getSupervisor().subscribe((res: Supervisor[]) => {
      this.supervisor = res;
    this.dataSource = new MatTableDataSource(res);
      console.log(this.supervisor)
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
    const bookDocRef = doc(this.firestore, `supervisors/${id}`);
  return updateDoc(bookDocRef, { isBlocked: block });
  }
  openDialog(id1:string) {
    const dialogRef = this.dialog.open(AddSupervisorComponent,{width: '400px',});

    dialogRef.afterClosed().subscribe(result => {
      let i=[]
      for(let res of (result.emp)){
        this.val.push(res.value.id)
        i.push(res.value.name)
      }
      console.log(`Dialog result: ${result}`);
      this.updateEmployee(id1,this.val,i)
    });
  }
  updateEmployee(id:string,value:Array<Map<string,string>>,value2:Array<Map<string,string>>){
    const bookDocRef = doc(this.firestore, `supervisors/${id}`);
  return updateDoc(bookDocRef, { employeeId:value,employeeName:value2 });
  }
}
