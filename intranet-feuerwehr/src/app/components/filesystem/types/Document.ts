export interface Document {
  documentID: number;
  title: string;
  validity: number; // 0 oder 1
  creationDate: Date;
  alterationDate: Date;
  parent: string;
  category: string;
  formData: FormData;
}

