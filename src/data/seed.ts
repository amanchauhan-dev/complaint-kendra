import { prisma } from "@/lib/prisma";
import locationData from "./locations.json";
import categoryData from "./categories.json";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { generateUniqueUUID } from "@/lib/id-generator";
import { GenderType, RoleType } from "@/validations/enums";

export const deleteLocations = async () => {
    try {
        await prisma.district.deleteMany({ where: {} })
        await prisma.subdivision.deleteMany({ where: {} })
        await prisma.taluka.deleteMany({ where: {} })

    } catch (error: any) {
        console.error("❌ Error deleting locations:", error.message);
    }
}

export const feedLocations = async () => {
    try {
        await prisma.$transaction(async (tx) => {
            let d = 2;
            for (const district of locationData) {
                const createdDistrict = await tx.district.create({
                    data: {
                        name: district.districtName,
                        district_id: district.district_id
                    }
                });
                let s = 1;
                for (const subdivision of district.subDivisions || []) {
                    const createdSubdivision = await tx.subdivision.create({
                        data: {
                            name: subdivision.subDivisionName,
                            district_id: createdDistrict.district_id,
                            subdivision_id: subdivision.subDivision_id
                        }
                    });
                    let t = 0;
                    for (const taluka of subdivision.taluks || []) {
                        await tx.taluka.create({
                            data: {
                                name: taluka.talukName,
                                area_code: `${taluka.talukName.charAt(0)}${subdivision.subDivisionName.charAt(0)}${d}${s}${t} `, // Default empty or provide logic
                                district_id: createdDistrict.district_id,
                                subdivision_id: createdSubdivision.subdivision_id,
                                taluka_id: taluka.taluka_id
                            }
                        });
                        t++
                        s++
                        d++
                    }
                }
            }
        });

        console.log("✅ Locations seeded successfully");
    } catch (error: any) {
        console.error("❌ Error seeding locations:", error.message);
    } finally {
        await prisma.$disconnect();
    }
};



export const deleteCategory = async () => {
    try {
        await prisma.category.deleteMany({ where: {} })
    } catch (error: any) {
        console.error("❌ Error categories:", error.message);
    }
}

export const feedCategory = async () => {
    try {
        await prisma.$transaction(async (tx) => {
            for (const category of categoryData) {
                const parent = await tx.category.create({
                    data: {
                        category_id: category.category_id,
                        name: category.name
                    },
                });
                for (const subCategory of category.subCategory) {
                    await tx.category.create({
                        data: {
                            category_id: subCategory.subId,
                            name: subCategory.name,
                            parent_id: parent.category_id
                        },
                    })
                }
            }
        });

        console.log("✅ users seeded successfully");
    } catch (error: any) {
        console.error("❌ Error seeding catgories:", error.message);
    } finally {
        await prisma.$disconnect();
    }
};


export const deleteUsers = async () => {
    try {
        await prisma.user.deleteMany({ where: {} })

    } catch (error: any) {
        console.error("❌ Error deleting users:", error.message);
    }
}



export const feedUsers = async () => {
    const NUMBER_OF_USERS = 500;
    // const NUMBER_OF_COMPLAINTS = 10;
    const userIds: string[] = []
    try {
        await prisma.$transaction(async (tx) => {
            //   seed users
            const usedEmails = new Set<string>();
            const usedAadhaars = new Set<string>();
            const hassedPassword = await bcrypt.hash("StrongPass1@", 10)
            const usersArr = [{
                user_id: "96de41ba-67ed-49d5-a534-dff36c802b34",
                full_name: `Aman Chauhan`,
                email: "aman@gmail.com",
                role: 'superadmin' as RoleType,
                profile_picture: '',
                gender: "male" as GenderType,
                password: hassedPassword,
                contact_number: faker.string.numeric({ length: 10 }),
                date_of_birth: faker.date.past({ years: 20 }),
                aadhaar_number: '12345678912',
                address: addresseess[Math.floor(Math.random() * addresseess.length)],
            }];
            // create fake users
            while (usersArr.length < NUMBER_OF_USERS) {
                const fname = faker.person.firstName();
                const lname = faker.person.lastName();
                const email = faker.internet.email({ firstName: fname, lastName: lname }).toLocaleLowerCase();
                const aadhaar = faker.string.numeric({ length: 12, allowLeadingZeros: false });
                // ensure uniqueness
                if (usedEmails.has(email) || usedAadhaars.has(aadhaar)) { continue }
                const id = generateUniqueUUID()
                userIds.push(id)
                usedEmails.add(email);
                usedAadhaars.add(aadhaar);
                usersArr.push({
                    user_id: id,
                    full_name: `${fname} ${lname}`,
                    email,
                    gender: genders[Math.floor(Math.random() * genders.length)] as GenderType,
                    role: 'citizen' as RoleType,
                    password: hassedPassword,
                    contact_number: faker.string.numeric({ length: 10 }),
                    date_of_birth: faker.date.past({ years: 20 }),
                    profile_picture: faker.image.avatar(),
                    aadhaar_number: aadhaar,
                    address: addresseess[Math.floor(Math.random() * addresseess.length)],
                });
            }
            // push in db
            for (let i = 0; i < usersArr.length; i++) {
                const address = await tx.address.create({
                    data: {
                        full_address: usersArr[i].address.full_address,
                        taluka_id: usersArr[i].address.taluka_id
                    }
                })
                await tx.user.create({
                    data: { ...usersArr[i], address: undefined, address_id: address.address_id }
                })
            }
        });

        console.log("✅ users seeded successfully");
    } catch (error: any) {
        console.error("❌ Error seeding locations:", error.message);
    } finally {
        await prisma.$disconnect();
    }
};


