export interface Task{
    id:number;
    title:string;
    description:string|null;
    dueDate:Date;
    dueTime:string;
    completed:boolean;
    userId:number;
}