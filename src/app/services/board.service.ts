import { Board } from '@app/models';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class BoardService {

  constructor (private http: HttpClient) {}

  addBoard(
    _id: null,
    key: string,
    title: string,
    description: string,
    province: string,
    city: string,
    examTypes: object[],
    sections: string[],
    type: string,
    webUrl: string,
    resultUrl: string,
    tags: string[],
    domain: string
  ): Observable<any> {
    const boardData: Board = {
      _id: _id,
      key: title.replace(/\s/g, '-'),
      title: title,
      description: description,
      province: province,
      city: city,
      examTypes: examTypes,
      sections: sections,
      type: type,
      webUrl: webUrl,
      resultUrl: resultUrl,
      tags: tags,
      domain: domain
    };
    return this.http.post<{success: boolean, message: string, data: any}>('/api/admin/board', boardData);
  }

  getAllBoards(): Observable<any> {
    return this.http.get<{success: boolean, message: string, data: any}>( '/api/admin/admin/boards');
  }

  getBoardById(boardId: string): Observable<any> {
    return this.http.get<{success: boolean, message: string, data: any}>('/api/admin/board/' + boardId);
  }

  getBoardBySectionTitle(sectionTitle: string): Observable<any> {
    return this.http.get<{success: boolean, message: string, data: any}>('/api/admin/boards/section/' + sectionTitle);
  }

  getBoardsBySectionId(sectionId: string): Observable<any> {
    return this.http.get<{success: boolean, message: string, data: any}>('/api/admin/boards/section/' + sectionId);
  }

  updateBoard(
    boardId: string,
    key: string,
    title: string,
    description: string,
    province: string,
    city: string,
    examTypes: object[],
    sections: string[],
    type: string,
    webUrl: string,
    resultUrl: string,
    tags: string[],
    domain: string
  ): Observable<any> {
    const update = {
      key: title.replace(/\s/g, '-'),
      title: title,
      description: description,
      province: province,
      city: city,
      examTypes: examTypes,
      sections: sections,
      type: type,
      webUrl: webUrl,
      resultUrl: resultUrl,
      tags: tags,
      domain: domain
     };

     return this.http.put<{success: boolean, message: string, data: any}>('/api/admin/updateBoard/' + boardId, update);
  }


  deleteBoard(boardId: string): Observable<any> {
    return this.http.delete<{success: boolean, message: string, data: any}>('/api/admin/deleteBoard/' + boardId);
  }

  addComment(boardId, comment) {

    return this.http.post<{success: boolean, message: string, data: any}>(`/api/admin/board/comment/${boardId}`, comment);

  }

  removeComment(boardId, commentId) {

    return this.http.delete<{success: boolean, message: string, data: any}>(`/api/admin/board/comment/${boardId}/${commentId}`);

  }

}


