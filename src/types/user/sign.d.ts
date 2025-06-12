export interface SignInfoResponse {
    list: { [key: String]: SignInfo[] };
    code: number;
    message: string;
}
export interface SignInfo {
    signPoints: number;
    record: number;
    isSign: number;
    days: AnyObject;
    recommendGoods: AnyObject;
}
