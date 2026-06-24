import dns from 'node:dns/promises';
dns.setServers(["8.8.8.8", "1.1.1.1"]); 

import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

// Import your actual production models to preserve schema types and constraints
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";
import { Application } from "./models/application.model.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) throw new Error("MONGO_URI environment variable is missing.");

        await mongoose.connect(mongoURI);
        console.log("Connected directly to database cluster... 🔌");

        // Wipe relational collections cleanly before inserting mock variants
        await User.deleteMany({});
        await Company.deleteMany({});
        await Application.deleteMany({});
        console.log("Cleared old user, company, and application records... 🧹");

        // 1. Generate 100 Fake Users
        const users = [];
        for (let i = 0; i < 100; i++) {
            users.push({
                fullname: faker.person.fullName(),
                email: `student_${i}_${faker.internet.email().toLowerCase()}`, // Guaranteed uniqueness
                phoneNumber: faker.string.numeric(10), // Enforced string structure match
                password: "$2b$10$EPY9a61KqjG.9nWhqM9PjOi8m9LpC2q1vM7Z0pY7W8O9rM.1a2b3c", 
                role: i % 5 === 0 ? 'recruiter' : 'student',
            });
        }
        const createdUsers = await User.insertMany(users);
        const recruiters = createdUsers.filter(u => u.role === 'recruiter');
        const students = createdUsers.filter(u => u.role === 'student');
        console.log(`Generated ${createdUsers.length} Users! 👤`);

        // 2. Generate 30 Fake Companies
        const companies = [];
        for (let i = 0; i < 30; i++) {
            const randomRecruiter = recruiters[Math.floor(Math.random() * recruiters.length)];
            companies.push({
                name: `${faker.company.name()} ${i}`, // Appending index enforces absolute unique field requirements
                description: faker.company.catchPhrase() + ". " + faker.lorem.sentence(),
                website: faker.internet.url(),
                location: faker.helpers.arrayElement(['Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Delhi']),
                userId: randomRecruiter._id
            });
        }
        const createdCompanies = await Company.insertMany(companies);
        console.log(`Generated ${createdCompanies.length} Companies! 🏢`);

        // 3. Unify Existing Job Collections
        const jobs = await Job.find({});
        console.log(`Linking ${jobs.length} existing target jobs... 🔗`);

        if (jobs.length > 0) {
            for (let job of jobs) {
                const randomCompany = createdCompanies[Math.floor(Math.random() * createdCompanies.length)];
                job.company = randomCompany._id;
                job.created_by = randomCompany.userId;
                await job.save();
            }
        }

        // 4. Generate 1,500 Safe Job Applications
        const applications = [];
        if (jobs.length > 0) {
            for (let i = 0; i < 1500; i++) {
                const randomStudent = students[Math.floor(Math.random() * students.length)];
                const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
                
                applications.push({
                    job: randomJob._id,
                    applicant: randomStudent._id,
                    status: faker.helpers.arrayElement(['pending', 'accepted', 'rejected'])
                });
            }
            // Use ordered false to allow execution to skip accidental duplicate pairs from unique compound constraints
            await Application.insertMany(applications, { ordered: false });
            console.log("Generated 1,500 Job Applications! 📝");
        } else {
            console.log("Skipping application seeding: No core jobs found in cluster to map.");
        }

        console.log("Database fully seeded and unified! 🎉");
        process.exit(0);

    } catch (error) {
        console.error("Seeding failed ❌:", error);
        process.exit(1);
    }
};

seedDatabase();
