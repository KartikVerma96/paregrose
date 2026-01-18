import { testDatabaseConnection } from '@/lib/db-test'

export async function GET() {
  try {
    const result = await testDatabaseConnection()
    return Response.json(result)
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
