import * as sut from '../repos/reimb_repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Reimbursement } from '../models/reimbursement';
// import { UserRepoInstance } from '../config/app';


/*
    We need to mock the connectionPool exported from the main module
    of our application. At this time, we only use one exposed method
    of the pg Pool API: connect. So we will provide a mock function 
    in its place so that we can mock it in our tests.
*/
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    };
});

// The result-set-mapper module also needs to be mocked
jest.mock('../util/result-set-mapper', () => {
    return {
        mapReimbursementResultSet: jest.fn(),
    };
});

describe('reimbRepo', () => {

    let mockConnect = mockIndex.connectionPool.connect;

    const testSubmissionDate = new Date("2020-5-15 15:57:15");
    const testResolveDate = new Date("2020-5-18 15:45:36");

    beforeEach(() => {

        /*
            We can provide a successful retrieval as the default mock implementation
            since it is very verbose. We can provide alternative implementations for
            the query and release methods in specific tests if needed.
        */
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                amount: 19.99,
                                submitted: "2020-5-15 15:57:15",
                                resolved: "2020-5-18 15:45:36",
                                description: "Lunch Conference",
                                receipt: null,
                                author_id: 1,
                                resolver_id: 1,
                                reimb_status_id: 1,
                                reimb_type_id: 3,

                            }
                        ]
                    };
                }), 
                release: jest.fn()
            };
        });
        (mockMapper.mapReimbursementResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Reimbursements when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockReimb = new Reimbursement(1, 5, testSubmissionDate, testResolveDate, "Test Description", null, 1, 1, 1, 1 );
        (mockMapper.mapReimbursementResultSet as jest.Mock).mockReturnValue(mockReimb);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an array of Reimbursements when getOrdersByUserId retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockReimb = new Reimbursement(1, 5, testSubmissionDate, testResolveDate, "Test Description", null, 1, 1, 1, 1 );
        (mockMapper.mapReimbursementResultSet as jest.Mock).mockReturnValue(mockReimb);

        // Act
        let result = await sut.getAllByUser(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAllByUser retrieves no records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getAllByUser(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });


    test('should resolve to a Reimbursement object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockReimb = new Reimbursement(1, 5, testSubmissionDate, testResolveDate, "Test Description", null, 1, 1, 1, 1 );
        (mockMapper.mapReimbursementResultSet as jest.Mock).mockReturnValue(mockReimb);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Reimbursement).toBe(true);

    });



    test('Should resolve to a Reimbursement object when submit retrieves a valid order object', async () => {
        expect.hasAssertions();
        
        let mockReimb= new Reimbursement(1, 5, testSubmissionDate, testResolveDate, "Test Description", null, 1, 1, 1, 1 );
        (mockMapper.mapReimbursementResultSet as jest.Mock).mockReturnValue(mockReimb);

        let result = await sut.submit(mockReimb);

        expect(result).toBeTruthy();
        expect(result instanceof Reimbursement).toBe(true);
    });

    test('Should resolve to true when deleteById deletes a valid Reimbursement object', async () => {
        expect.hasAssertions();
        
        let mockReimb = new Reimbursement(1, 5, testSubmissionDate, testResolveDate, "Test Description", null, 1, 1, 1, 1 );
        (mockMapper.mapReimbursementResultSet as jest.Mock).mockReturnValue(mockReimb);

        let result = await sut.deleteById(1);

        expect(result).toBeTruthy();
    });

    test('Should resolve to true when update updates a valid reimbursement object', async () => {
        expect.hasAssertions();
        
        let mockReimb = new Reimbursement(1, 5, testSubmissionDate, testResolveDate, "Test Description", null, 1, 1, 1, 1 );
        (mockMapper.mapReimbursementResultSet as jest.Mock).mockReturnValue(mockReimb);

        let result = await sut.update(1, mockReimb);

        expect(result).toBeTruthy();
    });

    

});
