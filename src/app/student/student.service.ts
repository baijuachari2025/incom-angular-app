import { Injectable } from '@angular/core';
import axios from 'axios';
import { API_END_POINT } from '../constants/api.constants';

axios.defaults.baseURL = API_END_POINT;

@Injectable({ providedIn: 'root' })
export class StudentService {
  searchByLastName(lastNameQuery: string) {
    return axios.get('api/students/searchByLastName', { params: { lastName: lastNameQuery } });
  }
}
