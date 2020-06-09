import { Injectable } from '@angular/core';
import { HttpParams, HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {FormGroup} from '@angular/forms';
import { User } from '../models/user';
import { Response } from '../models/generic-response';
import { Md5 } from 'ts-md5/dist/md5';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getUser(): User {
    if (localStorage.getItem('User')) {
      return JSON.parse(localStorage.getItem('User'));
    } else {
      // return {
      //   u_id: 'A001',
      //   type: 'admin',
      //   u_name: '黄元敏',
      //   gender: '男',
      //   description: 'user desc',
      //   image: 'http://123.56.219.88/SuperNova/UploadImage/default.jpg',
      //   token: '',
      //   password: '',
      //   status: true,
      // };
      // return {
      //   u_id: 'T001',
      //   type: 'teacher',
      //   u_name: '黄元敏',
      //   gender: '男',
      //   description: 'user desc',
      //   image: 'http://123.56.219.88/SuperNova/UploadImage/default.jpg',
      //   token: '',
      //   password: '',
      //   status: true,
      // };
      return {
        u_id: 'S001',
        type: 'student',
        u_name: '黄元敏',
        gender: '男',
        description: 'user desc',
        image: 'http://123.56.219.88/SuperNova/UploadImage/default.jpg',
        token: '',
        password: '',
        status: true,
      };
    }
  }

  getGroupersByProjectId(projectId: number) {
    const params = new HttpParams({
      fromObject: {
        pbl_token: String(this.getUser().token),
        p_id: String(projectId),
      },
    });
    return this.http.get<Response<{ leader: string; groupers: User[] }>>(
      '/api/searchGroupers',
      { params }
    );
  }
  logout(): void {
    localStorage.removeItem("User");
    this.router.navigate(['/passport/login']);
  }

  checkValidId(thisu_id :number){
    const params = new HttpParams({fromObject:{
      u_id :String(thisu_id),
    }})
    return this.http.get<any>(`/account/searchId`,{params});
  }
  register(validateForm:FormGroup){
    let headers = {
      headers: new HttpHeaders({
        'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
      })
    }
    // const params = new HttpParams({ fromObject: {
    //   u_id: validateForm.controls.id.value,
    //   u_name:validateForm.controls.name.value,
    //   gender:validateForm.controls.gender.value,
    //   password:validateForm.controls.password.value,
    // }});
    const params = {
      u_id: "S"+validateForm.controls.id.value,
      u_name:validateForm.controls.name.value,
      gender:validateForm.controls.gender.value,
      password:Md5.hashStr(validateForm.controls.password.value),
      description: ""
    };
    return this.http.post<Response<{user: User,image:string}>>(`/account/register`,this.transformRequest(params), {headers: new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded'
            })
      
          });
      

  }

  transformRequest(data) {

            var str = '';
    
            for (var i in data) {
    
              str += i + '=' + data[i] + '&';
    
            }
    
            str.substring(0, str.length - 1);
    
            return str;
    
      };
}

