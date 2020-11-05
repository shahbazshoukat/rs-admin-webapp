import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@app/models';


@Injectable({ providedIn: 'root' })
export class UsersService {

  username = '';

  constructor(private http: HttpClient) {}

  setUserName(name: string) {

    this.username = name;

  }

  addUser(name: string, email: string, password: string) {
    const user: User = {
      _id: null,
      name: name,
      email: email,
      password: password
    };
    return this.http.post<{message: string}>('/api/signUp', user);
  }

  loginUser(email: string, password: string) {
    const authData = { email: email, password: password };
    return this.http
      .post<{
        data: {
          token: string;
        expiresIn: number;
        userId: string;
        name: string;
        email: string;
        };
        message: string;
        success: boolean;
      }>('/api/login', authData);
  }

  logout() {
    return this.http.get<{success: boolean, message: string}>('/api/logout');
  }

}
