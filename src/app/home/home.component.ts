import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Users,ServiceService } from '../services/service.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { doc,Firestore, updateDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  users:Users[]=[]
  displayedColumns: string[] = ['image','name','phone','email','isBlocked'];
  dataSource!: MatTableDataSource<Users>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(public service:ServiceService,public firestore:Firestore) { }

  ngOnInit(): void {
    this.service.getUsers().subscribe((res: Users[]) => {
      this.users = res;
    this.dataSource = new MatTableDataSource(res);
      console.log(this.users)
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
    const bookDocRef = doc(this.firestore, `users/${id}`);
  return updateDoc(bookDocRef, { isBlocked: block });
  }



}
