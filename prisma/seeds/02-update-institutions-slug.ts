import ß from 'bhala'

import { slugify } from '../../common/helpers/slugify'

import type { PrismaClient } from '@prisma/client'

export async function updateInstitutionsSlug(prisma: PrismaClient) {
  const institutions = await prisma.institution.findMany()

  ß.info('Updating institutions slug…')
  for (const institution of institutions) {
    prisma.institution.update({
      data: {
        slug: slugify(institution.name, institution.id),
      },
      where: { id: institution.id },
    })
  }

  ß.success(`Institutions slug updated.`)
}
