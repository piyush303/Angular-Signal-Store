import { Component, inject } from '@angular/core';
import { PostListStore } from './post-list.store';

@Component({
  selector: 'app-post-list',
  standalone: true,
  templateUrl: './post-list.component.html',
  providers: [PostListStore],
})
export class PostListComponent {
  readonly store = inject(PostListStore);
}
