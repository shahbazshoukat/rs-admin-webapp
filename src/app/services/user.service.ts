import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@app/models';
import { environment as ENV } from '@env/environment';


@Injectable({ providedIn: 'root' })
export class UsersService {

    constructor(private http: HttpClient) {}

    signup(name: string, email: string, password: string) {
        const user: User = {
          _id: null,
          name: name,
          email: email,
          password: password
        };
        return this.http.post<{message: string}>('/api/signUp', user);
    }

    addUser(user) {

        return this.http.post<{success: boolean, message: string, data: any}>('/api/signUp', user);

    }

    getUserById(userId) {

        return this.http.get<{success: boolean, message: string, data: any}>(`/api/user/${userId}`);

    }

    getAllUsers() {

        return this.http.get<{success: boolean, message: string, data: any}>('/api/users');

    }

    updateUser(userId: string, update: any) {

        return this.http.put<{success: boolean, message: string, data: any}>(`/api/user/${userId}/update`, update);

    }

    deleteUser(userId: string) {

        return this.http.delete<{success: boolean, message: string, data: any}>(`/api/user/${userId}/delete`);

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

    getCurrentUser() {

        const appState = JSON.parse(localStorage.getItem(ENV.stores.appState) || '{}');

        if (appState && appState.loggedIn && appState.user && appState.user.token) {

            return appState.user;

        } else {

            return null;

        }

    }

    isAuthenticated() {

        const appState = JSON.parse(localStorage.getItem(ENV.stores.appState) || '{}');

        return !!(appState && appState.loggedIn && appState.user && appState.user.token);

    }

    logout() {

        return this.http.get<{success: boolean, message: string}>('/api/logout');

    }

}
