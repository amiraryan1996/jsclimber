// https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const categories = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.category.create({
        data: {
          name: `Category ${i + 1}`,
        },
      }),
    ),
  );

  console.log(`Created ${categories.length} categories.`);

  // Create Users
  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      passwordHash:
        '$argon2id$v=19$m=65536,t=3,p=4$bwuOa8qPL5alVj1nl/cMsA$ub5BfwlokWtTK3aQHd2DBjvKN2SJaqLMtvEwKcghVUs',
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      firstName: 'user',
      lastName: 'useri',
      email: 'user@example.com',
      passwordHash:
        '$argon2id$v=19$m=65536,t=3,p=4$bwuOa8qPL5alVj1nl/cMsA$ub5BfwlokWtTK3aQHd2DBjvKN2SJaqLMtvEwKcghVUs',
      role: 'USER',
    },
  });

  console.log(`Created users: admin (${admin.email}), regular (${regularUser.email}).`);

  // Create Posts
  const now = new Date(); // Current timestamp for seeding
  const posts = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.post.create({
        data: {
          title: `Post Title ${i + 1}`,
          description: `This is a description for Post ${i + 1}.`,
          image: `https://via.placeholder.com/150?text=Post+${i + 1}`,
          status: i % 2 === 0 ? 'PENDING' : 'APPROVED', // Alternate status for variety
          authorId: regularUser.id,
          categoryId: categories[i % categories.length].id, // Distribute posts across categories
          createdAt: now, // Explicitly set createdAt
          updatedAt: now, // Explicitly set updatedAt
        },
      }),
    ),
  );

  console.log(`Created ${posts.length} posts.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
