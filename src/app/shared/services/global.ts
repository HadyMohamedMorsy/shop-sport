
// Global types (models/entities)
export interface GlobalApiResponse {
  message: string;
  status: boolean;
  data: any;
  details : string
};

export interface FiltersData {
  [key: string]: any;
  start: number;
  length: number;
  order: { column: number | null, dir: "asc" | "desc" }[];
  columns: DataTableColumn[];
  search: { value: string | null, regex: boolean };
};


export interface DataTableColumn {
  title?: string | null;
  name?: string | null;
  searchable?: boolean | null;
  orderable?: boolean | null;
  search?: {
    value?: string | null;
    regex?: boolean | null;
  };
};