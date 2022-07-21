import { faker } from '@faker-js/faker';

export const MockProducts = () => ({
    _id: faker.database.mongodbObjectId(),
    id: faker.random.numeric(),
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.datatype.number({ min: 500, max: 4000 }),
    stock: faker.datatype.number({ min: 10, max: 150 }),
    thumbnail: faker.image.sports(60, 60, true),
    timestamp: Date.now(),
    _v: 1
})

export const MockProductsList = (length = 5) =>  Array.from({ length }).map(_ => MockProducts())