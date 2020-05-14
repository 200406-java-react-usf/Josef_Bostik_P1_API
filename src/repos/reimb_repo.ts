/**
 * TODO: REFARCTOR FOR REIMBURSEMENTS
 */


import { Reimbursement } from '../models/reimbursement';
import {
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapReimbursementResultSet } from '../util/result-set-mapper';

let baseQuery = `
    select
        ar.id, 
        ar.amount, 
        ar.submitted, 
        ar.resolved,
        ar.description,
        ar.receipt,
        ar.author_id,
        ar.resolver_id,
        ar.reimb_status_id,
        ar.reimb_type_id
    from app_reimbursements ar
`;

/*
    Gets everything in the Reimbursement database
*/

export async function getAll(): Promise<Reimbursement[]> {

    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery}`;
        let rs = await client.query(sql); // rs = ResultSet
        return rs.rows.map(mapReimbursementResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

export async function getAllByUser(id: number): Promise<Reimbursement[]> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery} where ar.author_id = $1`;
        let rs = await client.query(sql, [id]); // rs = ResultSet
        return rs.rows.map(mapReimbursementResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Gets all items by the specified serial Id
*/

export async function getById(id: number): Promise<Reimbursement> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery} where ar.id = $1`;
        let rs = await client.query(sql, [id]);
        return mapReimbursementResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Saves an Order to a new unique serial number
 */

export async function submit(newReimbursement: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();

        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;
        //console.log(dateTime);

        let sql = `
            insert into app_reimbursements (amount, submitted, resolved, description, receipt, author_id, resolver_id, reimb_status_id, reimb_type_id) 
                values ($1, $2, null, $3, null, $4, null, $5, $6) returning id
        `;

        let rs = await client.query(sql, [newReimbursement.amount, dateTime,
                                          newReimbursement.description, newReimbursement.author, 
                                          newReimbursement.reimb_status_id, newReimbursement.reimb_type_id]);
        return mapReimbursementResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Updates an Order based on a new Order object
*/
export async function update(id: number, updatedReimbursement: Reimbursement): Promise<boolean> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sqlSub = `
            select ar.submitted 
            from app_reimbursements ar
            where ar.id = $1;
        `
        let rs = await client.query(sqlSub, [id]);

        let sql = `
            update app_reimbursements
            set amount = $2, submitted = $3, resolved = $4, description = $5, receipt = null, author_id = $6, resolver_id = $7, reimb_status_id = $8, reimb_type_id = $9
            where app_reimbursements.id = $1;
        `;

        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;

        console.log(updatedReimbursement.submitted);
        await client.query(sql, [id, updatedReimbursement.amount, rs.rows[0].submitted, 
                                 dateTime, updatedReimbursement.description, 
                                  updatedReimbursement.author, 
                                 updatedReimbursement.resolver, updatedReimbursement.reimb_status_id, 
                                 updatedReimbursement.reimb_type_id]);
        return true;
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}


/*
    Deletes an order by its specified serial number
*/
export async function deleteById(id: number): Promise<boolean> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `
            delete from app_reimbursements where id = $1
        `;
        await client.query(sql, [id]);
        return true;
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

