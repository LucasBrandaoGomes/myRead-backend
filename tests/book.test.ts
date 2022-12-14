import { prisma } from "../src/database/database";
import supertest from "supertest";
import { createNewUser } from "../factories/userFactory";
import app from "../src/app";

describe("Test route GET /books", () => {
    it("Trying to get list of books, without search query param, and return status 200",async () => {
        const newUser = await createNewUser()
        const newLogin = {
            email: newUser.email,
            password: "1234",
        }
        await supertest(app).post('/sign-up').send(newUser);
        const signin = await supertest(app).post('/sign-in').send(newLogin);
        const result = await supertest(app).get(`/books`).set('Authorization', 'Bearer ' + signin.text)
        const bookList = await prisma.books.findMany()

        expect(result.status).toBe(200)
        expect(bookList).toBeInstanceOf(Array)
    })

    it("Trying to get list of books, with search query param, and return status 200",async () => {
        const newUser = await createNewUser()
        const newLogin = {
            email: newUser.email,
            password: "1234",
        }
        const search = "murakami"
        await supertest(app).post('/sign-up').send(newUser);
        const signin = await supertest(app).post('/sign-in').send(newLogin);
        const result = await supertest(app).get(`/books?search=${search}`).set('Authorization', 'Bearer ' + signin.text)
        const bookList = await prisma.books.findMany()

        expect(result.status).toBe(200)
        expect(bookList).toBeInstanceOf(Array)
    })

    it("Try to get list of books without token, return status 401",async () => {
        const newUser = await createNewUser()
        const newLogin = {
            email: newUser.email,
            password: "1234",
        }
        await supertest(app).post('/sign-up').send(newUser);
        const signin = await supertest(app).post('/sign-in').send(newLogin);
        const result = await supertest(app).get('/books')

        expect(result.status).toBe(401)
    })

    it("Try to get list of books without token, return status 401",async () => {
        const newUser = await createNewUser()
        const newLogin = {
            email: newUser.email,
            password: "1234",
        }
        await supertest(app).post('/sign-up').send(newUser);
        const signin = await supertest(app).post('/sign-in').send(newLogin);
        const result = await supertest(app).get('/books').set('Authorization', 'Bearer ' + 'Invalid token')

        expect(result.status).toBe(401)
    })
})

describe("Test route GET /books/:id", () => {
    it("Return book info status 200",async () => {
        const newUser = await createNewUser()
        const newLogin = {
            email: newUser.email,
            password: "1234",
        }
        const id = 2
        await supertest(app).post('/sign-up').send(newUser);
        const signin = await supertest(app).post('/sign-in').send(newLogin);
        const result = await supertest(app).get(`/books/${id}`).set('Authorization', 'Bearer ' + signin.text)
        
        const bookList = await prisma.books.findUnique({where : {id:id}})

        expect(result.status).toBe(200)
        expect(bookList).toBeInstanceOf(Object)
    })

    it("Try to get book infowithout token, return status 401",async () => {
        const newUser = await createNewUser()
        const newLogin = {
            email: newUser.email,
            password: "1234",
        }
        const id = 2
        await supertest(app).post('/sign-up').send(newUser);
        const signin = await supertest(app).post('/sign-in').send(newLogin);
        const result = await supertest(app).get(`/books/${id}`)

        expect(result.status).toBe(401)
    })

    it("Try to get book info without token, return status 401",async () => {
        const newUser = await createNewUser()
        const newLogin = {
            email: newUser.email,
            password: "1234",
        }
        const id = 2

        await supertest(app).post('/sign-up').send(newUser);
        const signin = await supertest(app).post('/sign-in').send(newLogin);
        const result = await supertest(app).get(`/books/${id}`).set('Authorization', 'Bearer ' + 'Invalid token')

        expect(result.status).toBe(401)
    })

    it("Try to get book info of an unregistered book, status 404",async () => {
        const newUser = await createNewUser()
        const newLogin = {
            email: newUser.email,
            password: "1234",
        }
        const id = 20
        await supertest(app).post('/sign-up').send(newUser);
        const signin = await supertest(app).post('/sign-in').send(newLogin);
        const result = await supertest(app).get(`/books/${id}`).set('Authorization', 'Bearer ' + signin.text)
        
        const bookList = await prisma.books.findUnique({where : {id:id}})

        expect(result.status).toBe(404)
        expect(bookList).toBeNull()
    })
})