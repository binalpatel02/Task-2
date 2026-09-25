import type { NextFunction, Request, Response } from "express";
import { userService } from "../service/user.service.js";
import { createUserValidator, loginValidator } from "../validator/user.validator.js";
import { userResponseMapper } from "../mapper/user.mapper.js";
import { AbstractController, type IController } from "@library/shared"; 

// LOGIN
export class LoginUserController extends AbstractController implements IController{
    
    async execute( req: Request, res: Response, next: NextFunction ) {
    
        try {   
            const { error } = loginValidator.validate(req.body);
    
            if (error) {    
                return res.status(400).json({                
                    success: false,                
                    message: error.details[0].message           
                });       
            }
       
            const { email, password } = req.body;
        
            const result = await userService.loginUser({       
                email,       
                password        
            });
       
            const response = this.success(result)
       
            return res.status(response.statusCode).json({       
                success: true,       
                message: "Login successful",       
                data: response.data       
            });
   
        } catch (error) {   
            next(error);    
        }
    }
};


// CREATE 
export class CreateUserController extends AbstractController implements IController{
    
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {   
            const { error } = createUserValidator.validate(req.body);
    
            if (error) {    
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const user = await userService.createUser(req.body);

            const response = this.success(userResponseMapper(user))

            return res.status(response.statusCode).json({    
                success: true,
                message: "User created successfully",
                data: response.data
            });
    
        } catch (error) {
            next(error);
        }
    }
};


// GET ALL USERS
export class GetUsersController extends AbstractController implements IController{

    async execute( req: Request, res: Response, next: NextFunction ) {

        try {
            const result = await userService.getUsers();

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No users found"
                });
            }

            // Map array contents uniformly
            const formattedUsers = result.map(user => userResponseMapper(user));

            const response = this.success(formattedUsers);

            return res.status(response.statusCode).json({
                success: true,
                data: response.data
            });
        } catch (error) {
            next(error);
        }
    };
}


// GET BY ID
export class GetUserByIdController extends AbstractController implements IController{ 
    
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {
            const { id } = req.params;
            const user = await userService.getUserById(id as string); 

            const response = this.success(userResponseMapper(user));

            return res.status(response.statusCode).json({
                success: true,
                message: "User fetched successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    };
}


// UPDATE USER
export class UpdateUserController extends AbstractController implements IController{ 
    
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {
            const { error } = createUserValidator.validate(req.body, { allowUnknown: true });

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const { id } = req.params;
            const user = await userService.updateUser(id as string, req.body);

            const response = this.success(userResponseMapper(user));

            return res.status(response.statusCode).json({
                success: true,
                message: "User updated successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }    
    };
}


// DELETE USER
export class DeleteUserController extends AbstractController implements IController{ 
    
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {
            const { id } = req.params;
            const statusResult = await userService.deleteUser(id as string);

            const response = this.success(statusResult);

            return res.status(response.statusCode).json({
                success: true,
                message: "User deleted successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    };
}

export const createUserController= new CreateUserController();
export const getUserByIdController = new GetUserByIdController();
export const getUsersController = new GetUsersController();
export const updateUserController = new UpdateUserController();
export const deleteUserController = new DeleteUserController();
export const loginUserController = new LoginUserController();