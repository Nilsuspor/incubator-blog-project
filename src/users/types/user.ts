
export type User ={
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string; 
    emailConfirmation?:{
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}