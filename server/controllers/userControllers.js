const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ message: "Username already exists", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ message: "Email already exists", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return res.json({
      user: {
        username: user.username,
        email: user.email,
        _id: user._id,
      },
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        message: "Incorrect username or password",
        status: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({
        message: "Incorrect username or password",
        status: false,
      });
    }

    user.password = undefined;
    user.contacts = undefined;

    return res.json({
      user,
      status: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImg = req.body.image;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        isAvatarImageSet: true,
        avatarImage: avatarImg,
      },
      { new: true, runValidators: true }
    );
    return res.json({ isSet: user.isAvatarImageSet, image: user.avatarImage });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { search } = req.query;
    let users = await User.find({ _id: { $ne: userId } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    if (search) {
      users = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Check if the users are contacts of the current user and add a boolean property `isContact` to each user
    const usersWithContacts = await Promise.all(
      users.map(async (user) => {
        const currentUser = await User.findOne({ _id: userId });
        const isContact = currentUser.contacts.includes(user._id);
        return { ...user._doc, isContact };
      })
    );

    return res.json({ usersWithContacts });
  } catch (error) {
    next(error);
  }
};

// Add or remove a contact
module.exports.addContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const userId = req.body.userId;

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.json({ message: "User not found", status: false });
    }

    if (currentUser.contacts.includes(contactId)) {
      currentUser.contacts = currentUser.contacts.filter(
        (contact) => contact.toString() !== contactId
      );
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { contacts: currentUser.contacts },
        { new: true, runValidators: true }
      );
      updatedUser.password = undefined;
      return res.json({
        updatedUser,
        message: "Contact removed",
        isContact: false,
      });
    } else {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { contacts: contactId } },
        { new: true, runValidators: true }
      );
      updatedUser.password = undefined;

      return res.json({
        updatedUser,
        message: "Contact added",
        isContact: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.getContacts = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const currentUser = await User.findById(userId).populate({
      path: "contacts",
      select: "-isAvatarImageSet -contacts -password -__v",
    });

    let contacts = currentUser.contacts;

    contacts = contacts.reverse();
    return res.json(contacts);
  } catch (error) {
    next(error);
  }
};
