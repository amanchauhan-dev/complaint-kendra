export type Email = {
    date: Date;
    html?: string;
    text?: string;
    subject?: string;
    from: string;
    uid: number | string;
}