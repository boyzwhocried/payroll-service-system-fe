import { TestBed } from '@angular/core/testing';

import { ClientAssignmentService } from './client-assignment.service';

describe('ClientAssignmentService', () => {
  let service: ClientAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientAssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
