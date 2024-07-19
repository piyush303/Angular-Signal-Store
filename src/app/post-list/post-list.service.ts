import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PostListService {
  readonly API_URL = 'https://jsonplaceholder.typicode.com/todos';
  readonly httpClient = inject(HttpClient);

  get() {
    return this.httpClient.get(this.API_URL);
  }
}
