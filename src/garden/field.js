const { db } = require('../db')

module.exports = {
   getOrCreateField: async (userId) => {
      let field = await db.field.findUnique({ where: { userId: userId } })
      if (!field) {
         field = await db.field.create({
            data: {
               userId: userId,
            },
         })

         let defaultCrops = Array(20).fill({
            fieldId: field.id,
            spiecesId: 0,
         })
         await db.crop.createMany({
            data: defaultCrops,
         })

         field = await db.field.findUnique({ where: { id: field.id } })
      }
      return field
   },
}
