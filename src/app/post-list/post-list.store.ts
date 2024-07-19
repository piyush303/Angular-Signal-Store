import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, pipe, switchMap, tap } from 'rxjs';
import { PostListService } from './post-list.service';

type LoadingState = 'init' | 'loading' | 'loaded';
interface ErrorState {
  errorMsg: string;
}

type CallState = LoadingState | ErrorState;

export interface PostDetails {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface PostListState {
  postDetails: PostDetails[];
  callState: CallState;
}

const INITIAL_STATE: PostListState = {
  postDetails: [],
  callState: 'init',
};

export const PostListStore = signalStore(
  withState(INITIAL_STATE),
  withComputed((store) => ({
    isLoading: computed(() => store.callState() === 'init'),
  })),
  withMethods((store, postListService = inject(PostListService)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { callState: 'loading' });
        }),
        switchMap(() => {
          return postListService.get().pipe(
            map((response: any) => {
              return patchState(store, {
                callState: 'loaded',
                postDetails: response,
              });
            }),
            catchError((err) => {
              patchState(store, { callState: { errorMsg: err.message } });
              return EMPTY;
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  })
);
