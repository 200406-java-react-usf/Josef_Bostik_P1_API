import * as sut from '../services/reimbursement_service';
import * as mockRepo from '../repos/reimb_repo';
import * as mockValidator from '../util/validator';

import { Reimbursement } from '../models/reimbursement';
import { ResourceNotFoundError, BadRequestError, InternalServerError} from '../errors/errors';

/*
    In order to properly mock all of the functions exported by
    the a module, we will invoke jest.mock() and pass to it: 
        
        - a relative path to the module we wish to mock as string

        - a function which will return the mocked module's exposed 
          functions (which are all mocked as well)

    Interesting fact: jest.mock() is actually executed before any
    import statements.

*/
jest.mock('../repos/reimb_repo', () => {

    /* 
        It is important to note that the object that is being returned
        exposes properties that are named the exact same as the functions
        exposed by the user-repo module, and all of the properties a Jest
        mock functions.
    */
    return {
        getAll: jest.fn(),
        getAllByUser: jest.fn(),
        getById: jest.fn(),
        submit: jest.fn(),
        update: jest.fn(),
        deleteById: jest.fn(),
    };
});

jest.mock('../util/validator', () => {
    return {
        isValidId: jest.fn(),
        isValidStrings: jest.fn(),
        isValidObject: jest.fn(),
        isPropertyOf: jest.fn(),
        isEmptyObject: jest.fn()
    };
});

