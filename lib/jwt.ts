import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

interface JwtPayload {
  userId: string
  email: string
  isAdmin: boolean
  iat?: number
  exp?: number
}

export function signJwtToken(payload: Omit<JwtPayload, "iat" | "exp">, expiresIn = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export async function verifyJwtToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err)
      }
      resolve(decoded as JwtPayload)
    })
  })
}
