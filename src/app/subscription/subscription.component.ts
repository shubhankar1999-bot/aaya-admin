import { Component, OnInit, ViewChild } from '@angular/core';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { isEmpty } from '@firebase/util';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';
import { General, Services, Services2, ServiceService } from '../services/service.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  servi:Services2={
    images: [],
    name: '',
    subscription: []
  }
   imgSrc:any='https://via.placeholder.com/150'

  userForm!: FormGroup;
  userForm2!: FormGroup;
  services:Services[]=[]
  displayedColumns: string[] = ['image','name','button','delete'];
  dataSource!: MatTableDataSource<Services>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(public service:ServiceService,public firestore:Firestore,public formBuilder: FormBuilder,private toast: HotToastService) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      duration: [0, [Validators.required]],
      perPersonCharge: [0, [Validators.required]],
      basePrice: [0, [Validators.required]],
      isBest: ['', [Validators.required]],
      points: ['', [Validators.required]],
    })

    this.userForm2 = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    })
    this.service.getServices().subscribe((res: Services[]) => {
      this.services = res;
      this.dataSource = new MatTableDataSource(res);
      console.log(this.services)
      this.dataSource.paginator = this.paginator;
    })
  }
  get getControl(){
    return this.userForm.controls;
  }

  get getControl2(){
    return this.userForm2.controls;
  }

  submitForm(){
    return 0
  }

  deleteImage(id:String){
    this.service.deleteService(id)
  }

  uploadData(event:any){
    console.log(this.userForm2.get('name')?.value)
    if(this.userForm2.get('name')?.value.length >1){
      this.service.pushFileToStorage2(event.target.files[0],event.target.files[0].name)
    .pipe(
      this.toast.observe({
        loading: 'Uploading profile image...',
        success: 'Image uploaded successfully',
        error: 'There was an error in uploading the image',
      }),
      switchMap((photoURL) => {
        return this.addServices(photoURL,this.userForm2.get('name')?.value);
      }

      )
    ).subscribe()

    const reader = new FileReader();
    reader.onload = e => this.imgSrc = reader.result;
    reader.readAsDataURL(event.target.files[0]);
    }
    else{
      this.toast.show("Enter Title of Service First and Refresh to Upload same Image")
      this.userForm2.setValue({name:''})
    }
  }

  addServices(value:string,key1:string){
    let p=[]
    p.push(value)
    
    this.servi={
      name:key1,
      images:p,
      subscription:[]
    }
    return this.service.addService(this.servi)
  }
displayStyle2="none"
  toggleOn(){
this.displayStyle2="block"
  }

  toggleOff(){
    this.displayStyle2="none"
      }

  updateForm(a:string){
    localStorage.setItem('sid',a)
    for( let i of this.services){
      const k=JSON.parse(JSON.stringify(i))
      if(i.id==a){
        console.log(k)
        let p:string=''
        for(let v of k.subscriptions[0].points){
          p=p+v+','
        }
        let q=p.replace(/(^[,\s]+)|([,\s]+$)/g, '');
        
        this.userForm.setValue({
          name:(k.subscriptions[0].name),
          description:k.subscriptions[0].description,
          duration:k.subscriptions[0].duration,
          perPersonCharge:k.subscriptions[0].perPersonCharge,
          basePrice:k.subscriptions[0].basePrice,
          isBest:k.subscriptions[0].isBest,
          points:k.subscriptions[0].points?q:'',
        })
      }
      else{
        this.userForm.setValue({
          name:'',
          description:'',
          duration:0,
          perPersonCharge:0,
          basePrice:0,
          isBest:'',
          points:'',
        })
      }
    }
    
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

  displayStyle = "none";
  
openPopup(id:string) {
  this.updateForm(id)
  this.displayStyle = "block";
}
closePopup() {
  this.displayStyle = "none";
}

addService(){

}

onSubmit(){
  
  if((this.userForm.get('name')?.value !='') || (this.userForm.get('description')?.value !='') || (this.userForm.get('basePrice')?.value !='') || (this.userForm.get('pricePerPerson')?.value !='') || (this.userForm.get('duration')?.value !='') || (this.userForm.get('isBest')?.value !='')){
    var str = this.userForm.get('points')?.value
    console.log(str)
    let q=''
    var splitted = typeof(str)==typeof(q)?str.toString().split(","):str
    
    this.userForm.patchValue({points:splitted})

    const k=localStorage.getItem('sid')
    this.toast.show("Upload Successfull")
    const bookDocRef = doc(this.firestore, `services/${k}`);
  return updateDoc(bookDocRef, { subscriptions: [this.userForm.value] }).then((v)=>{
    ()=>this.toast.show("Upload Successfull"+v)
  }).catch((e)=>this.toast.show("Upload Failed"))
  }
  else{
    return this.toast.show(
      "Please check if any field is Empty !"
    )
  }
}

}
