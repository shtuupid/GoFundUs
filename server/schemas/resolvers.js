const { AuthenticationError } = require('apollo-server-express');
const { User, Charity, Category, Order } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
    Query: {
        categories: async () => {
        return await Category.find();
        },
        charities: async (parent, { category, name }) => {
        const params = {};

        if (category) {
            params.category = category;
        }

        if (name) {
            params.name = {
            $regex: name
            };
        }

        return await Charity.find(params).populate('category');
        },
        Charity: async (parent, { _id }) => {
        return await Charity.findById(_id).populate('category');
        },
        user: async (parent, args, context) => {
        if (context.user) {
            const user = await User.findById(context.user._id).populate({
            path: 'orders.charities',
            populate: 'category'
            });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
        }

        throw new AuthenticationError('Not logged in');
        },
        order: async (parent, { _id }, context) => {
        if (context.user) {
            const user = await User.findById(context.user._id).populate({
                path: 'orders.charities',
                populate: 'category'
            });
            return user.orders.id(_id);
        }

        throw new AuthenticationError('Not logged in');
        },
        checkout: async (parent, args, context) => {
            const url = new URL(context.headers.referer).origin;
            const order = new Order({ charities: args.charities });
            const line_items = [];
            
            const { charities } = await order.populate('charities');
            for (let i = 0; i < charities.length; i++) {
                const product = await stripe.charities.create({
                    name: charities[i].name,
                    description: charities[i].description,
                    images: [`${url}/images/${charities[i].image}`]
                });
                
                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: charities[i].price * 100,
                    currency: 'gdp',
                });

                line_items.push({
                    price: price.id,
                    quantity: 1
                });
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${url}/`
            });
            
            return { session: session.id };
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        addOrder: async (parent, { charities }, context) => {
            console.log(context);
            if (context.user) {
                const order = new Order({ charities });

                await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

                return order;
            }

        throw new AuthenticationError('Not logged in');
        },
        updateUser: async (parent, args, context) => {
            if (context.user) {
                return await User.findByIdAndUpdate(context.user._id, args, { new: true });
            }

        throw new AuthenticationError('Not logged in');
        },
        updateProduct: async (parent, { _id, quantity }) => {
            const decrement = Math.abs(quantity) * -1;

            return await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        }
    }
};

module.exports = resolvers;
