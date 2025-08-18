import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function hashPassword(plainPassword) {
    return await bcrypt.hash(plainPassword,saltRounds);
}

export async function verifyPassword(plainPassword,hashedPassowrd) {
    return await bcrypt.compare(plainPassword,hashedPassowrd);
}

