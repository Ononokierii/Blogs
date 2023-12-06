import type { ResponseBase } from "./";

export type BlogInfo = {
  id: string;
  title: string;
  content: string;
  category_id: string;
  create_time?: string;
  update_time?: string;
};

export type BlogResponse = ResponseBase & {
  data: {
    result: BlogInfo[];
    total: number;
  };
};

export type SearchConditions = {
  currentCategoryId: string;
  keyword: string;
};
