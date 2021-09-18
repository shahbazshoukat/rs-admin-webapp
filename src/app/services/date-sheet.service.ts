import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Enums from '@app/app.enums';

@Injectable({providedIn: 'root'})
export class DateSheetService {

  constructor (private http: HttpClient) {}

  addDateSheet(body, file) {

    const fileExt = file.name.split('.').pop();

    const form = new FormData();

    form.append('file', file, 'testFle.jpg');

    form.append('data', JSON.stringify(body));

    return this.http.post<{success: boolean, message: string, data: any}>('/api/admin/date-sheet', form);

  }

  getDateSheetById(dateSheetId: string) {

    return this.http.get<{success: boolean, message: string, data: any}>('/api/admin/date-sheet/' + dateSheetId);

  }

  getDateSheetsByBoardKey(boardKey) {

    return this.http.get<{success: boolean, message: string, data: any}>(`/api/admin/date-sheets/board/${boardKey}`);

  }

  updateDateSheet(params, body) {

      return this.http.put<{success: boolean, message: string, data: any}>(`/api/admin/update-date-sheet/${params.dateSheetId}`, body);

  }

  deleteDateSheet(dateSheetId: string) {

    return this.http.delete<{success: boolean, message: string, data: any}>('/api/admin/delete-date-sheet/' + dateSheetId);

  }

  addComment(dateSheetId, comment) {

    return this.http.post<{success: boolean, message: string, data: any}>(`/api/admin/comment/${dateSheetId}`, comment);

  }

  removeComment(dateSheetId, commentId) {

    return this.http.delete<{success: boolean, message: string, data: any}>(`/api/admin/comment/${dateSheetId}/${commentId}`);

  }

}
