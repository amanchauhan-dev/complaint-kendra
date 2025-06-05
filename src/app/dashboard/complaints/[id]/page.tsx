import React from 'react'
import ViewComplaint from './view-complaint'
import { prisma } from '@/lib/prisma' // or wherever your Prisma instance is

type PageProps = {
    params: Promise<{ id: string }>
}

async function Page({ params }: PageProps) {
    const { id } = await params
    const complaint = await prisma.complaint.findUnique({
        where: { complaint_id: id },
        include: {
            category: true,
            responses: true,
            department: true,
            attachments: true,
            address: {
                include: {
                    taluka: {
                        include: {
                            subdivision: true,
                            district: true,
                        }
                    }
                }
            },
            user: {
                include: {
                    address: {
                        include: {
                            taluka: {
                                include: {
                                    subdivision: true,
                                    district: true
                                }
                            }
                        }
                    }
                }
            }
        },
    })

    if (!complaint) {
        return <div>Complaint not found</div>
    }

    const newData = { ...complaint, user: { ...complaint.user, password: undefined } }

    return <ViewComplaint data={newData} />
}

export default Page
