import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class ModelPaperService {

  constructor (private http: HttpClient) {}

  addModelPaper(body, file) {

    const fileExt = file.name.split('.').pop();

    const form = new FormData();

    form.append('file', file, 'testFle.jpg');

    form.append('data', JSON.stringify(body));

    return this.http.post<{success: boolean, message: string, data: any}>('/api/admin/model-paper', form);

  }

  getModelPaperById(modelPaperId: string) {

    return this.http.get<{success: boolean, message: string, data: any}>('/api/admin/model-paper/' + modelPaperId);

  }

  getModelPapersByBoardKey(boardKey) {

    return this.http.get<{success: boolean, message: string, data: any}>(`/api/admin/model-papers/board/${boardKey}`);

  }

  updateModelPaper(params, body) {

      return this.http.put<{success: boolean, message: string, data: any}>(`/api/admin/update-model-paper/${params.modelPaperId}`, body);

  }

  deleteModelPaper(modelPaperId: string) {

    return this.http.delete<{success: boolean, message: string, data: any}>('/api/admin/delete-model-paper/' + modelPaperId);

  }

  addComment(modelPaperId, comment) {

    return this.http.post<{success: boolean, message: string, data: any}>(`/api/admin/comment/${modelPaperId}`, comment);

  }

  removeComment(modelPaperId, commentId) {

    return this.http.delete<{success: boolean, message: string, data: any}>(`/api/admin/comment/${modelPaperId}/${commentId}`);

  }

}
