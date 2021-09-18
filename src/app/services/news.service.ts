import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class NewsService {

    constructor (private http: HttpClient) {}

    addNews(body) {

        return this.http.post<{success: boolean, message: string, data: any}>('/api/admin/news', body);

    }

    getNewsById(newsId) {

        return this.http.get<{success: boolean, message: string, data: any}>(`/api/admin/news/${newsId}`);

    }

    getAllNews() {

        return this.http.get<{success: boolean, message: string, data: any}>('/api/admin/news');

    }

    updateNews(params, body) {

        return this.http.put<{success: boolean, message: string, data: any}>(`/api/admin/news/${params.newsId}/update`, body);

    }

    deleteNews(newsId: string) {

        return this.http.delete<{success: boolean, message: string, data: any}>(`/api/admin/news/${newsId}/delete`);

    }

}