describe('reimbursementService', () => {

    const testSubmissionDate = new Date("2020-5-15 15:57:15");
    const testResolveDate = new Date("2020-5-18 15:45:36");

    let mockReimbursements = [
        new Reimbursement(1, 10, testSubmissionDate, testResolveDate, "Test Description 1", null, 1, 1, 1, 1),
        new Reimbursement(2, 15, testSubmissionDate, testResolveDate, "Test Description 2", null, 2, 2, 2, 2)
    ];

    beforeEach(() => {
        
        /*
            The mocking logic above makes all of the functions exposed 
            by the user-repo module mock functions. However, TypeScript 
            doesn't know that (because of that interesting fact from 
            earlier) so it will give us compiler errors if we use Mock
            methods (e.g. mockReturnValue, mockImplementation, etc.).

            The way around this is the either cast the operation as type
            jest.Mock, or to include the @ts-ignore directive to tell the
            TypeScript compiler to ignore it.

            Remember that Jest is a JavaScript framework, and it takes
            some configuring and syntactic gymnastics to get TypeScript
            to play nicely with it. 

        */

        // casting the function as jest.Mock -- option 1
        (mockRepo.getAll as jest.Mock).mockClear();
        (mockRepo.getAllByUser as jest.Mock).mockClear();

        // @ts-ignore -- option 2 (only ignores the next line of code)
        mockRepo.getById.mockClear();

        (mockRepo.submit as jest.Mock).mockClear();
        (mockRepo.update as jest.Mock).mockClear();
        (mockRepo.deleteById as jest.Mock).mockClear();

        (mockValidator.isValidId as jest.Mock).mockClear();
        (mockValidator.isValidStrings as jest.Mock).mockClear();
        (mockValidator.isValidObject as jest.Mock).mockClear();
        (mockValidator.isPropertyOf as jest.Mock).mockClear();
        (mockValidator.isEmptyObject as jest.Mock).mockClear();
        
        
    });


    test('should resolve to Reimbursement[] when getAllReimbursements() successfully retrieves reimbursements from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAll as jest.Mock).mockReturnValue(mockReimbursements);

        // Act
        let result = await sut.getAllReimbursements();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(2);
        expect(mockRepo.getAll).toBeCalledTimes(1);

    });

    test('should reject with ResourceNotFoundError when getAllReimbursements fails to get any reimbursements from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAll as jest.Mock).mockReturnValue([]);

        // Act
        try {
            await sut.getAllReimbursements();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
            expect(mockRepo.getAll).toBeCalledTimes(1);
        }

    });

    test('should resolve to Reimbursement[] when getAllReimbursementsByUser() successfully retrieves reimbursements from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAllByUser as jest.Mock).mockReturnValue(mockReimbursements);
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);

        // Act
        let result = await sut.getAllReimbursementsByUser(1);
        
        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(2);
        expect(mockRepo.getAllByUser).toBeCalledTimes(1);

    });

    test('should reject with ResourceNotFoundError when getAllReimbursementsByUser fails to get any reimbursements from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAllByUser as jest.Mock).mockReturnValue(mockReimbursements);
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getAllReimbursementsByUser(1);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError when getAllReimbursementsByUser is passed a bad ID', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAllByUser as jest.Mock).mockReturnValue([]);
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(true);

        // Act
        try {
            await sut.getAllReimbursementsByUser(1);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
            expect(mockRepo.getAllByUser).toBeCalledTimes(1);
        }

    });

    test('should resolve to Reimbursement when getReimbursementById is given a valid and known id', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);
        (mockRepo.getById as jest.Mock).mockReturnValue(mockReimbursements[0]);

        // Act
        let result = await sut.getReimbursementById(1);

        // Assert
        expect(result).toBeTruthy();

    });

    test('should reject with BadRequestError when getReimbursementById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getReimbursementById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getReimbursementById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getReimbursementById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getReimbursementById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getReimbursementById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getReimbursementById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getReimbursementById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if  getReimbursementById is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(true);
        (mockRepo.getById as jest.Mock).mockReturnValue({});

        // Act
        try {
            await sut.getReimbursementById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });


    test('should resolve to Reimbursmeent when submitReimbursement is given a valid Reimbursement object', async () => {

        // Arrange
        expect.hasAssertions();

        let mockReimb= new Reimbursement(1, 5, testSubmissionDate, testResolveDate, "Test Description", null, 1, 1, 1, 1 );
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(true);
        (mockRepo.submit as jest.Mock).mockReturnValue(mockReimb);
        

        // Act
        let result = await sut.submitReimbursement(mockReimb);

        // Assert
        expect(result).toBeTruthy();
        expect(mockRepo.submit).toBeCalledTimes(1);
    });
    
    test('should resolve to true when updateOrder is given a valid order and id', async () => {
        // Arrange
        expect.hasAssertions();

        let mockReimb= new Reimbursement(1, 5, testSubmissionDate, testResolveDate, "Test Description", null, 1, 1, 1, 1 );
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(true);
        (mockRepo.update as jest.Mock).mockReturnValue(true);

        let result = await sut.updateReimbursement(1, mockReimb);

        expect(result).toBeTruthy();
        expect(mockRepo.update).toBeCalledTimes(1);
    });

    // test('should resolve to  when updateReimbursement is given an invalid reimbursement object', async () => {
    //     // Arrange
    //     expect.hasAssertions();

    //     let mockReimb= new Reimbursement(1, 5, testSubmissionDate, testResolveDate, "Test Description", null, 1, 1, 1, 1 );
    //     (mockValidator.isValidObject as jest.Mock).mockReturnValue(false);
    //     (mockRepo.update as jest.Mock).mockReturnValue(InternalServerError);

    //     try {
    //         let result = await sut.updateReimbursement(3, mockReimb);
    //     } catch (e) {
    //         expect(e instanceof InternalServerError).toBeTruthy();
    //     }
    // });



    test('should resolve to true when  deleteById is given a valid id', async () => {
        // Arrange
        expect.hasAssertions();

        let mockReimb = {...mockReimbursements[0]};
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockRepo.deleteById as jest.Mock).mockReturnValue(true);

        // Act
        let result = await sut.deleteById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(mockValidator.isValidId).toBeCalledTimes(1);
        expect(mockRepo.deleteById).toBeCalledTimes(1);
    });

    test('should resolve to false when deleteById is given an invalid id', async () => {
        // Arrange
        expect.hasAssertions();

        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);
        (mockRepo.deleteById as jest.Mock).mockReturnValue(true);

        // Act
        try {
            await sut.deleteById(1);   
        } catch (e) {
        // Assert
            expect(e instanceof BadRequestError).toBeTruthy();
            expect(mockValidator.isValidId).toBeCalledTimes(1);
        }
    });

});