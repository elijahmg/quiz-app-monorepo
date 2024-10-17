import { z, ZodError } from 'zod'

export function schemaValidator<T>(schema: z.ZodObject<any, any>, data: T) {
  try {
    schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Failed to validate data. ${error.message}`)
    }
  }
}
