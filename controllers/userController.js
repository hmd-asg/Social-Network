const { User, Thought } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId }).populate('thoughts').populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Create a new user
    async createUser(req, res) {
        try {
            const dbUserData = await User.create(req.body);
            res.json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Update a user
    async updateUser(req, res) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ message: 'No User with this id!' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'server error', error });
        }
    },
    // Delete a user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No User with this id!' });
            }
            await Thought.deleteMany({ _id: { $in: user.thoughts } });

            res.json({ message: 'User successfully deleted!' });

        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },
    // Add a new friend to a user's friend list
    async createUserFriend(req, res) {
        try {
            const userFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );

            if (!userFriend) {
                return res.status(404).json({ message: 'No user found' });
            }
            res.status(200).json(userFriend);
        } catch (err) {
            res.status(500).json({ message: 'Server error', err });
        }
    },
    // Delete a friend from a user's friend list
    async deleteUserFriend(req, res) {
        try {
            const deletedFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );

            if (!deletedFriend) {
                return res.status(404).json({ message: 'No User with this id!' });
            }

            res.json({ message: 'Friend successfully deleted!', deletedFriend });

        } catch (error) {
            res.status(500).json(err);
        }
    }
};