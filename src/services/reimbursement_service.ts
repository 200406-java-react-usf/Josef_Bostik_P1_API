/**
 * The purpose of order_service ensures that all properties passed to order_repo are valid.
 */

import { Reimbursement } from '../models/reimbursement';
import * as reimbursementRepo  from '../repos/reimb_repo';
import { isValidId, 
    isValidObject, 
    isEmptyObject 
} from '../util/validator';
import { BadRequestError, 
    ResourceNotFoundError
} from '../errors/errors';


/**
 * Retrieves all orders from the orderRepo and returns them
 * if they exist.
 */
export async function getAllReimbursements(): Promise<Reimbursement[]> {



    let reimbursements = await reimbursementRepo.getAll();

    if (reimbursements.length == 0) {
        throw new ResourceNotFoundError();
    }

    return reimbursements;

}

/**
 * Gets an order by its serial ID value
 */
export async function getReimbursementById(id: number): Promise<Reimbursement> {

    if (!isValidId(id)) {
        throw new BadRequestError();
    }

    let reimbursement = await reimbursementRepo.getById(id);

    if (isEmptyObject(reimbursement)) {
        throw new ResourceNotFoundError();
    }

    return reimbursement;

}


/**
 * Adds a new order to the database
 */
export async function addNewReimbursement(newReimbursement: Reimbursement): Promise<Reimbursement> {
    
    if (!isValidObject(newReimbursement, 'id')) {
        throw new BadRequestError('Invalid property values found in provided user.');
    }

    const persistedOrder = await reimbursementRepo.save(newReimbursement);

    return persistedOrder;

}

/**
 * Updates an order at the specified index given a new order object and a
 * specified index.
 */
export async function updateReimbursement(id: number, updatedReimbursement: Reimbursement): Promise<boolean> {
    


    if (!isValidObject(updatedReimbursement)) {
        throw new BadRequestError('Invalid order provided (invalid values found).');
    }

    // let repo handle some of the other checking since we are still mocking db
    updatedReimbursement.id = id;

    return await reimbursementRepo.update(updatedReimbursement);

}

/**
 * Deletes an item given its serial ID
 */
export async function deleteById(id: number): Promise<boolean> {
    
    if(!isValidId(id)) {
        throw new BadRequestError();
    }

    return await reimbursementRepo.deleteById(id);

}


