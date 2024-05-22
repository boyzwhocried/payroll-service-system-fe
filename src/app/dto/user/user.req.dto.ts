import { CompanyReqDto } from "../company/company.req.dto"

export interface UserReqDto{
    userName: string
    email: string
    phoneNumber: string
    roleId: string
    fileContent: string
    fileExtension: string
    companyReq?: CompanyReqDto
}