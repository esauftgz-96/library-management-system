// import bcrypt from 'bcrypt';

// const saltRounds = 10;

// export async function hashPassword(plainPassword) {
//     return await bcrypt.hash(plainPassword,saltRounds);
// }

// export async function verifyPassword(plainPassword,hashedPassowrd) {
//     return await bcrypt.compare(plainPassword,hashedPassowrd);
// }

// bcrypt doesnt work in the frontend, use brcryptjs instead

import bcrypt from 'bcryptjs';

const saltRounds = 10;

export async function hashPassword(plainPassword) {
    // bcryptjs's hash function supports callback or Promise, so you can await it
    return await bcrypt.hash(plainPassword, saltRounds);
}

export async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
