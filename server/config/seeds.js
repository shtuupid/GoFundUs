const db = require('./connection');
const { User, Charity, Category } = require('../models');

db.once('open', async () => {
    await Category.deleteMany();

    const categories = await Category.insertMany([
        { name: 'Africa' },
        { name: 'Asia' },
        { name: 'Middle East' },
        { name: 'Europe' },
        { name: 'America' }
    ]);

    console.log('categories seeded');

    await Charity.deleteMany();

    const charities = await Charity.insertMany([
        {
            name: 'Ugandan Orphans',
            description:
            'Help the needy orphans of Uganda and their goal to have full stomachs, a roof and warmth. Your donation helps feed 4 children for a month. Donate now!',
            image: 'ugandan-kids.jpg',
            category: categories[0]._id,
            price: 2.99,
            quantity: 500
        },
        {
            name: 'Tanzanian fund',
            description:
            'Praesent sed lacinia mauris. Nulla congue nibh magna, at feugiat nunc scelerisque quis. Donec iaculis rutrum vulputate. Suspendisse lectus sem, vulputate ac lectus sed, placerat consequat dui.',
            image: 'tanazian-fund.jpg',
            category: categories[0]._id,
            price: 1.99,
            quantity: 500
        },
        {
            name: 'India Housing Help',
            category: categories[1]._id,
            description:
            'Donec volutpat erat erat, sit amet gravida justo sodales in. Phasellus tempus euismod urna. Proin ultrices nisi ut ipsum congue, vitae porttitor libero suscipit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam lacinia a nisi non congue.',
            image: 'india-housing-help.jpg',
            price: 7.99,
            quantity: 20
        },
        {
            name: 'Malyasian School Meals',
            category: categories[1]._id,
            description:
            'Praesent placerat, odio vel euismod venenatis, lectus arcu laoreet felis, et fringilla sapien turpis vestibulum nisl.',
            image: 'Malaysian-School-Meals.jpg',
            price: 3.99,
            quantity: 50
        },
        {   
            name: 'Indonesia Malaria kits',
            category: categories[1]._id,
            description:
            'Vivamus ut turpis in purus pretium mollis. Donec turpis odio, semper vel interdum ut, vulputate at ex. Duis dignissim nisi vel tortor imperdiet finibus. Aenean aliquam sagittis rutrum.',
            image: 'indonesia-malaria-kits.jpg',
            price: 14.99,
            quantity: 100
        },
        {
            name: 'Bulgaria Adopted Kids',
            category: categories[2]._id,
            description:
            'Vestibulum risus metus, luctus non tortor quis, tincidunt consectetur ex. Nullam vitae lobortis ligula, ut sagittis massa. Curabitur consectetur, tellus at pulvinar venenatis, erat augue cursus erat, eu ullamcorper eros lectus ultrices ipsum. Integer rutrum, augue vitae auctor venenatis, turpis turpis elementum orci, at sagittis risus mi a leo.',
            image: 'bulgaria-adopted-kids.jpg',
            price: 399.99,
            quantity: 30
        },
        {
            name: 'French Homeless Help',
            category: categories[2]._id,
            description:
            'In sodales, ipsum quis ultricies porttitor, tellus urna aliquam arcu, eget venenatis purus ligula ut nisi. Fusce ut felis dolor. Mauris justo ante, aliquet non tempus in, tempus ac lorem. Aliquam lacinia dolor eu sem eleifend ultrices. Etiam mattis metus metus. Sed ligula dui, placerat non turpis vitae, suscipit volutpat elit. Phasellus sagittis, diam elementum suscipit fringilla, libero mauris scelerisque ex, ac interdum diam erat non sapien.',
            image: 'french-homeless-help.jpg',
            price: 199.99,
            quantity: 30
        },
        {   
            name: 'Palestinian Help Kits',
            category: categories[3]._id,
            description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ornare diam quis eleifend rutrum. Aliquam nulla est, volutpat non enim nec, pharetra gravida augue. Donec vitae dictum neque. Pellentesque arcu lorem, fringilla non ligula ac, tristique bibendum erat. Ut a semper nibh. Quisque a mi et mi tempor ultricies. Maecenas eu ipsum eu enim hendrerit accumsan at euismod urna.',
            image: 'palestinian-help-kits.jpg',
            price: 9.99,
            quantity: 100
        },
        {
            name: 'Syrian Food Bank',
            category: categories[3]._id,
            description: 'Ut vulputate hendrerit nibh, a placerat elit cursus interdum.',
            image: 'syrian-food-bank.jpg',
            price: 1.99,
            quantity: 1000
        },
        {
            name: 'San Fran Homeless Fund',
            category: categories[4]._id,
            description:
            'Sed a mauris condimentum, elementum enim in, rhoncus dui. Phasellus lobortis leo odio, sit amet pharetra turpis porta quis.',
            image: 'san-fran.jpg',
            price: 2.99,
            quantity: 1000
        },
        {
            name: 'Hurricane Help Fund',
            category: categories[4]._id,
            description:
            'Vestibulum et erat finibus erat suscipit vulputate sed vitae dui. Ut laoreet tellus sit amet justo bibendum ultrices. Donec vitae felis vestibulum, congue augue eu, finibus turpis.',
            image: 'hurricane.jpg',
            price: 7.99,
            quantity: 100
        },
        {
            name: 'Texas DV help Shelter',
            category: categories[4]._id,
            description:
            'Morbi consectetur viverra urna, eu fringilla turpis faucibus sit amet. Suspendisse potenti. Donec at dui ac sapien eleifend hendrerit vel sit amet lectus.',
            image: 'texas.jpg',
            price: 9.99,
            quantity: 600
        }
    ]);

    console.log('charities seeded');

    await User.deleteMany();

    await User.create({
        firstName: 'Pamela',
        lastName: 'Washington',
        email: 'pamela@testmail.com',
        password: 'password12345',
        orders: [
        {
            charities: [charities[0]._id, charities[0]._id, charities[1]._id]
        }
        ]
    });

    await User.create({
        firstName: 'Elijah',
        lastName: 'Holt',
        email: 'eholt@testmail.com',
        password: 'password12345'
    });

    console.log('users seeded');

    process.exit();
});
