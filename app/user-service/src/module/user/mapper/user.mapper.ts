export const userResponseMapper = (user: any) => {
    return {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile_number: user.mobile_number,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
};