import { prisma } from "../config/prisma";


export const generateSlug = async (
    name: string
): Promise<string> => {
    const baseSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');;
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const exists = await prisma.organization.findUnique({
            where: { slug },
        });

        if (!exists) break;

        counter++;
        slug = `${baseSlug}-${counter}`;
    }

    return slug;
};
