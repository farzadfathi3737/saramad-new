export type Token = {
    accessToken: string;
    refreshToken: string;
    expiration: string;
    user: {
        id: string;
        companyId: string;
        username: string;
        firstName: string;
        lastName: string;
        displayName: string;
        email: string;
        roles: string[];
        permissions: string[];
    }
}