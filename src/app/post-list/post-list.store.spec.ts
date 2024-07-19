import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { createSpyFromClass } from 'jest-auto-spies';

import { PostDetails, PostListStore } from './post-list.store';
import { PostListService } from './post-list.service';
import { of } from 'rxjs';

describe('PostListStore', () => {
  const MOCK_API_RESPONSE: PostDetails[] = [
    {
      userId: 1,
      id: 1,
      title: 'test title 1',
      body: 'test body 1',
    },
    {
      userId: 1,
      id: 2,
      title: 'test title 2',
      body: 'test body 2',
    },
  ];
  function setup({ isApiFailed = false }: { isApiFailed?: boolean } = {}) {
    const mockService = createSpyFromClass(PostListService);

    if (isApiFailed) {
      mockService.get.throwWith({
        message: 'API Failed',
      });
    } else {
      mockService.get.mockReturnValue(of(MOCK_API_RESPONSE));
    }

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PostListStore,
        provideHttpClient(),
        {
          provide: PostListService,
          useValue: mockService,
        },
      ],
    });

    const store = TestBed.inject(PostListStore);

    return {
      mockService,
      store,
    };
  }

  it('will call API and return post list', () => {
    const { store, mockService } = setup();

    expect(mockService.get).toHaveBeenCalledTimes(1);
    expect(store.postDetails()).toStrictEqual(MOCK_API_RESPONSE);
  });

  it('will verify API is failed', () => {
    const { store, mockService } = setup({ isApiFailed: true });

    expect(mockService.get).toHaveBeenCalledTimes(1);
    expect(store.callState()).toStrictEqual({
      errorMsg: 'API Failed',
    });
  });
});
