import { ClientResDto } from "./client.res.dto";

export interface ClientListResDto {
    assignedClients: ClientResDto[],
    unassignedClients: ClientResDto[]
}