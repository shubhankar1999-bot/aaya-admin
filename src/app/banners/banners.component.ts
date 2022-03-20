import { Component, OnInit } from '@angular/core';
import { Database } from '@angular/fire/database';
import { Storage,ref,UploadTask, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { HotToastService } from '@ngneat/hot-toast';
import { finalize, from, Observable, switchMap } from 'rxjs';
import { FileUpload, General, ServiceService } from '../services/service.service';
import * as uuid from 'uuid';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
  img=''
   myId = uuid.v4();
   banners:General[]=[]
   images: Array<FileUpload> = [];
   imgSrc:any='https://via.placeholder.com/150'
   data: FileUpload={
     name: '',
     url: ''
   }
  constructor(private firestore: Firestore, private storage: Storage,private service:ServiceService,private toast: HotToastService,) { }
  

  ngOnInit(): void {
    this.service.getImages().subscribe((res: General[]) => {
      this.images=[]
      this.banners = res;
      for(let i of this.banners){
        if(i.id=='banners'){
          for(let j of i.imageUrl){
            this.data=JSON.parse(JSON.stringify(j))
            console.log(JSON.parse(JSON.stringify(j)))
            this.images.push(this.data)
          }
        }
      }
      console.log(this.images)
    })
    
  }

  deleteFileFromStorage(name:string){
    const filePath = `uploads/${name}`;
    const storageRef = ref(this.storage,filePath);
    deleteObject(storageRef).then(()=>{
      this.toast.observe({
        loading: 'Uploading profile image...',
        success: 'Image uploaded successfully',
        error: 'There was an error in uploading the image',
      })
    })
let sample=[]
    for(let k of this.images){
      if(k.name!=name){
        sample.push(k)
      }
    }
    console.log(sample)
    const bookDocRef = doc(this.firestore, `generalData/banners`);
  return updateDoc(bookDocRef, { imageUrl:sample });
  }



  uploadImage(event:any){
    this.service.pushFileToStorage(event.target.files[0],event.target.files[0].name)
    .pipe(
      this.toast.observe({
        loading: 'Uploading profile image...',
        success: 'Image uploaded successfully',
        error: 'There was an error in uploading the image',
      }),
      switchMap((photoURL) => {
        this.updateBanners(photoURL,event.target.files[0].name);
        return this.images=[]
      }

      )
    ).subscribe()

    const reader = new FileReader();
    reader.onload = e => this.imgSrc = reader.result;
    reader.readAsDataURL(event.target.files[0]);
  }

  updateBanners(value:string,key1:string){
    
    this.data={
      name:key1,
      url:value
    }
    this.images.push(this.data)
    console.log(this.images.length)
    const bookDocRef = doc(this.firestore, `generalData/banners`);
  return updateDoc(bookDocRef, { imageUrl:this.images });
  }

}
