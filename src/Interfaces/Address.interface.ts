export interface Address {
    street?: string;
    suite?: string;
    city?: string;
    zipcode?: number;
    geo?: {
        lat?: number,
        lng?: number
    }
}
