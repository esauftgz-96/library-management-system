import bcrypt from 'bcrypt';

const password = 'password';
const saltRounds = 10;

async function generateHashes(count) {
  for (let i = 0; i < count; i++) {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`Hash ${i + 1}: ${hash}`);
  }
}

generateHashes(5);
