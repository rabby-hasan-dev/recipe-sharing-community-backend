
export enum UserRole {
    SUPER_ADMIN = 'superAdmin',
    ADMIN = 'admin',
    USER = 'user',
}

export enum UserStatus {
    ACTIVE = 'active',
    IN_PROGRESS = 'in-progress',
    BLOCKED = 'blocked',
}

export const UserSearchableFields = [
    'email',
    'name.firstName',
    'name.lastName',
    'presentAddress',
];
