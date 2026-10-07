import { FormEvent, useState } from "react";

export default function ManageUsersPage() {

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    password: password
                }),
                credentials: "include"});

                if (response.ok) {
                    alert("user added successfully");
                }
                else    alert("user email or password inccorect, pls try again")

        } catch (error) {
            console.error("Error adding user:", error);
        }

    }


    const handleDeleteUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/deleteUser", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    password: password
                }),
                credentials: "include"
            });

            if (response.ok) {
                alert("user deleted successfully");
            } else {
                alert("failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="manage-users-page" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Manage Users Page - only accessable to admins</h1>
            <br></br>
            <p>Here you can add new users to the application.</p>
            <div className="add-user-form" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Add User</h2>
                <form onSubmit={handleAddUser} style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <label>Username: </label>
                    <input type="text" value={userName} onChange={(event) => setUserName(event.target.value)} />
                    <br></br>
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <br></br>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <br></br>
                    <br></br>

                    <button type="submit">Add User</button>
                </form>
            </div>

            <div className="delete-user-form" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Delete User</h2>
                <form onSubmit={handleAddUser} style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <label>Username: </label>
                    <input type="text" value={userName} onChange={(event) => setUserName(event.target.value)} />
                    <br></br>
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <br></br>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <br></br>
                    <br></br>

                    <button type="submit">Delete User</button>
                </form>
            </div>
        </div>
        );
}
