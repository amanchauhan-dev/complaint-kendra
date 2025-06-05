import { z } from 'zod';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted', 'ReadCommitted', 'RepeatableRead', 'Serializable']);

export const DistrictScalarFieldEnumSchema = z.enum(['district_id', 'name', 'created_at', 'updated_at']);

export const SubdivisionScalarFieldEnumSchema = z.enum(['subdivision_id', 'district_id', 'name', 'created_at', 'updated_at']);

export const TalukaScalarFieldEnumSchema = z.enum(['taluka_id', 'subdivision_id', 'district_id', 'name', 'area_code', 'created_at', 'updated_at']);

export const UserScalarFieldEnumSchema = z.enum(['user_id', 'full_name', 'email', 'password', 'contact_number', 'gender', 'date_of_birth', 'profile_picture', 'aadhaar_number', 'status', 'last_login', 'created_at', 'updated_at', 'role', 'address_id']);

export const AddressScalarFieldEnumSchema = z.enum(['address_id', 'full_address', 'created_at', 'taluka_id', 'updated_at']);

export const DepartmentScalarFieldEnumSchema = z.enum(['department_id', 'name', 'jurisdiction_level', 'jurisdiction_id', 'contact_person', 'contact_number', 'email', 'created_at', 'updated_at']);

export const OfficerScalarFieldEnumSchema = z.enum(['officer_id', 'user_id', 'designation', 'department_id', 'created_at', 'updated_at']);

export const CategoryScalarFieldEnumSchema = z.enum(['category_id', 'name', 'parent_id', 'created_at', 'updated_at']);

export const ComplaintScalarFieldEnumSchema = z.enum(['complaint_id', 'user_id', 'category_id', 'department_id', 'title', 'description', 'status', 'address_id', 'created_at', 'updated_at']);

export const ComplaintResponseScalarFieldEnumSchema = z.enum(['response_id', 'complaint_id', 'officer_id', 'response', 'created_at']);

export const AttachmentsScalarFieldEnumSchema = z.enum(['attachment_id', 'url', 'type', 'complaint_id']);

export const SortOrderSchema = z.enum(['asc', 'desc']);

export const QueryModeSchema = z.enum(['default', 'insensitive']);

export const NullsOrderSchema = z.enum(['first', 'last']);

export const GenderSchema = z.enum(['male', 'female', 'other']);

export type GenderType = `${z.infer<typeof GenderSchema>}`

export const StatusSchema = z.enum(['active', 'inactive']);

export type StatusType = `${z.infer<typeof StatusSchema>}`

export const RoleSchema = z.enum(['citizen', 'mamlatdar_office', 'sdm_office', 'collectorate_office', 'department_officer', 'admin', 'superadmin']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const JurisdictionLevelSchema = z.enum(['District', 'Subdivision', 'Taluka']);

export type JurisdictionLevelType = `${z.infer<typeof JurisdictionLevelSchema>}`

export const ComplaintStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']);

export type ComplaintStatusType = `${z.infer<typeof ComplaintStatusSchema>}`

export const AttachmentTypeSchema = z.enum(['IMAGE', 'PDF']);

export type AttachmentTypeType = `${z.infer<typeof AttachmentTypeSchema>}`
