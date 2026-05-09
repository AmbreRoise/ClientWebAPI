import { prisma } from '../src/db'

const tags = [
    { name: "Fantasy" },
    { name: "Science-fiction" },
    { name: "Classique" },
    { name: "Aventure" },
    { name: "Horreur" },
    { name: "Philosophie" },
    { name: "Drame" }
];


const authors = [
    {
        firstname: 'George',
        lastname: 'Orwell',
        books: {
            create: [
                {
                    title: '1984',
                    publication_year: 1949,
                    tags: { connect: [{ name: "Classique" }, { name: "Philosophie" }] }
                },
                {
                    title: 'Animal Farm',
                    publication_year: 1945,
                    tags: { connect: [{ name: "Classique" }] }
                }
            ]
        }
    },
    {
        firstname: 'Mary',
        lastname: 'Shelley',
        books: {
            create: [
                {
                    title: 'Frankenstein',
                    publication_year: 1818,
                    tags: { connect: [{ name: "Classique" }, { name: "Horreur" }] }
                },
                {
                    title: 'The Last Man',
                    publication_year: 1826,
                    tags: { connect: [{ name: "Science-fiction" }] }
                }
            ]
        }
    },
    {
        firstname: 'Isaac',
        lastname: 'Asimov',
        books: {
            create: [
                {
                    title: 'Foundation',
                    publication_year: 1951,
                    tags: { connect: [{ name: "Science-fiction" }] }
                },
                {
                    title: 'I, Robot',
                    publication_year: 1950,
                    tags: { connect: [{ name: "Science-fiction" }] }
                },
                {
                    title: 'The Caves of Steel',
                    publication_year: 1953,
                    tags: { connect: [{ name: "Science-fiction" }] }
                }
            ]
        }
    },
    {
        firstname: 'Agatha',
        lastname: 'Christie',
        books: {
            create: [
                {
                    title: 'Murder on the Orient Express',
                    publication_year: 1934,
                    tags: { connect: [{ name: "Classique" }, { name: "Drame" }] }
                },
                {
                    title: 'And Then There Were None',
                    publication_year: 1939,
                    tags: { connect: [{ name: "Classique" }] }
                }
            ]
        }
    },
    {
        firstname: 'Jules',
        lastname: 'Verne',
        books: {
            create: [
                {
                    title: 'Twenty Thousand Leagues Under the Sea',
                    publication_year: 1870,
                    tags: { connect: [{ name: "Aventure" }, { name: "Science-fiction" }] }
                },
                {
                    title: 'Journey to the Center of the Earth',
                    publication_year: 1864,
                    tags: { connect: [{ name: "Aventure" }] }
                },
                {
                    title: 'Around the World in Eighty Days',
                    publication_year: 1872,
                    tags: { connect: [{ name: "Aventure" }] }
                }
            ]
        }
    },
    {
        firstname: 'Arthur C.',
        lastname: 'Clarke',
        books: {
            create: [
                {
                    title: '2001: A Space Odyssey',
                    publication_year: 1968,
                    tags: { connect: [{ name: "Science-fiction" }] }
                },
                {
                    title: 'Childhood’s End',
                    publication_year: 1953,
                    tags: { connect: [{ name: "Science-fiction" }] }
                }
            ]
        }
    },
    {
        firstname: 'Philip K.',
        lastname: 'Dick',
        books: {
            create: [
                {
                    title: 'Do Androids Dream of Electric Sheep?',
                    publication_year: 1968,
                    tags: { connect: [{ name: "Science-fiction" }] }
                },
                {
                    title: 'The Man in the High Castle',
                    publication_year: 1962,
                    tags: { connect: [{ name: "Science-fiction" }] }
                }
            ]
        }
    },
    {
        firstname: 'Ray',
        lastname: 'Bradbury',
        books: {
            create: [
                {
                    title: 'Fahrenheit 451',
                    publication_year: 1953,
                    tags: { connect: [{ name: "Science-fiction" }, { name: "Classique" }] }
                },
                {
                    title: 'The Martian Chronicles',
                    publication_year: 1950,
                    tags: { connect: [{ name: "Science-fiction" }] }
                }
            ]
        }
    },
    {
        firstname: 'Leo',
        lastname: 'Tolstoy',
        books: {
            create: [
                {
                    title: 'War and Peace',
                    publication_year: 1869,
                    tags: { connect: [{ name: "Classique" }, { name: "Drame" }] }
                },
                {
                    title: 'Anna Karenina',
                    publication_year: 1877,
                    tags: { connect: [{ name: "Classique" }, { name: "Drame" }] }
                }
            ]
        }
    },
    {
        firstname: 'Fyodor',
        lastname: 'Dostoevsky',
        books: {
            create: [
                {
                    title: 'Crime and Punishment',
                    publication_year: 1866,
                    tags: { connect: [{ name: "Classique" }, { name: "Philosophie" }] }
                },
                {
                    title: 'The Brothers Karamazov',
                    publication_year: 1880,
                    tags: { connect: [{ name: "Classique" }, { name: "Philosophie" }] }
                }
            ]
        }
    },
    {
        firstname: 'Herman',
        lastname: 'Melville',
        books: {
            create: [
                {
                    title: 'Moby-Dick',
                    publication_year: 1851,
                    tags: { connect: [{ name: "Aventure" }, { name: "Classique" }] }
                },
                {
                    title: 'Billy Budd',
                    publication_year: 1924,
                    tags: { connect: [{ name: "Classique" }] }
                }
            ]
        }
    },
    {
        firstname: 'Virginia',
        lastname: 'Woolf',
        books: {
            create: [
                {
                    title: 'Mrs Dalloway',
                    publication_year: 1925,
                    tags: { connect: [{ name: "Classique" }, { name: "Drame" }] }
                },
                {
                    title: 'To the Lighthouse',
                    publication_year: 1927,
                    tags: { connect: [{ name: "Classique" }] }
                }
            ]
        }
    },
    {
        firstname: 'Franz',
        lastname: 'Kafka',
        books: {
            create: [
                {
                    title: 'The Metamorphosis',
                    publication_year: 1915,
                    tags: { connect: [{ name: "Classique" }, { name: "Philosophie" }] }
                },
                {
                    title: 'The Trial',
                    publication_year: 1925,
                    tags: { connect: [{ name: "Classique" }] }
                }
            ]
        }
    },
    {
        firstname: 'Gabriel',
        lastname: 'García Márquez',
        books: {
            create: [
                {
                    title: 'One Hundred Years of Solitude',
                    publication_year: 1967,
                    tags: { connect: [{ name: "Classique" }, { name: "Drame" }] }
                },
                {
                    title: 'Love in the Time of Cholera',
                    publication_year: 1985,
                    tags: { connect: [{ name: "Classique" }, { name: "Drame" }] }
                }
            ]
        }
    },
    {
        firstname: 'Haruki',
        lastname: 'Murakami',
        books: {
            create: [
                {
                    title: 'Kafka on the Shore',
                    publication_year: 2002,
                    tags: { connect: [{ name: "Science-fiction" }, { name: "Philosophie" }] }
                },
                {
                    title: 'Norwegian Wood',
                    publication_year: 1987,
                    tags: { connect: [{ name: "Drame" }] }
                },
                {
                    title: '1Q84',
                    publication_year: 2009,
                    tags: { connect: [{ name: "Science-fiction" }] }
                }
            ]
        }
    }
];



