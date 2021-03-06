/**
 * The purpose of reimbursement_service ensures that all properties passed to reimbursement_repo are valid.
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
 * Retrieves all reimbursements from the reimbursementRepo and returns them
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
 * Retrieves all reimbursements with the user id from the reimbursementRepo and returns them
 * if they exist.
 */
export async function getAllReimbursementsByUser(id: number): Promise<Reimbursement[]> {

    if (!isValidId(id)) {
        throw new BadRequestError();
    }

    let reimbursements = await reimbursementRepo.getAllByUser(id);

    if (reimbursements.length == 0) {
        throw new ResourceNotFoundError();
    }

    return reimbursements;

}

/**
 * Gets an reimbursement by its serial ID value
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
 * Adds a new reimbursement to the database
 */
export async function submitReimbursement(newReimbursement: Reimbursement): Promise<Reimbursement> {
    
    // if (!isValidObject(newReimbursement)) {
    //     throw new BadRequestError('Invalid property values found in provided reimbursement.');
    // }
    const persistedOrder = await reimbursementRepo.submit(newReimbursement);

    return persistedOrder;

}

/**
 * Updates a reimbursement at the specified index given a new reimbursement object and a
 * specified index.
 */
export async function updateReimbursement(id: number, updatedReimbursement: Reimbursement): Promise<boolean> {
    


    // if (!isValidObject(updatedReimbursement)) {
    //     throw new BadRequestError('Invalid reimbursement provided (invalid values found).');
    // }

    // let repo handle some of the other checking since we are still mocking db
    updatedReimbursement.id = id;

    return await reimbursementRepo.update(id, updatedReimbursement);

}

/**
 * Deletes a reimbursement given its serial ID
 */
export async function deleteById(id: number): Promise<boolean> {
    
    if(!isValidId(id)) {
        throw new BadRequestError();
    }

    return await reimbursementRepo.deleteById(id);

}


