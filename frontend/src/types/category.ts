import type { ResponseBase } from "./";

export type CategoryInfo = {
  id: string;
  name: string;
};

export type CategoryResponse = ResponseBase & {
  data: {
    result: CategoryInfo[];
  };
};
