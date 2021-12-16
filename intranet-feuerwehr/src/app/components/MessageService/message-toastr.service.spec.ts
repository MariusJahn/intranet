import { TestBed } from '@angular/core/testing';

import { MessageToastrService } from './message-toastr.service';

describe('MessageToastrService', () => {
  let service: MessageToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
