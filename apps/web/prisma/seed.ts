import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@flowstate.app' },
    update: {},
    create: {
      email: 'demo@flowstate.app',
      name: 'Demo User',
      onboardingComplete: true,
      goals: ['Career', 'Side Project', 'Learning'],
      podcastGenres: ['Technology', 'Business', 'Science', 'Personal Development', 'Health'],
      flowLocations: {
        create: [
          {
            name: 'Home Office',
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 100,
          },
          {
            name: 'Local Library',
            latitude: 40.7589,
            longitude: -73.9851,
            radius: 150,
          },
        ],
      },
      blockedApps: {
        create: [
          { name: 'Instagram', identifier: 'com.instagram.android' },
          { name: 'TikTok', identifier: 'com.zhiliaoapp.musically' },
          { name: 'Twitter', identifier: 'com.twitter.android' },
        ],
      },
      ritual: {
        create: [
          { text: 'Make coffee ☕', order: 1 },
          { text: 'Clear desk 🗂️', order: 2 },
          { text: 'Start music 🎵', order: 3 },
          { text: 'Enable DND 📵', order: 4 },
          { text: 'Close email 📧', order: 5 },
          { text: 'Take 3 deep breaths 🧘', order: 6 },
        ],
      },
    },
  })

  // Create sample time blocks for this week
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Monday
  startOfWeek.setHours(0, 0, 0, 0)

  const blocks = []
  for (let day = 0; day < 5; day++) {
    const blockDate = new Date(startOfWeek)
    blockDate.setDate(startOfWeek.getDate() + day)

    // Morning deep work block
    blocks.push({
      userId: demoUser.id,
      title: 'Deep Work Session',
      startTime: new Date(blockDate.setHours(9, 0)),
      endTime: new Date(blockDate.setHours(11, 0)),
      type: 'DEEP_WORK',
      color: '#1E3A8A',
    })

    // Afternoon meeting
    blocks.push({
      userId: demoUser.id,
      title: 'Team Standup',
      startTime: new Date(blockDate.setHours(14, 0)),
      endTime: new Date(blockDate.setHours(15, 0)),
      type: 'MEETING',
      color: '#6B7280',
    })

    // Afternoon deep work
    blocks.push({
      userId: demoUser.id,
      title: 'Project Work',
      startTime: new Date(blockDate.setHours(15, 30)),
      endTime: new Date(blockDate.setHours(17, 30)),
      type: 'DEEP_WORK',
      color: '#1E3A8A',
    })
  }

  await prisma.timeBlock.createMany({ data: blocks })

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        userId: demoUser.id,
        title: 'Complete project proposal',
        description: 'Draft and review the Q1 project proposal',
        impact: 'HIGH',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        userId: demoUser.id,
        title: 'Review pull requests',
        description: 'Review pending PRs on GitHub',
        impact: 'LOW',
      },
      {
        userId: demoUser.id,
        title: 'Study machine learning course',
        description: 'Complete modules 3-4',
        impact: 'HIGH',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
    ],
  })

  // Create today's daily goal
  await prisma.dailyGoal.create({
    data: {
      userId: demoUser.id,
      date: new Date(),
      goals: [
        'Complete project proposal draft',
        'Review 5 pull requests',
        'ML course module 3',
      ],
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Demo user: ${demoUser.email}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })