import { ClientResDto } from "./client.res.dto";

export interface ClientListResDto {
    psUserName: string,
    assignedClients: ClientResDto[],
    unassignedClients: ClientResDto[]
}