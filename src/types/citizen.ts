
export interface Citizen {
  id: number;
  age: number;
  city: string;
  name: string;
  someNote?: string;
}

export interface CitizenFormData {
  age: number;
  city: string;
  name: string;
  someNote: string;
}
