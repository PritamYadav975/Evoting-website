const organizationModel = require("../models/organization");

const showRegisterPage = (req, res) => {
    res.render("auth/register");
};
const bcrypt = require("bcrypt");

const registerOrganization = async (req, res) => {
   try{
    const { name, username, email, password, resultsPassword } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const resultsPasswordHash = await bcrypt.hash(resultsPassword, 10);

    await organizationModel.createOrganization(
    name,
    username,
    email,
    passwordHash,
    resultsPasswordHash
);

req.flash("success", "Organization registered successfully. Please log in.");
res.redirect("/auth/login");

}catch(error){
   console.error(error) ;
   req.flash("error", "Registration failed. Please try again.");
   return res.redirect("/auth/register");
}
};

const loginOrganization = async (req, res) => {
    try {
        const { username, password } = req.body;

        const organization = await organizationModel.getOrganizationByUsername(username);

        if (!organization) {
            req.flash("error_msg", "Invalid username or password");
            return res.redirect("/auth/login");
        }

        const passwordMatch = await bcrypt.compare(
            password,
            organization.password_hash
        );

        if (!passwordMatch) {
            req.flash("error_msg", "Invalid username or password");
            return res.redirect("/auth/login");
        }
        req.session.user = {
        id: organization.id,
        username: organization.username,
        name: organization.name
        };

        req.flash("success", "Login successful. Welcome back!");
        res.redirect("/elections/create");

    } catch (error) {
        console.error(error);
        req.flash("error", "Login failed. Please try again.");
        return res.redirect("/auth/login");
    }
};

const showLoginPage = (req, res) => {
    res.render("auth/login");
};
const showOrganizations = async (req, res) => {
    const organizations = await organizationModel.getAllOrganizations();

    res.send(organizations);
};
module.exports = {
    showRegisterPage,
    showLoginPage,
    showOrganizations,
    registerOrganization,
    loginOrganization

    
};