async function main() {
    await prisma.rating.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.tag.deleteMany();
    //await prisma.user.deleteMany();

    await prisma.$executeRaw`DELETE FROM sqlite_sequence`;

    for (const tag of tags) {
        await prisma.tag.create({ data: tag });
    }

    const createdAuthors = [];
    for (const author of authors) {
        const created = await prisma.author.create({
            data: author,
            include: { books: true }
        });
        createdAuthors.push(created);
    }

    const bookMap: Record<string, number> = {};
    for (const author of createdAuthors) {
        for (const book of author.books) {
            bookMap[book.title] = book.id;
        }
    }

    const commentsData = [
        {
            content: "Un livre incroyable, j'ai adoré !", bookId: bookMap["1984"]!, userName: "Alice"
        },
        {
            content: "Très intéressant mais un peu long.", bookId: bookMap["Foundation"]!, userName: "Alice"
        },
        {
            content: "Pas mon style, mais bien écrit.", bookId: bookMap["Journey to the Center of the Earth"]!, userName: "Bob"
        },
        {
            content: "Chef d'œuvre absolu.", bookId: bookMap["War and Peace"]!, userName: "Charlie"
        }
    ];

    const ratingsData = [
        {
            value: 5, bookId: bookMap["1984"]!, userName: "Alice"
        },
        {
            value: 4, bookId: bookMap["Foundation"]!, userName: "Alice"
        },
        {
            value: 3, bookId: bookMap["Journey to the Center of the Earth"]!, userName: "Bob"
        },
        {
            value: 5, bookId: bookMap["Animal Farm"]!, userName: "Bob"
        },
        {
            value: 5, bookId: bookMap["War and Peace"]!, userName: "Charlie"
        },
        {
            value: 4, bookId: bookMap["Do Androids Dream of Electric Sheep?"]!, userName: "Charlie"
        }
    ];

    for (const comment of commentsData) {
        await prisma.comment.create({ data: comment });
    }

    for (const rating of ratingsData) {
        await prisma.rating.create({ data: rating });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

