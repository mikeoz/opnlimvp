import React, { useState } from 'react';

const PersonForm = () => {
    const [person, setPerson] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        opnliId: ''
    });

    const handleChange = e => {
        setPerson({ ...person, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await fetch('/add-person', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: person.firstName,
                    middle_name: person.middleName,
                    last_name: person.lastName,
                    person_id: person.opnliId
                })
            });
            const data = await response.json();
            console.log('Person added:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
            <input type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
            <input type="text" name="opnliId" placeholder="Opnli ID" onChange={handleChange} />
            <button type="submit">Submit React Form</button>
        </form>
    );
};

export default PersonForm;
