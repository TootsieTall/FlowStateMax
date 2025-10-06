import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const user = await prisma.user.upsert({
    where: { email: 'demo@flowstate.app' },
    update: {},
    create: {
      email: 'demo@flowstate.app',
      name: 'Demo User',
      plan: 'pro',
    },
  })

  console.log('Created user:', user.id)

  await prisma.profile.create({
    data: {
      userId: user.id,
      podcastGenres: JSON.stringify(['Technology', 'Business', 'Science', 'Health', 'Philosophy']),
    },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.goal.create({
    data: {
      userId: user.id,
      date: today,
      top1: 'Complete project proposal',
      top2: 'Review design mockups',
      top3: 'Schedule team meeting',
    },
  })

  const locations = [
    { name: 'Home Office', address: '123 Main St' },
    { name: 'Local Library', address: '456 Oak Ave' },
    { name: 'Coffee Shop', address: '789 Elm St' },
    { name: 'University', address: '321 Campus Dr' },
    { name: 'Co-working Space', address: '654 Work Blvd' },
  ]

  for (const loc of locations) {
    await prisma.location.create({
      data: {
        userId: user.id,
        ...loc,
      },
    })
  }

  const blocks = [
    { type: 'Deep', startTime: '09:00', endTime: '11:00', title: 'Project Work', impact: 'High' },
    { type: 'Meeting', startTime: '11:00', endTime: '11:30', title: 'Team Sync', impact: 'Low' },
    { type: 'Break', startTime: '11:30', endTime: '12:00', title: 'Lunch Break', impact: 'Low' },
    { type: 'Deep', startTime: '12:00', endTime: '14:00', title: 'Design Review', impact: 'High' },
    { type: 'Gym', startTime: '17:00', endTime: '18:00', title: 'Workout', impact: 'Low' },
  ]

  for (const block of blocks) {
    await prisma.block.create({
      data: {
        userId: user.id,
        date: today,
        ...block,
      },
    })
  }

  await prisma.ritualChecklist.create({
    data: {
      userId: user.id,
      items: JSON.stringify([
        { text: 'Make coffee', checked: false },
        { text: 'Clear desk', checked: false },
        { text: 'Start music', checked: false },
        { text: 'Enable Do Not Disturb', checked: false },
        { text: 'Close email', checked: false },
        { text: 'Take 3 deep breaths', checked: false },
      ]),
      completedCount: 5,
    },
  })

  const blockedDomains = [
    'instagram.com',
    'tiktok.com',
    'twitter.com',
    'facebook.com',
    'reddit.com',
    'youtube.com',
  ]

  for (const domain of blockedDomains) {
    await prisma.blockedApp.create({
      data: {
        userId: user.id,
        domain,
      },
    })
  }

  await prisma.settings.create({
    data: {
      userId: user.id,
    },
  })

  await prisma.metrics.create({
    data: {
      userId: user.id,
      focusHours: 24.5,
      highImpactPercent: 68,
      timeSavedHours: 12.3,
      streakDays: 7,
    },
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
