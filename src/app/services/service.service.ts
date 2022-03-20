import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword,signInWithEmailAndPassword, getAuth,RecaptchaVerifier,signInWithPhoneNumber } from '@angular/fire/auth';
import { Firestore,collection,collectionData, doc, updateDoc, setDoc, docData, addDoc, where, query, documentId, deleteDoc } from '@angular/fire/firestore';
import { from, Observable, switchMap } from 'rxjs';

import { Storage,ref,UploadTask, uploadBytes, getDownloadURL } from '@angular/fire/storage';


export interface Users {
  id: string;
  email:string;
  feedback : Map<string,string>;
  image:string;
  isBlocked:boolean;
  name : string;
  phone: string;
  token:string;
  walletAmount:number;
}

export interface Employee {
  id: string;
  age:string;
  image:string;
  isAvailable:boolean;
  isBlocked:boolean;
  location:string;
  name : string;
  phone: string;
  review : Map<string,string>;
  serviceId:Array<Map<string,string>>;
  token:string;
}
export interface Supervisor {
  id: string;
  employeeId:Array<Map<string,string>>;
  image:string;
  name : string;
  password: string;
  phone: string;
  isBlocked:boolean;
}

export interface Orders {
  id: string;
  complaint:string;
  completed:boolean;
  customerContact:string;
  customerId:string;
  customerName : string;
  customerToken:string;
  date:string;
  employeeContact:string;
  employeeName:string;
  employeeToken:string;
  feedback:string;
  paymentId:string
  paymentMethod:string;
  razorpayOrderId:string;
  razorpaySignature:string;
  serviceId:string;
  status: string;
  subscriptionAmount :string;
  subscriptionDetails:Map<string,string>;
  subscriptionId:string;
  superVisorId:string;
  userAddress:string;
  userCity:string;
  userGender:string;
  userHouseType:string;
  userLandmark:string;
  userPincode:string;
  userSqftArea:string;
  user_requirements:string;
  validty:string;
}

export interface Services {
  id: string;
  images:Array<string>;
  name : string;
  subscription:Array<Map<string,string>>;
}

export interface Services2 {
  images:Array<string>;
  name : string;
  subscription:Array<Map<string,string>>;
}

export interface General{
id:string;
imageUrl:Array<string>;
}

export interface Admin{
  id:string;
  email:string;
  password:string;
  }

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private firestore: Firestore,public storage:Storage) { }
  private basePath = '/uploads';
  private basePath2 = '/services';
  pushFileToStorage(fileUpload: File,name:string): Observable<string> {
    const filePath = `${this.basePath}/${name}`;
    const storageRef = ref(this.storage,filePath);
    const uploadTask = from(uploadBytes(storageRef, fileUpload));
    return uploadTask.pipe(
      switchMap((result)=> getDownloadURL(result.ref))
    )
  }

  pushFileToStorage2(fileUpload: File,name:string): Observable<string> {
    const filePath = `${this.basePath2}/${name}`;
    const storageRef = ref(this.storage,filePath);
    const uploadTask = from(uploadBytes(storageRef, fileUpload));
    return uploadTask.pipe(
      switchMap((result)=> getDownloadURL(result.ref))
    )
  }


  getUsers() : Observable<Users[]>  { 
    return collectionData(collection(this.firestore,"users"),{ idField: 'id' }) as Observable<Users[]>;
    
 }
 getEmployee() : Observable<Employee[]>  { 
  return collectionData(collection(this.firestore,"employees"),{ idField: 'id' }) as Observable<Employee[]>;
  
}

getSupervisor() : Observable<Supervisor[]>  { 
  return collectionData(collection(this.firestore,"supervisors"),{ idField: 'id' }) as Observable<Supervisor[]>;
  
}

getOrders() : Observable<Orders[]>  { 
  return collectionData(collection(this.firestore,"orders"),{ idField: 'id' }) as Observable<Orders[]>;
  
}

getImages():Observable<General[]>{
  return collectionData(collection(this.firestore,"generalData"),{ idField: 'id' }) as Observable<General[]>;
}

getServices():Observable<Services[]>{
  return collectionData(collection(this.firestore,"services"),{ idField: 'id' }) as Observable<Services[]>;
}

getAdmin():Observable<Admin[]>{
  return collectionData(collection(this.firestore,"admin"),{ idField: 'id' }) as Observable<Admin[]>;
}

addService(book: Services2) {
  const booksRef = collection(this.firestore, 'services'); 
  return addDoc(booksRef, book);
}

deleteService(id: String) {
  const bookDocRef = doc(this.firestore, `services/${id}`);
  return deleteDoc(bookDocRef);
}

}

export class FileUpload {
  name: string='';
  url: string='';
}

export class FileUpload2 {
  url: Array<string>=[];
}
