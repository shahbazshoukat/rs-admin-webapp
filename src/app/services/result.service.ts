import { Result } from '@app/models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class ResultService {

  constructor (private http: HttpClient) {}

  addResult(body) {
    return this.http.post<{success: boolean, message: string, data: any}>('/api/admin/result', body);
  }

  getLatestResults() {
    return this.http.get<{success: boolean, message: string, data: any}>('/api/admin/results/latest');
  }

  getResultById(resultId: string) {
    return this.http.get<{success: boolean, message: string, data: any}>('/api/admin/result/' + resultId);
  }

  getResultYears(selectedClassId, selectedBoardId) {
    return this.http.get<{success: boolean, message: string, data: any}>(`/api/admin/result-year/${selectedClassId}/${selectedBoardId}`);
  }

  getExamTypes(selectedClassId, selectedBoardId, year) {
    return this.http.get<{success: boolean, message: string, data: any}>(`/api/admin/exam-types/${selectedClassId}/${selectedBoardId}/${year}`);
  }

  getResult(section, board, year, exam) {
    return this.http.get<{success: boolean, message: string, data: any}>(`/api/admin/result/${section}/${board}/${year}/${exam}`);
  }

  getResultsByBoardKey(boardKey) {
    return this.http.get<{success: boolean, message: string, data: any}>(`/api/admin/results/board/${boardKey}`);
  }

  updateResult(params, body) {
      return this.http.put<{success: boolean, message: string, data: any}>(`/api/admin/updateResult/${params.resultId}`, body);
  }


  deleteResult(resultId: string) {
    return this.http.delete<{success: boolean, message: string, data: any}>('/api/admin/deleteResult/' + resultId);
  }

  changeResultStatus(resultId: string, value: boolean) {

    const update = {status: value};
    return this.http.put<{success: boolean, message: string, data: any}>('/api/admin/updateStatus/' + resultId, update);

  }

  addComment(resultId, comment) {

    return this.http.post<{success: boolean, message: string, data: any}>(`/api/admin/comment/${resultId}`, comment);

  }

  removeComment(resultId, commentId) {

    return this.http.delete<{success: boolean, message: string, data: any}>(`/api/admin/comment/${resultId}/${commentId}`);

  }

}
