export interface Response {
    data: any | any[];
    links: {
        first: string;
        last: string;
        next: string;
    },
    meta: {
        count: number;
    }
    included?: any[];
}
