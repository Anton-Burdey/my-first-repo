import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'serial' });

test.describe('@api CRUD тесты для Restful-booker', () => {

    const baseURL = 'https://restful-booker.herokuapp.com';

    let bookingId;
    let authToken;

    const createPayload = {
        firstname: "Jim",
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
            checkin: "2018-01-01",
            checkout: "2019-01-01"
        },
        additionalneeds: "Breakfast"
    };

    test('Создание бронирования (POST /booking)', async ({ request }) => {
        console.log('Создание нового бронирования');

        const response = await request.post(`${baseURL}/booking`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: createPayload
        });

        console.log('Статус-код:', response.status());
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        console.log('Тело ответа:', responseBody);

        bookingId = responseBody.bookingid;
        expect(bookingId).toBeTruthy();

        expect(responseBody.booking.firstname).toBe(createPayload.firstname);
        expect(responseBody.booking.lastname).toBe(createPayload.lastname);
        expect(responseBody.booking.totalprice).toBe(createPayload.totalprice);

        console.log('Создан bookingId =', bookingId);
    });

    test('Получение информации о бронировании (GET /booking/:id)', async ({ request }) => {
        console.log('Получение данных о бронировании');

        const response = await request.get(`${baseURL}/booking/${bookingId}`);

        console.log('Статус-код:', response.status());
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        console.log('Тело ответа:', responseBody);

        expect(responseBody.firstname).toBe(createPayload.firstname);
        expect(responseBody.lastname).toBe(createPayload.lastname);
        expect(responseBody.totalprice).toBe(createPayload.totalprice);
    });

    test('Обновление бронирования (PUT /booking/:id)', async ({ request }) => {
        console.log('Получаем токен авторизации');

        const tokenResponse = await request.post(`${baseURL}/auth`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                username: "admin",
                password: "password123"
            }
        });

        console.log('Статус-код токена:', tokenResponse.status());
        expect(tokenResponse.status()).toBe(200);

        const tokenBody = await tokenResponse.json();
        authToken = tokenBody.token;

        console.log('Полученный токен:', authToken);

        console.log('Обновление данных бронирования');

        const updatedPayload = {
            firstname: "James",
            lastname: "Bond",
            totalprice: 777,
            depositpaid: true,
            bookingdates: {
                checkin: "2020-01-01",
                checkout: "2020-12-31"
            },
            additionalneeds: "Dinner"
        };

        const response = await request.put(`${baseURL}/booking/${bookingId}`, {
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${authToken}`
            },
            data: updatedPayload
        });

        console.log('Статус-код:', response.status());
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        console.log('Обновлённые данные:', responseBody);

        expect(responseBody.firstname).toBe(updatedPayload.firstname);
        expect(responseBody.lastname).toBe(updatedPayload.lastname);
        expect(responseBody.totalprice).toBe(updatedPayload.totalprice);
    });

    test('Удаление бронирования (DELETE /booking/:id)', async ({ request }) => {
        console.log('Удаление бронирования');

        const response = await request.delete(`${baseURL}/booking/${bookingId}`, {
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${authToken}`
            }
        });

        console.log('Статус-код:', response.status());
        expect(response.status()).toBe(201);
        console.log('Бронирование успешно удалено');
        console.log('Проверка, что бронирование удалено');
        const getAfterDelete = await request.get(`${baseURL}/booking/${bookingId}`);
        console.log('Статус после удаления:', getAfterDelete.status());
        expect(getAfterDelete.status()).toBe(404);
    });
});
