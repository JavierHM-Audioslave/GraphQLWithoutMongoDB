const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLList } = graphql;


const books = [
    {name: "Name of the Wind", genre: "Fantasy", id:"1", authorId: "1"},
    {name: "The Final Empire", genre: "Fantasy", id:"2", authorId: "2"},
    {name: "The Long Earth", genre: "Sci-Fi", id:"3", authorId: "3"},
    {name: "The Hero of Ages", genre: "Fantasy", id: "4", authorId: "2"},
    {name: "The Colour of Magic", genre: "Fantasy", id: "5", authorId: "3"},
    {name: "The Light Fantastic", genre: "Fantasy", id: "6", authorId: "3"}
];

const authors = [
    {name: "Patrick Rothfuss", age: 44, id: "1"},
    {name: "Brandon Sanderson", age: 42, id: "2"},
    {name: "Terry Pratchett", age: 66, id: "3"}
];

const BookType = new GraphQLObjectType({    // NOTA: "BookType" es un type object el cual define cómo es el objeto Book. //
    name: "Book",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                return authors.find(author => author.id === parent.authorId)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({  // NOTA: "AuthorType" es un type object el cual define cómo es el objeto Author. //
    name: "Author",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type : GraphQLString},
        age: { type : GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books.filter(book => book.authorId === parent.id);
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({   // NOTA: este es un "Root Type" que es el objeto que engloba a los object type de arriba y a su vez les asigna una función "resolve" que permite hacer la búsqueda de un cierto dato según el parámetro que se ingresa desde el frontend. //
    name: "RootQueryType",
    fields: {
        book: { // Con esta query se devuelve todo o parte de UN BookType. Qué BookType nos va a devolver depende del argumento enviado desde el front al hacer {book(id: ciertoNumero)} donde "ciertoNumero" es el campo id del BookType. //
            type: BookType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args){
                return books.find(element => element.id === args.id); // "args.id" va a contener el valor del id que se mande desde el frontend. // 
            }
        },
        author: {   // Con esta query se devuelve todo o parte de UN AuthoType. Qué AuthorType nos va a devolver depende del argumento enviado desde el front al hacer {author(id: ciertoNumero)} donde "ciertoNumero" es el campo id del AuthorType. //
            type: AuthorType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args){
                return authors.find(element => element.id === args.id); // "args.id" va a contener el valor del id que se mande desde el frontend. // 
            }
        },
        books: { // Con esta query se devuelven TODOS los "books" que hayan dentro de ese objeto.
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        authors: {  // Con esta query se devuelven TODOS los "authors" que hayan dentro de ese objeto.
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})