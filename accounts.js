const account1 = {
    owner: 'Ivan Pinevski',
    movements: [18000, -5000, 25, -12.63, 220, -150, -500],
    username: '',
    password: '',
    interestRate: 1.2,

    movementsDates: [
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2022-05-02T10:17:24.185Z',
        '2022-05-08T14:11:59.604Z',
        '2022-07-11T17:01:17.194Z',
        '2022-02-28T23:36:17.929Z',
        '2024-01-01T10:51:36.790Z',
    ],
};

const account2 = {
    owner: 'Stefan Stefanovski',
    movements: [200, 450, -400, 3000, -650],
    username: 'ss',
    password: '2222',
    interestRate: 1.5,

    movementsDates: [
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-07-26T17:01:17.194Z',
        '2020-07-28T23:36:17.929Z',
        '2020-08-01T10:51:36.790Z',
    ],
};

const account3 = {
    owner: 'Petar Petkov',
    movements: [200, -100, -100, 1000, -22, 15, 200, -20, -55],
    username: 'pp',
    password: '9999',
    interestRate: 0.7,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-07-26T17:01:17.194Z',
        '2020-07-28T23:36:17.929Z',
        '2020-08-01T10:51:36.790Z',
        '2020-08-01T10:51:36.790Z',
    ],
};

export const accounts = [account1, account2, account3];
