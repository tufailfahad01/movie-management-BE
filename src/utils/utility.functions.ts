import { BadRequestException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';



export async function hashPassword(userPassword: string) {
    const saltOrRounds = parseInt(process.env.Salt_Or_Rounds)
    const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
    return hashedPassword
}

export async function comparePassword(userPassword: string, storedPassword: string) {
    const verifyPassword = await bcrypt.compare(userPassword, storedPassword);
    if (!verifyPassword) {
        throw new BadRequestException('Invalid Credentials')
    }
    return verifyPassword
}

export function isEmailOrPhoneNumber(username: string): 'email' | 'phone' | 'neither' {
    const emailRegex = /^[a-zA-Z_][a-zA-Z0-9_.]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    if (emailRegex.test(username)) {
        return 'email';
    } else if (phoneRegex.test(username)) {
        return 'phone';
    } else {
        throw new BadRequestException('Invalid Username')
    }
}

export function generateRandom4DigitNumber() {
    const random4DigitNumber = Math.floor(Math.random() * 10000);
    const formattedNumber = String(random4DigitNumber).padStart(4, '0');
    return formattedNumber;
}

export function generateRandomPassword(): string {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const specialChars = '@$!%*?&';
    const digits = '0123456789';

    const minLength = 8;
    let password = '';

    password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    password += digits[Math.floor(Math.random() * digits.length)];

    const remainingLength = minLength - password.length;
    const allChars = uppercaseChars + lowercaseChars + specialChars + digits;
    for (let i = 0; i < remainingLength; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join(''); 

    return password;
}