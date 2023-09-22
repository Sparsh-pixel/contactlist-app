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
        // api call to get the contact
        axios.get('https://jsonplaceholder.typicode.com/users')
        .then (res => {
            setContacts(res.data);
        })
        .catch (err => {console.log(err)});
    },[]);

//  to add the contact
    const handleAddContact = () => {
        setShowAddForm(true);
    }
// to capture and handle form submission events. 
    const handleAddFormsubmit = (e) => {
        e.preventDefault();
        // to send http post request to url
        axios.post('https://jsonplaceholder.typicode.com/users', newContact)
        .then (res => {
            setContacts([...contacts,res.data]);
            setShowAddForm(false);
        })
        .catch (err => {
            console.log(err);
        });
    };

    // to capture what the user has entered into the form fields 

    const handleInputChange = (e) => {
        const {name,value} = e.target;
        // used spread operator to make shallow copy without modify the original object directly
        // name and value are keys whose values you want to assign to newContact
        setNewContact({...newContact,[name]: [value]});
        

    }
//  to edit the contact
    const handleEditContact = (contact) => {
        setEditContact(contact);
    };

    const handleEditFormSubmit = e => {
        e.preventDefault();
        // put method is used when you need to update the existing resource on the server
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
        // destructing the name and value properties from event.target
        const {name , value} = event.target;
        // to update the state of the component
        setEditContact({...editContact, [name]:value});
    };

    const handleDeleteContact = (contact) => {
        setDeleteContact(contact);
        // this will show the modal of delete contact 
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmation = () => {
        // to delete the existing data
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
{/* this will run when the condition is true */}
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