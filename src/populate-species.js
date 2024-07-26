const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function sendData() {
    await prisma.crop.deleteMany();
    await prisma.field.deleteMany();
    await prisma.spieces.deleteMany({});
    const data = await prisma.spieces.createManyAndReturn({
        data: [
            {
                id: 0,
                name: 'Empty',
                icon: '🟫',
                growthDuration: 0,
            },
            {
                id: 1,
                name: 'Carrot',
                icon: '🥕',
                growthDuration: 1000,
            },
            {
                id: 2,
                name: 'Potato',
                icon: '🥔',
                growthDuration: 60 * 1000,
            },
        ],
    });

    console.log(data);

    console.log('Finished');
}

sendData();
