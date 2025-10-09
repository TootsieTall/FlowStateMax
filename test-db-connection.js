#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests connection to Supabase PostgreSQL database
 */

const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  console.log('🔍 Testing database connection...\n')
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set!')
    console.log('\n📝 To fix this:')
    console.log('1. Create apps/web/.env.local file')
    console.log('2. Add your Supabase connection string:')
    console.log('   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.iqdomkoxncawrzwrrydr.supabase.co:5432/postgres?sslmode=require"')
    process.exit(1)
  }
  
  console.log('✅ DATABASE_URL is set')
  console.log(`   Connection: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`)
  
  const prisma = new PrismaClient()
  
  try {
    // Test basic connection
    console.log('🔌 Attempting to connect to database...')
    await prisma.$connect()
    console.log('✅ Connected successfully!\n')
    
    // Test query
    console.log('🔍 Testing query...')
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query successful!')
    console.log(`   Result: ${JSON.stringify(result)}\n`)
    
    // Check if tables exist
    console.log('📋 Checking database tables...')
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found in database!')
      console.log('   Run: npm run db:push --workspace=@flowstate/web')
      console.log('   to create tables from your Prisma schema\n')
    } else {
      console.log(`✅ Found ${tables.length} tables:`)
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`)
      })
      console.log('')
    }
    
    // Check User table
    console.log('👤 Checking User table...')
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ User table exists with ${userCount} user(s)\n`)
    } catch (error) {
      console.log('⚠️  User table not accessible')
      console.log(`   Error: ${error.message}\n`)
    }
    
    console.log('🎉 Database connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error(`   Error: ${error.message}`)
    console.error(`   Code: ${error.code || 'N/A'}`)
    
    if (error.code === 'P1001') {
      console.log('\n💡 Connection timeout - possible causes:')
      console.log('   1. Incorrect database URL')
      console.log('   2. Database is paused (Supabase free tier pauses after inactivity)')
      console.log('   3. Firewall blocking connection')
      console.log('   4. Invalid password in connection string')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

