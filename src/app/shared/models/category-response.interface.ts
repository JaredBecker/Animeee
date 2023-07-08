export interface CategoryResponse {
    data: any | any[];
    meta: {
        count: number;
    }
    links: {
        first: string;
        next: string;
        last: string;
    }
}
