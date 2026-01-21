import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';
export async function seed() {
    try {
        console.log('🌱 Seeding database with test credentials...');

        // Create Platform Admin
        const platformAdminPassword = await bcrypt.hash('password123', 10);
        await prisma.user.upsert({
            where: { email: 'admin@platform.com' },
            update: {},
            create: {
                email: 'admin@platform.com',
                password: platformAdminPassword,
                fullName: 'Platform Administrator',
                role: 'PLATFORM_ADMIN',
            },
        });
        console.log(`✅ Platform Admin created: admin@platform.com`);

    } catch (error) {
        console.error('❌ Seeding error:', error);
    }
}
