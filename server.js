import express from 'express'
import expressGraphQL from 'express-graphql'
import { 
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} from 'graphql'
import DB from './db.js'

const app = express()
const mysql = DB()

function getAuthors(){
    return new Promise((resolve, reject) => {

        mysql.query("SELECT * FROM authors", (err, result) => {
            if(err) return reject(err);
            resolve(Object.values(JSON.parse(JSON.stringify(result))))
        })

    })
}

function getBooks(){
    return new Promise((resolve, reject) => {

        mysql.query("SELECT * FROM books", (err, result) => {
            if(err) return reject(err);
            resolve(Object.values(JSON.parse(JSON.stringify(result))))
        })

    })
}

function getAuthor(id){
    return new Promise((resolve, reject) => {

        mysql.query("SELECT * FROM authors WHERE id = ?", [id], (err, result) => {
            if(err) return reject(err);
            resolve(Object.values(JSON.parse(JSON.stringify(result)))[0])
        })

    })
}

function getBook(id){
    return new Promise((resolve, reject) => {

        mysql.query("SELECT * FROM books WHERE id = ?", [id], (err, result) => {
            if(err) return reject(err);
            resolve(Object.values(JSON.parse(JSON.stringify(result)))[0])
        })

    })
}

function addBook(name, author_id){
    return new Promise((resolve, reject) => {

        mysql.query("INSERT INTO books(book_name, author_id) VALUES (?, ?)", [name, author_id], (err, result) => {
            if(err) return reject(err);
            resolve("Create book successfully")
        })

    })
}

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        book_name: { type: new GraphQLNonNull(GraphQLString) },
        author_id: { type: new GraphQLNonNull(GraphQLInt) },
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A Single Book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: async (parent, args) => await getBook(args.id)
        },
        author: {
            type: AuthorType,
            description: 'A Single Book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: async (parent, args) => await getAuthor(args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List all books',
            resolve: async () => await getBooks()
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List all authors',
            resolve: async () => await getAuthors()
        },
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: GraphQLString,
            description: 'Add a book',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, args) => {
                const book = await addBook(args.name, args.authorId)
                return book
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
})


app.use('/graphql', expressGraphQL.graphqlHTTP({
    graphiql: true,
        schema: schema
}))

app.listen(5000, () => {
    console.log('listening on port 5000')
})