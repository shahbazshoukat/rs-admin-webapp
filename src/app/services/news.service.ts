import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class NewsService {

    constructor (private http: HttpClient) {}

    addNews(title: string, link: string, description: string) {

        const newsData: any = { title: title, link: link, description: description};

        return this.http.post<{success: boolean, message: string, data: any}>('/api/news', newsData);

    }

    getNewsById(newsId) {

        return this.http.get<{success: boolean, message: string, data: any}>(`/api/news/${newsId}`);

    }

    getAllNews() {

        return this.http.get<{success: boolean, message: string, data: any}>('/api/news');

    }

    updateNews( newsId: string, title: string, link: string, description: string ) {

        const update = { title: title, link: link, description: description };

        return this.http.put<{success: boolean, message: string, data: any}>(`/api/news/${newsId}/update`, update);

    }

    deleteNews(newsId: string) {

        return this.http.delete<{success: boolean, message: string, data: any}>(`/api/news/${newsId}/delete`);

    }

}


