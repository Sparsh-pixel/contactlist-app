import React, {useState,useEffect} from "react";
import axios from "axios";

function Contacts ()  {

    const [contacts ,setContacts] = useState([]);
    const [showAddForm , setShowAddForm] = useState(false);
    const [newContact , setNewContact] = useState({name: '' , email: '' , phone: '' }); // passed the initial state as argument
    const [editContact , setEditContact] = useState(null);
    const [showDeleteConfirmation , setShowDeleteConfirmation] = useState(false);
    const [deleteContact , setDeleteContact] = useState(null);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/users')
        .then (res => {
            setContacts(res.data);
        })
        .catch (err => {console.log(err)});
    },[]);

    const handleAddContact = () => {
        setShowAddForm(true);
    }

    const handleAddFormsubmit = (e) => {
        e.preventDefault();
        axios.post('https://jsonplaceholder.typicode.com/users', newContact)
        .then (res => {
            setContacts([...contacts,res.data]);
            setShowAddForm(false);
        })
        .catch (err => {
            console.log(err);
        });
    };

    const handleInputChange = (e) => {
        const {name,value} = e.target;
        setNewContact({...newContact,[name]: [value]});

    }

    const handleEditContact = (contact) => {
        setEditContact(contact);
    };

    const handleEditFormSubmit = e => {
        e.preventDefault();
        axios.put(`https://jsonplaceholder.typicode.com/users/${editContact.id}`, editContact)
        .then (res => {
            const updatedContact = contacts.map((contact) => {
                if (contact.id === editContact.id) {
                    return res.data;
                }else {
                    return contact;
                }
            });
            setContacts(updatedContact);
            setEditContact(null);
        })
        .catch (err => {
            console.log(err);
        })  
    };

    const handleEditInputChange = (event) => {
        const {name , value} = event.target;
        setEditContact({...editContact, [name]:value});
    };

    const handleDeleteContact = (contact) => {
        setDeleteContact(contact);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmation = () => {
        axios.delete(`https://jsonplaceholder.typicode.com/users/${deleteContact.id}`)
        .then (res => {
            const updatedContact = contacts.filter(contact => {
                return contact.id !== deleteContact.id;
            });
            setContacts(updatedContact);
            setDeleteContact(null);
            setShowDeleteConfirmation(false);
        })
        .catch (err => {
            console.log(err);
        });
    }
    
    const handleDeleteCancel = () => {
        setDeleteContact(null);
        setShowDeleteConfirmation(false);
    };

    return (
        // add contact form 
        <div className="container">
            <h1>Contact Lists</h1>
            <button onClick={handleAddContact}>Add Contact</button>
            {showAddForm && (
                <>
                <div className="modal">
                    <form style = {{color: "white"}} className="addForm" onSubmit={handleAddFormsubmit}>
                        <button className= "close-btn" onClick={() => setShowAddForm(false)}>Close</button>

                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={newContact.name} onChange={handleInputChange} />
                        </div>

                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value= {newContact.email} onChange={handleInputChange}/>
                        </div>

                        <div>
                            <label>Phone:</label>
                            <input type="tel" name="phone" value= {newContact.phone} onChange={handleInputChange}/>
                        </div>

                        <button type="submit">Save</button>
                    </form>
                </div>
                </>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {contacts.map(contact =>(
                        <tr key={contact.id}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.phone}</td>
                            <td className="sidebar">
                                <button className="edit-btn" onClick={() => handleEditContact(contact)}>Edit</button>
                                <button className = "delete-btn" onClick={() => handleDeleteContact(contact)}>Delete</button>
                            </td>
                        </tr>

                   ) )}
                </tbody>
            </table>

                 {/* Edit form  */}
            {editContact && (
                <div className="modal">
                    <form className="edit-form" onSubmit={handleEditFormSubmit}>
                        <button style = {{color:"black"}} className="close-btn2" onClick={() => setEditContact(null)}>Close</button>
                        <br/><br/>
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={editContact.name} onChange={handleEditInputChange} />

                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={editContact.email} onChange={handleEditInputChange}/>
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input type="tel" name="phone" value={editContact.phone} onChange={handleEditInputChange}/>
                        </div>
                        
                        <button type="submit">Save</button>
                    </form>
                </div>
            )}

            {showDeleteConfirmation && (
                <div className="modal">
                    <p style = {{color:'white'}}>Are you sure want to delete {deleteContact.name}</p>
                    <button onClick={handleDeleteConfirmation}>Yes</button>
                    <button onClick={handleDeleteCancel}>No</button>
                    </div>
            )}
        </div>
    )
}

export default Contacts;