const addresseess = [
    {
        "full_address": "101 Ashram Road, Ahmedabad",
        "taluka_id": "2cefede1-3f59-4ad1-b004-9f583d9f863e"
    },
    {
        "full_address": "402 Satellite Road, Surat",
        "taluka_id": "b1c2781a-2262-4f63-8dcc-6bdce175c9f4"
    },
    {
        "full_address": "17 Civil Lines, Vadodara",
        "taluka_id": "802a88a8-92bd-4d66-8481-eddfb1d0efb7"
    },
    {
        "full_address": "51 City Light, Valsad",
        "taluka_id": "8ca04000-5b54-4f3a-9a31-4ee4fdde032a"
    },
    {
        "full_address": "98 Mandvi Bazar, Valsad",
        "taluka_id": "8ca04000-5b54-4f3a-9a31-4ee4fdde032a"
    },
    {
        "full_address": "Sector 14, Ahmedabad",
        "taluka_id": "2cefede1-3f59-4ad1-b004-9f583d9f863e"
    },
    {
        "full_address": "Nr. Law Garden, Ahmedabad",
        "taluka_id": "2cefede1-3f59-4ad1-b004-9f583d9f863e"
    },
    {
        "full_address": "M G Road, Ahmedabad",
        "taluka_id": "2cefede1-3f59-4ad1-b004-9f583d9f863e"
    },
    {
        "full_address": "Station Road, Valsad",
        "taluka_id": "8ca04000-5b54-4f3a-9a31-4ee4fdde032a"
    },
    {
        "full_address": "Main Street, Rajkot",
        "taluka_id": "b52aae8a-cd06-4279-8d57-79f72c18d29e"
    },
]


const genders = ['male', 'female', 'other']





export const deleteComplaints = async () => {
    try {
        await prisma.complaint.deleteMany({ where: {} })
        await prisma.attachments.deleteMany({ where: {} })
        await prisma.complaintResponse.deleteMany({ where: {} })
    } catch (error: any) {
        console.error("❌ Error deleting complaints:", error.message);
    }
}

type cs = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
const complaintStatus: cs[] = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']
export const feedComplaints = async () => {
    const NUMBER_OD_COMPLAINTS = 100
    try {
        const comapliants: any = [];
        while (comapliants.length < NUMBER_OD_COMPLAINTS) {
            comapliants.push({
                title: faker.lorem.sentence({ min: 4, max: 8 }),
                description: faker.lorem.paragraphs({ min: 5, max: 10 }),
                attachments: [faker.image.urlPicsumPhotos(), faker.image.urlPicsumPhotos()]
            });
        }

        await prisma.$transaction(async (tx) => {
            const users = await tx.user.findMany({
                select: {
                    user_id: true,
                    address: true
                },
                where: {
                    role: 'citizen'
                }
            })
            if (users.length == 0) {
                return
            }
            const categories = await tx.category.findMany({
                select: { category_id: true },
                where: {
                    parent_id: { not: null }
                }
            })
            for (let i = 0; i < comapliants.length; i++) {
                const user = users[Math.floor(Math.random() * users.length)]
                await tx.complaint.create({
                    data: {
                        title: comapliants[i].title,
                        description: comapliants[i].description,
                        user_id: user.user_id,
                        status: complaintStatus[Math.floor(Math.random() * complaintStatus.length)],
                        category_id: categories[Math.floor(Math.random() * categories.length)].category_id,
                        address_id: user.address?.address_id,
                        attachments: {
                            createMany: {
                                data: [{ type: 'IMAGE', url: comapliants[i].attachments[0] }, { type: 'IMAGE', url: comapliants[i].attachments[1] }]
                            }
                        }
                    }
                })
            }
        })

        console.log('✅ complaints Created ');
    } catch (error: any) {
        console.log('❌ Creating complaints', error);
    }
}