const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function sendData(){
    const data = await prisma.spieces.createManyAndReturn(
        {
            data: [
                {
                    id: 0,
                    name: "Empty",
                    icon: "🟫"
                },
                // {
                //     id: 1,
                //     name: "Carrot",
                //     icon: "🥕"
                // },
                // {
                //     id: 2,
                //     name: "Potato",
                //     icon: "🥔"
                // },
            ]
        }
    )

console.log(data);

console.log("Finished");
}

sendData()