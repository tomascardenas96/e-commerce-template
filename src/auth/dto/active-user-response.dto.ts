import { ApiProperty } from "@nestjs/swagger";

class Role {
    @ApiProperty({ example: '1234567890', description: 'ID del rol' })
    id: string;

    @ApiProperty({ example: 'member', description: 'Nombre del rol' })
    name: string;
}

class User {
    @ApiProperty({ example: '1234567890', description: 'ID del usuario' })
    id: string;

    @ApiProperty({ example: 'John', description: 'Nombre del usuario' })
    name: string;

    @ApiProperty({ example: 'Doe', description: 'Apellido del usuario' })
    lastname: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Correo del usuario' })
    email: string;

    @ApiProperty({ example: '1990-01-01', description: 'Fecha de nacimiento del usuario' })
    birthdate: string;

    @ApiProperty({ example: '2026-02-02T05:02:15.467Z', description: 'Fecha de creación del usuario' })
    createdAt: string;

    @ApiProperty({ example: '2026-02-02T05:02:15.467Z', description: 'Fecha de actualización del usuario' })
    updatedAt: string;

    @ApiProperty({ example: null, description: 'Fecha de eliminación del usuario' })
    deletedAt: string | null;

    @ApiProperty({ type: Role })
    role: Role;

    @ApiProperty({ example: false, description: '¿El correo del usuario ha sido confirmado?' })
    isEmailConfirmed: boolean;
}

export class ActiveUserResponseDto {
    @ApiProperty({ type: User })
    user: User;

    @ApiProperty({ example: 'User successfully retrieved', description: 'Mensaje de respuesta exitosa' })
    message: string;
}